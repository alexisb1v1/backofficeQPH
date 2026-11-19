import { ResultAsync } from 'neverthrow';
import { DomainError } from '@/app/shared/errors/domain-error';
import { FinanceRepository } from '../repositories/finance.repository';
import { FinanceRequestItem } from '../models/finance-request.model';

export class GetFinanceRequestsUseCase {
  constructor(private readonly repository: FinanceRepository) {}

  execute(status?: string, search?: string): ResultAsync<FinanceRequestItem[], DomainError> {
    return this.repository.getRequests(status, search);
  }
}
