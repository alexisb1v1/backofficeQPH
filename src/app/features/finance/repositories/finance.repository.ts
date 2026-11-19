import { ResultAsync } from "neverthrow";
import { DomainError } from "@/app/shared/errors/domain-error";
import { FinanceRequestItem } from "../models/finance-request.model";
import {
  PayFinanceRequestDto,
  RejectFinanceRequestDto,
} from "../dto/finance-request.dto";

export interface FinanceRepository {
  getRequests(
    status?: string,
    search?: string,
  ): ResultAsync<FinanceRequestItem[], DomainError>;
  approveRequest(id: string): ResultAsync<void, DomainError>;
  markRequestPaid(
    id: string,
    dto: PayFinanceRequestDto,
  ): ResultAsync<void, DomainError>;
  rejectRequest(
    id: string,
    dto: RejectFinanceRequestDto,
  ): ResultAsync<void, DomainError>;
}
