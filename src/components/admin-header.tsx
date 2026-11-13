'use client';

import Link from 'next/link';

interface HeaderProps {
  title?: string;
  onSearch?: (query: string) => void;
}

export function AdminHeader({ title = 'Panel de Control', onSearch }: HeaderProps) {
  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-surface/80 backdrop-blur-xl z-40 px-8 flex items-center justify-between border-b border-surface-container/60 shadow-[0_1px_8px_rgba(0,0,0,0.02)]">
      {/* Search Input */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-container-low text-on-surface placeholder:text-on-surface-variant text-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-electric-indigo/50 transition-all border border-transparent focus:border-electric-indigo"
            placeholder="Buscar evento, organizador, usuario o ticket ID..."
            type="text"
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        <button
          className="relative p-2 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors"
          title="Notificaciones de moderación"
        >
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-electric-indigo"></span>
        </button>

        <Link
          href="/finance/requests"
          className="relative p-2 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors"
          title="Solicitudes de liquidación"
        >
          <span className="material-symbols-outlined text-[22px]">receipt_long</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-vip-gold"></span>
        </Link>

        <div className="h-6 w-[1px] bg-surface-container-highest mx-1"></div>

        <div className="flex items-center gap-3 pl-1">
          <div className="flex flex-col text-right">
            <span className="text-xs font-bold text-on-surface">Master Ops</span>
            <span className="text-[11px] text-on-surface-variant">Sede Central Lima</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shadow-sm">
            MO
          </div>
        </div>
      </div>
    </header>
  );
}

