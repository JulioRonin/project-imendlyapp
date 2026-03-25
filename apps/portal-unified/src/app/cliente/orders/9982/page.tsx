"use client";

import { Logo } from '@i-mendly/shared/Logo';
import { Button } from '@i-mendly/shared/components/Button';
import { Card } from '@i-mendly/shared/components/Card';
import { Badge } from '@i-mendly/shared/components/Badge';

export default function OrderStatusPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <nav className="bg-white border-b border-slate-100 px-8 py-4 mb-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Logo size={32} />
          <Badge variant="primary" className="font-black italic">ORDEN #IM-9982</Badge>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-8">
        <div className="flex flex-col md:flex-row gap-8 mb-12 items-center">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-black text-brand-night tracking-tight mb-2">Servicio Solicitado</h1>
            <p className="text-brand-night/50 font-medium">Juan Pérez está revisando tu solicitud...</p>
          </div>
          <Card className="shrink-0 flex items-center gap-6 py-4 px-8 border-primary/20 bg-primary/5">
                <div className="text-center">
                    <p className="text-xs font-black text-primary uppercase tracking-widest mb-1">Total Protegido</p>
                    <p className="text-2xl font-black text-brand-night">$535.00</p>
                </div>
          </Card>
        </div>

        <div className="space-y-12">
            {/* Timeline */}
            <section className="relative">
                {[
                    { title: 'Fondos Retenidos', time: 'Hoy, 03:25 PM', status: 'completed' },
                    { title: 'Solicitud Enviada', time: 'Hoy, 03:25 PM', status: 'completed' },
                    { title: 'Aceptación del Profesional', time: 'Pendiente...', status: 'active' },
                    { title: 'Trabajo Realizado', time: 'Próximamente', status: 'pending' },
                    { title: 'Liberación de Escrow', time: 'Próximamente', status: 'pending' },
                ].map((item, i) => (
                    <div key={i} className="flex gap-6 mb-8 group last:mb-0">
                        <div className="flex flex-col items-center">
                            <div className={`w-6 h-6 rounded-full border-4 ${
                                item.status === 'completed' ? 'bg-primary border-primary/20' : 
                                item.status === 'active' ? 'bg-white border-primary animate-pulse' : 
                                'bg-slate-200 border-transparent'
                            }`} />
                            {i < 4 && <div className="w-0.5 h-full bg-slate-200 mt-2" />}
                        </div>
                        <div className="pb-8">
                            <h3 className={`text-lg font-black tracking-tight ${item.status === 'pending' ? 'text-brand-night/20' : 'text-brand-night'}`}>
                                {item.title}
                            </h3>
                            <p className="text-xs font-bold text-brand-night/40 uppercase tracking-widest mt-1">{item.time}</p>
                        </div>
                    </div>
                ))}
            </section>

            <Card variant="glass" className="bg-brand-coral/5 border-brand-coral/20">
                <div className="flex gap-4">
                    <span className="text-2xl">🚨</span>
                    <div>
                        <h4 className="font-black text-brand-night tracking-tight mb-2 italic">Garantía Escrow</h4>
                        <p className="text-sm text-brand-night/60 leading-relaxed font-medium">
                            Tu dinero está 100% seguro. Si el profesional no acepta la solicitud en 12 horas, tus fondos regresarán íntegros a tu cuenta automáticamente.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
      </div>
    </main>
  );
}
