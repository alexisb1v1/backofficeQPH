export type FinanceRequestType = "advance" | "settlement";
export type FinanceRequestStatus = "pending" | "approved" | "paid" | "rejected";

export interface FinanceRequestItem {
  id: string;
  publicUuid: string;
  code: string;
  type: FinanceRequestType;
  eventId: string;
  eventTitle: string;
  eventCode: string;
  eventStatus: string;
  organizerName: string;
  organizerDocumentType: string;
  organizerDocumentNumber: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountCci: string | null;
  bankAccountHolder: string;
  accountType: string | null;
  totalTicketsSold: number;
  grossAccumulatedFormatted: string;
  platformFeeFormatted: string;
  couponsDiscountFormatted: string;
  requestedAmountFormatted: string;
  pctOfAvailableFormatted: string;
  status: FinanceRequestStatus;
  statusLabel: string;
  requestedDate: string;
  paidDate: string | null;
  transferReference: string | null;
  transferVoucherUrl: string | null;
  notes: string | null;
  hoursElapsed: number;
}
