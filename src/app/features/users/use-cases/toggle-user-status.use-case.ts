import { ResultAsync } from "neverthrow";
import { DomainError } from "@/app/shared/errors/domain-error";
import { UserRepository } from "../repositories/user.repository";
import { UserModel } from "../models/user.model";

export class ToggleUserStatusUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  execute(
    userId: number,
    currentStatus: string,
  ): ResultAsync<UserModel, DomainError> {
    return this.userRepository.toggleUserStatus(userId, currentStatus);
  }
}
