import { FinanceRequestDto } from '../dto/finance-request.dto';
import { FinanceRequestItem } from '../models/finance-request.model';

export function financeRequestDtoToModel(dto: FinanceRequestDto): FinanceRequestItem {
  return {
    code: dto.code,
    type: dto.type,
    eventTitle: dto.event_title,
    organizerName: dto.organizer_name,
    organizerRuc: dto.organizer_ruc,
    bankName: dto.bank_name,
    bankAccount: dto.bank_account,
    grossAccumulatedFormatted: `S/ ${(dto.gross_accumulated_cents / 100).toFixed(2)}`,
    platformFeeFormatted: `S/ ${(dto.platform_fee_cents / 100).toFixed(2)}`,
    requestedAmountFormatted: `S/ ${(dto.requested_amount_cents / 100).toFixed(2)}`,
    pctOfAvailableFormatted: dto.type === 'settlement' ? '100% (Final)' : `${dto.pct_of_available}%`,
    status: dto.status,
    requestedDate: dto.requested_date,
  };
}

