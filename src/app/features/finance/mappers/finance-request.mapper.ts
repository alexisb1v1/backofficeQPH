import { AdminSettlementApiItemDto } from "../dto/finance-request.dto";
import {
  FinanceRequestItem,
  FinanceRequestStatus,
} from "../models/finance-request.model";

export function adminSettlementApiToModel(
  dto: AdminSettlementApiItemDto,
): FinanceRequestItem {
  let mappedStatus: FinanceRequestStatus = "pending";
  if (dto.status === "paid") mappedStatus = "paid";
  else if (dto.status === "rejected") mappedStatus = "rejected";
  else if (dto.status === "approved") mappedStatus = "approved";
  else mappedStatus = "pending";

  const reqDate = dto.requestedAt
    ? new Date(dto.requestedAt).toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

  const paidDate = dto.paidAt
    ? new Date(dto.paidAt).toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return {
    id: dto.id,
    publicUuid: dto.publicUuid,
    code: dto.code || `#LIQ-${dto.id}`,
    type: "settlement",
    eventId: dto.eventId,
    eventTitle: dto.eventTitle,
    eventCode: dto.eventCode,
    eventStatus: dto.eventStatus,
    organizerName: dto.organizerName || "Organizador",
    organizerDocumentType: dto.organizerDocumentType || "RUC",
    organizerDocumentNumber: dto.organizerDocumentNumber || "-",
    bankName: dto.bankName || "No especificado",
    bankAccountNumber: dto.bankAccountNumber || "-",
    bankAccountCci: dto.bankAccountCci || null,
    bankAccountHolder: dto.bankAccountHolder || dto.organizerName,
    accountType: dto.accountType || null,
    totalTicketsSold: dto.totalTicketsSold || 0,
    grossAccumulatedFormatted: `S/ ${Number(dto.grossAmount || 0).toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    platformFeeFormatted: `S/ ${Number(dto.platformFeeAmount || 0).toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    couponsDiscountFormatted: `S/ ${Number(dto.totalCouponsDiscountAmount || 0).toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    requestedAmountFormatted: `S/ ${Number(dto.netPayoutAmount || 0).toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    pctOfAvailableFormatted: "100% (Cierre Final)",
    status: mappedStatus,
    statusLabel:
      dto.statusLabel ||
      (mappedStatus === "paid"
        ? "Liquidado y Pagado"
        : "En Revisión (24h - 72h)"),
    requestedDate: reqDate,
    paidDate,
    transferReference: dto.transferReference || null,
    transferVoucherUrl: dto.transferVoucherUrl || null,
    notes: dto.notes || null,
    hoursElapsed: dto.hoursElapsed || 0,
  };
}
