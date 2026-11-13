'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getFinanceRequestsUseCase,
  approveFinanceRequestUseCase,
  markFinanceRequestPaidUseCase,
  FinanceRequestItem,
} from '@/app/features/finance';
import {
  CreditCard,
  History,
  FastForward,
  CalendarCheck,
  Timer,
  X,
  Eye,
  Check,
  CheckCircle,
} from 'lucide-react';

export function RequestsScreen() {
  const [filterType, setFilterType] = useState<'all' | 'advance' | 'settlement'>('all');
  const [items, setItems] = useState<FinanceRequestItem[]>([]);
  const [selectedAudit, setSelectedAudit] = useState<FinanceRequestItem | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const loadRequests = async () => {
    const result = await getFinanceRequestsUseCase.execute();
    result.match(
      (data) => setItems(data),
      (err) => setFeedbackMessage(`Error: ${err.message}`)
    );
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const filtered = items.filter((it) => {
    if (filterType === 'advance') return it.type === 'advance';
    if (filterType === 'settlement') return it.type === 'settlement';
    return true;
  });

  const handleApprove = async (code: string) => {
    const result = await approveFinanceRequestUseCase.execute(code);
    result.match(
      () => {
        setFeedbackMessage(`Solicitud ${code} aprobada.`);
        loadRequests();
        if (selectedAudit?.code === code) setSelectedAudit(null);
      },
      (err) => setFeedbackMessage(`Error: ${err.message}`)
    );
  };

  const handleMarkPaid = async (code: string) => {
    const result = await markFinanceRequestPaidUseCase.execute(code);
    result.match(
      () => {
        setFeedbackMessage(`Solicitud ${code} marcada como pagada.`);
        loadRequests();
        if (selectedAudit?.code === code) setSelectedAudit(null);
      },
      (err) => setFeedbackMessage(`Error: ${err.message}`)
    );
  };

  return (
    <div className="flex flex-col w-full pb-16">
      <div className="px-8 py-8 flex flex-col gap-6 max-w-[1440px] mx-auto w-full">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-on-surface-variant text-xs font-bold uppercase tracking-wider">
              <span className="text-primary font-bold">Finanzas & Tesorería QPH</span>
              <span>•</span>
              <span>Cola de Solicitudes Operativas</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-on-surface tracking-tight">
              Solicitudes de Adelantos y Liquidaciones
            </h1>
            <p className="text-xs text-on-surface-variant">
              Gestiona, audita y autoriza las peticiones de adelanto (eventos publicados) y liquidaciones finales (eventos completados).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/finance"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface font-bold text-xs shadow-sm border border-surface-container hover:bg-surface-container-low transition-all"
            >
              <CreditCard className="w-4 h-4 text-primary" />
              <span>Ver Balance Escrow</span>
            </Link>
          </div>
        </div>

        {feedbackMessage && (
          <div className="p-3 rounded-xl bg-surface-container text-xs font-semibold text-on-surface border border-surface-container flex items-center justify-between">
            <span>{feedbackMessage}</span>
            <button onClick={() => setFeedbackMessage(null)} className="text-on-surface-variant hover:text-on-surface">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container flex flex-col justify-between">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-xs font-bold uppercase tracking-wider">
                Pendiente Desembolso
              </span>
              <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex flex-col">
              <span className="text-2xl font-black text-on-surface">
                S/ 142,500<span className="text-xs text-on-surface-variant font-medium">.00</span>
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-amber-800 font-semibold">
                <span className="w-2 h-2 rounded-full bg-vip-gold"></span>
                <span>6 en espera de orden bancaria</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container flex flex-col justify-between">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-xs font-bold uppercase tracking-wider">
                Adelantos Solicitados
              </span>
              <div className="w-8 h-8 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary">
                <FastForward className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex flex-col">
              <span className="text-2xl font-black text-on-surface">4 peticiones</span>
              <span className="text-xs text-on-surface-variant mt-1">
                Límite reglamentario: máx. 50%
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container flex flex-col justify-between">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-xs font-bold uppercase tracking-wider">
                Liquidaciones Finales
              </span>
              <div className="w-8 h-8 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary">
                <CalendarCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex flex-col">
              <span className="text-2xl font-black text-on-surface">2 cierres</span>
              <span className="text-xs text-on-surface-variant mt-1">
                Solo eventos completados
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container flex flex-col justify-between">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-xs font-bold uppercase tracking-wider">
                SLA de Respuesta
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                <Timer className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex flex-col">
              <span className="text-2xl font-black text-emerald-700">98.4%</span>
              <span className="text-xs text-on-surface-variant mt-1">
                Auditadas en menos de 24 horas
              </span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-surface-container pb-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterType === 'all'
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            Todas ({items.length})
          </button>
          <button
            onClick={() => setFilterType('advance')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterType === 'advance'
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            Adelantos Parciales
          </button>
          <button
            onClick={() => setFilterType('settlement')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterType === 'settlement'
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            Liquidaciones Finales
          </button>
        </div>

        {/* Table */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-[11px] uppercase tracking-wider font-bold border-b border-surface-container">
                  <th className="py-3.5 px-4">Código & Evento</th>
                  <th className="py-3.5 px-4">Tipo</th>
                  <th className="py-3.5 px-4">Organizador & Cuenta</th>
                  <th className="py-3.5 px-4">Recaudación / Fee</th>
                  <th className="py-3.5 px-4">Monto Solicitado</th>
                  <th className="py-3.5 px-4 text-center">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container text-xs">
                {filtered.map((sol) => (
                  <tr key={sol.code} className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-on-surface text-sm">{sol.eventTitle}</span>
                        <span className="text-[11px] text-primary font-mono font-bold">
                          #{sol.code} • {sol.requestedDate}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {sol.type === 'advance' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-secondary-fixed text-on-secondary-fixed">
                          Adelanto ({sol.pctOfAvailableFormatted})
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Liquidación Final
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-on-surface">{sol.organizerName}</span>
                        <span className="text-[11px] text-on-surface-variant font-mono">
                          {sol.bankName}: {sol.bankAccount}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-on-surface font-mono">
                          {sol.grossAccumulatedFormatted}
                        </span>
                        <span className="text-[11px] text-on-surface-variant font-mono">
                          Fee QPH: {sol.platformFeeFormatted}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-sm text-primary">
                      {sol.requestedAmountFormatted}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {sol.status === 'pending' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          Pendiente
                        </span>
                      )}
                      {sol.status === 'approved' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                          Aprobado
                        </span>
                      )}
                      {sol.status === 'paid' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Pagado
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedAudit(sol)}
                          className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface border border-surface-container flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Auditar</span>
                        </button>
                        {sol.status === 'pending' && (
                          <button
                            onClick={() => handleApprove(sol.code)}
                            className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-sm flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Aprobar</span>
                          </button>
                        )}
                        {sol.status === 'approved' && (
                          <button
                            onClick={() => handleMarkPaid(sol.code)}
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-1"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Pagar</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* AUDIT MODAL */}
      {selectedAudit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-deep-slate/50 backdrop-blur-sm"
            onClick={() => setSelectedAudit(null)}
          ></div>
          <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-xl border border-surface-container p-6 z-10 space-y-5 text-xs">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div>
                <span className="text-[11px] text-primary font-mono font-bold">#{selectedAudit.code}</span>
                <h3 className="text-base font-bold text-on-surface mt-0.5">
                  Auditoría de Desembolso
                </h3>
              </div>
              <button
                onClick={() => setSelectedAudit(null)}
                className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 bg-surface-container-low p-4 rounded-xl border border-surface-container">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Evento</span>
                <span className="font-bold text-on-surface">{selectedAudit.eventTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Organizador</span>
                <span className="font-bold text-on-surface">{selectedAudit.organizerName} (RUC {selectedAudit.organizerRuc})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Banco / Cta Cte</span>
                <span className="font-mono text-on-surface">{selectedAudit.bankName} • {selectedAudit.bankAccount}</span>
              </div>
            </div>

            <div className="space-y-3 bg-surface-container-low p-4 rounded-xl border border-surface-container">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Tipo de Solicitud</span>
                <span className="font-bold uppercase text-primary">{selectedAudit.type} ({selectedAudit.pctOfAvailableFormatted})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Recaudado Bruto</span>
                <span className="font-mono text-on-surface">{selectedAudit.grossAccumulatedFormatted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Comisión QPH</span>
                <span className="font-mono text-error">{selectedAudit.platformFeeFormatted}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-surface-container">
                <span className="font-bold text-on-surface">Monto a Desembolsar</span>
                <span className="font-mono font-bold text-base text-primary">{selectedAudit.requestedAmountFormatted}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setSelectedAudit(null)}
                className="px-4 py-2 rounded-xl bg-surface-container text-xs font-semibold"
              >
                Cerrar
              </button>
              <div className="flex gap-2">
                {selectedAudit.status === 'pending' && (
                  <button
                    onClick={() => handleApprove(selectedAudit.code)}
                    className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Aprobar Desembolso</span>
                  </button>
                )}
                {selectedAudit.status === 'approved' && (
                  <button
                    onClick={() => handleMarkPaid(selectedAudit.code)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 flex items-center gap-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Marcar como Transferido</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

