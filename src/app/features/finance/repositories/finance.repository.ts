import { ResultAsync } from 'neverthrow';
import { DomainError } from '@/app/shared/errors/domain-error';
import { FinanceRequestItem } from '../models/finance-request.model';

export interface FinanceRepository {
  getRequests(): ResultAsync<FinanceRequestItem[], DomainError>;
  approveRequest(code: string): ResultAsync<void, DomainError>;
  markRequestPaid(code: string): ResultAsync<void, DomainError>;
}

