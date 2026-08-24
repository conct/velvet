// Publishing via the Meta Graph API's Content Publishing endpoints. Requires
// an Instagram Business or Creator account linked to a Facebook Page, and a
// long-lived Page access token with instagram_basic + instagram_content_publish.
// Not wired into any HTTP route -- this is a manual, human-approved posting
// step (see scripts/post-instagram.ts), matching how the weekly draft
// routine works: drafts are generated, Daniel names which one to approve in
// chat, and only then does a real post go out. No autonomous posting.
const GRAPH_API_VERSION = "v21.0";
const GRAPH_API_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} ist nicht gesetzt (server/.env)`);
  return value;
}

async function graphRequest<T>(path: string, params: Record<string, string>, method: "GET" | "POST" = "POST"): Promise<T> {
  const url = new URL(`${GRAPH_API_BASE}${path}`);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);

  const res = await fetch(url, { method });
  const data = (await res.json()) as { error?: { message?: string } };
  if (!res.ok) {
    const message = data?.error?.message ?? `Graph API Fehler (HTTP ${res.status})`;
    throw new Error(message);
  }
  return data as T;
}

// Cheap sanity check for a freshly-added token/account ID -- run this before
// ever attempting a real post, since it fails fast on the common setup
// mistakes (wrong account type, expired token, wrong permissions).
export async function verifyInstagramConnection(): Promise<{ id: string; username: string }> {
  const igUserId = requireEnv("INSTAGRAM_BUSINESS_ACCOUNT_ID");
  const accessToken = requireEnv("INSTAGRAM_ACCESS_TOKEN");
  return graphRequest<{ id: string; username: string }>(`/${igUserId}`, { fields: "id,username", access_token: accessToken }, "GET");
}

interface MediaContainer {
  id: string;
}

interface ContainerStatus {
  status_code: "EXPIRED" | "ERROR" | "FINISHED" | "IN_PROGRESS" | "PUBLISHED";
}

async function createMediaContainer(imageUrl: string, caption: string): Promise<string> {
  const igUserId = requireEnv("INSTAGRAM_BUSINESS_ACCOUNT_ID");
  const accessToken = requireEnv("INSTAGRAM_ACCESS_TOKEN");

  // image_url must be a publicly reachable HTTPS URL -- Meta's servers fetch
  // it themselves, a local file path or a private/authenticated URL won't
  // work. VELVET's existing /uploads static route (server/src/index.ts) is
  // one option for hosting the image temporarily.
  const container = await graphRequest<MediaContainer>(`/${igUserId}/media`, {
    image_url: imageUrl,
    caption,
    access_token: accessToken,
  });
  return container.id;
}

// Instagram processes the image asynchronously after the container is
// created -- publishing before it reaches FINISHED fails.
async function waitUntilProcessed(containerId: string, timeoutMs = 60_000, pollIntervalMs = 3_000): Promise<void> {
  const accessToken = requireEnv("INSTAGRAM_ACCESS_TOKEN");
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const status = await graphRequest<ContainerStatus>(`/${containerId}`, { fields: "status_code", access_token: accessToken }, "GET");
    if (status.status_code === "FINISHED") return;
    if (status.status_code === "ERROR" || status.status_code === "EXPIRED") {
      throw new Error(`Instagram konnte das Bild nicht verarbeiten (Status: ${status.status_code})`);
    }
    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }
  throw new Error("Zeitüberschreitung beim Warten auf die Bildverarbeitung durch Instagram");
}

async function publishContainer(containerId: string): Promise<string> {
  const igUserId = requireEnv("INSTAGRAM_BUSINESS_ACCOUNT_ID");
  const accessToken = requireEnv("INSTAGRAM_ACCESS_TOKEN");

  const result = await graphRequest<{ id: string }>(`/${igUserId}/media_publish`, {
    creation_id: containerId,
    access_token: accessToken,
  });
  return result.id;
}

export async function postToInstagram(imageUrl: string, caption: string): Promise<{ postId: string }> {
  const containerId = await createMediaContainer(imageUrl, caption);
  await waitUntilProcessed(containerId);
  const postId = await publishContainer(containerId);
  return { postId };
}
