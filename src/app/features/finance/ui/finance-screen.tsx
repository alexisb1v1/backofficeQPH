"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getFinanceRequestsUseCase,
  markFinanceRequestPaidUseCase,
  rejectFinanceRequestUseCase,
  FinanceRequestItem,
} from "@/app/features/finance";
import {
  Lock,
  ArrowUpRight,
  Clock,
  CheckCircle,
  FileText,
  CreditCard,
  X,
  Eye,
  Check,
  Building2,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check as CheckIcon,
} from "lucide-react";
import { VoucherUploader } from "@/app/shared/components/voucher-uploader";

export function FinanceScreen() {
  const [activeTab, setActiveTab] = useState<"advance" | "settlement">(
    "settlement",
  );
  const [requests, setRequests] = useState<FinanceRequestItem[]>([]);
  const [selectedReq, setSelectedReq] = useState<FinanceRequestItem | null>(
    null,
  );
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Estados del modal de pago/despacho
  const [transferReference, setTransferReference] = useState("");
  const [transferVoucherUrl, setTransferVoucherUrl] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [isSubmittingPay, setIsSubmittingPay] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Estados del modal de rechazo
  const [rejectModalItem, setRejectModalItem] =
    useState<FinanceRequestItem | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isSubmittingReject, setIsSubmittingReject] = useState(false);

  const loadRequests = async () => {
    const result = await getFinanceRequestsUseCase.execute();
    result.match(
      (data) => setRequests(data),
      (err) =>
        setFeedbackMessage({
          type: "error",
          text: `Error al cargar liquidaciones: ${err.message}`,
        }),
    );
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const filtered = requests.filter((r) => r.type === activeTab);

  const openAuditModal = (req: FinanceRequestItem) => {
    setSelectedReq(req);
    setTransferReference(req.transferReference || "");
    setTransferVoucherUrl(req.transferVoucherUrl || "");
    setPaymentNotes("");
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleProcessPay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq) return;
    if (!transferReference.trim()) {
      setFeedbackMessage({
        type: "error",
        text: "El número de operación bancaria es obligatorio para liquidar.",
      });
      return;
    }

    setIsSubmittingPay(true);
    const result = await markFinanceRequestPaidUseCase.execute(selectedReq.id, {
      transferReference: transferReference.trim(),
      transferVoucherUrl: transferVoucherUrl.trim() || undefined,
      notes: paymentNotes.trim() || undefined,
    });

    result.match(
      () => {
        setFeedbackMessage({
          type: "success",
          text: `Liquidación ${selectedReq.code} despachada y pagada con éxito.`,
        });
        setSelectedReq(null);
        loadRequests();
      },
      (err) => {
        setFeedbackMessage({
          type: "error",
          text: `Error al pagar: ${err.message}`,
        });
      },
    );
    setIsSubmittingPay(false);
  };

  const handleProcessReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalItem) return;
    if (!rejectReason.trim()) {
      setFeedbackMessage({
        type: "error",
        text: "Debe ingresar un motivo para rechazar la liquidación.",
      });
      return;
    }

    setIsSubmittingReject(true);
    const result = await rejectFinanceRequestUseCase.execute(
      rejectModalItem.id,
      {
        reason: rejectReason.trim(),
      },
    );

    result.match(
      () => {
        setFeedbackMessage({
          type: "success",
          text: `Liquidación ${rejectModalItem.code} fue rechazada correctamente.`,
        });
        setRejectModalItem(null);
        setSelectedReq(null);
        setRejectReason("");
        loadRequests();
      },
      (err) => {
        setFeedbackMessage({
          type: "error",
          text: `Error al rechazar: ${err.message}`,
        });
      },
    );
    setIsSubmittingReject(false);
  };

  // Métricas agregadas
  const pendingSettlements = requests.filter(
    (r) => r.type === "settlement" && r.status === "pending",
  );
  const paidSettlements = requests.filter(
    (r) => r.type === "settlement" && r.status === "paid",
  );
  const totalPendingAmount = pendingSettlements.reduce((acc, curr) => {
    const raw = curr.requestedAmountFormatted.replace(/[^\d.]/g, "");
    return acc + (parseFloat(raw) || 0);
  }, 0);

  return (
    <div className="flex flex-col w-full pb-16">
      <div className="px-8 py-6 flex flex-col gap-6 max-w-[1400px] mx-auto w-full">
        {/* Top Meta Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5 font-bold">
              <CreditCard className="w-4 h-4 text-primary" />
              Tesorería & Conciliación QPH
            </span>
            <span className="text-outline-variant font-bold">/</span>
            <span className="text-xs font-bold text-on-surface">
              Escrow & Settlements Engine
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-[11px] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Auditoría en Tiempo Real
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/finance/requests"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors text-xs font-bold text-on-surface shadow-sm border border-surface-container"
            >
              <FileText className="w-4 h-4 text-primary" />
              <span>Ver Cola de Despacho Detallada</span>
            </Link>
          </div>
        </div>

        {feedbackMessage && (
          <div
            className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between border ${
              feedbackMessage.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            <span>{feedbackMessage.text}</span>
            <button
              onClick={() => setFeedbackMessage(null)}
              className="hover:opacity-75"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Global Financial KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container flex flex-col justify-between">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-xs font-bold uppercase tracking-wider">
                Pendiente Desembolso
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex flex-col">
              <span className="text-2xl font-black text-on-surface">
                S/{" "}
                {totalPendingAmount.toLocaleString("es-PE", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-amber-800 font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>
                  {pendingSettlements.length} en espera de transferencia
                  bancaria
                </span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container flex flex-col justify-between">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-xs font-bold uppercase tracking-wider">
                Eventos en Revisión
              </span>
              <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex flex-col">
              <span className="text-2xl font-black text-on-surface">
                {pendingSettlements.length} solicitudes
              </span>
              <span className="text-xs text-on-surface-variant mt-1">
                Concluidos con ventas auditadas
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container flex flex-col justify-between">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-xs font-bold uppercase tracking-wider">
                Total Liquidados
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex flex-col">
              <span className="text-2xl font-black text-emerald-800">
                {paidSettlements.length} pagos
              </span>
              <span className="text-xs text-on-surface-variant mt-1">
                Transferencias confirmadas
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container flex flex-col justify-between">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-xs font-bold uppercase tracking-wider">
                SLA de Tesorería
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex flex-col">
              <span className="text-2xl font-black text-blue-700">
                24h - 72h
              </span>
              <span className="text-xs text-on-surface-variant mt-1">
                Ventana oficial de pago
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-surface-container pb-2">
          <button
            onClick={() => setActiveTab("settlement")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === "settlement"
                ? "bg-primary text-white shadow-sm"
                : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <span>Liquidaciones Finales (Completados)</span>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px]">
              {requests.filter((r) => r.type === "settlement").length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("advance")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === "advance"
                ? "bg-primary text-white shadow-sm"
                : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <span>Solicitudes de Adelanto (Publicados)</span>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px]">
              {requests.filter((r) => r.type === "advance").length}
            </span>
          </button>
        </div>

        {/* Requests Table */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-[11px] uppercase tracking-wider font-bold border-b border-surface-container">
                  <th className="py-3.5 px-4">Solicitud & Evento</th>
                  <th className="py-3.5 px-4">Organizador & Datos Bancarios</th>
                  <th className="py-3.5 px-4">Recaudación Bruta</th>
                  <th className="py-3.5 px-4">Comisión QPH</th>
                  <th className="py-3.5 px-4">Monto Solicitado</th>
                  <th className="py-3.5 px-4 text-center">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container text-xs">
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-12 text-center text-on-surface-variant"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FileText className="w-8 h-8 text-on-surface-variant/40" />
                        <span className="font-semibold text-sm">
                          No hay solicitudes de{" "}
                          {activeTab === "settlement"
                            ? "liquidación"
                            : "adelanto"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((req) => (
                    <tr
                      key={req.id}
                      className="hover:bg-surface-container-low/40 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-on-surface text-sm">
                            {req.eventTitle}
                          </span>
                          <span className="text-[11px] text-primary font-mono font-bold">
                            {req.code} • {req.requestedDate}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-on-surface">
                            {req.organizerName}
                          </span>
                          <span className="text-[11px] text-on-surface-variant font-mono">
                            {req.organizerDocumentType}:{" "}
                            {req.organizerDocumentNumber}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-bold text-[11px] text-primary">
                              {req.bankName}
                            </span>
                            <span className="text-[11px] text-on-surface font-mono">
                              Cta: {req.bankAccountNumber}
                            </span>
                          </div>
                          {req.bankAccountCci ? (
                            <span className="text-[10px] text-on-surface-variant font-mono">
                              CCI: {req.bankAccountCci}
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-700 italic">
                              Directo BCP (Sin CCI)
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-on-surface">
                        {req.grossAccumulatedFormatted}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-red-600 font-semibold">
                        -{req.platformFeeFormatted}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-sm text-primary">
                        {req.requestedAmountFormatted}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {req.status === "pending" && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            En Revisión
                          </span>
                        )}
                        {req.status === "paid" && (
                          <div className="flex flex-col items-center">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              Liquidado & Pagado
                            </span>
                            {req.transferReference && (
                              <span className="text-[10px] font-mono text-on-surface-variant mt-0.5">
                                OP: {req.transferReference}
                              </span>
                            )}
                          </div>
                        )}
                        {req.status === "rejected" && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
                            Rechazado
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openAuditModal(req)}
                            className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface border border-surface-container flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Auditar</span>
                          </button>
                          {req.status === "pending" && (
                            <button
                              onClick={() => openAuditModal(req)}
                              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-1"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Despachar Pago</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* DRAWER LATERAL DERECHO AUDITORÍA Y DESPACHO DE PAGO (FULL-HEIGHT) */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-deep-slate/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedReq(null)}
          ></div>
          <div className="relative w-full max-w-2xl bg-surface-container-lowest h-full shadow-2xl border-l border-surface-container p-6 sm:p-8 z-10 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-surface-container pb-4">
                <div>
                  <span className="text-[11px] text-primary font-mono font-bold tracking-wider">
                    {selectedReq.code}
                  </span>
                  <h3 className="text-lg font-black text-on-surface mt-0.5 tracking-tight">
                    Auditoría Financiera y Despacho
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedReq(null)}
                  className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Evento y Organizador */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container space-y-2">
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
                    Evento Asociado
                  </span>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Evento:</span>
                    <span className="font-bold text-on-surface text-right">
                      {selectedReq.eventTitle}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Código:</span>
                    <span className="font-mono text-on-surface">
                      {selectedReq.eventCode}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">
                      Entradas Vendidas:
                    </span>
                    <span className="font-bold text-on-surface">
                      {selectedReq.totalTicketsSold} tickets
                    </span>
                  </div>
                </div>

                <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container space-y-2">
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
                    Organizador & Fiscal
                  </span>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Titular:</span>
                    <span className="font-bold text-on-surface text-right">
                      {selectedReq.organizerName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">
                      {selectedReq.organizerDocumentType}:
                    </span>
                    <span className="font-mono font-bold text-primary flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {selectedReq.organizerDocumentNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Solicitado:</span>
                    <span className="text-on-surface">
                      {selectedReq.requestedDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* DATOS BANCARIOS PARA TRANSFERENCIA (DESTACADOS CON BOTONES DE COPIAR) */}
              <div className="bg-blue-50/60 border border-blue-200/80 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-blue-700" />
                    Datos Bancarios para Efectuar la Transferencia
                  </span>
                  <span className="text-[10px] text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full font-semibold">
                    Validado por Promotor
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-white p-3 rounded-lg border border-blue-100">
                    <span className="text-on-surface-variant block text-[10px] uppercase font-bold">
                      Banco Destino:
                    </span>
                    <span className="font-extrabold text-sm text-on-surface">
                      {selectedReq.bankName}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-blue-100">
                    <span className="text-on-surface-variant block text-[10px] uppercase font-bold">
                      Titular de la Cuenta:
                    </span>
                    <span className="font-bold text-xs text-on-surface">
                      {selectedReq.bankAccountHolder}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-blue-100 flex items-center justify-between">
                    <div>
                      <span className="text-on-surface-variant block text-[10px] uppercase font-bold">
                        Número de Cuenta:
                      </span>
                      <span className="font-mono font-extrabold text-sm text-primary select-all">
                        {selectedReq.bankAccountNumber}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          selectedReq.bankAccountNumber,
                          "account",
                        )
                      }
                      className="p-1.5 rounded-md hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
                      title="Copiar N° de Cuenta"
                    >
                      {copiedField === "account" ? (
                        <CheckIcon className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-blue-100 flex items-center justify-between">
                    <div>
                      <span className="text-on-surface-variant block text-[10px] uppercase font-bold">
                        Código Interbancario (CCI):
                      </span>
                      {selectedReq.bankAccountCci ? (
                        <span className="font-mono font-extrabold text-xs text-on-surface select-all">
                          {selectedReq.bankAccountCci}
                        </span>
                      ) : (
                        <span className="text-[11px] text-amber-800 font-semibold italic">
                          Cuenta BCP Directa (No aplica CCI)
                        </span>
                      )}
                    </div>
                    {selectedReq.bankAccountCci && (
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(selectedReq.bankAccountCci!, "cci")
                        }
                        className="p-1.5 rounded-md hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
                        title="Copiar CCI"
                      >
                        {copiedField === "cci" ? (
                          <CheckIcon className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Montos */}
              <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container space-y-2">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">
                    Recaudación Bruta en Escrow:
                  </span>
                  <span className="font-mono font-bold text-on-surface">
                    {selectedReq.grossAccumulatedFormatted}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">
                    Comisión del Servicio QPH:
                  </span>
                  <span className="font-mono font-bold text-red-600">
                    -{selectedReq.platformFeeFormatted}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-surface-container">
                  <span className="font-bold text-sm text-on-surface">
                    Monto Neto a Transferir:
                  </span>
                  <span className="font-mono font-extrabold text-lg text-primary">
                    {selectedReq.requestedAmountFormatted}
                  </span>
                </div>
              </div>

              {/* Formulario de Pago o Info si ya está pagado */}
              {selectedReq.status === "pending" ? (
                <form
                  onSubmit={handleProcessPay}
                  className="space-y-4 pt-2 border-t border-surface-container"
                >
                  <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Registrar Transferencia Bancaria Completada</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-on-surface mb-1">
                        N° de Operación Bancaria *
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. OP-19842104"
                        value={transferReference}
                        onChange={(e) => setTransferReference(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-xl bg-surface-container border border-surface-container font-mono text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-on-surface mb-1">
                        Comprobante Bancario (Voucher R2)
                      </label>
                      <VoucherUploader
                        value={transferVoucherUrl}
                        onChange={(url) => setTransferVoucherUrl(url)}
                        folder="vouchers"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-on-surface mb-1">
                      Notas de Auditoría Interna (Opcional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Detalles adicionales sobre la transferencia..."
                      value={paymentNotes}
                      onChange={(e) => setPaymentNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container border border-surface-container text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-surface-container">
                    <button
                      type="button"
                      onClick={() => {
                        setRejectModalItem(selectedReq);
                        setRejectReason("");
                      }}
                      className="px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold transition-colors"
                    >
                      Rechazar Solicitud
                    </button>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedReq(null)}
                        className="px-4 py-2 rounded-xl bg-surface-container text-xs font-semibold hover:bg-surface-container-high transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingPay}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 disabled:opacity-50 transition-all"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>
                          {isSubmittingPay
                            ? "Procesando..."
                            : "Confirmar y Despachar"}
                        </span>
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-2 text-emerald-900">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle className="w-4 h-4 text-emerald-700" />
                    <span>Liquidación Pagada y Conciliada</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="font-semibold">N° Operación:</span>{" "}
                      <span className="font-mono">
                        {selectedReq.transferReference || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">Fecha de Pago:</span>{" "}
                      <span>{selectedReq.paidDate || "-"}</span>
                    </div>
                  </div>
                  {selectedReq.transferVoucherUrl && (
                    <div className="pt-1">
                      <a
                        href={selectedReq.transferVoucherUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline font-bold text-[11px]"
                      >
                        <span>Ver voucher de transferencia bancaria</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                  {selectedReq.notes && (
                    <p className="text-[11px] text-on-surface-variant pt-1 border-t border-emerald-200">
                      <span className="font-semibold">Notas:</span>{" "}
                      {selectedReq.notes}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE RECHAZO */}
      {rejectModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-deep-slate/60 backdrop-blur-sm"
            onClick={() => setRejectModalItem(null)}
          ></div>
          <div className="relative w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container p-6 z-10 space-y-4 text-xs">
            <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <h3>Rechazar Liquidación de Evento</h3>
            </div>
            <p className="text-on-surface-variant">
              Indica la razón por la cual se rechaza la liquidación del evento{" "}
              <strong className="text-on-surface">
                {rejectModalItem.eventTitle}
              </strong>
              . El promotor será notificado para corregir sus datos bancarios.
            </p>

            <form onSubmit={handleProcessReject} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-on-surface mb-1">
                  Motivo de Rechazo *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ej. El número de cuenta no coincide con el RUC registrado..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container border border-surface-container text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalItem(null)}
                  className="px-4 py-2 rounded-xl bg-surface-container text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReject}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold disabled:opacity-50"
                >
                  {isSubmittingReject ? "Rechazando..." : "Confirmar Rechazo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
