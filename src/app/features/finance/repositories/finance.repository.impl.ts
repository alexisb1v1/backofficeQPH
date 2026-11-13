import { ResultAsync, okAsync, errAsync } from 'neverthrow';
import { DomainError, ERROR_CODES } from '@/app/shared/errors/domain-error';
import { FinanceRequestDto } from '../dto/finance-request.dto';
import { FinanceRequestItem } from '../models/finance-request.model';
import { financeRequestDtoToModel } from '../mappers/finance-request.mapper';
import { FinanceRepository } from './finance.repository';

const INITIAL_FINANCE_REQUESTS: FinanceRequestDto[] = [
  {
    code: 'ADL-2026-0089',
    type: 'advance',
    event_title: 'Neon Lights Festival Lima 2026',
    organizer_name: 'Sonorama Live SAC',
    organizer_ruc: '20601984210',
    bank_name: 'BCP Soles Cta Cte',
    bank_account: '193-9481928-0-12',
    gross_accumulated_cents: 12000000,
    platform_fee_cents: 780000,
    requested_amount_cents: 4800000,
    pct_of_available: 40.0,
    status: 'pending',
    requested_date: 'Hoy, 10:15 am',
  },
  {
    code: 'ADL-2026-0090',
    type: 'advance',
    event_title: 'Filarmónica Soundtracks Anime',
    organizer_name: 'Cultura Viva Producciones',
    organizer_ruc: '20551928371',
    bank_name: 'BBVA Perú Soles',
    bank_account: '0011-0482-0100039281',
    gross_accumulated_cents: 6800000,
    platform_fee_cents: 340000,
    requested_amount_cents: 2500000,
    pct_of_available: 36.7,
    status: 'pending',
    requested_date: 'Ayer, 04:30 pm',
  },
  {
    code: 'LIQ-2026-0041',
    type: 'settlement',
    event_title: 'Standup Comedy Especial Fin de Año',
    organizer_name: 'Prod. Macanudo EIRL',
    organizer_ruc: '20551928371',
    bank_name: 'Interbank Soles',
    bank_account: '200-3001928419',
    gross_accumulated_cents: 2250000,
    platform_fee_cents: 135000,
    requested_amount_cents: 1845000,
    pct_of_available: 100,
    status: 'approved',
    requested_date: '10 Mar 2026',
  },
  {
    code: 'LIQ-2026-0042',
    type: 'settlement',
    event_title: 'Torneo Pádel Lima Open 2026',
    organizer_name: 'Padel Pro League Peru SAC',
    organizer_ruc: '20718829102',
    bank_name: 'BCP Soles',
    bank_account: '191-4829104-0-99',
    gross_accumulated_cents: 3800000,
    platform_fee_cents: 182400,
    requested_amount_cents: 3420000,
    pct_of_available: 100,
    status: 'paid',
    requested_date: '08 Mar 2026',
  },
];

export class FinanceRepositoryImpl implements FinanceRepository {
  private data: FinanceRequestDto[] = [...INITIAL_FINANCE_REQUESTS];

  getRequests(): ResultAsync<FinanceRequestItem[], DomainError> {
    try {
      const models = this.data.map(financeRequestDtoToModel);
      return okAsync(models);
    } catch (error) {
      return errAsync(
        new DomainError(
          ERROR_CODES.INTERNAL_ERROR.message,
          ERROR_CODES.INTERNAL_ERROR.code,
          error
        )
      );
    }
  }

  approveRequest(code: string): ResultAsync<void, DomainError> {
    const item = this.data.find((r) => r.code === code);
    if (!item) {
      return errAsync(
        new DomainError(ERROR_CODES.NOT_FOUND.message, ERROR_CODES.NOT_FOUND.code)
      );
    }
    item.status = 'approved';
    return okAsync(undefined);
  }

  markRequestPaid(code: string): ResultAsync<void, DomainError> {
    const item = this.data.find((r) => r.code === code);
    if (!item) {
      return errAsync(
        new DomainError(ERROR_CODES.NOT_FOUND.message, ERROR_CODES.NOT_FOUND.code)
      );
    }
    item.status = 'paid';
    return okAsync(undefined);
  }
}

