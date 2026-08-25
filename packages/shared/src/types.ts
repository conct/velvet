export type StaffRole = "DOORMAN" | "MANAGER" | "SERVICE";

export const STAFF_ROLES: StaffRole[] = ["DOORMAN", "SERVICE", "MANAGER"];

export interface StaffRolePermissions {
  // Look a guest up and see their trust profile at the door.
  viewGuests: boolean;
  // Scan a guest QR code and rate the visit afterwards.
  scanAndRate: boolean;
  // Create/see staff accounts, venue settings, guest messaging.
  manageVenue: boolean;
}

// SERVICE is the slimmer role for bar/service staff at small locations
// (bars, pubs): same door capabilities as DOORMAN, but deliberately no
// venue/team administration. It exists as its own role rather than as an
// alias for DOORMAN so a venue's team list stays truthful about who is
// actually on the door and who is behind the bar.
export const staffRolePermissions: Record<StaffRole, StaffRolePermissions> = {
  MANAGER: { viewGuests: true, scanAndRate: true, manageVenue: true },
  DOORMAN: { viewGuests: true, scanAndRate: true, manageVenue: false },
  SERVICE: { viewGuests: true, scanAndRate: true, manageVenue: false },
};

export function canManageVenue(role: StaffRole): boolean {
  return staffRolePermissions[role].manageVenue;
}

export function canScanAndRate(role: StaffRole): boolean {
  return staffRolePermissions[role].scanAndRate;
}

export type VenueStatus = "PENDING" | "VERIFIED" | "SUSPENDED";

export type VenueType = "CLUB" | "BAR" | "PUB" | "OTHER";

export const VENUE_TYPES: VenueType[] = ["CLUB", "BAR", "PUB", "OTHER"];

export type VenueApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

// What a location submits through the public self-service form. Approval is
// always manual: a platform admin checks the attached business registration
// and only then is the actual Venue created.
export interface AdminVenueApplication {
  id: string;
  venueName: string;
  venueType: VenueType;
  address: string;
  website: string | null;
  contactName: string;
  contactEmail: string;
  contactPhone: string | null;
  message: string | null;
  documentName: string;
  status: VenueApplicationStatus;
  reviewNote: string | null;
  reviewedAt: string | null;
  documentDeletedAt: string | null;
  // null bei Bewerbungen von vor der Pflicht-Checkbox (25.08.2026).
  acceptedTermsVersion: string | null;
  acceptedTermsAt: string | null;
  createdVenueId: string | null;
  createdAt: string;
}

export interface VenueSummary {
  id: string;
  name: string;
  status: VenueStatus;
}

export interface StaffProfile {
  id: string;
  email: string;
  name: string;
  role: StaffRole;
  venue: { id: string; name: string; address: string; logoUrl: string | null; status: VenueStatus };
  isPlatformAdmin: boolean;
}

export interface AdminHiddenVenue {
  venueId: string;
  venueName: string;
  hiddenAt: string;
}

export interface AdminHiddenVenuesResult {
  userId: string;
  email: string;
  hiddenVenues: AdminHiddenVenue[];
}

export interface AdminVenue {
  id: string;
  name: string;
  slug: string;
  address: string;
  status: VenueStatus;
  suspendedAt: string | null;
  suspendedReason: string | null;
  createdAt: string;
}

export interface StaffLoginSuccess {
  token: string;
  staff: StaffProfile;
}

export interface StaffLoginNeedsVenueSelection {
  needsVenueSelection: true;
  preAuthToken: string;
  venues: VenueSummary[];
}

export type StaffLoginResponse = StaffLoginSuccess | StaffLoginNeedsVenueSelection;

export type GlobalTier = "VIP" | "TRUSTED" | "STANDARD" | "WATCH" | "BANNED";

export type LocalFlag = "NONE" | "VIP" | "BANNED";

export interface RatingTag {
  key: string;
  label: string;
}

export const RATING_TAGS: RatingTag[] = [
  { key: "friendly", label: "Freundlich" },
  { key: "punctual", label: "Pünktlich" },
  { key: "big_spender", label: "Umsatzstark" },
  { key: "well_dressed", label: "Stilvoll gekleidet" },
  { key: "trouble", label: "Ärger gemacht" },
  { key: "too_intoxicated", label: "Zu stark alkoholisiert" },
];

export interface QrVerifyResult {
  displayName: string;
  photoUrl: string | null;
  globalTier: GlobalTier;
  globalScore: number;
  venue: {
    visits: number;
    lastVisitAt: string | null;
    localFlag: LocalFlag;
    privateNote: string | null;
  };
  entryLogId: string;
}

export type SubscriptionProvider = "STRIPE" | "PAYPAL" | "COMPED";
export type SubscriptionStatus = "ACTIVE" | "PAST_DUE" | "CANCELED" | "INCOMPLETE";
export type BillingInterval = "MONTH" | "YEAR";

export interface PremiumStatus {
  isPremium: boolean;
  subscription: {
    provider: SubscriptionProvider;
    status: SubscriptionStatus;
    interval: BillingInterval;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
  } | null;
}

export interface EligibleMatch {
  userId: string;
  displayName: string;
  photoUrl: string | null;
  venueName: string;
  sharedAt: string;
}

export interface MessageDTO {
  id: string;
  senderId: string;
  recipientId: string;
  body: string;
  createdAt: string;
  readAt: string | null;
}

export interface MessageThreadSummary {
  userId: string;
  displayName: string;
  photoUrl: string | null;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface EligibleGuest {
  userId: string;
  displayName: string;
  photoUrl: string | null;
  globalTier: GlobalTier;
  isPremium: boolean;
}

export interface StaffMessageDTO {
  id: string;
  senderId: string | null;
  senderStaffAccountId: string | null;
  recipientId: string | null;
  recipientStaffAccountId: string | null;
  body: string;
  createdAt: string;
  readAt: string | null;
}

export interface InviteCodePreview {
  userId: string;
  displayName: string;
  photoUrl: string | null;
}

export type InviteRequestStatus = "PENDING" | "ACCEPTED" | "DECLINED";

export interface IncomingInviteRequest {
  id: string;
  userId: string;
  displayName: string;
  photoUrl: string | null;
  createdAt: string;
}
