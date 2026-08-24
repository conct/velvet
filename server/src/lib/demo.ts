import { prisma } from "../db";

// Some accounts exist only to be logged into by people who are not guests:
// the Google/Apple store reviewers, and whoever we hand a test login to.
// Their credentials are, by design, shared outside the company -- an app
// store review means writing them into a form. So they have to be assumed
// public, and a public login must not be able to touch real people's records.
//
// What a demo staff account could otherwise do to a stranger it scans is not
// cosmetic: rate them one star, flag them BANNED, and -- since two banning
// venues trip isNetworkBanned() -- lock them out of every door in the
// network. That is the thing being prevented here.
//
// The model is two parallel worlds rather than "real data plus some rows to
// ignore". Everything carries an isDemo flag, and every query stays inside
// the world of whoever is asking. That keeps the sandbox fully usable -- a
// reviewer scans, gets rated, watches their tier move, sees the venue in
// their history -- while none of it is visible from, or counts towards,
// anything real.
//
// Two layers, because either alone is insufficient:
//
//   Containment (`assertSameWorld`) refuses a cross-world scan before
//   anything is written.
//
//   Scoping (`worldOf` + the filters below) keeps every read inside one
//   world. This deliberately filters on the *current* flag rather than a
//   column copied onto each row, so flagging an account demo retroactively
//   neutralises everything it already wrote. That matters: the reviewer
//   accounts predate this feature.

export interface WorldFilters {
  /** Ratings written by staff of this world, at a venue of this world. */
  rating: { staffAccount: { isDemo: boolean }; venue: { isDemo: boolean } };
  /** Anything joined to a venue of this world. */
  venue: { venue: { isDemo: boolean } };
  /** Entry logs of this world, on both the venue and the guest side. */
  entry: { venue: { isDemo: boolean }; user: { isDemo: boolean } };
}

export function world(isDemo: boolean): WorldFilters {
  return {
    rating: { staffAccount: { isDemo }, venue: { isDemo } },
    venue: { venue: { isDemo } },
    entry: { venue: { isDemo }, user: { isDemo } },
  };
}

/** Which world a guest belongs to. */
export async function worldOf(userId: string): Promise<boolean> {
  const { isDemo } = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { isDemo: true },
  });
  return isDemo;
}

export class CrossWorldError extends Error {}

// Called before a scan writes anything. Demo staff scanning a real guest is
// the attack; a real doorman scanning a demo guest is the mirror image and
// equally unwanted, since it would put a fake visit in a real venue's history.
export async function assertSameWorld(venueId: string, userId: string): Promise<void> {
  const [venue, user] = await Promise.all([
    prisma.venue.findUniqueOrThrow({ where: { id: venueId }, select: { isDemo: true } }),
    prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { isDemo: true } }),
  ]);

  if (venue.isDemo !== user.isDemo) {
    throw new CrossWorldError();
  }
}
