'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'fees' | 'gateways' | 'settlements' | 'security'>('fees');
  const [feePercent, setFeePercent] = useState('8.5');
  const [feeFixed, setFeeFixed] = useState('1.50');
  const [feeMode, setFeeMode] = useState<'buyer' | 'promoter'>('buyer');
  const [maxAdvancePct, setMaxAdvancePct] = useState('50');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="flex flex-col w-full pb-16">
      <div className="flex flex-col w-full p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-primary font-bold">
                Núcleo Central QPH
              </span>
              <span className="text-on-surface-variant font-bold">•</span>
              <span className="text-xs font-bold text-on-surface-variant">
                Configuraciones del Sistema
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-on-surface tracking-tight">
              Parámetros Globales de queplaneshoy
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-electric-indigo text-white font-bold text-xs shadow-lg shadow-electric-indigo/20 hover:bg-primary transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Guardar Cambios Globales</span>
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="p-4 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-2 text-xs font-bold animate-in fade-in duration-200">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>Configuraciones del sistema guardadas exitosamente en la plataforma.</span>
          </div>
        )}

        {/* Main Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Secondary Nav */}
          <nav className="lg:col-span-3 flex flex-col gap-1.5 p-2 bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container">
            <button
              onClick={() => setActiveTab('fees')}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                activeTab === 'fees'
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">payments</span>
                <span>Comisiones & Tarifas</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('gateways')}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                activeTab === 'gateways'
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">account_balance</span>
                <span>Pasarelas & Culqi</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('settlements')}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                activeTab === 'settlements'
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">price_change</span>
                <span>Adelantos & Liquidaciones</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                activeTab === 'security'
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">shield</span>
                <span>QR Keys & Seguridad</span>
              </div>
            </button>

            <div className="mt-4 pt-4 border-t border-surface-container p-3 text-on-surface-variant text-xs space-y-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-tertiary">
                  history_toggle_off
                </span>
                <span className="font-bold text-[11px] uppercase">Última Modificación</span>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-tight">
                Por <strong>Master Ops</strong> hoy a las 14:32 GMT-5
              </p>
            </div>
          </nav>

          {/* Content Area */}
          <div className="lg:col-span-9 space-y-8">
            {activeTab === 'fees' && (
              <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm border border-surface-container space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-primary">
                      <span className="material-symbols-outlined text-[22px]">tune</span>
                      <span className="text-xs uppercase font-bold">Ticketing Fees Base</span>
                    </div>
                    <h2 className="text-lg font-bold text-on-surface mt-1">
                      Estructura de Comisión por Ticket
                    </h2>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Define los márgenes globales aplicados automáticamente a toda aprobación de evento (grabados como snapshot histórico).
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold">
                    Activo en Producción
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="p-5 rounded-xl bg-surface-container-low space-y-4 border border-surface-container">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-on-surface">Ventas Estándar & Masivas</span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-bold">
                        B2C General
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-on-surface-variant">Comisión %</label>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.1"
                            value={feePercent}
                            onChange={(e) => setFeePercent(e.target.value)}
                            className="w-full pl-3 pr-8 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface text-base font-bold outline-none focus:ring-2 focus:ring-primary shadow-sm border border-surface-container"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-on-surface-variant">
                            %
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-on-surface-variant">Tarifa Fija / Ticket</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-on-surface-variant">
                            S/
                          </span>
                          <input
                            type="number"
                            step="0.10"
                            value={feeFixed}
                            onChange={(e) => setFeeFixed(e.target.value)}
                            className="w-full pl-8 pr-3 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface text-base font-bold outline-none focus:ring-2 focus:ring-primary shadow-sm border border-surface-container"
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-[11px] text-on-surface-variant">
                      Fórmula snapshot: (Ticket × {feePercent}%) + S/ {feeFixed} por boleto.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-surface-container-low space-y-4 border border-surface-container opacity-90">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-on-surface">Eventos Gratuitos</span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-bold">
                        Exonerado
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-on-surface-variant">Comisión %</label>
                        <input
                          type="number"
                          disabled
                          value="0.0"
                          className="w-full pl-3 pr-3 py-2.5 rounded-lg bg-surface-container text-on-surface text-base font-bold shadow-none cursor-not-allowed border border-surface-container"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-on-surface-variant">Costo Procesamiento</label>
                        <input
                          type="number"
                          disabled
                          value="0.00"
                          className="w-full pl-3 pr-3 py-2.5 rounded-lg bg-surface-container text-on-surface text-base font-bold shadow-none cursor-not-allowed border border-surface-container"
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-on-surface-variant">
                      Sin cargo de intermediación QPH.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-surface-container-low flex flex-col md:flex-row md:items-center justify-between gap-4 border border-surface-container">
                  <div className="space-y-1">
                    <span className="font-bold text-xs text-on-surface">
                      Modalidad de Imputación de Servicio (Service Fee)
                    </span>
                    <p className="text-xs text-on-surface-variant">
                      Determina si el recargo de tarifa se cobra al comprador final o se descuenta de la recaudación del organizador.
                    </p>
                  </div>
                  <div className="inline-flex p-1 bg-surface-container-highest rounded-xl">
                    <button
                      type="button"
                      onClick={() => setFeeMode('buyer')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        feeMode === 'buyer'
                          ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      Al Comprador
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeeMode('promoter')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        feeMode === 'promoter'
                          ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      Deducido al Organizador
                    </button>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'gateways' && (
              <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm border border-surface-container space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-primary">
                      <span className="material-symbols-outlined text-[22px]">credit_card</span>
                      <span className="text-xs uppercase font-bold">Pasarela Culqi</span>
                    </div>
                    <h2 className="text-lg font-bold text-on-surface mt-1">
                      Integración de Pagos y Webhooks
                    </h2>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Configuración de llaves de entorno y URL de retorno para validación asíncrona de cobros.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-on-surface">Llave Pública Culqi (PK)</label>
                    <input
                      type="text"
                      defaultValue="pk_live_d8194a0284729104829"
                      className="w-full p-3 rounded-xl bg-surface-container-low text-xs border border-surface-container font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-on-surface">Webhook Secret Key</label>
                    <input
                      type="password"
                      defaultValue="whsec_994829104829104829"
                      className="w-full p-3 rounded-xl bg-surface-container-low text-xs border border-surface-container font-mono"
                    />
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'settlements' && (
              <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm border border-surface-container space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-primary">
                      <span className="material-symbols-outlined text-[22px]">price_change</span>
                      <span className="text-xs uppercase font-bold">Políticas de Tesorería</span>
                    </div>
                    <h2 className="text-lg font-bold text-on-surface mt-1">
                      Límites de Adelanto & Reglas de Liquidación
                    </h2>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Parámetros para activar adelanto (en publicado) y liquidación final (en completado).
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-on-surface">
                      Porcentaje Máximo de Adelanto (%)
                    </label>
                    <input
                      type="number"
                      value={maxAdvancePct}
                      onChange={(e) => setMaxAdvancePct(e.target.value)}
                      className="w-full max-w-xs p-3 rounded-xl bg-surface-container-low text-xs border border-surface-container font-mono font-bold"
                    />
                    <p className="text-[11px] text-on-surface-variant">
                      Los organizadores no podrán solicitar más del {maxAdvancePct}% del fondo neto antes de la finalización del evento.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'security' && (
              <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm border border-surface-container space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-primary">
                      <span className="material-symbols-outlined text-[22px]">qr_code_2</span>
                      <span className="text-xs uppercase font-bold">Criptografía de Accesos</span>
                    </div>
                    <h2 className="text-lg font-bold text-on-surface mt-1">
                      Par de Llaves QR (Signing Key ID & Public Key)
                    </h2>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Gestiona la clave pública para que el escáner móvil de puertas valide entradas offline sin exponer la clave privada.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-on-surface">Signing Key ID Activo</label>
                    <input
                      type="text"
                      defaultValue="key_ed25519_2026_qph_prod_01"
                      className="w-full p-3 rounded-xl bg-surface-container-low text-xs border border-surface-container font-mono font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-on-surface">
                      Clave Pública Ed25519 (Distribuida al App de Puertas)
                    </label>
                    <textarea
                      rows={3}
                      defaultValue="MCowBQYDK2VwAyEA9bWq291kLa84Zp89qA8J7h3kLa99841KmL910482KkL="
                      className="w-full p-3 rounded-xl bg-surface-container-low text-xs border border-surface-container font-mono"
                    />
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

