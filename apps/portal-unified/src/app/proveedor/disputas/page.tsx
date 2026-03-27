"use client";

import React, { useState } from 'react';
import { 
  AlertCircle, 
  MessageCircle, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  ChevronRight,
  Search,
  History,
  Info
} from 'lucide-react';
import { Button } from '@i-mendly/shared/components/Button';
import { Card } from '@i-mendly/shared/components/Card';
import { Badge } from '@i-mendly/shared/components/Badge';
import { Avatar } from '@i-mendly/shared/components/Avatar';

const DISPUTES = [
  {
    id: 'DIS-102',
    client: 'Pedro Marmol',
    service: 'Instalación de Espejos',
    reason: 'Inconformidad con acabado',
    date: 'Hace 2 horas',
    status: 'opened',
    priority: 'high',
    lastMessage: 'El espejo quedó un poco chueco...',
  },
  {
    id: 'DIS-098',
    client: 'Lorena Fuentes',
    service: 'Limpieza Básica',
    reason: 'Cargo no reconocido',
    date: 'Ayer, 4:00 PM',
    status: 'resolving',
    priority: 'medium',
    lastMessage: 'Mendly Support: Estamos revisando el cobro...',
  },
  {
    id: 'DIS-085',
    client: 'Ricardo Salinas',
    service: 'Reparación Eléctrica',
    reason: 'Garantía solicitada',
    date: '12 Mar, 2026',
    status: 'closed',
    priority: 'low',
    lastMessage: 'Caso cerrado - Proveedor re-visitó el domicilio.',
  }
];

export default function DisputesPage() {
  const [activeTab, setActiveTab] = useState<'open' | 'resolved'>('open');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedDispute, setSelectedDispute] = useState<typeof DISPUTES[0] | null>(null);

  const filteredDisputes = DISPUTES.filter(d => 
      activeTab === 'open' ? d.status !== 'closed' : d.status === 'closed'
  );

  const openCount = DISPUTES.filter(d => d.status !== 'closed').length;
  const resolvedCount = DISPUTES.filter(d => d.status === 'closed').length;

  const FAQS = [
    {
        q: '¿Cómo responder a una reclamación?',
        a: 'Tienes 48 horas hábiles para presentar tus evidencias fotográficas o aceptar el reclamo. En caso de no responder, Mendly fallará automáticamente a favor del cliente para proteger la confianza en la plataforma.'
    },
    {
        q: 'Políticas de reembolso',
        a: 'Si un trabajo no se completa según los términos acordados o causa daños mayores, Mendly reembolsará al cliente del saldo retenido. Tienes derecho a apelar adjuntando pruebas previas y posteriores al servicio.'
    },
    {
        q: 'Garantías de servicio I Mendly',
        a: 'Todos los servicios Premium cuentan con una garantía de 7 días. Si el cliente reporta una falla dentro de este lapso, el sistema abrirá un ticket de Revisión prioritaria antes de emitir algún reembolso.'
    }
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F8F9FB]">
      <header className="h-24 px-10 border-b border-slate-100 bg-white flex items-center justify-between sticky top-0 z-10 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-brand-night tracking-tight uppercase">Disputas & Aclaraciones</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Gestión de reclamos y resolución de conflictos</p>
        </div>

        <div className="flex items-center gap-4">
            <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2 w-64 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <Search size={18} className="text-slate-400 mr-2" />
                <input type="text" placeholder="Buscar por ID o cliente..." className="bg-transparent border-none text-[11px] font-bold uppercase tracking-tight outline-none w-full placeholder:text-slate-300" />
            </div>
            <Button variant="outline" className="rounded-xl h-11 px-4 flex items-center gap-2 border-slate-200">
                <History size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Ver Todo</span>
            </Button>
        </div>
      </header>

      <main className="flex-1 p-10 overflow-y-auto space-y-10 custom-scrollbar">
        {/* Warning Banner */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-0 overflow-hidden shadow-sm">
            <div className="p-8 bg-im-error/5 flex items-start gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5">
                    <ShieldAlert size={120} />
                </div>
                <div className="w-14 h-14 bg-im-error/10 text-im-error rounded-2xl flex items-center justify-center shrink-0">
                    <ShieldAlert size={24} />
                </div>
                <div className="relative z-10 flex-1">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-im-error mb-2">Aviso de Mediación</h4>
                    <p className="text-[14px] font-bold text-brand-night/80 max-w-2xl leading-relaxed">
                        Tienes una disputa abierta con alta prioridad. Recuerda que la resolución rápida afecta positivamente tu ranking en la plataforma. Mendly actúa como mediador neutral en todos los procesos.
                    </p>
                    <button className="mt-4 text-[10px] font-black uppercase tracking-widest text-im-error underline underline-offset-4 hover:opacity-70">
                        Leer política de arbitraje
                    </button>
                </div>
            </div>
        </div>

        {/* Disputes Grid */}
        <div className="grid lg:grid-cols-3 gap-10">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
                {selectedDispute ? (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <button 
                            onClick={() => setSelectedDispute(null)}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-night transition-colors mb-6"
                        >
                            <span className="rotate-180"><ChevronRight size={14} /></span>
                            Volver a la lista
                        </button>
                        
                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-8">
                            {/* Header Info */}
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <Badge variant={selectedDispute.priority === 'high' ? 'error' : 'default'} className="text-[8px] font-black px-2 py-0.5 uppercase tracking-widest">
                                            {selectedDispute.priority}
                                        </Badge>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Case: {selectedDispute.id}</span>
                                    </div>
                                    <h2 className="text-2xl font-black text-brand-night tracking-tight uppercase">{selectedDispute.reason}</h2>
                                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight mt-1">{selectedDispute.client} • {selectedDispute.service}</p>
                                </div>
                                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
                                    selectedDispute.status === 'opened' ? 'bg-im-error/10 text-im-error' : 
                                    selectedDispute.status === 'resolving' ? 'bg-amber-50 text-amber-500' : 
                                    'bg-emerald-50 text-emerald-500'
                                }`}>
                                    {selectedDispute.status === 'opened' ? 'Abierta' : selectedDispute.status === 'resolving' ? 'En Mediación' : 'Resuelta'}
                                </div>
                            </div>

                            {/* Roadmap / Protocol */}
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Protocolo y Estado Actual</h4>
                                <div className="flex items-center justify-between mb-4 relative">
                                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0"></div>
                                    <div className={`absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all ${
                                        selectedDispute.status === 'opened' ? 'w-1/3' : 
                                        selectedDispute.status === 'resolving' ? 'w-2/3' : 'w-full'
                                    }`}></div>
                                    
                                    {[
                                        { label: 'Reclamo', active: true },
                                        { label: 'Evidencia', active: selectedDispute.status !== 'opened' || selectedDispute.status === 'opened' },
                                        { label: 'Mediación', active: selectedDispute.status === 'resolving' || selectedDispute.status === 'closed' },
                                        { label: 'Resolución', active: selectedDispute.status === 'closed' }
                                    ].map((step, idx) => (
                                        <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-slate-50 text-white shadow-sm transition-colors ${
                                                step.active ? 'bg-primary' : 'bg-slate-300'
                                            }`}>
                                                {step.active ? <CheckCircle2 size={12} /> : <div className="w-2 h-2 rounded-full bg-white/50" />}
                                            </div>
                                            <span className={`text-[8px] font-black uppercase tracking-widest ${
                                                step.active ? 'text-brand-night' : 'text-slate-400'
                                            }`}>{step.label}</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-[12px] font-medium text-slate-600 leading-relaxed bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                    {selectedDispute.status === 'opened' ? (
                                        "Es tu turno de responder. Por favor, proporciona fotos del servicio finalizado y una breve explicación de tu proceso. Tienes 48 hrs hábiles."
                                    ) : selectedDispute.status === 'resolving' ? (
                                        "El caso está en manos de nuestros mediadores. Estamos revisando ambas partes de la información y te notificaremos pronto."
                                    ) : (
                                        "Este caso ha sido cerrado y los fondos distribuidos acorde a la resolución final enviada a tu correo."
                                    )}
                                </p>
                            </div>

                            {/* Evidence Form */}
                            {selectedDispute.status !== 'closed' && (
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-brand-night uppercase tracking-widest flex items-center gap-2">
                                            Tu Declaración
                                        </label>
                                        <textarea 
                                            placeholder="Explica en detalle qué sucedió durante el servicio y por qué no estás de acuerdo con el reclamo..."
                                            className="w-full h-32 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-[12px] font-medium text-brand-night focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none shadow-inner"
                                        />
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-brand-night uppercase tracking-widest">
                                            Evidencia Fotográfica
                                        </label>
                                        <div className="border-2 border-dashed border-slate-200 bg-slate-50 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-white hover:border-primary/40 transition-colors cursor-pointer group">
                                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                <History size={20} className="text-primary" />
                                            </div>
                                            <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Arrastra tus fotos aquí o haz clic para subir</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Soporta JPG, PNG o MP4 (Max 10MB)</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                                        <Button variant="primary" className="flex-1 h-14 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                                            Enviar Evidencia
                                        </Button>
                                        <Button variant="outline" className="flex-1 h-14 rounded-xl text-[10px] font-black uppercase tracking-widest border-im-error text-im-error hover:bg-im-error/5">
                                            Solicitar Asistencia de Administración
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-black text-brand-night tracking-tight uppercase">Disputas Activas</h3>
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setActiveTab('open')}
                                    className={`text-[9px] font-black uppercase tracking-widest transition-colors ${activeTab === 'open' ? 'text-brand-night' : 'text-slate-300 hover:text-slate-400'}`}
                                >
                                    Abiertas ({openCount})
                                </button>
                                <button 
                                    onClick={() => setActiveTab('resolved')}
                                    className={`text-[9px] font-black uppercase tracking-widest transition-colors ${activeTab === 'resolved' ? 'text-brand-night' : 'text-slate-300 hover:text-slate-400'}`}
                                >
                                    Resueltas ({resolvedCount})
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {filteredDisputes.length === 0 ? (
                                <div className="bg-white p-12 rounded-[2rem] border border-slate-100 flex flex-col items-center justify-center text-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                                        <CheckCircle2 size={32} className="text-emerald-400" />
                                    </div>
                                    <p className="text-sm font-black text-brand-night uppercase tracking-tight">Todo en orden</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">No hay disputas en esta sección</p>
                                </div>
                            ) : filteredDisputes.map((dispute) => (
                                <div 
                                    key={dispute.id} 
                                    onClick={() => setSelectedDispute(dispute)}
                                    className="bg-white p-6 rounded-[1.8rem] border border-slate-50 hover:border-slate-200 transition-all flex items-center gap-6 group cursor-pointer shadow-sm hover:shadow-md"
                                >
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                                        dispute.status === 'opened' ? 'bg-im-error/10 text-im-error' : 
                                        dispute.status === 'resolving' ? 'bg-amber-50 text-amber-500' : 
                                        'bg-slate-50 text-slate-300'
                                    }`}>
                                        {dispute.status === 'closed' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Case: {dispute.id} • {dispute.date}</span>
                                            <Badge 
                                                variant={dispute.priority === 'high' ? 'error' : 'default'} 
                                                className="text-[8px] font-black px-2 py-0.5 uppercase tracking-widest shrink-0"
                                            >
                                                {dispute.priority}
                                            </Badge>
                                        </div>
                                        <h4 className="text-[15px] font-black text-brand-night leading-tight group-hover:text-primary transition-colors">{dispute.reason}</h4>
                                        <div className="flex items-center gap-3 mt-2">
                                            <Avatar size="sm" name={dispute.client} className="w-5 h-5" />
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate">{dispute.client} • {dispute.service}</p>
                                        </div>
                                        <p className="text-[11px] font-medium text-slate-500 mt-3 truncate italic bg-slate-50/50 p-2 rounded-lg">
                                            "{dispute.lastMessage}"
                                        </p>
                                    </div>

                                    <Button variant="ghost" size="sm" className="rounded-xl shrink-0">
                                        <ChevronRight size={20} className="text-slate-200" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Support Sidebar */}
            <div className="space-y-10">
                <section className="space-y-6">
                    <h3 className="text-lg font-black text-brand-night tracking-tight uppercase">Soporte Express</h3>
                    <div className="p-8 rounded-[2.5rem] border border-brand-night bg-brand-night shadow-2xl shadow-brand-night/20">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mb-6">
                                <MessageCircle size={32} className="text-primary" />
                            </div>
                            <h4 className="text-lg font-black mb-2 uppercase tracking-tight text-white">Chat con Mediador</h4>
                            <p className="text-white/60 text-[11px] font-medium leading-[1.6] mb-8">
                                Conéctate con un agente verificado para resolver tu disputa de forma inmediata.
                            </p>
                            <Button variant="primary" className="w-full h-12 text-[10px] font-black tracking-widest uppercase rounded-xl border-none">
                                Iniciar Chat
                            </Button>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <h3 className="text-lg font-black text-brand-night tracking-tight uppercase">Centro de Ayuda</h3>
                    <div className="space-y-3">
                        {FAQS.map((faq, i) => (
                            <div 
                                key={i} 
                                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                                className="p-5 bg-white border border-slate-100 rounded-2xl flex flex-col group hover:border-slate-200 transition-all cursor-pointer shadow-sm"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-slate-600 group-hover:text-brand-night transition-colors pr-4">{faq.q}</span>
                                    <ChevronRight size={14} className={`text-slate-300 group-hover:text-primary transition-transform duration-300 shrink-0 ${expandedFaq === i ? 'rotate-90 text-primary' : ''}`} />
                                </div>
                                
                                {expandedFaq === i && (
                                    <div className="mt-4 pt-4 border-t border-slate-50 animate-in slide-in-from-top-2 opacity-0 fade-in duration-300">
                                        <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                                            {faq.a}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
      </main>
    </div>
  );
}
