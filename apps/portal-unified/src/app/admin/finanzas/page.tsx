"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  Zap,
  DollarSign,
  PieChart,
  Calendar,
  FileText,
  ArrowUpRight
} from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

const CATEGORY_PERFORMANCE = [
  { name: 'Plomería', sales: '$240,000', commission: '15%', revenue: '$36,000' },
  { name: 'Electricidad', sales: '$180,000', commission: '12%', revenue: '$21,600' },
  { name: 'Limpieza', sales: '$120,000', commission: '18%', revenue: '$21,600' },
  { name: 'Cerrajería', sales: '$85,000', commission: '14%', revenue: '$11,900' },
  { name: 'Pintura', sales: '$72,000', commission: '10%', revenue: '$7,200' },
];

const categories = [
  { name: 'Plomería', sales: '$245,000', volume: 145, commission: '15%', revenue: '$36,750' },
  { name: 'Electricidad', sales: '$182,000', volume: 122, commission: '12%', revenue: '$21,840' },
  { name: 'Limpieza', sales: '$112,000', volume: 98, commission: '18%', revenue: '$20,160' },
  { name: 'Pintura', sales: '$95,000', volume: 85, commission: '15%', revenue: '$14,250' },
  { name: 'Cerrajería', sales: '$72,000', volume: 54, commission: '20%', revenue: '$14,400' },
];

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<'ventas' | 'volumen'>('ventas');
  const [selectedMonth, setSelectedMonth] = useState('Marzo 2026');

  return (
    <main className="min-h-screen bg-linen flex">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-14">
          {/* ── Cabecera editorial ── */}
          <header className="v3-blur-in flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-deep mb-2">Finanzas</p>
              <h1 className="text-[36px] md:text-[44px] font-semibold tracking-tight leading-[1.02] text-ink">Finanzas y comisiones</h1>
              <p className="mt-2 text-[14px] font-medium text-muted max-w-lg">Consolidado mensual de ventas, retenciones y revenue por categoría.</p>
            </div>
            <div className="flex flex-wrap gap-2 items-center shrink-0">
              <div className="relative group">
                <button className="h-14 px-5 rounded-full bg-cream text-ink text-[13px] font-bold flex items-center gap-2 v2-shadow-soft v2-press">
                  <Calendar size={16} className="text-primary-deep" />
                  {selectedMonth}
                </button>
                {/* Simulated dropdown */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-cream rounded-[1.25rem] v2-shadow-float opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-50 overflow-hidden p-1.5">
                  {['Marzo 2026', 'Febrero 2026', 'Enero 2026'].map(m => (
                    <button key={m} onClick={() => setSelectedMonth(m)} className={`w-full text-left px-4 h-10 rounded-[0.9rem] text-[13px] font-semibold transition-colors ${selectedMonth === m ? 'bg-lavender-light text-ink' : 'text-muted hover:bg-sand hover:text-ink'}`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <Link href="/admin/reporte-financiero" className="h-14 px-6 rounded-full bg-ink text-white text-[13px] font-bold flex items-center gap-2 v2-press">
                <FileText size={16} /> Generar reporte
              </Link>
            </div>
          </header>

          {/* ── KPIs ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
            <div className="v2-rise v2-d1 relative overflow-hidden v3-night-grad text-on-dark rounded-[2rem] p-7 md:p-8 v2-shadow-lift">
              <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-primary/25 blur-3xl" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-dark/50">Total ventas (GMV)</p>
                  <span className="w-10 h-10 rounded-[0.9rem] bg-white/10 text-primary flex items-center justify-center">
                    <DollarSign size={18} />
                  </span>
                </div>
                <p className="mt-6 text-[44px] font-bold tabular-nums tracking-tight leading-none">$842,500</p>
                <span className="mt-5 inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-white/10 text-primary text-[12px] font-bold tabular-nums">
                  <ArrowUpRight size={13} /> +12.5% crecimiento mensual
                </span>
              </div>
            </div>

            <div className="v2-rise v2-d2 bg-cream rounded-[2rem] p-7 md:p-8 v2-shadow-soft v2-float">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Comisiones netas</p>
                <span className="w-10 h-10 rounded-[0.9rem] bg-primary-light text-primary-deep flex items-center justify-center">
                  <PieChart size={18} />
                </span>
              </div>
              <p className="mt-6 text-[40px] font-bold tabular-nums tracking-tight text-ink leading-none">$101,100</p>
              <p className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-primary-deep">
                <Zap size={13} /> 12% margen promedio
              </p>
            </div>

            <div className="v2-rise v2-d3 bg-cream rounded-[2rem] p-7 md:p-8 v2-shadow-soft v2-float">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">En disputas (escrow)</p>
                <span className="w-10 h-10 rounded-[0.9rem] bg-rose/20 text-error flex items-center justify-center">
                  <AlertCircle size={18} />
                </span>
              </div>
              <p className="mt-6 text-[40px] font-bold tabular-nums tracking-tight text-ink leading-none">$4,450</p>
              <p className="mt-5 text-[12.5px] font-medium text-muted">0.5% del volumen total</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-12">
            {/* ── Rendimiento por categoría ── */}
            <section className="v2-rise v2-d3 lg:col-span-2 bg-cream rounded-[2.25rem] p-7 md:p-8 v2-shadow-soft">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-1">Desglose</p>
                  <h2 className="text-[22px] font-semibold tracking-tight text-ink">Rendimiento por categoría</h2>
                </div>
                {/* Tabs subrayadas */}
                <div className="flex gap-6">
                  {([['ventas', 'Ventas'], ['volumen', 'Volumen']] as const).map(([key, label]) => {
                    const active = activeTab === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`relative pb-2 text-[14px] transition-colors duration-300 ${active ? 'font-semibold text-ink' : 'font-medium text-faint hover:text-muted'}`}
                      >
                        {label}
                        <span className={`absolute left-0 right-0 -bottom-px h-[3px] rounded-full bg-lavender transition-transform duration-500 origin-left ${active ? 'scale-x-100' : 'scale-x-0'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="grid grid-cols-4 px-5 pb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-faint">
                  <span>Categoría</span>
                  <span className="text-center">{activeTab === 'ventas' ? 'Ventas totales' : 'Solicitudes'}</span>
                  <span className="text-center">Comisión</span>
                  <span className="text-right">Monto</span>
                </div>
                <div className="divide-y divide-line">
                  {categories.map((cat, i) => (
                    <div key={i} className={`v2-rise v2-d${Math.min(i + 3, 8)} grid grid-cols-4 items-center px-5 h-16 hover:bg-sand/60 rounded-[1.1rem] transition-colors`}>
                      <span className="text-[14px] font-semibold text-ink">{cat.name}</span>
                      <span className="text-[14px] text-center font-medium text-muted tabular-nums">{activeTab === 'ventas' ? cat.sales : `${cat.volume} serv.`}</span>
                      <span className="text-center">
                        <span className="inline-flex items-center h-7 px-2.5 rounded-full bg-primary-light text-primary-deep text-[12px] font-bold tabular-nums">{cat.commission}</span>
                      </span>
                      <span className="text-[15px] text-right font-bold tabular-nums text-ink">{cat.revenue}</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-4 items-center px-5 pt-5 mt-2 border-t border-line">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Total</span>
                  <span className="text-center text-[16px] font-bold tabular-nums text-ink">
                    {activeTab === 'ventas'
                      ? `$${categories.reduce((acc, cat) => acc + parseInt(cat.sales.replace(/[^0-9]/g, '')), 0).toLocaleString()}`
                      : `${categories.reduce((acc, cat) => acc + cat.volume, 0)} serv.`}
                  </span>
                  <span className="text-center text-[13px] font-medium text-faint">—</span>
                  <span className="text-right text-[18px] font-bold tabular-nums text-primary-deep">
                    {`$${categories.reduce((acc, cat) => acc + parseInt(cat.revenue.replace(/[^0-9]/g, '')), 0).toLocaleString()}`}
                  </span>
                </div>
              </div>
            </section>

            {/* ── Columna lateral ── */}
            <aside className="space-y-5">
              <div className="v2-rise v2-d4 bg-cream rounded-[2.25rem] p-7 md:p-8 v2-shadow-soft">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-1">Margen</p>
                <h2 className="text-[20px] font-semibold tracking-tight text-ink">Estructura de margen</h2>
                <p className="mt-2 text-[13px] font-medium text-muted leading-relaxed">
                  Distribución de ingresos operativos por tipo de retención aplicada.
                </p>
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="flex items-center gap-2 font-medium text-muted"><span className="w-2.5 h-2.5 rounded-full bg-primary" /> Transaccional (10%)</span>
                    <span className="font-bold tabular-nums text-ink">$62,400</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="flex items-center gap-2 font-medium text-muted"><span className="w-2.5 h-2.5 rounded-full bg-ink" /> Premium Ads (5%)</span>
                    <span className="font-bold tabular-nums text-ink">$28,150</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="flex items-center gap-2 font-medium text-muted"><span className="w-2.5 h-2.5 rounded-full bg-rose" /> Penalizaciones (2%)</span>
                    <span className="font-bold tabular-nums text-ink">$10,550</span>
                  </div>
                </div>
                <div className="h-3 w-full bg-sand rounded-full mt-7 flex overflow-hidden gap-0.5">
                  <div className="h-full bg-primary rounded-full" style={{ width: '60%' }} />
                  <div className="h-full bg-ink rounded-full" style={{ width: '25%' }} />
                  <div className="h-full bg-rose rounded-full" style={{ width: '15%' }} />
                </div>
              </div>

              <div className="v2-rise v2-d5 bg-cream rounded-[2.25rem] p-7 v2-shadow-soft">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-1">Nota fiscal</p>
                <h3 className="text-[16px] font-semibold text-ink">Montos antes de IVA</h3>
                <p className="mt-2 text-[13px] font-medium text-muted leading-relaxed">
                  Las facturas de comisiones se generan automáticamente al final de cada ciclo de pago.
                </p>
                <button className="mt-5 h-11 px-5 rounded-full bg-sand text-ink text-[12.5px] font-bold flex items-center gap-2 v2-press">
                  Configurar facturación <ArrowUpRight size={14} />
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
