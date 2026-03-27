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
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F8F9FB]">
      <header className="h-24 px-10 border-b border-slate-100 bg-white flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-black text-brand-night tracking-tight uppercase">Disputas & Aclaraciones</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Gestión de reclamos y resolución de conflictos</p>
        </div>

        <div className="flex items-center gap-4">
            <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2 w-64">
                <Search size={18} className="text-slate-400 mr-2" />
                <input type="text" placeholder="Buscar por ID o cliente..." className="bg-transparent border-none text-[11px] font-bold uppercase tracking-tight outline-none w-full placeholder:text-slate-300" />
            </div>
            <Button variant="outline" className="rounded-xl h-11 px-4 flex items-center gap-2 border-slate-200">
                <History size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Ver Todo</span>
            </Button>
        </div>
      </header>

      <main className="flex-1 p-10 overflow-y-auto space-y-10">
        {/* Warning Banner */}
        <Card className="p-8 rounded-[2.5rem] bg-im-error/5 border-im-error/20 flex items-start gap-6 relative overflow-hidden">
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
        </Card>

        {/* Disputes Grid */}
        <div className="grid lg:grid-cols-3 gap-10">
            {/* List Column */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-brand-night tracking-tight uppercase">Disputas Activas</h3>
                    <div className="flex gap-4">
                        <button className="text-[9px] font-black uppercase tracking-widest text-brand-night">Abiertas (1)</button>
                        <button className="text-[9px] font-black uppercase tracking-widest text-slate-300">Resueltas (12)</button>
                    </div>
                </div>

                <div className="space-y-4">
                    {DISPUTES.map((dispute) => (
                        <Card 
                            key={dispute.id} 
                            className="p-6 rounded-[1.8rem] border-slate-50 hover:border-slate-200 transition-all flex items-center gap-6 group cursor-pointer"
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                                dispute.status === 'opened' ? 'bg-im-error/10 text-im-error' : 
                                dispute.status === 'resolving' ? 'bg-amber-50 text-amber-500' : 
                                'bg-slate-50 text-slate-300'
                            }`}>
                                {dispute.status === 'closed' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Case: {dispute.id} • {dispute.date}</span>
                                    <Badge 
                                        variant={dispute.priority === 'high' ? 'error' : 'default'} 
                                        className="text-[8px] font-black px-2 py-0.5 uppercase tracking-widest"
                                    >
                                        {dispute.priority}
                                    </Badge>
                                </div>
                                <h4 className="text-[15px] font-black text-brand-night leading-tight group-hover:text-primary transition-colors">{dispute.reason}</h4>
                                <div className="flex items-center gap-3 mt-2">
                                    <Avatar size="sm" name={dispute.client} className="w-5 h-5" />
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{dispute.client} • {dispute.service}</p>
                                </div>
                                <p className="text-[11px] font-medium text-slate-500 mt-3 truncate italic bg-slate-50/50 p-2 rounded-lg">
                                    "{dispute.lastMessage}"
                                </p>
                            </div>

                            <Button variant="ghost" size="sm" className="rounded-xl">
                                <ChevronRight size={20} className="text-slate-200" />
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Support Sidebar */}
            <div className="space-y-10">
                <section className="space-y-6">
                    <h3 className="text-lg font-black text-brand-night tracking-tight uppercase">Soporte Express</h3>
                    <Card className="p-8 rounded-[2.5rem] border-slate-100/60 bg-brand-night text-white shadow-2xl shadow-brand-night/20">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mb-6">
                                <MessageCircle size={32} className="text-primary" />
                            </div>
                            <h4 className="text-lg font-black mb-2 uppercase tracking-tight">Chat con Mediador</h4>
                            <p className="text-white/50 text-[11px] font-medium leading-[1.6] mb-8">
                                Conéctate con un agente verificado para resolver tu disputa de forma inmediata.
                            </p>
                            <Button variant="primary" className="w-full h-12 text-[10px] font-black tracking-widest uppercase rounded-xl">
                                Iniciar Chat
                            </Button>
                        </div>
                    </Card>
                </section>

                <section className="space-y-6">
                    <h3 className="text-lg font-black text-brand-night tracking-tight uppercase">Centro de Ayuda</h3>
                    <div className="space-y-3">
                        {[
                            '¿Cómo responder a una reclamación?',
                            'Políticas de reembolso',
                            'Garantías de servicio I Mendly'
                        ].map((q, i) => (
                            <div key={i} className="p-5 bg-white border border-slate-50 rounded-2xl flex items-center justify-between group hover:border-slate-200 transition-all cursor-pointer">
                                <span className="text-[11px] font-bold text-slate-600 group-hover:text-brand-night transition-colors">{q}</span>
                                <Info size={14} className="text-slate-200 group-hover:text-primary transition-colors" />
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
