import { ResultAsync } from 'neverthrow';
import { DomainError } from '@/app/shared/errors/domain-error';
import { FinanceRequestItem } from '../models/finance-request.model';
import { FinanceRepository } from '../repositories/finance.repository';

export class GetFinanceRequestsUseCase {
  constructor(private readonly repository: FinanceRepository) {}

  execute(): ResultAsync<FinanceRequestItem[], DomainError> {
    return this.repository.getRequests();
  }
}

