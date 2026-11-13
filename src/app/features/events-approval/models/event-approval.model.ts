export type EventApprovalStatus = 'pending' | 'in_review' | 'published' | 'observed';

export interface EventApprovalZoneModel {
  name: string;
  regularPrice: number;
  serviceFee: number;
  feeIncluded: boolean;
  capacity: number;
  buyerPrice: number;
}

export interface EventApprovalItem {
  id: string;
  publicUuid: string;
  slug: string;
  title: string;
  organizerName: string;
  organizerDocumentNumber: string;
  category: string;
  eventDateFormatted: string;
  venueName: string;
  venueCity: string;
  totalCapacity: number;
  capacityFormatted: string;
  priceRangeFormatted: string;
  minPrice: number;
  maxPrice: number;
  status: EventApprovalStatus;
  observationReason: string | null;
  zones: EventApprovalZoneModel[];
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
