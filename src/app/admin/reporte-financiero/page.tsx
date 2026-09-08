"use client";

import { Logo } from '@i-mendly/shared/Logo';
import { Card } from '@i-mendly/shared/components/Card';
import { Badge } from '@i-mendly/shared/components/Badge';
import { Button } from '@i-mendly/shared/components/Button';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  TrendingUp, 
  Target, 
  BarChart, 
  ShieldCheck,
  Briefcase,
  PieChart as PieIcon,
  Flag,
  CheckCircle2,
  TrendingDown,
  Info,
  Zap,
  Users,
  AlertCircle,
  LogOut
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FinancialReportPage() {
  const router = useRouter();
  const handlePrint = () => window.print();
  const handleLogout = () => router.push('/role-selection');

  return (
    <main className="min-h-screen bg-white font-urbanist p-8 md:p-16 print:p-0">
      {/* Navigation - Hidden on Print */}
      <header className="max-w-5xl mx-auto mb-16 flex justify-between items-center print:hidden">
        <Link href="/admin/finanzas" className="flex items-center gap-2 text-gray-soft text-sm hover:text-black-rich transition-colors">
          <ArrowLeft size={16} /> Volver a Finanzas
        </Link>
        <div className="flex gap-4">
           <Button variant="outline" onClick={handleLogout} className="gap-2 rounded-pill px-6 text-im-error border-im-error/20 hover:bg-im-error/5">
              <LogOut size={18} /> Cerrar Sesión
           </Button>
           <div className="w-[1px] h-8 bg-black/5 mx-2" />
           <Button variant="secondary" onClick={handlePrint} className="gap-2 rounded-pill px-6">
              <Printer size={18} /> Imprimir Reporte
           </Button>
           <Button variant="primary" onClick={handlePrint} className="gap-2 rounded-pill px-6 bg-black-rich hover:bg-black text-white">
              <Download size={18} /> Descargar PDF
           </Button>
        </div>
      </header>

      {/* Report Document Container */}
      <div className="max-w-5xl mx-auto bg-white print:max-w-none shadow-2xl shadow-black/5 rounded-3xl overflow-hidden mb-20 border-[0.5px] border-black/5">
        {/* Header Section */}
        <section className="bg-black-rich p-16 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full -mr-32 -mt-32" />
           <div className="relative z-10 flex justify-between items-start">
              <div>
                 <Logo size={40} variant="dark" />
                 <div className="mt-12">
                    <Badge variant="silver" className="bg-primary/20 text-primary border-none mb-4 tracking-widest px-4 py-1.5 font-[600]">MARZO 2026</Badge>
                    <h1 className="text-6xl font-[600] tracking-tighter leading-none mb-4 text-white">Reporte de <br />Socios & Q1</h1>
                    <p className="text-xl text-white/40 max-w-md">Análisis de rendimiento financiero alineado con los objetivos del Master Plan v2.0.</p>
                 </div>
              </div>
              <div className="text-right flex flex-col items-end">
                 <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-12">
                    <TrendingUp size={32} className="text-primary" />
                 </div>
                 <p className="text-[10px] uppercase font-[600] tracking-[0.3em] opacity-40">Financial Statement</p>
              </div>
           </div>
        </section>

        {/* GMV vs Master Plan Target */}
        <section className="p-16 space-y-16">
           <div>
              <div className="flex items-center gap-3 mb-10">
                 <Target className="text-primary" size={24} />
                 <h2 className="text-xl font-[600] uppercase tracking-widest text-black-rich">1. GMV vs. Objetivos Master Plan</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                 <div className="space-y-12">
                    <div>
                       <div className="flex justify-between items-end mb-4">
                          <p className="text-sm font-[600] text-gray-500 uppercase tracking-tighter">Progreso Q1 2026</p>
                          <p className="text-3xl font-[600] text-black-rich">92% <span className="text-sm text-gray-400 font-[300]">del objetivo</span></p>
                       </div>
                       <div className="h-4 bg-silver-light/40 rounded-pill overflow-hidden relative">
                          <div className="absolute inset-0 bg-primary/20 animate-pulse" />
                          <div className="h-full bg-primary rounded-pill relative z-10" style={{ width: '92%' }} />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                       <div className="p-8 border border-black/5 rounded-2xl bg-silver-light/10">
                          <p className="text-[10px] uppercase font-[600] text-gray-400 mb-2">Target Marzo</p>
                          <p className="text-3xl font-[600]">$750k</p>
                       </div>
                       <div className="p-8 border border-black/5 rounded-2xl bg-primary/5">
                          <p className="text-[10px] uppercase font-[600] text-primary mb-2">Real Logrado</p>
                          <p className="text-3xl font-[600] text-primary">$842k</p>
                       </div>
                    </div>
                 </div>

                 <div className="bg-black-rich p-10 rounded-3xl text-white relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Flag className="mb-6 text-primary" size={32} />
                    <h3 className="text-lg font-[600] mb-4">Interpretación Estratégica</h3>
                    <p className="text-sm leading-relaxed text-white/60 mb-8 font-[300]">
                       Hemos superado el target mensual en un **12.5%**. Este excedente se atribuye a la adopción temprana del modelo I MENDLY en zonas residenciales premium, 
                       donde el ticket promedio superó las proyecciones en un 8%.
                    </p>
                    <Badge variant="silver" className="bg-white/5 border-white/10 text-white">Meta Q1: $2.4M</Badge>
                 </div>
              </div>
           </div>

           {/* Financial KPI Dashboard for Partners */}
           <div className="pt-16 border-t border-black/5">
              <div className="flex items-center gap-3 mb-12">
                 <Briefcase className="text-primary" size={24} />
                 <h2 className="text-xl font-[600] uppercase tracking-widest text-black-rich">2. Indicadores Clave de Rentabilidad</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                 {[
                   { label: 'Margen de Distribución', val: '12.0%', info: 'Comisiones netas post-procesamiento.', icon: <CheckCircle2 className="text-primary" size={16} /> },
                   { label: 'Estructura de Costes (CAC)', val: '$42.50', info: 'Se mantiene bajo el umbral de $45 estipulado.', icon: <CheckCircle2 className="text-primary" size={16} /> },
                   { label: 'LTV de Proveedor', val: '$18.4k', info: 'Ventas generadas por proveedor activo.', icon: <CheckCircle2 className="text-primary" size={16} /> },
                   { label: 'Ticket Promedio', val: '$1,245', info: 'Aumento del 8% debido a servicios premium.', icon: <TrendingUp className="text-primary" size={16} /> },
                 ].map((kpi, i) => (
                   <Card key={i} variant="default" className="p-8 border-[0.5px] border-black/5 flex flex-col justify-between hover:border-primary/20 transition-colors shadow-none">
                      <div>
                         <div className="flex justify-between items-start mb-4">
                            {kpi.icon}
                            <span className="text-[10px] font-[600] text-gray-soft uppercase">{kpi.label}</span>
                         </div>
                         <p className="text-2xl font-[600] text-black-rich">{kpi.val}</p>
                      </div>
                      <p className="text-[9px] text-gray-soft mt-6 leading-relaxed flex items-start gap-1">
                         <Info size={10} className="mt-0.5 shrink-0" /> {kpi.info}
                      </p>
                   </Card>
                 ))}
              </div>
           </div>

           {/* New Section: Margin Breakdown Deep Dive */}
           <div className="pt-16 border-t border-black/5">
              <div className="flex items-center gap-3 mb-10">
                 <PieIcon className="text-primary" size={24} />
                 <h2 className="text-xl font-[600] uppercase tracking-widest text-black-rich">3. Desglose de Márgenes y Revenue</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                 <div className="p-10 bg-silver-light/10 rounded-3xl border border-black/5 relative overflow-hidden">
                    <div className="relative z-10">
                       <h4 className="text-sm font-[600] text-black-rich mb-8 uppercase tracking-widest">Distribución de Ingresos (Marzo)</h4>
                       <div className="space-y-6">
                          {[
                            { label: 'GMV Total (Ventas Brutas)', val: '$842,500', pct: '100%' },
                            { label: 'Comisiones Totales (15% Avg)', val: '$126,375', pct: '15%' },
                            { label: 'Costo Operativo & Procesamiento', val: '$25,275', pct: '3%' },
                            { label: 'Revenue Neto I MENDLY', val: '$101,100', pct: '12%', highlight: true },
                          ].map((item, i) => (
                            <div key={i} className={`flex justify-between items-end pb-4 border-b border-black/5 ${item.highlight ? 'pt-4' : ''}`}>
                               <div>
                                  <p className={`text-xs ${item.highlight ? 'font-[700] text-black-rich' : 'font-[500] text-gray-soft'}`}>{item.label}</p>
                                  <p className="text-[10px] text-gray-400">{item.pct} del volumen total</p>
                               </div>
                               <p className={`text-lg ${item.highlight ? 'font-[700] text-primary' : 'font-[600] text-black-rich'}`}>{item.val}</p>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
                 <div className="flex flex-col justify-center">
                    <h4 className="text-lg font-[600] text-black-rich mb-6">Análisis de Retención de Margen</h4>
                    <p className="text-sm text-gray-600 leading-relaxed mb-8 font-[300]">
                       La optimización del <strong className="text-black-rich">Revenue Neto ($101k)</strong> se debe a que el 65% de las transacciones se realizaron bajo categorías de alta comisión (Plomería y Cerrajería). 
                       La estructura de costos se mantiene contenida en un 3%, permitiendo una escalabilidad lineal sin incrementar el burn-rate operativo significativamente.
                    </p>
                    <div className="flex items-center gap-4 p-6 bg-primary/5 rounded-2xl border border-primary/10">
                       <ShieldCheck className="text-primary shrink-0" size={24} />
                       <p className="text-xs text-primary font-[500]">El ticket promedio de **$1,245** valida nuestra estrategia de mercado premium.</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* New Section: Strategic Recommendations */}
           <div className="pt-16 border-t border-black/5">
              <div className="flex items-center gap-3 mb-10">
                 <Zap className="text-primary" size={24} />
                 <h2 className="text-xl font-[600] uppercase tracking-widest text-black-rich">4. Recomendaciones Estratégicas</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-6">
                    <div className="p-8 border border-black/5 rounded-2xl group hover:bg-black-rich transition-all duration-500">
                       <h5 className="text-sm font-[600] text-black-rich group-hover:text-white mb-4 flex items-center gap-2">
                          <Users size={18} className="text-primary" /> Expansión de Proveedores
                       </h5>
                       <p className="text-xs leading-relaxed text-gray-500 group-hover:text-white/60 font-[300]">
                          Déficit proyectado del 15% en categorías de Electricidad para el Q2. Se recomienda acelerar el onboarding en la zona **Valle del Sol** para cubrir la demanda vespertina.
                       </p>
                    </div>
                    <div className="p-8 border border-black/5 rounded-2xl group hover:bg-black-rich transition-all duration-500">
                       <h5 className="text-sm font-[600] text-black-rich group-hover:text-white mb-4 flex items-center gap-2">
                          <AlertCircle size={18} className="text-im-warning" /> Gestión de Disputas
                       </h5>
                       <p className="text-xs leading-relaxed text-gray-500 group-hover:text-white/60 font-[300]">
                          El 0.5% de Escrow en disputa se concentra en 'Limpieza Profunda'. Sugerimos implementar una checklist digital obligatoria previa al cierre del servicio para reducir fricciones.
                       </p>
                    </div>
                 </div>
                 <div className="space-y-6">
                    <div className="p-8 border border-black/5 rounded-2xl group hover:bg-black-rich transition-all duration-500">
                       <h5 className="text-sm font-[600] text-black-rich group-hover:text-white mb-4 flex items-center gap-2">
                          <TrendingUp size={18} className="text-primary" /> Presencia en Zona
                       </h5>
                       <p className="text-xs leading-relaxed text-gray-500 group-hover:text-white/60 font-[300]">
                          Baja penetración en **Pradera Dorada** contrastada con alto volumen de búsquedas. Oportunidad para campaña de marketing dirigida a residenciales de esa área.
                       </p>
                    </div>
                    <div className="p-8 bg-black-rich rounded-3xl text-white relative overflow-hidden shadow-xl">
                       <div className="relative z-10">
                          <h5 className="text-sm font-[600] mb-4 flex items-center gap-2">
                             <CheckCircle2 size={18} className="text-primary" /> Próximo Paso Crítico
                          </h5>
                          <p className="text-xs leading-relaxed opacity-60 mb-6 font-[300]">
                             Reactivar el módulo de 'Incentivos a Proveedores' para mantener la retención sobre el 80% durante la temporada alta de verano.
                          </p>
                          <Button variant="ghost" className="w-full border-white/10 text-white hover:bg-primary text-[10px] uppercase font-bold tracking-widest rounded-pill">
                             Revisar Plan de Incentivos
                          </Button>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Executive Analysis Summary */}
           <div className="pt-16 border-t border-black/5 grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="md:col-span-2">
                 <h3 className="text-lg font-[600] text-black-rich mb-6">Nota Financiera para la Junta de Socios</h3>
                 <p className="text-sm leading-relaxed text-gray-600 font-[300]">
                    "La solidez financiera del cierre de Marzo nos coloca en una posición de ventaja competitiva para la expansión a Chihuahua capital en Mayo 2026. 
                    Se recomienda reinvertir el excedente del 12.5% en la optimización del agente IA de soporte para reducir aún más el CAC y mejorar el NPS global. 
                    La estructura de margen es estable y permite escalar la operación sin sacrificar rentabilidad neta."
                 </p>
              </div>
              <div className="p-8 bg-black-rich rounded-2xl flex flex-col justify-center items-center text-center">
                 <p className="text-[9px] uppercase font-[600] text-white/40 mb-4 tracking-widest">Estado Operativo</p>
                 <div className="w-4 h-4 rounded-full bg-primary animate-ping mb-4" />
                 <p className="text-lg font-[600] text-white tracking-tight">Q1 Saludable</p>
              </div>
           </div>
        </section>

        {/* Footer */}
        <footer className="bg-silver-light/20 p-12 border-t border-black/5 flex justify-between items-end">
           <div>
              <p className="text-[10px] font-[700] uppercase tracking-[0.3em] text-black-rich mb-2">I MENDLY FINANCIAL INTELLIGENCE</p>
              <p className="text-[10px] text-gray-soft font-[300]">Generado automáticamente para el equipo directivo · v2.0</p>
           </div>
           <div className="opacity-20">
              <Logo size={24} />
           </div>
        </footer>
      </div>

      <style jsx global>{`
        @media print {
          body { background: white; margin: 0; }
          .print-hidden { display: none !important; }
          main { padding: 0 !important; }
          .shadow-2xl { box-shadow: none !important; }
        }
      `}</style>
    </main>
  );
}
