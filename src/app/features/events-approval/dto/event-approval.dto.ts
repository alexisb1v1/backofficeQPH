export interface EventApprovalZoneItemDto {
  name: string;
  regularPrice: number;
  serviceFee: number;
  feeIncluded: boolean;
  capacity: number;
}

export interface ApiEventApprovalItemDto {
  id: string;
  publicUuid: string;
  slug: string;
  title: string;
  category: string;
  status: 'pending' | 'in_review' | 'published' | 'observed';
  observationReason: string | null;
  venue: string | null;
  city: string;
  organizerName: string;
  organizerDocumentNumber: string | null;
  firstShowDate: string | null;
  totalCapacity: number;
  minPrice: number;
  maxPrice: number;
  zones?: EventApprovalZoneItemDto[];
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
  status?: 'pending' | 'in_review' | 'published' | 'observed' | 'all';
  search?: string;
  page?: number;
  limit?: number;
}

export interface ObserveEventPayloadDto {
  reason?: string;
}
