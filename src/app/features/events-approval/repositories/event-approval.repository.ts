import { ResultAsync } from "neverthrow";
import { DomainError } from "@/app/shared/errors/domain-error";
import { PaginatedEventApprovalsModel } from "../models/event-approval.model";
import { ListEventApprovalsFiltersDto } from "../dto/event-approval.dto";

export interface EventApprovalRepository {
  getEvents(
    filters: ListEventApprovalsFiltersDto,
  ): ResultAsync<PaginatedEventApprovalsModel, DomainError>;
  approveEvent(eventId: string): ResultAsync<void, DomainError>;
  observeEvent(
    eventId: string,
    reason?: string,
  ): ResultAsync<void, DomainError>;
  updateEventFee?(
    eventId: string,
    feePercentage: number,
    feeFixed: number,
  ): ResultAsync<void, DomainError>;
}
