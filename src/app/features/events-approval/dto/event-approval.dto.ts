export interface EventApprovalZoneItemDto {
  name: string;
  regularPrice: number;
  serviceFee: number;
  feeIncluded: boolean;
  capacity: number;
}

export interface EventApprovalShowItemDto {
  id: string;
  name: string;
  startTime: string;
  durationHours?: number;
}

export interface EventApprovalCouponItemDto {
  code: string;
  discountType: string;
  discountValue: number;
  maxUses?: number;
}

export interface EventApprovalFaqItemDto {
  question: string;
  answer: string;
}

export interface ApiEventApprovalItemDto {
  id: string;
  publicUuid: string;
  slug: string;
  title: string;
  description: string | null;
  category: string;
  status: "pending" | "in_review" | "published" | "observed";
  observationReason: string | null;
  venue: string | null;
  address: string | null;
  addressReference: string | null;
  city: string;
  googleMapsUrl: string | null;
  organizerName: string;
  organizerDocumentNumber: string | null;
  organizerEmail: string | null;
  organizerPhone: string | null;
  ageRestriction: string | null;
  entryRequirements: string | null;
  openingHoursComment: string | null;
  termsAndConditionsUrl: string | null;
  bannerImageUrl: string | null;
  hasLandingPage: boolean;
  firstShowDate: string | null;
  totalCapacity: number;
  minPrice: number;
  maxPrice: number;
  zones?: EventApprovalZoneItemDto[];
  shows?: EventApprovalShowItemDto[];
  coupons?: EventApprovalCouponItemDto[];
  faqs?: EventApprovalFaqItemDto[];
  createdAt: string;
}

export interface ApiEventApprovalsMetaDto {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  pendingCount: number;
  publishedCount: number;
  observedCount: number;
}

export interface ListEventApprovalsApiResponseDto {
  data: ApiEventApprovalItemDto[];
  meta: ApiEventApprovalsMetaDto;
}

export interface ListEventApprovalsFiltersDto {
  status?: "pending" | "in_review" | "published" | "observed" | "all";
  search?: string;
  page?: number;
  limit?: number;
}

export interface ObserveEventPayloadDto {
  reason?: string;
}
