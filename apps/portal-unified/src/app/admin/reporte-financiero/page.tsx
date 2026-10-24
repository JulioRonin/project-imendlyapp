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
  Flag,
  CheckCircle2,
  Info,
  Zap,
  Users,
  AlertCircle,
  LogOut,
  ArrowUpRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function FinancialReportPage() {
  const router = useRouter();
  const handlePrint = () => window.print();
  const handleLogout = () => supabase.auth.signOut().then(() => router.push('/admin'));

  return (
    <main className="min-h-screen bg-linen px-6 py-10 md:px-12 md:py-14 print:p-0">
      {/* Navigation - Hidden on Print */}
      <header className="v3-blur-in max-w-5xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <Link href="/admin/finanzas" className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-muted hover:text-ink transition-colors group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver a finanzas
        </Link>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleLogout} className="h-12 px-5 rounded-full bg-cream text-error text-[13px] font-bold flex items-center gap-2 v2-shadow-soft v2-press">
            <LogOut size={16} /> Cerrar sesión
          </button>
          <button onClick={handlePrint} className="h-12 px-5 rounded-full bg-cream text-ink text-[13px] font-bold flex items-center gap-2 v2-shadow-soft v2-press">
            <Printer size={16} /> Imprimir reporte
          </button>
          <button onClick={handlePrint} className="h-12 px-6 rounded-full bg-ink text-white text-[13px] font-bold flex items-center gap-2 v2-press">
            <Download size={16} /> Descargar PDF
          </button>
        </div>
      </header>

      {/* Report Document Container */}
      <div className="v3-blur-in max-w-5xl mx-auto bg-cream rounded-[2.5rem] overflow-hidden mb-20 v2-shadow-float print:max-w-none print:shadow-none print:rounded-none" style={{ animationDelay: '120ms' }}>
        {/* Header Section */}
        <section className="relative overflow-hidden v3-night-grad text-on-dark p-10 md:p-16">
          <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <Logo size={40} variant="dark" />
              <div className="mt-12">
                <span className="inline-flex items-center h-8 px-3.5 rounded-full bg-lavender text-ink text-[11px] font-bold mb-5">Marzo 2026</span>
                <h1 className="text-[44px] md:text-[64px] font-semibold tracking-tight leading-[0.98]">Reporte de <br />socios y Q1</h1>
                <p className="mt-4 text-[17px] font-medium text-on-dark/60 max-w-md">Análisis de rendimiento financiero alineado con los objetivos del Master Plan v2.0.</p>
              </div>
            </div>
            <div className="flex flex-col items-start md:items-end">
              <span className="w-16 h-16 rounded-[1.25rem] bg-white/10 text-primary flex items-center justify-center mb-10">
                <TrendingUp size={28} />
              </span>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-dark/50">Estado financiero</p>
            </div>
          </div>
        </section>

        {/* GMV vs Master Plan Target */}
        <section className="p-8 md:p-16 space-y-16">
          <div>
            <div className="flex items-center gap-4 mb-10">
              <span className="w-11 h-11 rounded-[1rem] bg-primary-light text-primary-deep flex items-center justify-center"><Target size={20} /></span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">01</p>
                <h2 className="text-[24px] font-semibold tracking-tight text-ink">GMV vs. objetivos del Master Plan</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
              <div className="space-y-10">
                <div>
                  <div className="flex justify-between items-end mb-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Progreso Q1 2026</p>
                    <p className="text-[32px] font-bold tabular-nums tracking-tight text-ink leading-none">92% <span className="text-[13px] font-medium text-muted">del objetivo</span></p>
                  </div>
                  <div className="h-3 bg-sand rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 rounded-[1.5rem] bg-sand">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-2">Target marzo</p>
                    <p className="text-[30px] font-bold tabular-nums tracking-tight text-ink leading-none">$750k</p>
                  </div>
                  <div className="p-6 rounded-[1.5rem] bg-primary-light">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-deep mb-2">Real logrado</p>
                    <p className="text-[30px] font-bold tabular-nums tracking-tight text-primary-deep leading-none">$842k</p>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden v3-night-grad text-on-dark p-9 rounded-[2rem] v2-shadow-lift">
                <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-lavender/20 blur-3xl" />
                <div className="relative">
                  <span className="w-11 h-11 rounded-[1rem] bg-white/10 text-primary flex items-center justify-center mb-6"><Flag size={20} /></span>
                  <h3 className="text-[20px] font-semibold tracking-tight">Interpretación estratégica</h3>
                  <p className="mt-3 text-[14px] font-medium leading-relaxed text-on-dark/60">
                    Hemos superado el target mensual en un <strong className="font-bold text-on-dark tabular-nums">12.5%</strong>. Este excedente se atribuye a la adopción temprana del modelo I mendly en zonas residenciales premium,
                    donde el ticket promedio superó las proyecciones en un 8%.
                  </p>
                  <span className="mt-6 inline-flex items-center h-8 px-3 rounded-full bg-white/10 text-on-dark text-[12px] font-bold tabular-nums">Meta Q1: $2.4M</span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial KPI Dashboard for Partners */}
          <div className="pt-14 border-t border-line">
            <div className="flex items-center gap-4 mb-10">
              <span className="w-11 h-11 rounded-[1rem] bg-primary-light text-primary-deep flex items-center justify-center"><Briefcase size={20} /></span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">02</p>
                <h2 className="text-[24px] font-semibold tracking-tight text-ink">Indicadores clave de rentabilidad</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Margen de distribución', val: '12.0%', info: 'Comisiones netas post-procesamiento.', icon: <CheckCircle2 size={16} /> },
                { label: 'Estructura de costes (CAC)', val: '$42.50', info: 'Se mantiene bajo el umbral de $45 estipulado.', icon: <CheckCircle2 size={16} /> },
                { label: 'LTV de proveedor', val: '$18.4k', info: 'Ventas generadas por proveedor activo.', icon: <CheckCircle2 size={16} /> },
                { label: 'Ticket promedio', val: '$1,245', info: 'Aumento del 8% debido a servicios premium.', icon: <TrendingUp size={16} /> },
              ].map((kpi, i) => (
                <div key={i} className="p-6 rounded-[1.75rem] bg-sand flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-3 mb-4">
                      <span className="w-9 h-9 shrink-0 rounded-[0.8rem] bg-cream text-primary-deep flex items-center justify-center">{kpi.icon}</span>
                      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted text-right">{kpi.label}</span>
                    </div>
                    <p className="text-[30px] font-bold tabular-nums tracking-tight text-ink leading-none">{kpi.val}</p>
                  </div>
                  <p className="text-[12px] font-medium text-muted mt-5 leading-relaxed flex items-start gap-1.5">
                    <Info size={12} className="mt-0.5 shrink-0 text-faint" /> {kpi.info}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Margin Breakdown Deep Dive */}
          <div className="pt-14 border-t border-line">
            <div className="flex items-center gap-4 mb-10">
              <span className="w-11 h-11 rounded-[1rem] bg-primary-light text-primary-deep flex items-center justify-center"><PieIcon size={20} /></span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">03</p>
                <h2 className="text-[24px] font-semibold tracking-tight text-ink">Desglose de márgenes y revenue</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="p-7 md:p-9 bg-sand rounded-[2rem]">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-6">Distribución de ingresos (marzo)</p>
                <div className="divide-y divide-line">
                  {[
                    { label: 'GMV total (ventas brutas)', val: '$842,500', pct: '100%' },
                    { label: 'Comisiones totales (15% avg)', val: '$126,375', pct: '15%' },
                    { label: 'Costo operativo y procesamiento', val: '$25,275', pct: '3%' },
                    { label: 'Revenue neto I mendly', val: '$101,100', pct: '12%', highlight: true },
                  ].map((item, i) => (
                    <div key={i} className={`flex justify-between items-end py-4 ${item.highlight ? 'pt-6' : ''}`}>
                      <div>
                        <p className={`text-[14px] ${item.highlight ? 'font-bold text-ink' : 'font-medium text-muted'}`}>{item.label}</p>
                        <p className="text-[12px] font-medium text-faint tabular-nums">{item.pct} del volumen total</p>
                      </div>
                      <p className={`font-bold tabular-nums tracking-tight ${item.highlight ? 'text-[26px] text-primary-deep' : 'text-[18px] text-ink'}`}>{item.val}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="text-[20px] font-semibold tracking-tight text-ink mb-4">Análisis de retención de margen</h4>
                <p className="text-[14px] font-medium text-muted leading-relaxed mb-7">
                  La optimización del <strong className="text-ink font-bold">revenue neto ($101k)</strong> se debe a que el 65% de las transacciones se realizaron bajo categorías de alta comisión (Plomería y Cerrajería).
                  La estructura de costos se mantiene contenida en un 3%, permitiendo una escalabilidad lineal sin incrementar el burn-rate operativo significativamente.
                </p>
                <div className="flex items-center gap-4 p-5 bg-mint-light rounded-[1.5rem]">
                  <ShieldCheck className="text-mint-deep shrink-0" size={22} />
                  <p className="text-[13px] font-medium text-mint-deep">El ticket promedio de <strong className="font-bold tabular-nums">$1,245</strong> valida nuestra estrategia de mercado premium.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Strategic Recommendations */}
          <div className="pt-14 border-t border-line">
            <div className="flex items-center gap-4 mb-10">
              <span className="w-11 h-11 rounded-[1rem] bg-primary-light text-primary-deep flex items-center justify-center"><Zap size={20} /></span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">04</p>
                <h2 className="text-[24px] font-semibold tracking-tight text-ink">Recomendaciones estratégicas</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="p-7 bg-sand rounded-[1.75rem]">
                  <h5 className="text-[15px] font-semibold text-ink mb-3 flex items-center gap-2">
                    <Users size={17} className="text-primary-deep" /> Expansión de proveedores
                  </h5>
                  <p className="text-[13px] font-medium leading-relaxed text-muted">
                    Déficit proyectado del 15% en categorías de Electricidad para el Q2. Se recomienda acelerar el onboarding en la zona <strong className="font-bold text-ink">Valle del Sol</strong> para cubrir la demanda vespertina.
                  </p>
                </div>
                <div className="p-7 bg-sand rounded-[1.75rem]">
                  <h5 className="text-[15px] font-semibold text-ink mb-3 flex items-center gap-2">
                    <AlertCircle size={17} className="text-error" /> Gestión de disputas
                  </h5>
                  <p className="text-[13px] font-medium leading-relaxed text-muted">
                    El 0.5% de escrow en disputa se concentra en Limpieza Profunda. Sugerimos implementar una checklist digital obligatoria previa al cierre del servicio para reducir fricciones.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-7 bg-sand rounded-[1.75rem]">
                  <h5 className="text-[15px] font-semibold text-ink mb-3 flex items-center gap-2">
                    <TrendingUp size={17} className="text-primary-deep" /> Presencia en zona
                  </h5>
                  <p className="text-[13px] font-medium leading-relaxed text-muted">
                    Baja penetración en <strong className="font-bold text-ink">Pradera Dorada</strong> contrastada con alto volumen de búsquedas. Oportunidad para campaña de marketing dirigida a residenciales de esa área.
                  </p>
                </div>
                <div className="relative overflow-hidden p-7 bg-ink text-on-dark rounded-[1.75rem] v2-shadow-lift">
                  <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-primary/25 blur-3xl" />
                  <div className="relative">
                    <h5 className="text-[15px] font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle2 size={17} className="text-primary" /> Próximo paso crítico
                    </h5>
                    <p className="text-[13px] font-medium leading-relaxed text-on-dark/60 mb-6">
                      Reactivar el módulo de Incentivos a Proveedores para mantener la retención sobre el 80% durante la temporada alta de verano.
                    </p>
                    <button className="w-full h-12 rounded-full bg-white text-ink text-[13px] font-bold flex items-center justify-center gap-2 v2-press">
                      Revisar plan de incentivos <ArrowUpRight size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Executive Analysis Summary */}
          <div className="pt-14 border-t border-line grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-[20px] font-semibold tracking-tight text-ink mb-4">Nota financiera para la junta de socios</h3>
              <p className="text-[14px] font-medium leading-relaxed text-muted">
                “La solidez financiera del cierre de Marzo nos coloca en una posición de ventaja competitiva para la expansión a Chihuahua capital en Mayo 2026.
                Se recomienda reinvertir el excedente del 12.5% en la optimización del agente IA de soporte para reducir aún más el CAC y mejorar el NPS global.
                La estructura de margen es estable y permite escalar la operación sin sacrificar rentabilidad neta.”
              </p>
            </div>
            <div className="p-7 bg-mint-light rounded-[1.75rem] flex flex-col justify-center items-center text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-mint-deep mb-4">Estado operativo</p>
              <span className="relative w-4 h-4 mb-4">
                <span className="absolute inset-0 rounded-full bg-mint animate-ping" />
                <span className="absolute inset-0 rounded-full bg-mint" />
              </span>
              <p className="text-[18px] font-semibold tracking-tight text-ink">Q1 saludable</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-sand px-8 md:px-16 py-10 flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink mb-1">I mendly Financial Intelligence</p>
            <p className="text-[12px] font-medium text-muted">Generado automáticamente para el equipo directivo · v2.0</p>
          </div>
          <div className="opacity-40">
            <Logo size={24} />
          </div>
        </footer>
      </div>

      <style jsx global>{`
        @media print {
          body { background: white; margin: 0; }
          .print-hidden { display: none !important; }
          main { padding: 0 !important; }
          .v2-shadow-float { box-shadow: none !important; }
        }
      `}</style>
    </main>
  );
}
