import { ResultAsync } from "neverthrow";
import { DomainError } from "@/app/shared/errors/domain-error";
import { EventApprovalRepository } from "../repositories/event-approval.repository";

export class ObserveEventUseCase {
  constructor(private readonly repository: EventApprovalRepository) {}

  execute(eventId: string, reason?: string): ResultAsync<void, DomainError> {
    return this.repository.observeEvent(eventId, reason);
  }
}
