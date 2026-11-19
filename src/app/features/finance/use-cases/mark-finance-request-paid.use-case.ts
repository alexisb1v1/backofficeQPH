import { ResultAsync } from "neverthrow";
import { DomainError } from "@/app/shared/errors/domain-error";
import { FinanceRepository } from "../repositories/finance.repository";
import { PayFinanceRequestDto } from "../dto/finance-request.dto";

export class MarkFinanceRequestPaidUseCase {
  constructor(private readonly repository: FinanceRepository) {}

  execute(
    id: string,
    dto: PayFinanceRequestDto,
  ): ResultAsync<void, DomainError> {
    return this.repository.markRequestPaid(id, dto);
  }
}
