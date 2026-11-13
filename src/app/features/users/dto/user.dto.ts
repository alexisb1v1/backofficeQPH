export interface ApiUserItemDto {
  id: number;
  publicUuid: string;
  name: string;
  email: string;
  username: string;
  role: string;
  isOrganizer: boolean;
  organizerName: string | null;
  organizerDocumentType: string | null;
  organizerDocumentNumber: string | null;
  organizerPhone: string | null;
  isEmailVerified: boolean;
  emailVerifiedAt: string | null;
  ticketsCount: number;
  createdAt: string;
}

export interface PaginationMetaDto {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ListUsersApiResponseDto {
  data: ApiUserItemDto[];
  meta: PaginationMetaDto;
}

export interface ListUsersFiltersDto {
  role?: string;
  search?: string;
  isOrganizer?: boolean;
  page?: number;
  limit?: number;
}
