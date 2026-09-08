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
  LogOut
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ReportPage() {
  const router = useRouter();
  const handlePrint = () => {
    // Small delay to ensure any dynamic elements are ready
    setTimeout(() => {
      window.print();
    }, 500);
  };
  const handleLogout = () => router.push('/role-selection');

  return (
    <main className="min-h-screen bg-silver font-urbanist p-8 md:p-12 print:p-0">
      {/* Navigation - Hidden on Print */}
      <header className="max-w-4xl mx-auto mb-12 flex justify-between items-center print:hidden">
        <Link href="/admin" className="flex items-center gap-2 text-gray-soft text-sm hover:text-black-rich transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Volver al Dashboard
        </Link>
        <div className="flex gap-4">
           <Button variant="outline" onClick={handleLogout} className="gap-2 rounded-pill px-6 text-im-error border-im-error/20 hover:bg-im-error/5 group">
              <LogOut size={18} className="group-hover:rotate-12 transition-transform" /> Cerrar Sesión
           </Button>
           <div className="w-[1px] h-8 bg-black/5 mx-2" />
           <Button variant="secondary" onClick={handlePrint} className="gap-2 rounded-pill px-6 border border-black/5 hover:bg-white shadow-sm">
              <Printer size={18} /> Configurar Impresión
           </Button>
           <Button variant="primary" onClick={handlePrint} className="gap-3 rounded-pill px-8 bg-black-rich hover:bg-black text-white shadow-xl group">
              <Download size={18} className="group-hover:translate-y-0.5 transition-transform" /> Generar PDF Profesional
           </Button>
        </div>
      </header>

      {/* Report Document Container */}
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden mb-20 border border-black/5 print:shadow-none print:max-w-none print:m-0">
        
        {/* Cover Section */}
        <section className="h-[480px] relative bg-black-rich flex flex-col justify-end p-16 text-white overflow-hidden border-b border-black/10">
           <div className="absolute inset-0 z-0">
             <img 
               src="/images/report_bg.png" 
               className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
               alt="Report Cover"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black-rich via-black-rich/60 to-transparent" />
           </div>
           
           <div className="relative z-10">
              <Logo size={48} variant="dark" />
              <div className="mt-12 space-y-4">
                 <div className="flex items-center gap-3">
                    <Badge variant="silver" className="bg-primary text-white border-none px-4 py-1 text-[10px] font-bold tracking-widest uppercase">Confidencial</Badge>
                    <span className="text-[10px] text-white/40 uppercase tracking-[0.2em]">ID: REP-2026-03-A</span>
                 </div>
                 <h1 className="text-7xl font-[600] tracking-tighter leading-none mb-2">Reporte <br /> Ejecutivo</h1>
                 <p className="text-xl text-white/40 font-[300]">Marzo 2026 · Análisis de Crecimiento Operativo</p>
              </div>
           </div>
        </section>

        {/* Executive Summary */}
        <section className="py-20 px-16">
           <div className="flex items-center gap-3 mb-10 pb-6 border-b border-black/5">
              <Target className="text-primary" size={28} />
              <h2 className="text-2xl font-[600] uppercase tracking-widest text-black-rich">1. Resumen Ejecutivo</h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="md:col-span-2">
                <p className="text-xl leading-relaxed text-gray-700 font-[300]">
                   El mes de Marzo 2026 ha consolidado la tendencia de crecimiento exponencial proyectada al cierre del Q1. 
                   Con un GMV total de <strong className="text-black-rich font-[600]">$842,500</strong>, hemos superado el objetivo mensual en un <strong className="text-primary font-[600]">12.5%</strong>. 
                   Este resultado está impulsado principalmente por la alta demanda en servicios de mantenimiento especializado y la optimización de los tiempos de asignación.
                </p>
              </div>
              <div className="bg-silver-light/20 p-8 rounded-2xl border border-black/5 self-start shadow-sm">
                 <p className="text-[10px] font-bold mb-8 text-black-rich uppercase tracking-widest text-center">Indicadores de Salud</p>
                 <div className="space-y-8">
                    <div className="flex justify-between items-center pb-2 border-b border-black/5">
                       <span className="text-[11px] text-gray-500 uppercase tracking-tighter">Eficiencia Escrow</span>
                       <span className="text-lg font-[600] text-primary">99.5%</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-black/5">
                       <span className="text-[11px] text-gray-500 uppercase tracking-tighter">Retención</span>
                       <span className="text-lg font-[600] text-primary">82.0%</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[11px] text-gray-500 uppercase tracking-tighter">Satisfacción NPS</span>
                       <span className="text-lg font-[600] text-primary">4.8 / 5</span>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Global Performance Analysis */}
        <section className="py-20 px-16 bg-silver-light/10">
           <div className="flex items-center gap-3 mb-12 pb-6 border-b border-black/5">
              <TrendingUp className="text-primary" size={28} />
              <h2 className="text-2xl font-[600] uppercase tracking-widest text-black-rich">2. Análisis de Rendimiento</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              <Card variant="dark" className="p-12 border-none bg-black-rich text-white shadow-xl flex flex-col items-center justify-center text-center">
                 <p className="text-[10px] uppercase font-[600] opacity-40 mb-4 tracking-[0.2em]">GMV TOTAL</p>
                 <p className="text-5xl font-[600] tracking-tighter mb-4">$842k</p>
                 <Badge variant="silver" className="bg-primary/20 text-primary border-none text-[10px] font-bold">+12.5% VS LAST MONTH</Badge>
              </Card>
              <Card variant="default" className="p-12 border-none bg-white shadow-none flex flex-col items-center justify-center text-center">
                 <p className="text-[10px] uppercase font-[600] text-gray-soft mb-4 tracking-[0.2em]">Revenue Neto</p>
                 <p className="text-5xl font-[600] text-black-rich tracking-tighter mb-4">$101k</p>
                 <p className="text-[10px] font-[600] text-primary uppercase">12% Margen Promedio</p>
              </Card>
              <Card variant="default" className="p-12 border-none bg-white shadow-none flex flex-col items-center justify-center text-center">
                 <p className="text-[10px] uppercase font-[600] text-gray-soft mb-4 tracking-[0.2em]">CAC Promedio</p>
                 <p className="text-5xl font-[600] text-black-rich tracking-tighter mb-4">$42.5</p>
                 <p className="text-[10px] font-[600] text-im-error uppercase">+2.1% MoM</p>
              </Card>
           </div>

           <div className="mb-16">
              <h3 className="text-lg font-[600] mb-10 text-black-rich tracking-tight px-4 border-l-4 border-primary">Evolución de Ingresos (SVG Professional)</h3>
              <div className="w-full h-96 relative bg-white border border-black/5 rounded-3xl flex items-end px-20 pb-16 gap-12 overflow-hidden shadow-sm">
                 <div className="absolute inset-0 bg-gradient-to-t from-silver-light/30 to-transparent pointer-events-none" />
                 
                 {/* Luxury SVG Chart Bars */}
                 {[40, 65, 55, 85, 75, 95].map((val, i) => (
                   <div key={i} className="flex-1 flex flex-col items-center gap-6 group relative z-10">
                      <div className="absolute -top-12 scale-0 group-hover:scale-100 transition-transform bg-black-rich text-white text-[10px] px-3 py-1.5 rounded-lg shadow-xl font-bold">
                        {val}%
                      </div>
                      <div 
                        className="w-16 bg-primary rounded-t-xl transition-all duration-1000 ease-out hover:bg-black-rich shadow-2xl shadow-primary/20" 
                        style={{ height: `${val}%` }} 
                      />
                      <span className="text-[11px] font-bold text-gray- soft/60 uppercase tracking-widest">Mes {i+1}</span>
                   </div>
                 ))}

                 {/* Indicators */}
                 <div className="absolute top-12 right-12 text-right">
                    <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Peak Performance</p>
                    <p className="text-[11px] text-gray-400 font-[300]">Marzo 2026 · Semana 4</p>
                 </div>
              </div>
           </div>

           <p className="text-base text-gray-500 leading-relaxed max-w-3xl border-l-[4px] border-primary/40 pl-8 italic font-[300]">
              "La interpretación de los datos sugiere que la integración de proveedores bajo el esquema Emerald v2.0 ha optimizado el costo de soporte técnico, 
              mejorando significativamente el margen de revenue neto y consolidando la visión del Master Plan."
           </p>
        </section>

        {/* Services & Providers Breakdown */}
        <section className="py-20 px-16 page-break-before">
           <div className="flex items-center gap-3 mb-12 pb-6 border-b border-black/5">
              <Briefcase className="text-primary" size={28} />
              <h2 className="text-2xl font-[600] uppercase tracking-widest text-black-rich">3. Desglose de Operaciones</h2>
           </div>

           <div className="flex flex-col gap-8">
              <Card variant="default" className="p-12 border-none bg-[#F9F9F9]">
                 <h3 className="text-lg font-[600] mb-8">Performance por Categoría</h3>
                 <div className="space-y-6">
                    <div className="grid grid-cols-4 pb-4 border-b border-black/5 text-[10px] font-[600] uppercase tracking-tighter text-gray-400">
                       <span>Servicio</span>
                       <span className="text-center">Volumen</span>
                       <span className="text-center">Comisión</span>
                       <span className="text-right">Ranking</span>
                    </div>
                    {[
                      { s: 'Plomería', v: '145', c: '15%', r: '1' },
                      { s: 'Electricidad', v: '122', c: '12%', r: '2' },
                      { s: 'Limpieza', v: '98', c: '18%', r: '3' },
                    ].map((item, i) => (
                      <div key={i} className="grid grid-cols-4 items-center">
                         <span className="text-sm font-[600]">{item.s}</span>
                         <span className="text-sm text-center text-gray-600">{item.v} servicios</span>
                         <span className="text-sm text-center font-[600] text-primary">{item.c}</span>
                         <span className="text-sm text-right font-[600]">#{item.r}</span>
                      </div>
                    ))}
                 </div>
              </Card>

              <div className="grid grid-cols-2 gap-8">
                 <div className="p-8 border border-black/5 rounded-xl">
                    <div className="flex items-center gap-2 mb-4 text-primary">
                       <ShieldCheck size={20} />
                       <h4 className="text-sm font-[600]">Seguridad y Escrow</h4>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed mb-4">
                       Cero fallas detectadas en el sistema de retención. El 98.5% de los pagos fueron liberados automáticamente tras la satisfacción del cliente.
                    </p>
                    <Badge variant="success">Estatus: Saludable</Badge>
                 </div>
                 <div className="p-8 border border-black/5 rounded-xl">
                    <div className="flex items-center gap-2 mb-4 text-primary">
                       <PieIcon size={20} />
                       <h4 className="text-sm font-[600]">Crecimiento Red</h4>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed mb-4">
                       Se integraron **42 nuevos proveedores veteados** este mes, con un enfoque del 60% en la zona norte (Cd. Juárez).
                    </p>
                    <Badge variant="silver">42 Onboardings</Badge>
                 </div>
              </div>
           </div>
        </section>

        {/* Footer */}
        <footer className="mt-48 pt-12 border-t border-black/10 flex justify-between items-end">
           <div>
              <p className="text-xs font-[600] uppercase tracking-widest text-black-rich">Generado por I MENDLY Intelligence</p>
              <p className="text-[10px] text-gray-soft">Software de Gestión Admin v2.0 · March 2026</p>
           </div>
           <div className="text-right opacity-30">
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
