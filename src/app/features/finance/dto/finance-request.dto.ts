export interface RejectFinanceRequestDto {
  reason: string;
}

export interface PayFinanceRequestDto {
  transferReference: string;
  transferVoucherUrl?: string;
  notes?: string;
}

export interface AdminSettlementApiItemDto {
  id: string;
  publicUuid: string;
  code: string;
  eventId: string;
  eventTitle: string;
  eventCode: string;
  eventStatus: string;
  organizerId: number;
  organizerName: string;
  organizerDocumentType: string;
  organizerDocumentNumber: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountCci: string | null;
  bankAccountHolder: string;
  accountType: string | null;
  totalTicketsSold: number;
  grossAmount: number;
  totalCouponsDiscountAmount: number;
  platformFeeAmount: number;
  netPayoutAmount: number;
  status: string;
  statusLabel: string;
  requestedAt: string;
  paidAt: string | null;
  transferReference: string | null;
  transferVoucherUrl: string | null;
  notes: string | null;
  hoursElapsed: number;
}

export interface AdminSettlementListApiResponseDto {
  items: AdminSettlementApiItemDto[];
  total: number;
}
