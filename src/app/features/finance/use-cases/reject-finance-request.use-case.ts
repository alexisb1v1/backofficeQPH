import { ResultAsync } from "neverthrow";
import { DomainError } from "@/app/shared/errors/domain-error";
import { FinanceRepository } from "../repositories/finance.repository";
import { RejectFinanceRequestDto } from "../dto/finance-request.dto";

export class RejectFinanceRequestUseCase {
  constructor(private readonly repository: FinanceRepository) {}

  execute(
    id: string,
    dto: RejectFinanceRequestDto,
  ): ResultAsync<void, DomainError> {
    return this.repository.rejectRequest(id, dto);
  }
}
