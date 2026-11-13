import { ResultAsync } from 'neverthrow';
import { DomainError } from '@/app/shared/errors/domain-error';
import { EventApprovalRepository } from '../repositories/event-approval.repository';

export class ApproveEventUseCase {
  constructor(private readonly repository: EventApprovalRepository) {}

  execute(eventId: string): ResultAsync<void, DomainError> {
    return this.repository.approveEvent(eventId);
  }
}
