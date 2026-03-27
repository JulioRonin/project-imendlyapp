"use client";

import { useSearchParams, useParams } from 'next/navigation';
import { Button } from '@i-mendly/shared/components/Button';
import { MOCK_PROVIDERS } from '@i-mendly/shared/constants/mocks';
import { Card } from '@i-mendly/shared/components/Card';
import { Avatar } from '@i-mendly/shared/components/Avatar';
import { Badge } from '@i-mendly/shared/components/Badge';
import { 
  ArrowLeft, CheckCircle2, Clock, MapPin, 
  MessageCircle, XCircle, ChevronRight, FileText, 
  ShieldCheck, Smartphone, Info
} from 'lucide-react';
import Link from 'next/link';

const STAGES = [
  { id: 'solicitado', label: 'Solicitado', description: 'Esperando que el proveedor acepte el requerimiento.', active: true, done: true },
  { id: 'confirmado', label: 'Confirmado', description: 'El profesional ha aceptado tu servicio y está agendado.', active: true, done: false },
  { id: 'en-camino', label: 'En Camino', description: 'El profesional está dirigiéndose a tu ubicación.', active: false, done: false },
  { id: 'finalizado', label: 'Finalizado', description: 'Servicio completado. Liberación de fondos pendiente.', active: false, done: false },
];

export default function OrderDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderIdParam = params.id as string;
  const orderId = orderIdParam || searchParams.get('id') || 'ORD-8842';

  const providerId = searchParams.get('providerId');
  const servicesParam = searchParams.get('services');
  const totalParam = searchParams.get('total');
  
  const provider = MOCK_PROVIDERS.find(p => p.id === providerId) || MOCK_PROVIDERS[2];
  const serviceName = servicesParam ? decodeURIComponent(servicesParam).split(',')[0] : 'Mantenimiento de Pintura Mural';
  const total = totalParam ? `$${parseInt(totalParam).toLocaleString('es-MX')}.00` : '$1,250.00';

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <header className="px-8 py-10 flex items-center justify-between sticky top-0 bg-slate-50/90 backdrop-blur-xl z-50">
        <Link href="/cliente">
          <button className="w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center text-brand-night border border-slate-100">
            <ArrowLeft size={20} />
          </button>
        </Link>
        <div className="flex-1 px-6 text-center">
           <p className="text-[10px] font-black text-brand-night/30 uppercase tracking-[0.3em]">Seguimiento de Orden</p>
           <h1 className="text-xl font-black text-brand-night uppercase tracking-tighter">{orderId}</h1>
        </div>
        <div className="w-12" />
      </header>

      <div className="px-8 max-w-5xl mx-auto space-y-10">
        {/* Roadmap Visual */}
        <section className="bg-white p-12 rounded-[3.5rem] shadow-[0_32px_96px_-12px_rgba(0,0,0,0.05)] border border-slate-50">
           <h2 className="text-lg font-black text-brand-night uppercase tracking-tight mb-12">Etapas del Servicio</h2>
           
           <div className="relative space-y-12">
              <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-slate-100" />
              
              {STAGES.map((stage, i) => (
                <div key={stage.id} className="relative flex gap-10 items-start group">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center z-10 transition-all duration-500 ring-8 ring-white ${stage.done ? 'bg-primary text-white scale-110 shadow-xl' : stage.active ? 'bg-brand-night text-white animate-pulse' : 'bg-slate-50 text-slate-200'}`}>
                      {stage.done ? <CheckCircle2 size={24} /> : stage.active ? <Clock size={24} /> : <div className="w-3 h-3 rounded-full bg-slate-200" />}
                   </div>
                   <div className="flex-1 pt-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className={`font-black uppercase tracking-widest text-sm ${stage.active || stage.done ? 'text-brand-night' : 'text-slate-300'}`}>{stage.label}</h4>
                        {stage.active && !stage.done && (
                           <Badge variant="default" className="text-[8px] px-2 py-0.5 animate-bounce bg-primary text-white border-primary">ACTUAL</Badge>
                        )}
                      </div>
                      <p className={`text-xs font-medium leading-relaxed max-w-md ${stage.active || stage.done ? 'text-slate-500' : 'text-slate-300'}`}>
                        {stage.description}
                      </p>
                   </div>
                </div>
              ))}
           </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-8">
           {/* Provider & Quick Actions */}
           <Card className="p-10 rounded-[3rem] border-none shadow-xl bg-white space-y-8">
              <div className="flex items-center gap-6">
                 <Avatar src={(provider as any).image} name={provider.name} className="w-20 h-20 rounded-3xl shadow-lg ring-4 ring-slate-50" />
                 <div className="flex-1">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Tu Profesional</p>
                    <h3 className="text-2xl font-black text-brand-night uppercase tracking-tighter">{provider.name}</h3>
                    {provider.verified && (
                      <div className="flex items-center gap-2 mt-2">
                         <ShieldCheck size={14} className="text-emerald-500" />
                         <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Verificado</span>
                      </div>
                    )}
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <Button className="py-6 rounded-2xl flex gap-3 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                    <MessageCircle size={16} /> Abrir Chat
                 </Button>
                 <Button variant="outline" className="py-6 rounded-2xl flex gap-3 text-[10px] font-black uppercase tracking-widest border-slate-100 text-brand-night hover:bg-slate-50">
                    <Smartphone size={16} /> Llamar
                 </Button>
              </div>

              <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                 <div className="flex items-center gap-2 text-slate-400">
                    <XCircle size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Cancelar Servicio</span>
                 </div>
                 <ChevronRight size={16} className="text-slate-200" />
              </div>
           </Card>

           {/* Details & Info */}
           <Card className="p-10 rounded-[3rem] border-none shadow-xl bg-white space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <FileText size={120} />
              </div>
              
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-primary">
                    <Info size={20} />
                 </div>
                 <h2 className="text-lg font-black text-brand-night uppercase tracking-tight">Detalles del Servicio</h2>
              </div>

              <div className="space-y-6 relative z-10">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Servicio Contratado</p>
                    <p className="text-sm font-black text-brand-night uppercase tracking-tight">{serviceName}</p>
                 </div>

                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Ubicación</p>
                    <p className="text-sm font-black text-brand-night uppercase tracking-tight flex items-center gap-2">
                       Residencial San Pedro, Av. Real 452 <MapPin size={14} className="text-primary" />
                    </p>
                 </div>

                 <div className="pt-6 border-t border-slate-50 flex justify-between items-end">
                    <div>
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Monto Pagado</p>
                       <p className="text-3xl font-black text-brand-night tracking-tighter">{total}</p>
                    </div>
                    <Badge variant="success" className="py-2.5 px-5 text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border-emerald-200">PAGADO</Badge>
                 </div>
              </div>

              <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-brand-night">
                 Descargar Recibo (PDF)
              </Button>
           </Card>
        </div>
      </div>
    </main>
  );
}
