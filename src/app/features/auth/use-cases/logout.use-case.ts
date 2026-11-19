import { ResultAsync } from "neverthrow";
import { DomainError } from "@/app/shared/errors/domain-error";
import { AuthRepository } from "../repositories/auth.repository";

export class LogoutUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(): ResultAsync<void, DomainError> {
    return this.authRepository.logout();
  }
}
