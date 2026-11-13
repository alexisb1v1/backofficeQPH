export type FinanceRequestTypeDto = 'advance' | 'settlement';
export type FinanceRequestStatusDto = 'pending' | 'approved' | 'paid' | 'rejected';

export interface FinanceRequestDto {
  code: string;
  type: FinanceRequestTypeDto;
  event_title: string;
  organizer_name: string;
  organizer_ruc: string;
  bank_name: string;
  bank_account: string;
  gross_accumulated_cents: number;
  platform_fee_cents: number;
  requested_amount_cents: number;
  pct_of_available: number;
  status: FinanceRequestStatusDto;
  requested_date: string;
}

