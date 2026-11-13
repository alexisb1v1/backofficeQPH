import { ResultAsync } from 'neverthrow';
import { DomainError } from '@/app/shared/errors/domain-error';
import { EventApprovalRepository } from '../repositories/event-approval.repository';
import { PaginatedEventApprovalsModel } from '../models/event-approval.model';
import { ListEventApprovalsFiltersDto } from '../dto/event-approval.dto';

export class GetApprovalEventsUseCase {
  constructor(private readonly repository: EventApprovalRepository) {}

  execute(filters: ListEventApprovalsFiltersDto = {}): ResultAsync<PaginatedEventApprovalsModel, DomainError> {
    return this.repository.getEvents({
      status: 'in_review',
      page: 1,
      limit: 10,
      ...filters,
    });
  }
}
