import { ResultAsync } from "neverthrow";
import { DomainError } from "@/app/shared/errors/domain-error";
import { PaginatedUsersModel, UserModel } from "../models/user.model";
import { ListUsersFiltersDto } from "../dto/user.dto";

export interface UserRepository {
  getUsers(
    filters: ListUsersFiltersDto,
  ): ResultAsync<PaginatedUsersModel, DomainError>;
  toggleUserStatus(
    userId: number,
    currentStatus: string,
  ): ResultAsync<UserModel, DomainError>;
}
