export type EventApprovalStatus = 'pending' | 'in_review' | 'published' | 'observed';

export interface EventApprovalZoneModel {
  name: string;
  regularPrice: number;
  serviceFee: number;
  feeIncluded: boolean;
  capacity: number;
  buyerPrice: number;
}

export interface EventApprovalShowModel {
  id: string;
  name: string;
  startTime: string;
  startTimeFormatted: string;
  durationHours?: number;
}

export interface EventApprovalCouponModel {
  code: string;
  discountType: string;
  discountValue: number;
  maxUses?: number;
}

export interface EventApprovalFaqModel {
  question: string;
  answer: string;
}

export interface EventApprovalItem {
  id: string;
  publicUuid: string;
  slug: string;
  title: string;
  description: string | null;
  organizerName: string;
  organizerDocumentNumber: string;
  organizerEmail: string | null;
  organizerPhone: string | null;
  category: string;
  eventDateFormatted: string;
  venueName: string;
  venueAddress: string | null;
  venueAddressReference: string | null;
  venueCity: string;
  googleMapsUrl: string | null;
  ageRestriction: string | null;
  entryRequirements: string | null;
  openingHoursComment: string | null;
  termsAndConditionsUrl: string | null;
  bannerImageUrl: string | null;
  hasLandingPage: boolean;
  landingUrl: string | null;
  totalCapacity: number;
  capacityFormatted: string;
  priceRangeFormatted: string;
  minPrice: number;
  maxPrice: number;
  status: EventApprovalStatus;
  observationReason: string | null;
  zones: EventApprovalZoneModel[];
  shows: EventApprovalShowModel[];
  coupons: EventApprovalCouponModel[];
  faqs: EventApprovalFaqModel[];
  avatarInitials: string;
  avatarBgColor: string;
  createdAtFormatted: string;
}

export interface PaginatedEventApprovalsModel {
  items: EventApprovalItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    pendingCount: number;
    publishedCount: number;
    observedCount: number;
  };
}
