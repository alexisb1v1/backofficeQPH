import { ResultAsync } from 'neverthrow';
import { DomainError } from '@/app/shared/errors/domain-error';
import { FinanceRepository } from '../repositories/finance.repository';

export class MarkFinanceRequestPaidUseCase {
  constructor(private readonly repository: FinanceRepository) {}

  execute(code: string): ResultAsync<void, DomainError> {
    return this.repository.markRequestPaid(code);
  }
}

