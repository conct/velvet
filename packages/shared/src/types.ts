export type StaffRole = "DOORMAN" | "MANAGER";

export type VenueStatus = "PENDING" | "VERIFIED";

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

export interface AdminVenue {
  id: string;
  name: string;
  slug: string;
  address: string;
  status: VenueStatus;
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
