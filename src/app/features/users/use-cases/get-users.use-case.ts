import { ResultAsync } from "neverthrow";
import { DomainError } from "@/app/shared/errors/domain-error";
import { UserRepository } from "../repositories/user.repository";
import { PaginatedUsersModel } from "../models/user.model";
import { ListUsersFiltersDto } from "../dto/user.dto";

export class GetUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  execute(
    filters: ListUsersFiltersDto = {},
  ): ResultAsync<PaginatedUsersModel, DomainError> {
    return this.userRepository.getUsers({
      role: "customer",
      page: 1,
      limit: 10,
      ...filters,
    });
  }
}
