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
  Lock,
  ArrowUpRight,
  Clock,
  CheckCircle,
  FileText,
  CreditCard,
  X,
  Eye,
  Check,
} from 'lucide-react';

export function FinanceScreen() {
  const [activeTab, setActiveTab] = useState<'advance' | 'settlement'>('advance');
  const [requests, setRequests] = useState<FinanceRequestItem[]>([]);
  const [selectedReq, setSelectedReq] = useState<FinanceRequestItem | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const loadRequests = async () => {
    const result = await getFinanceRequestsUseCase.execute();
    result.match(
      (data) => setRequests(data),
      (err) => setFeedbackMessage(`Error: ${err.message}`)
    );
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const filtered = requests.filter((r) => r.type === activeTab);

  const handleApprovePayment = async (code: string) => {
    const result = await approveFinanceRequestUseCase.execute(code);
    result.match(
      () => {
        setFeedbackMessage(`Solicitud ${code} aprobada para pago.`);
        loadRequests();
        if (selectedReq?.code === code) setSelectedReq(null);
      },
      (err) => setFeedbackMessage(`Error al aprobar: ${err.message}`)
    );
  };

  const handleMarkPaid = async (code: string) => {
    const result = await markFinanceRequestPaidUseCase.execute(code);
    result.match(
      () => {
        setFeedbackMessage(`Solicitud ${code} marcada como pagada / transferida.`);
        loadRequests();
        if (selectedReq?.code === code) setSelectedReq(null);
      },
      (err) => setFeedbackMessage(`Error al marcar pagado: ${err.message}`)
    );
  };

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
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors text-xs font-bold text-on-surface shadow-sm border border-surface-container"
            >
              <FileText className="w-4 h-4" />
              <span>Ver Solicitudes Directas</span>
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

        {/* Operational KPI Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Escrow Total */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Fondos en Custodia (Escrow Total)
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-on-surface">
                    S/ 3,420,800
                  </span>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                    <ArrowUpRight className="w-3.5 h-3.5" /> +4.8% hoy
                  </span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-surface-container flex items-center justify-between text-xs text-on-surface-variant">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary"></span> 42 eventos bajo custodia
              </span>
              <span className="font-bold text-primary">Tasa Cobertura 100%</span>
            </div>
          </div>

          {/* Card 2: Adelantos Pendientes */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Adelantos Solicitados Pendientes
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-on-surface">
                    S/ 142,500
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-vip-gold/15 text-amber-800 text-[11px] font-bold">
                    6 en cola
                  </span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-vip-gold/15 text-vip-gold flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-700" />
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-surface-container flex items-center justify-between text-xs text-on-surface-variant">
              <span>Límite reglamentario: máx. 50%</span>
              <span className="font-bold text-amber-700">Evento publicado requerido</span>
            </div>
          </div>

          {/* Card 3: Liquidaciones Finales */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Liquidaciones Finales de Cierre
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-on-surface">
                    S/ 289,100
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                    3 finalizados
                  </span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-700" />
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-surface-container flex items-center justify-between text-xs text-on-surface-variant">
              <span>Solo eventos culminados</span>
              <span className="font-bold text-emerald-700">Listos para liberar</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-surface-container pb-2">
          <button
            onClick={() => setActiveTab('advance')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'advance'
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span>Solicitudes de Adelanto (Publicados)</span>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px]">
              {requests.filter((r) => r.type === 'advance').length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settlement')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'settlement'
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span>Liquidaciones Finales (Completados)</span>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px]">
              {requests.filter((r) => r.type === 'settlement').length}
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
                  <th className="py-3.5 px-4">Organizador & Cuenta Bancaria</th>
                  <th className="py-3.5 px-4">Recaudación Bruta</th>
                  <th className="py-3.5 px-4">Comisión QPH</th>
                  <th className="py-3.5 px-4">Monto Solicitado</th>
                  <th className="py-3.5 px-4 text-center">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container text-xs">
                {filtered.map((req) => (
                  <tr key={req.code} className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-on-surface text-sm">{req.eventTitle}</span>
                        <span className="text-[11px] text-primary font-mono font-bold">#{req.code} • {req.requestedDate}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-on-surface">{req.organizerName}</span>
                        <span className="text-[11px] text-on-surface-variant font-mono">
                          {req.bankName}: {req.bankAccount}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold text-on-surface">
                      {req.grossAccumulatedFormatted}
                    </td>

                    <td className="py-3.5 px-4 text-on-surface-variant font-mono">
                      {req.platformFeeFormatted}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-sm text-primary">
                      {req.requestedAmountFormatted}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {req.status === 'pending' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          Pendiente
                        </span>
                      )}
                      {req.status === 'approved' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                          Aprobado p/ Pago
                        </span>
                      )}
                      {req.status === 'paid' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Transferido OK
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {req.status === 'pending' && (
                          <button
                            onClick={() => handleApprovePayment(req.code)}
                            className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 shadow-sm flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Aprobar</span>
                          </button>
                        )}
                        {req.status === 'approved' && (
                          <button
                            onClick={() => handleMarkPaid(req.code)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-sm flex items-center gap-1"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Marcar Pagado</span>
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedReq(req)}
                          className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface"
                          title="Detalles de conciliación"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-deep-slate/50 backdrop-blur-sm"
            onClick={() => setSelectedReq(null)}
          ></div>
          <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-xl border border-surface-container p-6 z-10 space-y-5 text-xs">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div>
                <span className="text-[11px] text-primary font-mono font-bold">#{selectedReq.code}</span>
                <h3 className="text-base font-bold text-on-surface mt-0.5">
                  Auditoría Financiera de Solicitud
                </h3>
              </div>
              <button
                onClick={() => setSelectedReq(null)}
                className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 bg-surface-container-low p-4 rounded-xl border border-surface-container">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Evento</span>
                <span className="font-bold text-on-surface">{selectedReq.eventTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Organizador</span>
                <span className="font-bold text-on-surface">{selectedReq.organizerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Cuenta Destino</span>
                <span className="font-mono text-on-surface">{selectedReq.bankName} • {selectedReq.bankAccount}</span>
              </div>
            </div>

            <div className="space-y-3 bg-surface-container-low p-4 rounded-xl border border-surface-container">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Recaudación Bruta en Escrow</span>
                <span className="font-mono font-bold text-on-surface">{selectedReq.grossAccumulatedFormatted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Retención Tarifa Ticketera</span>
                <span className="font-mono text-error">{selectedReq.platformFeeFormatted}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-surface-container">
                <span className="font-bold text-on-surface">Monto a Transferir</span>
                <span className="font-mono font-bold text-base text-primary">{selectedReq.requestedAmountFormatted}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedReq(null)}
                className="px-4 py-2 rounded-xl bg-surface-container text-xs font-semibold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

