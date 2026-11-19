export type UserRole = "customer" | "admin";
export type UserStatus = "active" | "pending_verification" | "suspended";

export interface UserModel {
  id: number;
  publicUuid: string;
  fullName: string;
  email: string;
  username: string;
  role: UserRole;
  isOrganizer: boolean;
  documentType: string;
  documentNumber: string;
  phoneNumber: string;
  registeredDateFormatted: string;
  isEmailVerified: boolean;
  status: UserStatus;
  ticketsCount: number;
  lastActivityText: string;
  avatarInitials: string;
  avatarBgColor: string;
}

export interface PaginatedUsersModel {
  users: UserModel[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
