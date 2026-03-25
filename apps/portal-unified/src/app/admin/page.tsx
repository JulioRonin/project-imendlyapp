"use client";

import { Logo } from '@i-mendly/shared/Logo';
import { Card } from '@i-mendly/shared/components/Card';
import { Badge } from '@i-mendly/shared/components/Badge';

import { MOCK_STATS, MOCK_DISPUTES } from '@i-mendly/shared/constants/mocks';

export default function AdminDashboard() {
  const stats = [
    { label: 'Escrow Vigente', value: MOCK_STATS.escrow, color: 'primary' },
    { label: 'Servicios de Hoy', value: MOCK_STATS.dailyServices, color: 'coral' },
    { label: 'Nuevos Proveedores', value: MOCK_STATS.newProviders, color: 'teal' },
    { label: 'TICKET PROMEDIO', value: MOCK_STATS.avgTicket, color: 'navy' },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="bg-brand-night px-8 py-4 text-white flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <Logo size={32} />
          <h1 className="text-sm font-black uppercase tracking-[0.2em] italic">Dashboard Operativo</h1>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {stats.map((s, i) => (
            <Card key={i} className="flex flex-col justify-center items-center py-8">
              <p className="text-[10px] font-black text-brand-night/30 uppercase tracking-[0.2em] mb-2">{s.label}</p>
              <p className={`text-3xl font-black text-brand-night tracking-tighter`}>{s.value}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Card className="min-h-[400px]">
            <h3 className="text-xl font-black text-brand-night mb-6 tracking-tight">Últimas transacciones Escrow</h3>
            <div className="space-y-4">
               {[1,2,3,4,5].map(i => (
                 <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200" />
                      <div>
                        <p className="text-sm font-bold text-brand-night">Servicio #45{i}</p>
                        <p className="text-[10px] font-black text-brand-night/30 uppercase tracking-widest">Retención Exitosa</p>
                      </div>
                    </div>
                    <p className="font-black text-brand-night">$640.00</p>
                 </div>
               ))}
            </div>
          </Card>

          <Card className="min-h-[400px] bg-brand-night text-white overflow-hidden relative">
            <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-primary opacity-20 blur-[100px] rounded-full" />
            <h3 className="text-xl font-black mb-6 tracking-tight relative z-10">Disputas Activas</h3>
            <div className="space-y-4 relative z-10">
               <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                  <Badge variant="coral" className="mb-3">ALERTA CRÍTICA</Badge>
                  <p className="text-sm font-bold mb-2">Disputa de Pago #DP-0021</p>
                  <p className="text-xs opacity-50 leading-relaxed mb-6 italic">"El cliente reclama que el electricista no terminó la instalación del tablero principal."</p>
                  <button className="text-xs font-black text-primary uppercase tracking-[0.2em] hover:underline">Intervenir ahora</button>
               </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
