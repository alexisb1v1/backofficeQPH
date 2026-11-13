'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getApprovalEventsUseCase,
  approveEventUseCase,
  observeEventUseCase,
  EventApprovalItem,
  PaginatedEventApprovalsModel,
} from '@/app/features/events-approval';
import {
  Search,
  Download,
  FileCheck,
  CheckCircle,
  AlertTriangle,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  RefreshCw,
  Clock,
  ShieldAlert,
  Calendar,
  MapPin,
  Building2,
  Ticket,
  BadgePercent,
  Info,
} from 'lucide-react';

export function EventsApprovalScreen() {
  const [activeTab, setActiveTab] = useState<'in_review' | 'published' | 'observed'>('in_review');
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [loading, setLoading] = useState(true);
  const [paginatedData, setPaginatedData] = useState<PaginatedEventApprovalsModel>({
    items: [],
    meta: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1,
      pendingCount: 0,
      publishedCount: 0,
      observedCount: 0,
    },
  });

  const [selectedEvent, setSelectedEvent] = useState<EventApprovalItem | null>(null);
  const [observingEvent, setObservingEvent] = useState<EventApprovalItem | null>(null);
  const [observeReason, setObserveReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Debounce para búsqueda
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchInput]);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setFeedbackMessage(null);

    const result = await getApprovalEventsUseCase.execute({
      status: activeTab,
      search: debouncedSearch || undefined,
      page,
      limit,
    });

    result.match(
      (data) => {
        setPaginatedData(data);
        setLoading(false);
      },
      (err) => {
        setFeedbackMessage(`Error al cargar eventos: ${err.message}`);
        setLoading(false);
      },
    );
  }, [activeTab, debouncedSearch, page, limit]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleTabChange = (tab: 'in_review' | 'published' | 'observed') => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleApprove = async (id: string) => {
    setActionLoading(true);
    const result = await approveEventUseCase.execute(id);
    result.match(
      () => {
        setFeedbackMessage('Evento aprobado y publicado exitosamente en la plataforma web.');
        setActionLoading(false);
        setSelectedEvent(null);
        loadEvents();
      },
      (err) => {
        setFeedbackMessage(`No se pudo aprobar: ${err.message}`);
        setActionLoading(false);
      },
    );
  };

  const handleObserve = async () => {
    if (!observingEvent) return;
    setActionLoading(true);
    const result = await observeEventUseCase.execute(observingEvent.id, observeReason.trim());
    result.match(
      () => {
        setFeedbackMessage('Evento marcado como observado. El promotor fue notificado con la observación.');
        setObservingEvent(null);
        setObserveReason('');
        setActionLoading(false);
        setSelectedEvent(null);
        loadEvents();
      },
      (err) => {
        setFeedbackMessage(`Error al observar: ${err.message}`);
        setActionLoading(false);
      },
    );
  };

  return (
    <div className="flex flex-col w-full pb-16">
      <div className="p-8 max-w-[1440px] mx-auto w-full flex flex-col gap-6">
        {/* Header & Action Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider text-primary font-bold">
                Mesa de Control • Moderación
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
              <span className="text-xs text-on-surface-variant font-medium">
                {paginatedData.meta.pendingCount} Solicitudes Pendientes
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-on-surface tracking-tight">
              Aprobación y Moderación de Eventos
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => loadEvents()}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface hover:text-primary font-bold text-xs shadow-sm border border-surface-container transition-all cursor-pointer"
              title="Refrescar listado"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-primary' : 'text-on-surface-variant'}`} />
              <span>Actualizar</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface hover:text-primary font-bold text-xs shadow-sm border border-surface-container transition-all">
              <Download className="w-4 h-4 text-primary" />
              <span>Exportar (CSV)</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackMessage && (
          <div className="p-4 rounded-xl bg-error/10 border border-error/30 text-error flex items-start justify-between gap-2 text-xs font-medium">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{feedbackMessage}</span>
            </div>
            <button
              onClick={() => setFeedbackMessage(null)}
              className="hover:opacity-75"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-xs text-on-surface-variant font-semibold">
                Pendientes de Revisión
              </span>
              <h3 className="text-2xl font-black text-on-surface">
                {paginatedData.meta.pendingCount}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-xs text-on-surface-variant font-semibold">
                Eventos Aprobados / En Vivo
              </span>
              <h3 className="text-2xl font-black text-emerald-600">
                {paginatedData.meta.publishedCount}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-xs text-on-surface-variant font-semibold">
                Eventos Observados
              </span>
              <h3 className="text-2xl font-black text-rose-600">
                {paginatedData.meta.observedCount}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Search & Tabs Filter (Alineado con el diseño unificado) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-sm">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Buscar evento por título, recinto u organizador..."
              className="w-full bg-surface-container-low text-on-surface placeholder:text-outline pl-10 pr-4 py-2.5 rounded-xl text-xs outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-electric-indigo transition-all border border-transparent focus:border-electric-indigo"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Subfilter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-container-low border border-surface-container text-xs font-semibold">
            <button
              type="button"
              onClick={() => handleTabChange('in_review')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'in_review'
                  ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>En Revisión ({paginatedData.meta.pendingCount})</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('published')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'published'
                  ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Aprobados ({paginatedData.meta.publishedCount})</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('observed')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'observed'
                  ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Observados ({paginatedData.meta.observedCount})</span>
            </button>
          </div>
        </div>

        {/* Table Container - Ajustado para evitar scrolls que oculten las acciones */}
        <div className="rounded-2xl bg-surface-container-lowest border border-surface-container shadow-sm overflow-visible flex flex-col">
          <div className="w-full">
            <table className="w-full table-auto text-left text-xs">
              <thead className="bg-surface-container-low text-on-surface-variant font-bold uppercase tracking-wider border-b border-surface-container">
                <tr>
                  <th className="py-3.5 px-4 w-[28%]">Evento / Categoría</th>
                  <th className="py-3.5 px-4 w-[20%]">Organizador & RUC</th>
                  <th className="py-3.5 px-4 w-[16%]">Recinto & Ciudad</th>
                  <th className="py-3.5 px-4 w-[13%]">Función</th>
                  <th className="py-3.5 px-3 w-[8%] text-center">Aforo</th>
                  <th className="py-3.5 px-3 w-[7%] text-right">Rango</th>
                  <th className="py-3.5 px-4 w-[8%] text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container/60">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-on-surface-variant">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-7 h-7 animate-spin text-primary" />
                        <span className="font-semibold text-xs">Consultando catálogo de eventos...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedData.items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-on-surface-variant">
                      <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                        <Search className="w-8 h-8 text-outline" />
                        <h4 className="font-bold text-sm text-on-surface">No hay eventos en esta sección</h4>
                        <p className="text-xs text-outline leading-relaxed">
                          No se encontraron solicitudes con el estado seleccionado o los términos de búsqueda.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.items.map((ev) => (
                    <tr
                      key={ev.id}
                      className="hover:bg-surface-container-low/50 transition-colors"
                    >
                      {/* Titulo / Categoria */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-full ${ev.avatarBgColor} text-white flex items-center justify-center font-bold text-[11px] shadow-xs flex-shrink-0`}
                          >
                            {ev.avatarInitials}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-on-surface truncate leading-tight" title={ev.title}>
                              {ev.title}
                            </span>
                            <div className="flex items-center gap-1.5 pt-0.5">
                              <span className="text-[10px] text-primary font-semibold uppercase tracking-wider leading-tight">
                                {ev.category}
                              </span>
                              {ev.status === 'observed' && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[9px] uppercase tracking-wider">
                                  <AlertTriangle className="w-2.5 h-2.5 text-amber-700" />
                                  <span>Observado</span>
                                </span>
                              )}
                            </div>
                            {ev.observationReason && (
                              <span
                                className="text-[10px] text-rose-600 font-medium truncate max-w-[220px] pt-0.5"
                                title={`Motivo: ${ev.observationReason}`}
                              >
                                Obs: &quot;{ev.observationReason}&quot;
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Organizador */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-on-surface truncate leading-tight" title={ev.organizerName}>
                            {ev.organizerName}
                          </span>
                          <span className="font-mono text-[10px] text-on-surface-variant leading-tight">
                            RUC: {ev.organizerDocumentNumber}
                          </span>
                        </div>
                      </td>

                      {/* Recinto */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-on-surface truncate leading-tight" title={ev.venueName}>
                            {ev.venueName}
                          </span>
                          <span className="text-[10px] text-on-surface-variant flex items-center gap-0.5 leading-tight">
                            <MapPin className="w-2.5 h-2.5 text-primary flex-shrink-0" />
                            <span className="truncate">{ev.venueCity}</span>
                          </span>
                        </div>
                      </td>

                      {/* Fecha */}
                      <td className="py-3 px-4 text-on-surface text-[11px] font-medium">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-on-surface-variant flex-shrink-0" />
                          <span className="truncate">{ev.eventDateFormatted}</span>
                        </div>
                      </td>

                      {/* Aforo */}
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-md bg-surface-container font-mono text-[11px] font-semibold whitespace-nowrap">
                          {ev.capacityFormatted}
                        </span>
                      </td>

                      {/* Rango de precios */}
                      <td className="py-3 px-3 text-right">
                        <span className="font-bold text-emerald-700 whitespace-nowrap text-[11px]">
                          {ev.priceRangeFormatted}
                        </span>
                      </td>

                      {/* Acciones visibles y alineadas */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedEvent(ev)}
                            className="p-1 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
                            title="Revisar expediente y tarifario"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {ev.status !== 'published' && (
                            <button
                              onClick={() => handleApprove(ev.id)}
                              disabled={actionLoading}
                              className="px-2 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition-all shadow-xs cursor-pointer disabled:opacity-50"
                              title="Aprobar evento"
                            >
                              Aprobar
                            </button>
                          )}
                          {ev.status !== 'observed' && (
                            <button
                              onClick={() => setObservingEvent(ev)}
                              disabled={actionLoading}
                              className="px-2 py-1 rounded-md bg-surface-container hover:bg-rose-50 text-rose-600 font-bold text-[10px] transition-all border border-surface-container-high cursor-pointer disabled:opacity-50"
                              title="Observar evento"
                            >
                              Observar
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

          {/* Pagination Footer */}
          <div className="p-4 bg-surface-container-low border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-on-surface-variant font-medium">
              Mostrando {paginatedData.items.length} de {paginatedData.meta.total} eventos (Página {paginatedData.meta.page} de {paginatedData.meta.totalPages})
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={paginatedData.meta.page <= 1 || loading}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface-container-lowest border border-surface-container font-semibold text-on-surface disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>

              <div className="px-3 py-1.5 rounded-xl bg-surface-container font-bold text-on-surface">
                {paginatedData.meta.page}
              </div>

              <button
                disabled={paginatedData.meta.page >= paginatedData.meta.totalPages || loading}
                onClick={() => setPage((prev) => prev + 1)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface-container-lowest border border-surface-container font-semibold text-on-surface disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container transition-all cursor-pointer"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Drawer Detalle de Evento con Tarifario Completo y Observaciones */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-lg bg-surface-container-lowest h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            <div className="p-6 border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-full ${selectedEvent.avatarBgColor} text-white flex items-center justify-center font-bold text-sm shadow-sm`}
                >
                  {selectedEvent.avatarInitials}
                </div>
                <div className="min-w-0 max-w-[320px]">
                  <h3 className="font-bold text-base text-on-surface leading-tight truncate">
                    {selectedEvent.title}
                  </h3>
                  <span className="text-xs text-primary font-semibold uppercase tracking-wider">
                    {selectedEvent.category} • #{selectedEvent.id}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
              {/* Alerta si el evento tiene observaciones previas */}
              {selectedEvent.observationReason && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] text-rose-700">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Motivo de Observación Registrado</span>
                  </div>
                  <p className="text-xs leading-relaxed font-medium">
                    {selectedEvent.observationReason}
                  </p>
                </div>
              )}

              {/* Datos de Organizador */}
              <div className="space-y-3 bg-surface-container-low p-4 rounded-xl border border-surface-container">
                <h4 className="font-bold uppercase tracking-wider text-[11px] text-on-surface flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-primary" />
                  Datos del Organizador
                </h4>
                <div className="flex justify-between py-1 border-b border-surface-container">
                  <span className="text-on-surface-variant">Razón Social</span>
                  <span className="font-bold text-on-surface">{selectedEvent.organizerName}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-on-surface-variant">RUC Tributario</span>
                  <span className="font-mono font-bold text-on-surface">{selectedEvent.organizerDocumentNumber}</span>
                </div>
              </div>

              {/* Tarifario Oficial y Comisiones QPH */}
              <div className="space-y-3 bg-surface-container-low p-4 rounded-xl border border-surface-container">
                <h4 className="font-bold uppercase tracking-wider text-[11px] text-on-surface flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <BadgePercent className="w-3.5 h-3.5 text-primary" />
                    Tarifario & Comisiones QPH por Zona
                  </span>
                  <span className="text-[10px] text-primary font-mono lowercase">
                    {selectedEvent.zones.length} zonas
                  </span>
                </h4>

                <div className="space-y-2 pt-1">
                  {selectedEvent.zones.length === 0 ? (
                    <div className="p-3 text-center text-on-surface-variant text-[11px] bg-surface-container rounded-lg">
                      No se han configurado zonas en este evento.
                    </div>
                  ) : (
                    selectedEvent.zones.map((zone, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-surface-container-lowest border border-surface-container space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-on-surface text-xs">{zone.name}</span>
                          <span className="font-mono text-[11px] text-on-surface-variant">
                            Aforo: {zone.capacity.toLocaleString()}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-[11px] pt-1 border-t border-surface-container">
                          <div>
                            <span className="text-on-surface-variant block text-[10px]">Precio Base</span>
                            <span className="font-bold text-on-surface">S/ {zone.regularPrice.toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="text-on-surface-variant block text-[10px]">Comisión QPH</span>
                            <span className="font-bold text-primary">S/ {zone.serviceFee.toFixed(2)}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-on-surface-variant block text-[10px]">Paga Cliente</span>
                            <span className="font-bold text-emerald-700">S/ {zone.buyerPrice.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="text-[10px] text-on-surface-variant flex items-center gap-1 pt-0.5">
                          <Info className="w-3 h-3 text-primary flex-shrink-0" />
                          <span>
                            {zone.feeIncluded
                              ? 'Comisión incluida en el precio (se descuenta al promotor)'
                              : 'Comisión sumada al comprador en el checkout'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Capacidad y Recinto */}
              <div className="space-y-3 bg-surface-container-low p-4 rounded-xl border border-surface-container">
                <h4 className="font-bold uppercase tracking-wider text-[11px] text-on-surface flex items-center gap-1.5">
                  <Ticket className="w-3.5 h-3.5 text-primary" />
                  Recinto y Funciones
                </h4>
                <div className="flex justify-between py-1 border-b border-surface-container">
                  <span className="text-on-surface-variant">Aforo Total Declarado</span>
                  <span className="font-bold text-on-surface font-mono">{selectedEvent.capacityFormatted}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-surface-container">
                  <span className="text-on-surface-variant">Recinto</span>
                  <span className="font-semibold text-on-surface">{selectedEvent.venueName} ({selectedEvent.venueCity})</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-on-surface-variant">Fecha Primera Función</span>
                  <span className="font-semibold text-on-surface">{selectedEvent.eventDateFormatted}</span>
                </div>
              </div>
            </div>

            <div className="p-5 bg-surface border-t border-surface-container flex items-center justify-between">
              <button
                type="button"
                onClick={() => setObservingEvent(selectedEvent)}
                className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-rose-50 text-rose-600 font-bold text-xs transition-colors cursor-pointer"
              >
                Observar / Retornar
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface cursor-pointer"
                >
                  Cerrar
                </button>
                {selectedEvent.status !== 'published' && (
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleApprove(selectedEvent.id)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {actionLoading ? 'Procesando...' : 'Aprobar Evento'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Observar Evento */}
      {observingEvent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl shadow-2xl border border-surface-container p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold text-base text-on-surface">Observar Evento</h3>
              </div>
              <button
                onClick={() => setObservingEvent(null)}
                className="text-on-surface-variant hover:text-on-surface p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-on-surface-variant">
              Indica las observaciones técnicas, legales o de recinto que el promotor de <strong>{observingEvent.title}</strong> debe corregir antes de ser aprobado. Este mensaje se grabará en la base de datos en <code>observation_reason</code>.
            </p>

            <textarea
              rows={4}
              value={observeReason}
              onChange={(e) => setObserveReason(e.target.value)}
              placeholder="Ej: Adjuntar contrato de alquiler del local o autorización de Defensa Civil..."
              className="w-full bg-surface-container-low text-on-surface p-3 rounded-xl text-xs outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary border border-surface-container"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setObservingEvent(null)}
                className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={actionLoading || !observeReason.trim()}
                onClick={handleObserve}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {actionLoading ? 'Guardando...' : 'Confirmar Observación'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
