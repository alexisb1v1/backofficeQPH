"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Loader2,
  FileText,
  LifeBuoy,
  AlertCircle,
} from "lucide-react";
import { loginUseCase } from "@/app/features/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;

    setLoading(true);
    setErrorMessage(null);

    const result = await loginUseCase.execute({
      username: username.trim(),
      password,
      origin: "backoffice",
    });

    result.match(
      () => {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => {
          router.push(from);
          router.refresh();
        }, 600);
      },
      (error) => {
        setLoading(false);
        setErrorMessage(error.message);
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-error/10 border border-error/30 text-error flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p className="text-xs font-medium leading-relaxed">{errorMessage}</p>
        </div>
      )}

      {/* Username */}
      <div className="space-y-1.5">
        <label
          htmlFor="adminUsername"
          className="block text-xs uppercase tracking-wider font-bold text-on-surface"
        >
          Usuario Corporativo (Username)
        </label>
        <div className="relative flex items-center">
          <User className="w-4 h-4 text-on-surface-variant absolute left-3.5 pointer-events-none" />
          <input
            id="adminUsername"
            type="text"
            required
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="abasilio"
            className="w-full bg-surface-container-low text-on-surface placeholder:text-outline pl-10 pr-4 py-3 rounded-xl text-xs outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-electric-indigo transition-all border border-surface-container"
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="adminPassword"
            className="block text-xs uppercase tracking-wider font-bold text-on-surface"
          >
            Contraseña Administrativa
          </label>
          <a
            href="#"
            className="text-xs font-semibold text-primary hover:text-electric-indigo transition-colors"
          >
            ¿Olvidó su contraseña?
          </a>
        </div>
        <div className="relative flex items-center">
          <Lock className="w-4 h-4 text-on-surface-variant absolute left-3.5 pointer-events-none" />
          <input
            id="adminPassword"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full bg-surface-container-low text-on-surface placeholder:text-outline pl-10 pr-11 py-3 rounded-xl text-xs outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-electric-indigo transition-all border border-surface-container"
          />
          <button
            type="button"
            aria-label="Mostrar u ocultar contraseña"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-on-surface-variant hover:text-on-surface p-1 rounded transition-colors focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Remember device */}
      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            className="w-4 h-4 rounded text-electric-indigo accent-electric-indigo cursor-pointer"
          />
          <span className="text-xs text-on-surface">
            Recordar sesión en este equipo seguro
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading || success}
          className={`w-full py-3.5 px-6 font-bold text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer text-white shadow-md ${
            success
              ? "bg-emerald-600 shadow-emerald-500/30"
              : "bg-electric-indigo hover:bg-primary shadow-indigo-500/25"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Validando Credenciales...</span>
            </>
          ) : success ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Acceso Concedido</span>
            </>
          ) : (
            <>
              <span>Ingresar al Panel de Control</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="w-full h-screen overflow-hidden flex flex-col lg:flex-row bg-surface">
      {/* Left Visual Panel: Full Height Brand & Telemetry */}
      <div className="hidden lg:flex lg:w-5/12 bg-deep-slate text-on-primary p-10 xl:p-14 flex-col justify-between relative overflow-hidden h-full">
        <div className="absolute inset-0 bg-gradient-to-tr from-deep-slate via-deep-slate/95 to-electric-indigo/25 pointer-events-none"></div>

        {/* Ambient Glow Orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-electric-indigo/15 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-primary/20 blur-3xl pointer-events-none"></div>

        {/* Top Brand Identity */}
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-electric-indigo flex items-center justify-center text-white font-black text-xl shadow-lg shadow-electric-indigo/30">
              QPH
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white leading-tight">
                queplanhoy
              </span>
              <span className="text-xs uppercase text-platinum-silver tracking-widest font-semibold">
                Backoffice Suite
              </span>
            </div>
          </div>

          <div className="space-y-2.5 mt-2">
            <span className="text-xs font-semibold text-electric-indigo uppercase tracking-wider">
              Acceso Restringido
            </span>
            <h1 className="text-2xl xl:text-3xl font-extrabold text-white leading-tight">
              Gestión Central de Eventos y Operaciones
            </h1>
            <p className="text-xs xl:text-sm text-slate-300 font-normal leading-relaxed max-w-md">
              Plataforma interna para supervisión de taquilla, validación de
              accesos, conciliación financiera y métricas en tiempo real.
            </p>
          </div>
        </div>

        {/* Telemetry Live Widget */}
        <div className="relative z-10 p-5 bg-slate-900/80 backdrop-blur-md rounded-2xl space-y-4 border border-slate-800 shadow-xl max-w-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-slate-200">
                Nodo Central Seguro
              </span>
            </div>
            <span className="text-xs font-semibold text-electric-indigo uppercase">
              TLS v1.3
            </span>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Latencia de red interna</span>
              <span className="font-semibold text-white font-mono">
                12 ms (Óptima)
              </span>
            </div>
            <svg
              className="w-full h-10 text-electric-indigo stroke-current fill-none"
              preserveAspectRatio="none"
              viewBox="0 0 260 40"
            >
              <path
                d="M0,28 Q25,32 50,22 T100,24 T150,14 T200,19 T260,10"
                strokeLinecap="round"
                strokeWidth="2.5"
              ></path>
              <path
                d="M0,28 Q25,32 50,22 T100,24 T150,14 T200,19 T260,10 L260,40 L0,40 Z"
                fill="rgba(99,102,241,0.12)"
                strokeWidth="0"
              ></path>
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-slate-800">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-electric-indigo" />
              WAF Cloud Activo
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-slate-400">
              ISO 27001
            </span>
          </div>
        </div>

        {/* Compliance Footer */}
        <div className="relative z-10 pt-2 flex items-center justify-between text-xs text-slate-400">
          <span>© 2026 QPH Entertainment S.A.</span>
          <span className="tracking-wide font-mono">v4.18.2-prod</span>
        </div>
      </div>

      {/* Right Interaction Panel: Full Height Form */}
      <div className="w-full lg:w-7/12 h-full flex flex-col justify-between bg-surface-container-lowest p-6 sm:p-10 lg:p-14 overflow-y-auto">
        {/* Top Header & Security Trust Pill */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container text-deep-slate border border-surface-container-high">
            <Lock className="w-3.5 h-3.5 text-electric-indigo" />
            <span className="text-[11px] uppercase tracking-wider font-bold text-on-surface">
              Entorno Seguro • SSL 256-bit
            </span>
          </div>
        </div>

        {/* Central Form Container */}
        <div className="max-w-md w-full mx-auto my-auto py-4 space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl xl:text-3xl font-extrabold text-on-surface tracking-tight">
              Acceso Administrativo
            </h2>
            <p className="text-xs text-on-surface-variant">
              Introduce tus credenciales corporativas verificadas para ingresar
              a la consola de operaciones.
            </p>
          </div>

          <Suspense
            fallback={
              <div className="py-8 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-electric-indigo" />
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>

        {/* Footer & Audit Notice */}
        <div className="pt-4 border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-on-surface-variant">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 flex-shrink-0 text-on-surface-variant" />
            <p className="text-[11px] leading-tight">
              <strong>Aviso de Auditoría:</strong> Acceso registrado y
              monitoreado por el SOC.
            </p>
          </div>
          <a
            href="#"
            className="text-[11px] font-bold text-electric-indigo hover:text-primary whitespace-nowrap flex items-center gap-1 transition-colors"
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Soporte TI</span>
          </a>
        </div>
      </div>
    </main>
  );
}
