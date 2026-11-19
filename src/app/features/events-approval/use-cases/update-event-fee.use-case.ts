import { ResultAsync } from "neverthrow";
import { DomainError, ERROR_CODES } from "@/app/shared/errors/domain-error";
import { EventApprovalRepository } from "../repositories/event-approval.repository";

export class UpdateEventFeeUseCase {
  constructor(private readonly repository: EventApprovalRepository) {}

  execute(
    eventId: string,
    feePercentage: number,
    feeFixed: number,
  ): ResultAsync<void, DomainError> {
    if (this.repository.updateEventFee) {
      return this.repository.updateEventFee(eventId, feePercentage, feeFixed);
    }
    return ResultAsync.fromPromise(
      Promise.resolve(),
      () =>
        new DomainError(
          "Ajuste de comisión no disponible",
          ERROR_CODES.INTERNAL_ERROR.code,
        ),
    );
  }
}
