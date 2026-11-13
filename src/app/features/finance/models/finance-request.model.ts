export type FinanceRequestType = 'advance' | 'settlement';
export type FinanceRequestStatus = 'pending' | 'approved' | 'paid' | 'rejected';

export interface FinanceRequestItem {
  code: string;
  type: FinanceRequestType;
  eventTitle: string;
  organizerName: string;
  organizerRuc: string;
  bankName: string;
  bankAccount: string;
  grossAccumulatedFormatted: string;
  platformFeeFormatted: string;
  requestedAmountFormatted: string;
  pctOfAvailableFormatted: string;
  status: FinanceRequestStatus;
  requestedDate: string;
}

