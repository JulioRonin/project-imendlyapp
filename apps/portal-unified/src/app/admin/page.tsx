"use client";

import Link from 'next/link';
import {
  Users,
  AlertCircle,
  BarChart3,
  UserPlus,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  DollarSign,
  Star,
  FileText
} from 'lucide-react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';

/** Iniciales sobre arcilla profunda cuando no hay foto. */
function Initials({ name, className = '' }: { name: string; className?: string }) {
  const initials = name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'IM';
  return (
    <span className={`shrink-0 rounded-[1rem] bg-clay-deep text-white flex items-center justify-center font-semibold ${className}`}>
      {initials}
    </span>
  );
}

export default function AdminDashboard() {
  const stats = [
    { label: 'GMV del Mes', value: '$842,500', icon: <DollarSign size={20} />, growth: '+12.5%', trend: 'up' },
    { label: 'Revenue Mensual', value: '$101,100', icon: <BarChart3 size={20} />, growth: '+8.2%', trend: 'up' },
    { label: 'Clientes Activos', value: '1,240', icon: <Users size={20} />, growth: '+4.1%', trend: 'up' },
    { label: 'Proveedores Activos', value: '458', icon: <UserPlus size={20} />, growth: '+6.8%', trend: 'up' },
  ];

  const topServices = [
    { name: 'Plomería Integral', sales: 145, growth: 12 },
    { name: 'Electricista Certificado', sales: 122, growth: 8 },
    { name: 'Limpieza Profunda', sales: 98, growth: 15 },
    { name: 'Pintura Fachadas', sales: 85, growth: -2 },
    { name: 'Soporte Técnico', sales: 64, growth: 5 },
  ];

  const topProviders = [
    { name: 'Juan Pérez', rating: 4.9, services: 82 },
    { name: 'María Garcia', rating: 5.0, services: 75 },
    { name: 'Roberto Solis', rating: 4.8, services: 64 },
    { name: 'Lucía Méndez', rating: 4.9, services: 58 },
    { name: 'Armando Casas', rating: 4.7, services: 52 },
  ];
  return (
    <main className="min-h-screen bg-linen flex">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-14">
          {/* ── Cabecera editorial ── */}
          <header className="v3-blur-in flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-deep mb-2">Operación I mendly</p>
              <h1 className="text-[36px] md:text-[44px] font-semibold tracking-tight leading-[1.02] text-ink">Resumen de operación</h1>
              <div className="mt-3 flex items-center gap-2 text-[14px] font-medium text-muted">
                <span>Insights del mes de</span>
                <select className="h-9 px-3 rounded-full bg-sand text-ink text-[13px] font-semibold outline-none focus:ring-2 focus:ring-lavender/60 cursor-pointer">
                  <option>Marzo 2026</option>
                  <option>Febrero 2026</option>
                  <option>Enero 2026</option>
                  <option>Diciembre 2025</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link href="/admin/reporte" className="h-14 px-6 rounded-full bg-cream text-ink text-[13px] font-bold flex items-center gap-2 v2-shadow-soft v2-press">
                <FileText size={16} /> Exportar reporte
              </Link>
              <Link href="/admin/master-plan" className="h-14 px-6 rounded-full bg-ink text-white text-[13px] font-bold flex items-center gap-2 v2-press">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Launch 2026 <ArrowUpRight size={16} />
              </Link>
            </div>
          </header>

          {/* ── Métricas ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mt-10">
            {stats.map((s, i) => (
              <div key={i} className={`v2-rise v2-d${i + 1} bg-cream rounded-[1.75rem] p-6 v2-shadow-soft v2-float`}>
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-[0.9rem] bg-primary-light text-primary-deep flex items-center justify-center">
                    {s.icon}
                  </span>
                  <span className={`inline-flex items-center gap-1 text-[12px] font-bold tabular-nums ${s.trend === 'up' ? 'text-primary-deep' : 'text-error'}`}>
                    {s.trend === 'up' ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                    {s.growth}
                  </span>
                </div>
                <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">{s.label}</p>
                <p className="mt-2 text-[30px] font-bold tabular-nums tracking-tight text-ink leading-none">{s.value}</p>
              </div>
            ))}
            {/* Servicios activos: tarjeta nocturna */}
            <div className="v2-rise v2-d5 relative overflow-hidden v3-night-grad text-on-dark rounded-[1.75rem] p-6 v2-shadow-lift">
              <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-primary/25 blur-3xl" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-[0.9rem] bg-white/10 text-primary flex items-center justify-center">
                    <Zap size={18} />
                  </span>
                  <span className="inline-flex items-center gap-1 text-[12px] font-bold tabular-nums text-primary">
                    <ArrowUpRight size={13} /> +15.2%
                  </span>
                </div>
                <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-on-dark/50">Servicios Activos</p>
                <p className="mt-2 text-[30px] font-bold tabular-nums tracking-tight leading-none">342</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-12">
            {/* ── Servicios con mayor demanda ── */}
            <section className="v2-rise v2-d3 lg:col-span-2 bg-cream rounded-[2.25rem] p-7 md:p-8 v2-shadow-soft">
              <div className="flex items-center justify-between gap-4 mb-8">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-1">Demanda</p>
                  <h2 className="text-[22px] font-semibold tracking-tight text-ink">Servicios con mayor demanda</h2>
                </div>
                <span className="inline-flex items-center h-9 px-3.5 rounded-full bg-lavender-light text-ink text-[12px] font-semibold">Top 5</span>
              </div>
              <div className="space-y-6">
                {topServices.map((service, i) => (
                  <div key={i} className={`v2-rise v2-d${Math.min(i + 3, 8)} space-y-2.5`}>
                    <div className="flex justify-between items-end gap-4">
                      <span className="text-[15px] font-semibold text-ink">{service.name}</span>
                      <span className="text-[13px] font-medium text-muted tabular-nums">
                        <span className="font-bold text-ink">{service.sales}</span> ventas ·{' '}
                        <span className={`font-bold ${service.growth > 0 ? 'text-primary-deep' : 'text-error'}`}>
                          {service.growth > 0 ? '+' : ''}{service.growth}%
                        </span>
                      </span>
                    </div>
                    <div className="h-2 bg-sand rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-1000 delay-200"
                        style={{ width: `${(service.sales / topServices[0].sales) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Proveedores estrella ── */}
            <section className="v2-rise v2-d4 bg-cream rounded-[2.25rem] p-7 md:p-8 v2-shadow-soft flex flex-col">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-1">Talento</p>
              <h2 className="text-[22px] font-semibold tracking-tight text-ink mb-6">Proveedores estrella</h2>
              <div className="space-y-2">
                {topProviders.map((p, i) => (
                  <div key={i} className={`v2-rise v2-d${Math.min(i + 4, 8)} flex items-center gap-3 p-3 rounded-[1.25rem] hover:bg-sand/60 transition-colors`}>
                    <Initials name={p.name} className="w-11 h-11 text-[13px]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-ink truncate">{p.name}</p>
                      <p className="text-[12px] font-medium text-muted"><span className="tabular-nums">{p.services}</span> servicios completados</p>
                    </div>
                    <span className="inline-flex items-center gap-1 h-8 px-2.5 rounded-full bg-sand text-ink text-[12.5px] font-bold tabular-nums">
                      <Star size={12} className="text-primary-deep fill-primary" /> {p.rating.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
              <Link href="/admin/professionals" className="mt-6 w-full h-12 rounded-full bg-sand text-ink text-[13px] font-bold flex items-center justify-center gap-2 v2-press">
                Ver todos los proveedores <ArrowUpRight size={15} />
              </Link>
            </section>

            {/* ── Alerta de disputas ── */}
            <section className="v2-rise v2-d5 lg:col-span-3 bg-cream rounded-[2.25rem] p-7 md:p-8 v2-shadow-soft">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-5">
                  <span className="w-14 h-14 shrink-0 rounded-[1.15rem] bg-rose/20 text-error flex items-center justify-center">
                    <AlertCircle size={24} />
                  </span>
                  <div className="max-w-xl">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-error mb-1">Atención</p>
                    <h2 className="text-[22px] font-semibold tracking-tight text-ink">3 disputas activas</h2>
                    <p className="mt-2 text-[14px] font-medium text-muted leading-relaxed">
                      Hay transacciones que requieren mediación inmediata para garantizar la seguridad del escrow.
                      Una de ellas está marcada como <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-rose/20 text-error text-[11px] font-bold align-middle">Crítica</span>.
                    </p>
                  </div>
                </div>
                <Link href="/admin/disputas" className="shrink-0 h-14 px-7 rounded-full bg-ink text-white text-[13px] font-bold flex items-center gap-2 v2-press">
                  Gestionar disputas <ArrowUpRight size={16} />
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
