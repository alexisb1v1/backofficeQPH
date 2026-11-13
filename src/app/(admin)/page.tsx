import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="flex flex-col w-full">
      <div className="px-8 py-8 flex flex-col gap-8 max-w-[1400px] mx-auto w-full">
        {/* Header Context & Date Selector */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Panel de Control Global
              </span>
              <span className="text-on-surface-variant">•</span>
              <span className="text-xs text-on-surface-variant">
                Hola, Administrador Principal
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-on-surface">
              Resumen Operativo QPH
            </h1>
          </div>

          {/* Action & Filter Pills */}
          <div className="flex items-center gap-3 bg-surface-container-low p-1.5 rounded-xl shadow-sm self-start lg:self-auto border border-surface-container">
            <div className="flex items-center gap-1 bg-surface-container-lowest rounded-lg p-1 shadow-sm">
              <button className="px-3 py-1.5 rounded-md text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors">
                Hoy
              </button>
              <button className="px-3 py-1.5 rounded-md text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors">
                Últimos 7 días
              </button>
              <button className="px-3 py-1.5 rounded-md bg-primary text-white text-xs font-semibold shadow-sm transition-all">
                Mes actual
              </button>
              <button className="px-3 py-1.5 rounded-md text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors">
                2026
              </button>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors text-xs font-semibold text-on-surface">
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              <span>Filtrar</span>
            </button>
          </div>
        </div>

        {/* 4 High Impact Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Card 1: GMV */}
          <div className="relative overflow-hidden bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col justify-between group hover:-translate-y-1 transition-transform border border-surface-container">
            <div className="absolute -right-4 -top-4 w-28 h-28 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase font-bold text-on-surface-variant tracking-wider">
                  Recaudación Total (GMV)
                </span>
                <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
                  <span className="material-symbols-outlined text-[22px]">payments</span>
                </div>
              </div>
              <div className="text-3xl lg:text-4xl text-on-surface mb-2 font-extrabold tracking-tight">
                S/ 4,892,140
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 mt-2 border-t border-surface-container">
              <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                <span className="material-symbols-outlined text-[18px]">trending_up</span>
                <span>+18.4%</span>
              </div>
              <span className="text-xs text-on-surface-variant">vs mes anterior</span>
            </div>
          </div>

          {/* Card 2: Tickets */}
          <div className="relative overflow-hidden bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col justify-between group hover:-translate-y-1 transition-transform border border-surface-container">
            <div className="absolute -right-4 -top-4 w-28 h-28 bg-secondary-fixed/30 rounded-full blur-2xl group-hover:bg-secondary-fixed/50 transition-colors"></div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase font-bold text-on-surface-variant tracking-wider">
                  Tickets Vendidos
                </span>
                <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container">
                  <span className="material-symbols-outlined text-[22px]">confirmation_number</span>
                </div>
              </div>
              <div className="text-3xl lg:text-4xl text-on-surface mb-2 font-extrabold tracking-tight">
                68,420
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 mt-2 border-t border-surface-container">
              <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                <span className="material-symbols-outlined text-[18px]">trending_up</span>
                <span>+12.6%</span>
              </div>
              <span className="text-xs text-on-surface-variant">4,120 en 24h</span>
            </div>
          </div>

          {/* Card 3: Events */}
          <div className="relative overflow-hidden bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col justify-between group hover:-translate-y-1 transition-transform border border-surface-container">
            <div className="absolute -right-4 -top-4 w-28 h-28 bg-tertiary-fixed/30 rounded-full blur-2xl group-hover:bg-tertiary-fixed/50 transition-colors"></div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase font-bold text-on-surface-variant tracking-wider">
                  Eventos Activos
                </span>
                <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface">
                  <span className="material-symbols-outlined text-[22px]">event_available</span>
                </div>
              </div>
              <div className="text-3xl lg:text-4xl text-on-surface mb-2 font-extrabold tracking-tight">
                342
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 mt-2 border-t border-surface-container">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                <span>8 en revisión</span>
              </div>
              <span className="text-xs text-on-surface-variant">92 organizadores</span>
            </div>
          </div>

          {/* Card 4: Liquidations */}
          <div className="relative overflow-hidden bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col justify-between group hover:-translate-y-1 transition-transform border border-surface-container">
            <div className="absolute -right-4 -top-4 w-28 h-28 bg-vip-gold/10 rounded-full blur-2xl group-hover:bg-vip-gold/20 transition-colors"></div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase font-bold text-on-surface-variant tracking-wider">
                  Adelantos y Retiros
                </span>
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
                  <span className="material-symbols-outlined text-[22px]">account_balance</span>
                </div>
              </div>
              <div className="text-3xl lg:text-4xl text-on-surface mb-2 font-extrabold tracking-tight">
                8 pendientes
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 mt-2 border-t border-surface-container">
              <span className="text-xs font-bold text-amber-700">S/ 142,500 en cola</span>
              <span className="text-xs text-on-surface-variant">SLA: 24 horas</span>
            </div>
          </div>
        </div>

        {/* Analytics Section: Sales Timeline + Category Donut */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sales & Commissions Timeline */}
          <div className="lg:col-span-8 bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col justify-between border border-surface-container">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-on-surface">
                    Evolución de Ventas vs Comisiones
                  </h2>
                  <p className="text-xs text-on-surface-variant">
                    Comportamiento semanal de emisión bruta y margen QPH (7.5% avg)
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-primary"></span>
                    <span className="text-on-surface-variant">Ventas Brutas</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-vip-gold"></span>
                    <span className="text-on-surface-variant">Comisión QPH</span>
                  </div>
                </div>
              </div>

              {/* SVG Chart */}
              <div className="w-full h-64 pt-2">
                <svg
                  className="w-full h-full overflow-visible"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 700 240"
                >
                  <line stroke="#f2f4f6" strokeDasharray="4 4" strokeWidth="1.5" x1="0" x2="700" y1="20" y2="20" />
                  <line stroke="#f2f4f6" strokeDasharray="4 4" strokeWidth="1.5" x1="0" x2="700" y1="80" y2="80" />
                  <line stroke="#f2f4f6" strokeDasharray="4 4" strokeWidth="1.5" x1="0" x2="700" y1="140" y2="140" />
                  <line stroke="#eceef0" strokeWidth="1.5" x1="0" x2="700" y1="200" y2="200" />
                  <defs>
                    <linearGradient id="primaryAreaGrad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#4648d4" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#4648d4" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="goldAreaGrad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 160 Q 116 110 233 130 T 466 70 T 700 45 L 700 200 L 0 200 Z"
                    fill="url(#primaryAreaGrad)"
                  />
                  <path
                    d="M 0 160 Q 116 110 233 130 T 466 70 T 700 45"
                    stroke="#4648d4"
                    strokeLinecap="round"
                    strokeWidth="3"
                  />
                  <path
                    d="M 0 185 Q 116 170 233 175 T 466 150 T 700 135 L 700 200 L 0 200 Z"
                    fill="url(#goldAreaGrad)"
                  />
                  <path
                    d="M 0 185 Q 116 170 233 175 T 466 150 T 700 135"
                    stroke="#F59E0B"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                  />
                  <circle cx="233" cy="130" fill="#4648d4" r="4" />
                  <circle cx="466" cy="70" fill="#4648d4" r="4" />
                  <circle cx="700" cy="45" fill="#4648d4" r="5" className="ring-4 ring-primary/20" />
                  <circle cx="700" cy="135" fill="#F59E0B" r="4" />
                </svg>
              </div>

              {/* X Axis */}
              <div className="grid grid-cols-7 text-center text-xs font-semibold text-on-surface-variant pt-3">
                <span>Lun 17</span>
                <span>Mar 18</span>
                <span>Mié 19</span>
                <span>Jue 20</span>
                <span>Vie 21</span>
                <span className="text-primary font-bold">Sáb 22 (Pico)</span>
                <span>Dom 23</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 mt-6 bg-surface-container-low p-4 rounded-xl border border-surface-container">
              <div className="flex flex-col">
                <span className="text-xs text-on-surface-variant">Pico Diario</span>
                <span className="text-sm font-bold text-on-surface">S/ 940,320</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-on-surface-variant">Ticket Promedio</span>
                <span className="text-sm font-bold text-on-surface">S/ 71.50</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-on-surface-variant">Comisión QPH acumulada</span>
                <span className="text-sm font-bold text-primary">S/ 366,910</span>
              </div>
            </div>
          </div>

          {/* Categories Distribution */}
          <div className="lg:col-span-4 bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col justify-between border border-surface-container">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-on-surface">Por Categoría</h2>
                <button className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg">
                  <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                </button>
              </div>
              <p className="text-xs text-on-surface-variant mb-6">Participación en volumen de entradas</p>

              {/* Inline Visual Donut */}
              <div className="relative flex items-center justify-center my-4">
                <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" fill="none" r="48" stroke="#eceef0" strokeWidth="14" />
                  <circle
                    cx="60"
                    cy="60"
                    fill="none"
                    r="48"
                    stroke="#4648d4"
                    strokeDasharray="162.8 301.6"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeWidth="14"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    fill="none"
                    r="48"
                    stroke="#6366F1"
                    strokeDasharray="72.3 301.6"
                    strokeDashoffset="-164"
                    strokeLinecap="round"
                    strokeWidth="14"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    fill="none"
                    r="48"
                    stroke="#F59E0B"
                    strokeDasharray="36.2 301.6"
                    strokeDashoffset="-238"
                    strokeLinecap="round"
                    strokeWidth="14"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    fill="none"
                    r="48"
                    stroke="#565e74"
                    strokeDasharray="30.1 301.6"
                    strokeDashoffset="-276"
                    strokeLinecap="round"
                    strokeWidth="14"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase">Líder</span>
                  <span className="text-2xl font-bold text-on-surface">54%</span>
                  <span className="text-[11px] text-on-surface-variant">Conciertos</span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary"></span>
                  <span className="text-on-surface">Conciertos y Live</span>
                </div>
                <span className="font-bold text-on-surface">54%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-electric-indigo"></span>
                  <span className="text-on-surface">Festivales de Música</span>
                </div>
                <span className="font-bold text-on-surface">24%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-vip-gold"></span>
                  <span className="text-on-surface">Teatro & Cultura</span>
                </div>
                <span className="font-bold text-on-surface">12%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-secondary"></span>
                  <span className="text-on-surface">Deportes & Maratones</span>
                </div>
                <span className="font-bold text-on-surface">10%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Workbenches */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 pb-8">
          {/* Table 1: Urgent Approvals */}
          <div className="xl:col-span-7 bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col justify-between border border-surface-container">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
                    <span className="material-symbols-outlined text-[18px]">gavel</span>
                  </div>
                  <h2 className="text-lg font-bold text-on-surface">
                    Aprobación de Eventos Pendientes
                  </h2>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs font-semibold">
                  3 prioritarios
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mb-5">
                Organizadores solicitando validación de fianza, aforo y publicación.
              </p>

              <div className="flex flex-col gap-3">
                {/* Row 1 */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-surface-container-low rounded-xl gap-4 hover:bg-surface-container transition-colors border border-surface-container">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg flex-shrink-0">
                      NL
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-on-surface text-sm truncate">
                          Neon Lights Festival Lima 2026
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-deep-slate text-white text-[10px] font-bold uppercase">
                          General
                        </span>
                      </div>
                      <span className="text-xs text-on-surface-variant">
                        Organizador: Sonorama Live • Arena 1
                      </span>
                      <span className="text-[11px] font-semibold text-amber-700">
                        Aforo: 8,500 entradas • Tarifa snapshot: 6.5% + S/ 1.50
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Link
                      href="/events/approvals"
                      className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-white text-xs font-semibold shadow-sm transition-all border border-surface-container"
                    >
                      Revisar
                    </Link>
                    <button className="px-3.5 py-1.5 rounded-lg bg-primary text-white hover:bg-primary/90 text-xs font-semibold shadow-sm transition-all flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      <span>Aprobar</span>
                    </button>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-surface-container-low rounded-xl gap-4 hover:bg-surface-container transition-colors border border-surface-container">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg flex-shrink-0">
                      FS
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-on-surface text-sm truncate">
                          Filarmónica Soundtracks Anime
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface text-[10px] font-bold uppercase">
                          Teatro
                        </span>
                      </div>
                      <span className="text-xs text-on-surface-variant">
                        Organizador: Cultura Viva • Gran Teatro Nac.
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-700">
                        Aforo: 1,400 entradas • Tarifa snapshot: 5.0% + S/ 1.00
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Link
                      href="/events/approvals"
                      className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-white text-xs font-semibold shadow-sm transition-all border border-surface-container"
                    >
                      Revisar
                    </Link>
                    <button className="px-3.5 py-1.5 rounded-lg bg-primary text-white hover:bg-primary/90 text-xs font-semibold shadow-sm transition-all flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      <span>Aprobar</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-surface-container flex items-center justify-between">
              <span className="text-xs text-on-surface-variant">5 eventos más en cola de moderación</span>
              <Link
                href="/events/approvals"
                className="text-xs font-bold text-primary hover:text-electric-indigo transition-colors flex items-center gap-1"
              >
                <span>Ver cola de aprobación</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Table 2: Financial Requests */}
          <div className="xl:col-span-5 bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col justify-between border border-surface-container">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-vip-gold/20 flex items-center justify-center text-amber-800">
                    <span className="material-symbols-outlined text-[18px]">price_check</span>
                  </div>
                  <h2 className="text-lg font-bold text-on-surface">Liquidaciones & Adelantos</h2>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
                  8 pendientes
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mb-5">
                Retiros solicitados por promotores con eventos publicados o culminados.
              </p>

              <div className="flex flex-col gap-3">
                <div className="p-3.5 bg-surface-container-low rounded-xl flex items-center justify-between border border-surface-container">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-on-surface">
                      Sonorama Live (Adelanto 40%)
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      Neon Lights • BCP Soles 193-289382
                    </span>
                    <span className="text-xs font-bold text-primary mt-0.5">
                      S/ 48,000.00
                    </span>
                  </div>
                  <Link
                    href="/finance/requests"
                    className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-white text-xs font-semibold shadow-sm transition-all border border-surface-container"
                  >
                    Auditar
                  </Link>
                </div>

                <div className="p-3.5 bg-surface-container-low rounded-xl flex items-center justify-between border border-surface-container">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-on-surface">
                      Prod. Macanudo (Liquidación Final)
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      Standup Comedy • BBVA 0011-0482
                    </span>
                    <span className="text-xs font-bold text-emerald-700 mt-0.5">
                      S/ 18,450.00 (Evento Completado)
                    </span>
                  </div>
                  <Link
                    href="/finance/requests"
                    className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-white text-xs font-semibold shadow-sm transition-all border border-surface-container"
                  >
                    Auditar
                  </Link>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-surface-container flex items-center justify-between">
              <span className="text-xs text-on-surface-variant">Total por desembolsar: S/ 142,500</span>
              <Link
                href="/finance/requests"
                className="text-xs font-bold text-primary hover:text-electric-indigo transition-colors flex items-center gap-1"
              >
                <span>Gestionar Solicitudes</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

