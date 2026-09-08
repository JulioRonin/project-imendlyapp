"use client";

import { Logo } from '@i-mendly/shared/Logo';
import { Card } from '@i-mendly/shared/components/Card';
import { Badge } from '@i-mendly/shared/components/Badge';
import { Button } from '@i-mendly/shared/components/Button';
import { Avatar } from '@i-mendly/shared/components/Avatar';
import Link from 'next/link';
import { 
  AlertCircle, 
  BarChart3, 
  UserPlus, 
  TrendingUp, 
  Zap,
  ArrowLeft,
  FileText,
  MessageSquare,
  History,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';

export default function DisputeDetailPage({ params }: { params: { id: string } }) {
  const navItems = [
    { label: 'Dashboard', icon: <BarChart3 size={18} />, href: '/admin' },
    { label: 'Disputas', icon: <AlertCircle size={18} />, href: '/admin/disputas', active: true },
    { label: 'Onboarding', icon: <UserPlus size={18} />, href: '/admin/proveedores/onboarding' },
    { label: 'Finanzas', icon: <TrendingUp size={18} />, href: '/admin/finanzas' },
    { label: 'Master Plan', icon: <Zap size={18} />, href: '/admin/master-plan' },
  ];

  const timeline = [
    { date: '25 Mar, 10:30 AM', event: 'Disputa abierta por el cliente', actor: 'Carlos Slim', type: 'system' },
    { date: '25 Mar, 11:45 AM', event: 'Réplica de proveedor enviada', actor: 'Juan Eléctrico', type: 'message' },
    { date: '25 Mar, 02:20 PM', event: 'Evidencia fotográfica cargada', actor: 'Carlos Slim', type: 'file' },
    { date: '25 Mar, 04:00 PM', event: 'Intervención de mediador solicitada', actor: 'Sistema', type: 'alert' },
  ];

  return (
    <main className="min-h-screen bg-silver font-urbanist flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-black-rich text-white flex flex-col sticky top-0 h-screen p-6">
        <div className="mb-12">
          <Logo size={32} variant="dark" />
        </div>
        <nav className="flex-1 space-y-2">
          {navItems.map((item, i) => (
            <Link key={i} href={item.href}>
              <div className={`
                flex items-center gap-3 px-4 py-3 rounded-pill transition-all
                ${item.active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-white/50 hover:text-white hover:bg-white/5'}
              `}>
                {item.icon}
                <span className="text-sm font-[500]">{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Content Area */}
      <div className="flex-1 max-w-7xl mx-auto px-8 py-12">
        <header className="mb-12">
          <Link href="/admin/disputas" className="flex items-center gap-2 text-gray-soft text-xs mb-6 hover:text-black-rich transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver al Listado
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-4 mb-3">
                 <Badge variant="error" className="uppercase text-[10px]">CRÍTICA</Badge>
                 <span className="text-xs text-gray-soft font-[600] uppercase tracking-widest">ID: {params.id || 'DP-0021'}</span>
              </div>
              <h2 className="text-4xl font-[600] tracking-tight text-black-rich mb-2">Incumplimiento de Instalación</h2>
              <p className="text-gray-500 italic max-w-2xl">"El cliente reclama que el tablero no fue terminado y hay cables expuestos peligrosos."</p>
            </div>
            <div className="flex gap-3">
               <Button variant="secondary">Contactar Partes</Button>
               <Button variant="primary" className="bg-black-rich hover:bg-black text-white px-8">Intervenir Ahora</Button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Summary Cards */}
           <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                 <Card variant="floating" className="p-8">
                    <p className="text-[10px] text-gray-soft uppercase font-[600] mb-4">Cliente</p>
                    <div className="flex items-center gap-4">
                       <Avatar name="Carlos Slim" size="md" />
                       <div>
                          <p className="text-lg font-[600] text-black-rich">Carlos Slim</p>
                          <p className="text-xs text-primary">Cliente Verificado</p>
                       </div>
                    </div>
                 </Card>
                 <Card variant="floating" className="p-8">
                    <p className="text-[10px] text-gray-soft uppercase font-[600] mb-4">Proveedor</p>
                    <div className="flex items-center gap-4">
                       <Avatar name="Juan Eléctrico" size="md" />
                       <div>
                          <p className="text-lg font-[600] text-black-rich">Juan Eléctrico</p>
                          <p className="text-xs text-im-warning">En Revisión</p>
                       </div>
                    </div>
                 </Card>
              </div>

              {/* Evidence / Messages */}
              <Card variant="default" className="p-8">
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-[600] text-black-rich tracking-tight flex items-center gap-2">
                       <FileText size={20} className="text-gray-soft" /> Evidencia y Documentos
                    </h3>
                    <Badge variant="silver">4 ARCHIVOS</Badge>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    {[1,2].map(i => (
                      <div key={i} className="aspect-video bg-silver-light/30 rounded-lg border-[0.5px] border-black/5 flex items-center justify-center group cursor-pointer hover:bg-silver-light/50 transition-colors">
                         <div className="text-center">
                            <FileText size={32} className="mx-auto text-gray-soft mb-2 group-hover:text-primary transition-colors" />
                            <p className="text-[10px] text-gray-soft uppercase font-[600]">Foto_Evidencia_{i}.jpg</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </Card>

              {/* Action Resolution */}
              <Card variant="dark" className="p-10">
                 <h3 className="text-xl font-[600] mb-4 tracking-tight">Resolución Administrativa</h3>
                 <p className="text-sm opacity-60 mb-8 leading-relaxed">
                    Como administrador, puedes liberar el pago al proveedor, reembolsar al cliente o proponer un ajuste parcial. 
                    Esta acción es **final e irreversible**.
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="ghost" className="border-white/10 text-white hover:bg-primary gap-2">
                       <CheckCircle2 size={18} /> Pago Total
                    </Button>
                    <Button variant="ghost" className="border-white/10 text-white hover:bg-im-error gap-2">
                       <XCircle size={18} /> Reembolso
                    </Button>
                    <Button variant="ghost" className="border-white/10 text-white hover:bg-white/10 gap-2">
                       <HelpCircle size={18} /> Mediación
                    </Button>
                 </div>
              </Card>
           </div>

           {/* Timeline Sidebar */}
           <div className="space-y-8">
              <Card variant="default" className="p-8 h-full">
                 <h3 className="text-lg font-[600] text-black-rich tracking-tight mb-8 flex items-center gap-2">
                    <History size={20} className="text-gray-soft" /> Historial del Caso
                 </h3>
                 <div className="space-y-8 relative">
                    <div className="absolute left-4 top-2 bottom-2 w-[1px] bg-black/5" />
                    {timeline.map((step, i) => (
                      <div key={i} className="relative pl-10">
                         <div className={`absolute left-2.5 top-1 w-3 h-3 rounded-full border-2 border-white ${step.type === 'alert' ? 'bg-im-error' : step.type === 'file' ? 'bg-primary' : 'bg-silver'}`} />
                         <p className="text-[10px] text-gray-soft font-[600] mb-1 uppercase tracking-tight">{step.date}</p>
                         <p className="text-sm font-[600] text-black-rich leading-tight mb-1">{step.event}</p>
                         <p className="text-xs text-gray-soft italic">{step.actor}</p>
                      </div>
                    ))}
                 </div>
                 <Button variant="secondary" size="sm" className="w-full mt-10 gap-2">
                    <MessageSquare size={14} /> Añadir Nota Interna
                 </Button>
              </Card>
           </div>
        </div>
      </div>
    </main>
  );
}
