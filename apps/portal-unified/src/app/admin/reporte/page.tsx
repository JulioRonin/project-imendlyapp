"use client";

import { Logo } from '@i-mendly/shared/Logo';
import Link from 'next/link';
import {
  ArrowLeft,
  Printer,
  Download,
  TrendingUp,
  Target,
  ShieldCheck,
  Briefcase,
  PieChart as PieIcon,
  LogOut
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ReportPage() {
  const router = useRouter();
  const handlePrint = () => {
    // Small delay to ensure any dynamic elements are ready
    setTimeout(() => {
      window.print();
    }, 500);
  };
  const handleLogout = () => supabase.auth.signOut().then(() => router.push('/admin'));

  return (
    <main className="min-h-screen bg-linen px-6 py-10 md:px-12 md:py-14 print:p-0">
      {/* Navigation - Hidden on Print */}
      <header className="v3-blur-in max-w-4xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <Link href="/admin" className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-muted hover:text-ink transition-colors group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver al dashboard
        </Link>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleLogout} className="h-12 px-5 rounded-full bg-cream text-error text-[13px] font-bold flex items-center gap-2 v2-shadow-soft v2-press">
            <LogOut size={16} /> Cerrar sesión
          </button>
          <button onClick={handlePrint} className="h-12 px-5 rounded-full bg-cream text-ink text-[13px] font-bold flex items-center gap-2 v2-shadow-soft v2-press">
            <Printer size={16} /> Configurar impresión
          </button>
          <button onClick={handlePrint} className="h-12 px-6 rounded-full bg-ink text-white text-[13px] font-bold flex items-center gap-2 v2-press">
            <Download size={16} /> Generar PDF
          </button>
        </div>
      </header>

      {/* Report Document Container */}
      <div className="v3-blur-in max-w-4xl mx-auto bg-cream rounded-[2.5rem] overflow-hidden mb-20 v2-shadow-float print:shadow-none print:max-w-none print:m-0 print:rounded-none" style={{ animationDelay: '120ms' }}>

        {/* Cover Section */}
        <section className="group h-[480px] relative v3-night-grad text-on-dark flex flex-col justify-end p-10 md:p-16 overflow-hidden">
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/provider_dashboard_hero.png"
              className="w-full h-full object-cover opacity-50 v3-photo"
              alt="Portada del reporte"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/10" />
          </div>

          <div className="relative z-10">
            <Logo size={44} variant="dark" />
            <div className="mt-12">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="inline-flex items-center h-8 px-3.5 rounded-full bg-primary text-ink text-[11px] font-bold">Confidencial</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-dark/50">REP-2026-03-A</span>
              </div>
              <h1 className="text-[52px] md:text-[72px] font-semibold tracking-tight leading-[0.98]">Reporte <br /> ejecutivo</h1>
              <p className="mt-4 text-[17px] font-medium text-on-dark/60">Marzo 2026 · Análisis de crecimiento operativo</p>
            </div>
          </div>
        </section>

        {/* Executive Summary */}
        <section className="py-16 px-8 md:px-16">
          <div className="flex items-center gap-4 mb-10">
            <span className="w-11 h-11 rounded-[1rem] bg-primary-light text-primary-deep flex items-center justify-center"><Target size={20} /></span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">01</p>
              <h2 className="text-[26px] font-semibold tracking-tight text-ink">Resumen ejecutivo</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14">
            <div className="md:col-span-2">
              <p className="text-[18px] leading-relaxed font-medium text-muted">
                El mes de Marzo 2026 ha consolidado la tendencia de crecimiento exponencial proyectada al cierre del Q1.
                Con un GMV total de <strong className="text-ink font-bold tabular-nums">$842,500</strong>, hemos superado el objetivo mensual en un <strong className="text-primary-deep font-bold tabular-nums">12.5%</strong>.
                Este resultado está impulsado principalmente por la alta demanda en servicios de mantenimiento especializado y la optimización de los tiempos de asignación.
              </p>
            </div>
            <div className="bg-sand p-7 rounded-[1.75rem] self-start">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-6">Indicadores de salud</p>
              <div className="divide-y divide-line">
                {[
                  { label: 'Eficiencia escrow', value: '99.5%' },
                  { label: 'Retención', value: '82.0%' },
                  { label: 'Satisfacción NPS', value: '4.8 / 5' },
                ].map(k => (
                  <div key={k.label} className="flex justify-between items-center py-3.5">
                    <span className="text-[13px] font-medium text-muted">{k.label}</span>
                    <span className="text-[18px] font-bold tabular-nums text-ink">{k.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Global Performance Analysis */}
        <section className="py-16 px-8 md:px-16 bg-linen">
          <div className="flex items-center gap-4 mb-10">
            <span className="w-11 h-11 rounded-[1rem] bg-primary-light text-primary-deep flex items-center justify-center"><TrendingUp size={20} /></span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">02</p>
              <h2 className="text-[26px] font-semibold tracking-tight text-ink">Análisis de rendimiento</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
            <div className="relative overflow-hidden v3-night-grad text-on-dark rounded-[1.75rem] p-8 v2-shadow-lift">
              <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-primary/25 blur-3xl" />
              <div className="relative">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-dark/50">GMV total</p>
                <p className="mt-4 text-[44px] font-bold tabular-nums tracking-tight leading-none">$842k</p>
                <span className="mt-5 inline-flex items-center h-8 px-3 rounded-full bg-white/10 text-primary text-[12px] font-bold tabular-nums">+12.5% vs. mes anterior</span>
              </div>
            </div>
            <div className="bg-cream rounded-[1.75rem] p-8 v2-shadow-soft">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Revenue neto</p>
              <p className="mt-4 text-[44px] font-bold tabular-nums tracking-tight text-ink leading-none">$101k</p>
              <p className="mt-5 text-[12.5px] font-semibold text-primary-deep">12% margen promedio</p>
            </div>
            <div className="bg-cream rounded-[1.75rem] p-8 v2-shadow-soft">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">CAC promedio</p>
              <p className="mt-4 text-[44px] font-bold tabular-nums tracking-tight text-ink leading-none">$42.5</p>
              <p className="mt-5 text-[12.5px] font-semibold text-error tabular-nums">+2.1% MoM</p>
            </div>
          </div>

          <div className="mb-12">
            <h3 className="text-[20px] font-semibold tracking-tight text-ink mb-6">Evolución de ingresos</h3>
            <div className="w-full h-80 relative bg-cream rounded-[2rem] flex items-end px-8 md:px-16 pb-12 gap-6 md:gap-10 overflow-hidden v2-shadow-soft">
              {[40, 65, 55, 85, 75, 95].map((val, i) => (
                <div key={i} className="flex-1 h-full flex flex-col items-center justify-end gap-4 group relative">
                  <span className="text-[12px] font-bold tabular-nums text-ink opacity-0 group-hover:opacity-100 transition-opacity">{val}%</span>
                  <div
                    className="w-full max-w-[56px] bg-primary rounded-t-[1rem] transition-colors duration-500 hover:bg-ink"
                    style={{ height: `${val}%` }}
                  />
                  <span className="text-[11px] font-semibold text-faint">Mes {i + 1}</span>
                </div>
              ))}

              <div className="absolute top-8 right-8 text-right">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-deep mb-1">Pico de rendimiento</p>
                <p className="text-[12px] font-medium text-muted">Marzo 2026 · Semana 4</p>
              </div>
            </div>
          </div>

          <p className="text-[16px] font-medium text-muted leading-relaxed max-w-3xl pl-7 border-l-[3px] border-primary">
            “La interpretación de los datos sugiere que la integración de proveedores bajo el esquema Emerald v2.0 ha optimizado el costo de soporte técnico,
            mejorando significativamente el margen de revenue neto y consolidando la visión del Master Plan.”
          </p>
        </section>

        {/* Services & Providers Breakdown */}
        <section className="py-16 px-8 md:px-16 page-break-before">
          <div className="flex items-center gap-4 mb-10">
            <span className="w-11 h-11 rounded-[1rem] bg-primary-light text-primary-deep flex items-center justify-center"><Briefcase size={20} /></span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">03</p>
              <h2 className="text-[26px] font-semibold tracking-tight text-ink">Desglose de operaciones</h2>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-sand rounded-[2rem] p-7 md:p-9">
              <h3 className="text-[18px] font-semibold tracking-tight text-ink mb-5">Performance por categoría</h3>
              <div className="grid grid-cols-4 px-4 pb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-faint">
                <span>Servicio</span>
                <span className="text-center">Volumen</span>
                <span className="text-center">Comisión</span>
                <span className="text-right">Ranking</span>
              </div>
              <div className="divide-y divide-line">
                {[
                  { s: 'Plomería', v: '145', c: '15%', r: '1' },
                  { s: 'Electricidad', v: '122', c: '12%', r: '2' },
                  { s: 'Limpieza', v: '98', c: '18%', r: '3' },
                ].map((item, i) => (
                  <div key={i} className="grid grid-cols-4 items-center px-4 h-14 bg-cream first:rounded-t-[1.1rem] last:rounded-b-[1.1rem]">
                    <span className="text-[14px] font-semibold text-ink">{item.s}</span>
                    <span className="text-[13px] text-center font-medium text-muted tabular-nums">{item.v} servicios</span>
                    <span className="text-center"><span className="inline-flex items-center h-7 px-2.5 rounded-full bg-primary-light text-primary-deep text-[12px] font-bold tabular-nums">{item.c}</span></span>
                    <span className="text-[14px] text-right font-bold tabular-nums text-ink">#{item.r}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-7 bg-cream rounded-[1.75rem] v2-shadow-soft">
                <div className="flex items-center gap-2 mb-3 text-mint-deep">
                  <ShieldCheck size={18} />
                  <h4 className="text-[15px] font-semibold text-ink">Seguridad y escrow</h4>
                </div>
                <p className="text-[13px] font-medium text-muted leading-relaxed mb-4">
                  Cero fallas detectadas en el sistema de retención. El 98.5% de los pagos fueron liberados automáticamente tras la satisfacción del cliente.
                </p>
                <span className="inline-flex items-center h-8 px-3 rounded-full bg-mint-light text-mint-deep text-[12px] font-semibold">Estatus: saludable</span>
              </div>
              <div className="p-7 bg-cream rounded-[1.75rem] v2-shadow-soft">
                <div className="flex items-center gap-2 mb-3 text-primary-deep">
                  <PieIcon size={18} />
                  <h4 className="text-[15px] font-semibold text-ink">Crecimiento de la red</h4>
                </div>
                <p className="text-[13px] font-medium text-muted leading-relaxed mb-4">
                  Se integraron <strong className="font-bold text-ink">42 nuevos proveedores vetados</strong> este mes, con un enfoque del 60% en la zona norte (Cd. Juárez).
                </p>
                <span className="inline-flex items-center h-8 px-3 rounded-full bg-lavender-light text-ink text-[12px] font-semibold tabular-nums">42 onboardings</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-8 md:px-16 py-10 border-t border-line flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink">Generado por I mendly Intelligence</p>
            <p className="mt-1 text-[12px] font-medium text-muted">Software de gestión admin v2.0 · Marzo 2026</p>
          </div>
          <div className="opacity-40">
            <Logo size={24} />
          </div>
        </footer>
      </div>

      <style jsx global>{`
        @media print {
          body { background: white; }
          .print-hidden { display: none !important; }
          .page-break-before { page-break-before: always; }
        }
      `}</style>
    </main>
  );
}
