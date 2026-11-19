"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  logoutUseCase,
  getStoredSessionUseCase,
  AdminSessionUser,
} from "@/app/features/auth";

interface SidebarProps {
  pendingApprovalsCount?: number;
}

export function AdminSidebar({ pendingApprovalsCount }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AdminSessionUser | null>(null);

  useEffect(() => {
    const session = getStoredSessionUseCase.execute();
    if (session) {
      setCurrentUser(session.user);
    }
  }, []);

  const handleLogout = async () => {
    await logoutUseCase.execute();
    router.push("/login");
    router.refresh();
  };

  interface NavItem {
    label: string;
    icon: string;
    href: string;
    badge?: number | null;
    badgeColor?: string;
  }

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      icon: "grid_view",
      href: "/",
      badge: null,
    },
    {
      label: "Gestión de Usuarios",
      icon: "group",
      href: "/users",
      badge: null,
    },
    {
      label: "Gestión de Eventos",
      icon: "verified",
      href: "/events/approvals",
      badge: null,
    },
    {
      label: "Finanzas & Liquidaciones",
      icon: "account_balance_wallet",
      href: "/finance",
      badge: null,
    },
    {
      label: "Solicitudes y Adelantos",
      icon: "receipt_long",
      href: "/finance/requests",
      badge: null,
    },
    {
      label: "Configuraciones QPH",
      icon: "tune",
      href: "/settings",
      badge: null,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-lowest z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-surface-container">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-surface-container/60">
          <div className="w-8 h-8 rounded-lg bg-electric-indigo flex items-center justify-center text-white font-extrabold text-xs shadow-xs shrink-0 tracking-tight">
            QPH
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-tight text-on-surface leading-none text-base">
              queplan<span className="text-electric-indigo">hoy</span>
            </span>
            <span className="text-[10px] tracking-wider uppercase text-on-surface-variant font-semibold">
              Backoffice Suite
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-3 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href ||
                  pathname?.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl transition-all font-medium text-sm ${
                  isActive
                    ? "bg-primary-container text-on-primary-container font-semibold shadow-[0_10px_10px_-5px_rgba(0,0,0,0.02)]"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px]">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      item.badgeColor ||
                      "bg-primary-fixed text-on-primary-fixed"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Admin Profile Footer */}
      <div className="p-4 flex flex-col gap-3 bg-surface-container-lowest border-t border-surface-container/60">
        <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[18px]">
                person
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-on-surface leading-tight truncate">
                {currentUser?.displayName || "Super Admin"}
              </span>
              <span className="text-[11px] text-on-surface-variant leading-tight truncate">
                {currentUser?.email || "ops@queplanhoy.com"}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="text-on-surface-variant hover:text-error transition-colors p-1.5 rounded-lg hover:bg-surface-container cursor-pointer flex-shrink-0"
            title="Cerrar sesión"
          >
            <span className="material-symbols-outlined text-[20px]">
              logout
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
