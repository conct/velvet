// Shared between (guest)/_layout.tsx (stashes the code when a logged-out
// visitor is bounced off an invite link) and guest-login.tsx (resumes into
// that invite once they've signed in).
export const PENDING_INVITE_CODE_KEY = "pending_invite_code";
