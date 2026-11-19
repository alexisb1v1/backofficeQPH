"use client";

import Link from "next/link";

interface HeaderProps {
  title?: string;
  onSearch?: (query: string) => void;
}

export function AdminHeader({
  title = "Panel de Control",
  onSearch,
}: HeaderProps) {
  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-surface/80 backdrop-blur-xl z-40 px-8 flex items-center justify-between border-b border-surface-container/60 shadow-[0_1px_8px_rgba(0,0,0,0.02)]">
      {/* Título de Sección o Espacio Flexible */}
      <div className="flex items-center gap-3">
        <span className="font-extrabold text-sm text-on-surface tracking-tight">
          {title}
        </span>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        <button
          className="relative p-2 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors"
          title="Notificaciones de moderación"
        >
          <span className="material-symbols-outlined text-[22px]">
            notifications
          </span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-electric-indigo"></span>
        </button>

        <Link
          href="/finance/requests"
          className="relative p-2 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors"
          title="Solicitudes de liquidación"
        >
          <span className="material-symbols-outlined text-[22px]">
            receipt_long
          </span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-vip-gold"></span>
        </Link>
      </div>
    </header>
  );
}
