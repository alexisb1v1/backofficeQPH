'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getFinanceRequestsUseCase,
  markFinanceRequestPaidUseCase,
  rejectFinanceRequestUseCase,
  FinanceRequestItem,
} from '@/app/features/finance';
import {
  CreditCard,
  CalendarCheck,
  Timer,
  X,
  Eye,
  CheckCircle,
  XCircle,
  Building2,
  FileText,
  Search,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { VoucherUploader } from '@/app/shared/components/voucher-uploader';

export function RequestsScreen() {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<FinanceRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<FinanceRequestItem | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Estados del modal de pago/despacho
  const [transferReference, setTransferReference] = useState('');
  const [transferVoucherUrl, setTransferVoucherUrl] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [isSubmittingPay, setIsSubmittingPay] = useState(false);

  // Estados del modal de rechazo
  const [rejectModalItem, setRejectModalItem] = useState<FinanceRequestItem | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isSubmittingReject, setIsSubmittingReject] = useState(false);

  const loadRequests = async () => {
    setIsLoading(true);
    const result = await getFinanceRequestsUseCase.execute(filterStatus, searchQuery);
    result.match(
      (data) => setItems(data),
      (err) => setFeedbackMessage({ type: 'error', text: `Error al cargar liquidaciones: ${err.message}` })
    );
    setIsLoading(false);
  };

  useEffect(() => {
    loadRequests();
  }, [filterStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadRequests();
  };

  const openAuditModal = (item: FinanceRequestItem) => {
    setSelectedAudit(item);
    setTransferReference(item.transferReference || '');
    setTransferVoucherUrl(item.transferVoucherUrl || '');
    setPaymentNotes('');
  };

  const handleProcessPay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAudit) return;
    if (!transferReference.trim()) {
      setFeedbackMessage({ type: 'error', text: 'El número de operación bancaria es obligatorio para liquidar.' });
      return;
    }

    setIsSubmittingPay(true);
    const result = await markFinanceRequestPaidUseCase.execute(selectedAudit.id, {
      transferReference: transferReference.trim(),
      transferVoucherUrl: transferVoucherUrl.trim() || undefined,
      notes: paymentNotes.trim() || undefined,
    });

    result.match(
      () => {
        setFeedbackMessage({
          type: 'success',
          text: `Liquidación ${selectedAudit.code} despachada y pagada exitosamente.`,
        });
        setSelectedAudit(null);
        loadRequests();
      },
      (err) => {
        setFeedbackMessage({ type: 'error', text: `Error al pagar: ${err.message}` });
      }
    );
    setIsSubmittingPay(false);
  };

  const handleProcessReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalItem) return;
    if (!rejectReason.trim()) {
      setFeedbackMessage({ type: 'error', text: 'Debe ingresar un motivo para rechazar la liquidación.' });
      return;
    }

    setIsSubmittingReject(true);
    const result = await rejectFinanceRequestUseCase.execute(rejectModalItem.id, {
      reason: rejectReason.trim(),
    });

    result.match(
      () => {
        setFeedbackMessage({
          type: 'success',
          text: `Liquidación ${rejectModalItem.code} fue rechazada correctamente.`,
        });
        setRejectModalItem(null);
        setSelectedAudit(null);
        setRejectReason('');
        loadRequests();
      },
      (err) => {
        setFeedbackMessage({ type: 'error', text: `Error al rechazar: ${err.message}` });
      }
    );
    setIsSubmittingReject(false);
  };

  // KPIs calculados
  const pendingItems = items.filter((it) => it.status === 'pending');
  const paidItems = items.filter((it) => it.status === 'paid');
  const totalPendingAmount = pendingItems.reduce((acc, curr) => {
    const raw = curr.requestedAmountFormatted.replace(/[^\d.]/g, '');
    return acc + (parseFloat(raw) || 0);
  }, 0);

  return (
    <div className="flex flex-col w-full pb-16">
      <div className="px-8 py-8 flex flex-col gap-6 max-w-[1440px] mx-auto w-full">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-on-surface-variant text-xs font-bold uppercase tracking-wider">
              <span className="text-primary font-bold">Finanzas & Tesorería QPH</span>
              <span>•</span>
              <span>Auditoría de Liquidaciones</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-on-surface tracking-tight">
              Despacho de Liquidaciones de Eventos
            </h1>
            <p className="text-xs text-on-surface-variant">
              Audita las ventas finales de eventos concluidos, valida cuentas bancarias/RUC y registra la transferencia definitiva.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => loadRequests()}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-surface-container text-on-surface font-semibold text-xs border border-surface-container hover:bg-surface-container-high transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Actualizar</span>
            </button>
            <Link
              href="/finance"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface font-bold text-xs shadow-sm border border-surface-container hover:bg-surface-container-low transition-all"
            >
              <CreditCard className="w-4 h-4 text-primary" />
              <span>Ver Balance General</span>
            </Link>
          </div>
        </div>

        {feedbackMessage && (
          <div
            className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between border ${
              feedbackMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-red-50 text-red-800 border-red-200'
            }`}
          >
            <span>{feedbackMessage.text}</span>
            <button onClick={() => setFeedbackMessage(null)} className="hover:opacity-75">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container flex flex-col justify-between">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-xs font-bold uppercase tracking-wider">Pendiente Desembolso</span>
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex flex-col">
              <span className="text-2xl font-black text-on-surface">
                S/ {totalPendingAmount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-amber-800 font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>{pendingItems.length} en espera de transferencia</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container flex flex-col justify-between">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-xs font-bold uppercase tracking-wider">Eventos en Revisión</span>
              <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                <CalendarCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex flex-col">
              <span className="text-2xl font-black text-on-surface">{pendingItems.length} solicitudes</span>
              <span className="text-xs text-on-surface-variant mt-1">Concluidos y con ventas auditadas</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container flex flex-col justify-between">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-xs font-bold uppercase tracking-wider">Total Liquidados</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex flex-col">
              <span className="text-2xl font-black text-emerald-800">{paidItems.length} pagos</span>
              <span className="text-xs text-on-surface-variant mt-1">Transferencias confirmadas</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container flex flex-col justify-between">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-xs font-bold uppercase tracking-wider">SLA de Tesorería</span>
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
                <Timer className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex flex-col">
              <span className="text-2xl font-black text-blue-700">24h - 72h</span>
              <span className="text-xs text-on-surface-variant mt-1">Ventana oficial de pago</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-container pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterStatus === 'all'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              Todas ({items.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterStatus === 'pending'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              En Revisión ({pendingItems.length})
            </button>
            <button
              onClick={() => setFilterStatus('paid')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterStatus === 'paid'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              Liquidadas ({paidItems.length})
            </button>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por evento, RUC o código..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl bg-surface-container-low border border-surface-container text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90"
            >
              Buscar
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-[11px] uppercase tracking-wider font-bold border-b border-surface-container">
                  <th className="py-3.5 px-4">Código & Evento</th>
                  <th className="py-3.5 px-4">Organizador & RUC</th>
                  <th className="py-3.5 px-4">Banco & Cuenta</th>
                  <th className="py-3.5 px-4">Recaudado / Retenciones</th>
                  <th className="py-3.5 px-4">Neto a Pagar</th>
                  <th className="py-3.5 px-4 text-center">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container text-xs">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-on-surface-variant">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <CalendarCheck className="w-8 h-8 text-on-surface-variant/40" />
                        <span className="font-semibold text-sm">No hay solicitudes de liquidación registradas</span>
                        <span className="text-xs">Los eventos concluidos aparecerán aquí cuando el promotor solicite el cierre.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  items.map((sol) => (
                    <tr key={sol.id} className="hover:bg-surface-container-low/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-on-surface text-sm">{sol.eventTitle}</span>
                          <span className="text-[11px] text-primary font-mono font-bold">
                            {sol.code} • {sol.requestedDate}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-on-surface">{sol.organizerName}</span>
                          <span className="text-[11px] text-on-surface-variant font-mono">
                            {sol.organizerDocumentType}: {sol.organizerDocumentNumber}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-on-surface flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-primary" />
                            {sol.bankName}
                          </span>
                          <span className="text-[11px] text-on-surface font-mono">
                            Cta: {sol.bankAccountNumber}
                          </span>
                          {sol.bankAccountCci ? (
                            <span className="text-[10px] text-on-surface-variant font-mono">
                              CCI: {sol.bankAccountCci}
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-700 italic">
                              Transferencia directa (Sin CCI)
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-on-surface font-mono">
                            {sol.grossAccumulatedFormatted}
                          </span>
                          <span className="text-[11px] text-red-600 font-mono">
                            Comisión QPH: -{sol.platformFeeFormatted}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-sm text-primary">
                        {sol.requestedAmountFormatted}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {sol.status === 'pending' && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            En Revisión
                          </span>
                        )}
                        {sol.status === 'paid' && (
                          <div className="flex flex-col items-center">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              Liquidado & Pagado
                            </span>
                            {sol.transferReference && (
                              <span className="text-[10px] font-mono text-on-surface-variant mt-0.5">
                                OP: {sol.transferReference}
                              </span>
                            )}
                          </div>
                        )}
                        {sol.status === 'rejected' && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
                            Rechazado
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openAuditModal(sol)}
                            className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface border border-surface-container flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Auditar</span>
                          </button>
                          {sol.status === 'pending' && (
                            <>
                              <button
                                onClick={() => openAuditModal(sol)}
                                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-1"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Despachar Pago</span>
                              </button>
                              <button
                                onClick={() => {
                                  setRejectModalItem(sol);
                                  setRejectReason('');
                                }}
                                className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                title="Rechazar liquidación"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
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
      {selectedAudit && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-deep-slate/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedAudit(null)}
          ></div>
          <div className="relative w-full max-w-2xl bg-surface-container-lowest h-full shadow-2xl border-l border-surface-container p-6 sm:p-8 z-10 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="space-y-6">
              {/* Header Drawer */}
              <div className="flex items-center justify-between border-b border-surface-container pb-4">
                <div>
                  <span className="text-[11px] text-primary font-mono font-bold tracking-wider">{selectedAudit.code}</span>
                  <h3 className="text-lg font-black text-on-surface mt-0.5 tracking-tight">
                    Auditoría y Despacho Bancario
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedAudit(null)}
                  className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Datos del Evento y Promotor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container space-y-2">
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
                    Datos del Evento
                  </span>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Título:</span>
                    <span className="font-bold text-on-surface text-right">{selectedAudit.eventTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Código Evento:</span>
                    <span className="font-mono text-on-surface">{selectedAudit.eventCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Entradas Vendidas:</span>
                    <span className="font-bold text-on-surface">{selectedAudit.totalTicketsSold} tickets</span>
                  </div>
                </div>

                <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container space-y-2">
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
                    Organizador & Fiscal
                  </span>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Titular:</span>
                    <span className="font-bold text-on-surface text-right">{selectedAudit.organizerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">{selectedAudit.organizerDocumentType}:</span>
                    <span className="font-mono font-bold text-primary flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {selectedAudit.organizerDocumentNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Solicitado:</span>
                    <span className="text-on-surface">{selectedAudit.requestedDate}</span>
                  </div>
                </div>
              </div>

              {/* Datos Bancarios Verificados */}
              <div className="bg-blue-50/60 border border-blue-200/80 p-4 rounded-xl space-y-2.5">
                <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-700" />
                  Destino Bancario Autorizado
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-white p-3 rounded-lg border border-blue-100">
                    <span className="text-on-surface-variant block text-[10px] uppercase font-bold">Banco:</span>
                    <span className="font-extrabold text-sm text-on-surface">{selectedAudit.bankName}</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-blue-100">
                    <span className="text-on-surface-variant block text-[10px] uppercase font-bold">Titular de Cuenta:</span>
                    <span className="font-semibold text-xs text-on-surface">{selectedAudit.bankAccountHolder}</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-blue-100">
                    <span className="text-on-surface-variant block text-[10px] uppercase font-bold">Número de Cuenta:</span>
                    <span className="font-mono font-bold text-sm text-primary select-all">{selectedAudit.bankAccountNumber}</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-blue-100">
                    <span className="text-on-surface-variant block text-[10px] uppercase font-bold">Código Interbancario (CCI):</span>
                    {selectedAudit.bankAccountCci ? (
                      <span className="font-mono font-bold text-xs text-on-surface select-all">{selectedAudit.bankAccountCci}</span>
                    ) : (
                      <span className="text-[11px] text-amber-800 italic font-semibold">Cuenta Directa BCP (No aplica CCI)</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Desglose Financiero */}
              <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container space-y-2">
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
                  Liquidación de Fondos
                </span>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Recaudación Bruta Total:</span>
                  <span className="font-mono font-bold text-on-surface">{selectedAudit.grossAccumulatedFormatted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Comisión del Servicio Ticketera (QPH):</span>
                  <span className="font-mono font-bold text-red-600">-{selectedAudit.platformFeeFormatted}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-surface-container">
                  <span className="font-bold text-sm text-on-surface">Monto Neto a Transferir:</span>
                  <span className="font-mono font-extrabold text-lg text-primary">{selectedAudit.requestedAmountFormatted}</span>
                </div>
              </div>

              {/* Formulario de Pago o Info si ya está pagado */}
              {selectedAudit.status === 'pending' ? (
                <form onSubmit={handleProcessPay} className="space-y-4 pt-2 border-t border-surface-container">
                  <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Registrar Despacho de Transferencia Bancaria</span>
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
                        setRejectModalItem(selectedAudit);
                        setRejectReason('');
                      }}
                      className="px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold transition-colors"
                    >
                      Rechazar Solicitud
                    </button>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedAudit(null)}
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
                        <span>{isSubmittingPay ? 'Procesando...' : 'Confirmar y Pagar'}</span>
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
                      <span className="font-semibold">N° Operación:</span>{' '}
                      <span className="font-mono">{selectedAudit.transferReference || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Fecha de Pago:</span>{' '}
                      <span>{selectedAudit.paidDate || '-'}</span>
                    </div>
                  </div>
                  {selectedAudit.transferVoucherUrl && (
                    <div className="pt-1">
                      <a
                        href={selectedAudit.transferVoucherUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline font-bold text-[11px]"
                      >
                        <span>Ver voucher de transferencia bancaria</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                  {selectedAudit.notes && (
                    <p className="text-[11px] text-on-surface-variant pt-1 border-t border-emerald-200">
                      <span className="font-semibold">Notas:</span> {selectedAudit.notes}
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
          <div className="absolute inset-0 bg-deep-slate/60 backdrop-blur-sm" onClick={() => setRejectModalItem(null)}></div>
          <div className="relative w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container p-6 z-10 space-y-4 text-xs">
            <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <h3>Rechazar Liquidación de Evento</h3>
            </div>
            <p className="text-on-surface-variant">
              Indica la razón por la cual se rechaza la liquidación del evento{' '}
              <strong className="text-on-surface">{rejectModalItem.eventTitle}</strong>. El promotor será notificado para corregir sus datos.
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
                  {isSubmittingReject ? 'Rechazando...' : 'Confirmar Rechazo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
