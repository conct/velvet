import { prisma } from "../db";

// A guest can take a location out of their own history -- a fetish club, a
// queer bar, a clinic's event, anything they would rather not have listed on
// a phone someone else might pick up.
//
// What hiding does NOT do is as important as what it does: the rating still
// counts towards the trust score, and the venue keeps its own record of the
// visit. Otherwise this would be a button for erasing a bad night, and the
// whole premise of a shared trust network would collapse. It is a control
// over who else gets to see the association, not over what happened.
//
// It is also one-way by design: a guest can hide, but not unhide. Someone
// scrolling through a partner's phone must not be able to reveal a location
// by toggling it back on, and an unhide button would make the hidden list
// itself the thing worth looking at. Restoring goes through support
// (server/scripts/unhide-venue.ts).

export async function hiddenVenueIds(userId: string): Promise<Set<string>> {
  const hidden = await prisma.venueRelationship.findMany({
    where: { userId, hiddenAt: { not: null } },
    select: { venueId: true },
  });
  return new Set(hidden.map((h) => h.venueId));
}
