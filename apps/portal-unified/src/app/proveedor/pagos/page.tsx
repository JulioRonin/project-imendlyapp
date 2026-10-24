"use client";

import React, { useState } from 'react';
import {
  TrendingUp,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Building,
  CreditCard,
  History,
  ChevronRight,
  X,
  Target,
  BarChart2,
  CheckCircle2,
  Users,
  Receipt
} from 'lucide-react';

const TRANSACTIONS = [
  { id: 'TX-8821', type: 'service_payout', description: 'Pago Limpieza Profunda - ORD-9901', date: '25 Mar, 2026', daysAgo: 1, amount: '+ $450.00', status: 'completed' },
  { id: 'TX-8820', type: 'service_payout', description: 'Pago Plomería - ORD-9882', date: '23 Mar, 2026', daysAgo: 3, amount: '+ $1,200.00', status: 'completed' },
  { id: 'TX-8819', type: 'system_fee', description: 'Comisión Plataforma (15%)', date: '21 Mar, 2026', daysAgo: 5, amount: '- $180.00', status: 'completed' },
  { id: 'TX-8818', type: 'withdrawal', description: 'Retiro a Cuenta Santander ****4421', date: '15 Mar, 2026', daysAgo: 11, amount: '- $5,000.00', status: 'processing' },
  { id: 'TX-8817', type: 'service_payout', description: 'Pago Pintura - ORD-9855', date: '28 Feb, 2026', daysAgo: 26, amount: '+ $3,400.00', status: 'completed' },
  { id: 'TX-8816', type: 'service_payout', description: 'Pago Electricidad - ORD-9810', date: '15 Feb, 2026', daysAgo: 39, amount: '+ $850.00', status: 'completed' },
];

const EYEBROW = 'text-[10px] font-bold uppercase tracking-[0.18em]';
const LABEL_CLS = `block ${EYEBROW} text-muted mb-2 ml-1`;
const INPUT_CLS = 'w-full h-14 px-5 bg-sand rounded-[1.25rem] border-0 text-[15px] font-semibold text-ink placeholder:text-faint placeholder:font-medium outline-none focus:ring-2 focus:ring-primary/30 transition-shadow';

const METRICS = [
  { label: 'Saldo disponible', value: '$8,420.50', hint: 'Listo para retirar', icon: Wallet },
  { label: 'Servicios realizados', value: '48', hint: 'En marzo hasta hoy', icon: CheckCircle2 },
  { label: 'Retiros totales', value: '$22,800', hint: 'Último retiro: 15 Mar', icon: History },
];

export default function PaymentsPage() {
  const [filter, setFilter] = useState<'7' | '30' | 'all'>('7');
  const [showReportModal, setShowReportModal] = useState(false);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);

  const filteredTransactions = TRANSACTIONS.filter(tx => {
    if (filter === '7') return tx.daysAgo <= 7;
    if (filter === '30') return tx.daysAgo <= 30;
    return true;
  });

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-linen">
      <main className="flex-1 overflow-y-auto px-6 md:px-12 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* ── Cabecera editorial ── */}
          <header className="pt-10 md:pt-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className={`v3-blur-in ${EYEBROW} text-primary-deep`}>Finanzas</p>
              <h1 className="v3-blur-in text-[34px] md:text-[44px] font-semibold tracking-tight leading-[1.02] text-ink mt-2" style={{ animationDelay: '100ms' }}>
                Pagos y cobros
              </h1>
              <p className="v3-blur-in mt-2 text-[14px] font-medium text-muted" style={{ animationDelay: '200ms' }}>
                Control de ingresos, comisiones y retiros
              </p>
            </div>

            <div className="v3-blur-in flex items-center gap-3" style={{ animationDelay: '300ms' }}>
              <button type="button" className="h-12 md:h-14 px-5 rounded-full bg-cream text-ink text-[13px] font-bold flex items-center gap-2 v2-shadow-soft v2-press">
                <Calendar size={16} /> Marzo 2026
              </button>
              <button
                type="button"
                onClick={() => setShowReportModal(true)}
                className="h-12 md:h-14 px-6 rounded-full bg-ink text-white text-[13px] font-bold flex items-center gap-2 v2-press"
              >
                <Download size={16} /> Exportar reporte
              </button>
            </div>
          </header>

          {/* ── Ganancia del mes ── */}
          <section className="v3-blur-in mt-9" style={{ animationDelay: '350ms' }}>
            <div className="relative overflow-hidden v3-night-grad rounded-[2.5rem] p-7 md:p-10 text-on-dark v2-shadow-lift">
              <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
              <div className="absolute -left-10 -bottom-20 w-56 h-56 rounded-full bg-lavender/20 blur-3xl pointer-events-none" />
              <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <p className={`${EYEBROW} text-on-dark/60`}>Ganancia del mes</p>
                  <p className="mt-3 text-[56px] md:text-[80px] font-bold tabular-nums tracking-tight leading-[0.95]">$31,200</p>
                  <p className="mt-4 inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-mint-light text-mint-deep text-[12.5px] font-semibold tabular-nums">
                    <TrendingUp size={14} /> +12.4% vs mes anterior
                  </p>
                </div>
                <div className="shrink-0 md:text-right">
                  <p className={`${EYEBROW} text-on-dark/50`}>Neto después de comisión</p>
                  <p className="mt-1.5 text-[14px] font-medium text-on-dark/70 tabular-nums">Bruto $36,705.88 · Comisión 15% $5,505.88</p>
                  <button type="button" className="mt-5 h-12 px-6 rounded-full bg-primary hover:bg-primary-dark text-ink text-[13px] font-bold inline-flex items-center gap-2 v2-press transition-colors">
                    Retirar saldo <ArrowUpRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ── Métricas ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
            {METRICS.map((m, i) => (
              <div key={m.label} className={`v2-rise v2-d${i + 1} bg-cream rounded-[1.75rem] p-6 v2-shadow-soft v2-float`}>
                <div className="flex items-center justify-between">
                  <p className={`${EYEBROW} text-muted`}>{m.label}</p>
                  <span className="w-10 h-10 rounded-[0.9rem] bg-primary-light text-primary-deep flex items-center justify-center">
                    <m.icon size={17} />
                  </span>
                </div>
                <p className="mt-4 text-[30px] font-bold tabular-nums tracking-tight text-ink leading-none">{m.value}</p>
                <p className="mt-2 text-[12px] font-medium text-faint">{m.hint}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 mt-12">
            {/* ── Historial ── */}
            <div className="lg:col-span-2">
              <div className="flex items-end justify-between gap-4 mb-5">
                <h3 className="text-[22px] font-semibold tracking-tight text-ink">Historial</h3>
                <div className="flex gap-6">
                  {[
                    { id: '7', label: '7 días' },
                    { id: '30', label: '30 días' },
                    { id: 'all', label: 'Todo' }
                  ].map(f => {
                    const active = filter === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFilter(f.id as any)}
                        className={`relative shrink-0 pb-2 text-[13.5px] transition-colors duration-300 ${active ? 'font-semibold text-ink' : 'font-medium text-faint hover:text-muted'}`}
                      >
                        {f.label}
                        <span className={`absolute left-0 right-0 -bottom-px h-[3px] rounded-full bg-lavender transition-transform duration-500 origin-left ${active ? 'scale-x-100' : 'scale-x-0'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                {filteredTransactions.length === 0 && (
                  <div className="v2-rise bg-cream rounded-[2.25rem] px-8 py-14 flex flex-col items-center text-center v2-shadow-soft">
                    <span className="w-16 h-16 rounded-[1.4rem] bg-primary-light text-primary-deep flex items-center justify-center mb-5">
                      <Receipt size={26} />
                    </span>
                    <h3 className="text-[19px] font-semibold tracking-tight text-ink">Sin movimientos</h3>
                    <p className="mt-1.5 text-[13.5px] font-medium text-muted max-w-xs">No hay transacciones en este periodo. Amplía el rango para ver tu historial completo.</p>
                    <button type="button" onClick={() => setFilter('all')} className="mt-6 h-12 px-6 rounded-full bg-ink text-white text-[13px] font-bold v2-press">
                      Ver todo
                    </button>
                  </div>
                )}

                {filteredTransactions.map((tx, i) => {
                  const incoming = tx.amount.startsWith('+');
                  return (
                    <article key={tx.id} className={`v2-rise v2-d${Math.min(i + 1, 8)} bg-cream rounded-[1.75rem] p-5 v2-shadow-soft v2-float flex items-center gap-4`}>
                      <span className={`w-12 h-12 shrink-0 rounded-[1.05rem] flex items-center justify-center ${
                        incoming ? 'bg-mint-light text-mint-deep' : 'bg-sand text-muted'
                      }`}>
                        {incoming ? <ArrowDownRight size={19} /> : <ArrowUpRight size={19} />}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-semibold text-ink leading-tight truncate">{tx.description}</p>
                        <p className="text-[12.5px] font-medium text-muted mt-0.5 tabular-nums">{tx.date} · <span className="text-faint">{tx.id}</span></p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-[18px] md:text-[20px] font-bold tabular-nums tracking-tight leading-none ${incoming ? 'text-ink' : 'text-muted'}`}>
                          {tx.amount}
                        </p>
                        <span className={`mt-2 inline-flex items-center h-7 px-3 rounded-full text-[11px] font-semibold ${
                          tx.status === 'completed' ? 'bg-mint-light text-mint-deep' : 'bg-primary-light text-primary-deep'
                        }`}>
                          {tx.status === 'completed' ? 'Pagado' : 'Pendiente'}
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* ── Columna lateral ── */}
            <aside className="space-y-5">
              <section className="v2-rise v2-d3 bg-cream rounded-[2.25rem] p-6 v2-shadow-soft">
                <p className={`${EYEBROW} text-muted`}>Estado de cuenta</p>
                <h3 className="mt-1 text-[20px] font-semibold tracking-tight text-ink">Marzo 2026</h3>
                <div className="mt-5 space-y-0">
                  <div className="flex items-center justify-between py-3.5 border-b border-line">
                    <span className="text-[13px] font-medium text-muted">Facturación bruta</span>
                    <span className="text-[15px] font-bold tabular-nums text-ink">$36,705.88</span>
                  </div>
                  <div className="flex items-center justify-between py-3.5 border-b border-line">
                    <span className="text-[13px] font-medium text-muted">Comisión I mendly (15%)</span>
                    <span className="text-[15px] font-bold tabular-nums text-error">-$5,505.88</span>
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <span className="text-[13px] font-semibold text-ink">Ingreso neto</span>
                    <span className="text-[24px] font-bold tabular-nums tracking-tight text-mint-deep leading-none">$31,200.00</span>
                  </div>
                </div>
              </section>

              <section className="v2-rise v2-d4">
                <h3 className="text-[18px] font-semibold tracking-tight text-ink mb-4">Cuenta de retiro</h3>
                <div className="space-y-3">
                  <div className="bg-cream rounded-[1.75rem] p-5 v2-shadow-soft flex items-center gap-4 v2-press cursor-pointer">
                    <span className="w-12 h-12 shrink-0 rounded-[1.05rem] bg-primary-light text-primary-deep flex items-center justify-center">
                      <Building size={20} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-semibold text-ink leading-tight">Santander</p>
                      <p className="text-[12.5px] font-medium text-muted mt-0.5 tabular-nums tracking-wide">CLABE ···· ···· ···· 4421</p>
                    </div>
                    <span className="inline-flex items-center h-7 px-3 rounded-full bg-mint-light text-mint-deep text-[11px] font-semibold shrink-0">Principal</span>
                    <ChevronRight size={16} className="text-faint shrink-0" />
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAddAccountModal(true)}
                    className="w-full bg-cream rounded-[1.75rem] p-5 v2-shadow-soft flex items-center gap-4 v2-press text-left"
                  >
                    <span className="w-12 h-12 shrink-0 rounded-[1.05rem] bg-sand text-ink flex items-center justify-center">
                      <CreditCard size={20} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-semibold text-ink leading-tight">Añadir nueva cuenta</p>
                      <p className="text-[12.5px] font-medium text-muted mt-0.5">Validación en 24 horas</p>
                    </div>
                    <span className="w-9 h-9 shrink-0 rounded-full bg-ink text-white flex items-center justify-center">
                      <ArrowUpRight size={15} />
                    </span>
                  </button>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>

      {/* KPI Report Modal Overlay */}
      {showReportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-ink/40 backdrop-blur-sm">
          <div className="v2-scale bg-cream rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar v2-shadow-float relative">
            <button
              type="button"
              onClick={() => setShowReportModal(false)}
              aria-label="Cerrar"
              className="absolute top-5 right-5 w-11 h-11 bg-sand text-ink rounded-full flex items-center justify-center v2-press z-10"
            >
              <X size={18} />
            </button>

            <div className="p-7 md:p-10 flex items-center gap-5">
              <span className="w-14 h-14 shrink-0 bg-primary-light text-primary-deep rounded-[1.2rem] flex items-center justify-center">
                <BarChart2 size={26} />
              </span>
              <div>
                <p className={`${EYEBROW} text-primary-deep`}>Marzo 2026 · generado a las 19:00</p>
                <h2 className="mt-1 text-[26px] font-semibold tracking-tight text-ink leading-tight">Reporte ejecutivo</h2>
              </div>
            </div>

            <div className="px-7 md:px-10 pb-8 md:pb-10 space-y-8">
              {/* Objectives */}
              <section>
                <h3 className="text-[17px] font-semibold tracking-tight text-ink mb-4 flex items-center gap-2">
                  <Target size={17} className="text-primary-deep" /> Cumplimiento de objetivos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 bg-sand rounded-[1.75rem]">
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <p className={`${EYEBROW} text-muted`}>Objetivo mensual</p>
                        <p className="mt-1 text-[26px] font-bold tabular-nums tracking-tight text-ink leading-none">$40,000</p>
                      </div>
                      <div className="text-right">
                        <p className={`${EYEBROW} text-mint-deep`}>Actual</p>
                        <p className="mt-1 text-[22px] font-bold tabular-nums tracking-tight text-mint-deep leading-none">$31,200</p>
                      </div>
                    </div>
                    <div className="w-full h-2.5 bg-cream rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full w-[78%] transition-all duration-1000" />
                    </div>
                    <p className="text-[12px] font-medium text-muted mt-3 text-right tabular-nums">78% completado</p>
                  </div>

                  <div className="p-6 bg-sand rounded-[1.75rem]">
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <p className={`${EYEBROW} text-muted`}>Conversión de clientes</p>
                        <p className="mt-1 text-[26px] font-bold tabular-nums tracking-tight text-ink leading-none">85%</p>
                      </div>
                      <span className="w-10 h-10 bg-primary-light text-primary-deep flex items-center justify-center rounded-[0.9rem]">
                        <Users size={18} />
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-cream rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full w-[85%] transition-all duration-1000" />
                    </div>
                    <p className="text-[12px] font-medium text-muted mt-3 text-right">Excelente nivel de cierre</p>
                  </div>
                </div>
              </section>

              {/* KPI Details */}
              <section>
                <h3 className="text-[17px] font-semibold tracking-tight text-ink mb-4 flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-primary-deep" /> Indicadores clave
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Tiempo de respuesta', val: '< 15 min', trend: '-2 min', status: 'good' },
                    { label: 'Cancelaciones', val: '2.1%', trend: '-0.5%', status: 'good' },
                    { label: 'Ticket promedio', val: '$650', trend: '+$45', status: 'good' },
                    { label: 'Retención M/M', val: '64%', trend: '+4%', status: 'good' },
                  ].map((kpi, i) => (
                    <div key={i} className="bg-sand p-5 rounded-[1.5rem] text-center">
                      <p className={`${EYEBROW} text-muted mb-2`}>{kpi.label}</p>
                      <p className="text-[22px] font-bold tabular-nums tracking-tight text-ink mb-2 leading-none">{kpi.val}</p>
                      <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-mint-light text-mint-deep text-[11px] font-semibold tabular-nums">{kpi.trend}</span>
                    </div>
                  ))}
                </div>
              </section>

              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setShowReportModal(false)} className="h-14 px-6 rounded-full text-[13px] font-semibold text-muted hover:text-ink v2-press transition-colors">
                  Cerrar
                </button>
                <button type="button" className="h-14 px-8 rounded-full bg-ink text-white text-[13px] font-bold flex items-center gap-2 v2-press">
                  <Download size={16} /> Descargar PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Bank Account Modal */}
      {showAddAccountModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-ink/40 backdrop-blur-sm">
          <div className="v2-scale bg-cream rounded-[2.5rem] w-full max-w-lg v2-shadow-float relative overflow-hidden flex flex-col">
            <div className="p-7 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="w-12 h-12 shrink-0 bg-primary-light text-primary-deep rounded-[1.05rem] flex items-center justify-center">
                  <Building size={22} />
                </span>
                <div>
                  <p className={`${EYEBROW} text-primary-deep`}>Datos bancarios para retiros</p>
                  <h2 className="mt-1 text-[22px] font-semibold tracking-tight text-ink leading-tight">Nueva cuenta</h2>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddAccountModal(false)}
                aria-label="Cerrar"
                className="w-11 h-11 bg-sand text-ink rounded-full flex items-center justify-center v2-press"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-7 pb-2 space-y-5">
              <div>
                <label className={LABEL_CLS}>Banco destino</label>
                <div className="relative">
                  <select className={`${INPUT_CLS} appearance-none cursor-pointer pr-12`}>
                    <option value="">Selecciona tu banco</option>
                    <option value="bbva">BBVA Bancomer</option>
                    <option value="santander">Santander</option>
                    <option value="banorte">Banorte</option>
                    <option value="citibanamex">Citibanamex</option>
                    <option value="hsbc">HSBC</option>
                    <option value="scotiabank">Scotiabank</option>
                  </select>
                  <ChevronRight size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-faint pointer-events-none rotate-90" />
                </div>
              </div>

              <div>
                <label className={LABEL_CLS}>Titular de la cuenta</label>
                <input
                  type="text"
                  placeholder="Nombre completo del titular"
                  className={INPUT_CLS}
                />
              </div>

              <div>
                <label className={LABEL_CLS}>CLABE interbancaria (18 dígitos)</label>
                <input
                  type="text"
                  maxLength={18}
                  placeholder="000000000000000000"
                  className={`${INPUT_CLS} tabular-nums tracking-[0.18em] font-bold`}
                />
              </div>
            </div>

            <div className="p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-[12px] font-medium text-muted leading-relaxed max-w-[220px]">
                La validación de una nueva cuenta toma 24 horas.
              </p>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowAddAccountModal(false)} className="h-14 px-5 rounded-full text-[13px] font-semibold text-muted hover:text-ink v2-press transition-colors">
                  Cancelar
                </button>
                <button type="button" onClick={() => setShowAddAccountModal(false)} className="h-14 px-7 rounded-full bg-ink text-white text-[13px] font-bold v2-press">
                  Guardar cuenta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
