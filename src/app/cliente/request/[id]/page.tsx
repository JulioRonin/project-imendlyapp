"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePlatformStore } from '@/store/usePlatformStore';
import { Logo } from '@i-mendly/shared/Logo';
import { Button } from '@i-mendly/shared/components/Button';
import { Card } from '@i-mendly/shared/components/Card';
import { Input } from '@i-mendly/shared/components/Input';
import { Avatar } from '@i-mendly/shared/components/Avatar';

export default function RequestPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const createOrder = usePlatformStore(state => state.createOrder);
  const currentUser = usePlatformStore(state => state.currentUser);
  
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateOrder = () => {
    if (!date || !time) return alert("Selecciona fecha y hora");
    if (!currentUser) return alert("Inicia sesión primero");

    setLoading(true);
    createOrder({
      serviceName: "Moda y Costura",
      providerName: "Indigo",
      providerEmail: "indigo@gmail.com",
      clientEmail: currentUser.email,
      status: "PENDING",
      date,
      time,
      price: 535
    });

    setTimeout(() => {
      router.push("/cliente/orders");
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <nav className="bg-white border-b border-slate-100 px-8 py-6 mb-12 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size={40} />
            <span className="text-xl font-black text-brand-night uppercase tracking-tighter">I mendly</span>
          </div>
          <h1 className="text-xs font-black uppercase tracking-[0.3em] text-brand-night/30">Checkout Seguro</h1>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-5 gap-16">
        <div className="md:col-span-3 space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <section className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-100 border border-slate-50">
            <h2 className="text-2xl font-black text-brand-night mb-10 tracking-tight flex items-center gap-4">
              <span className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm">1</span>
              Detalles del Servicio
            </h2>
            <div className="space-y-8">
              <Input label="¿Qué necesitas reparar hoy?" value="Moda y Costura" readOnly className="py-4 px-6 text-lg font-bold bg-slate-50 text-slate-500" />
              <div className="flex flex-col gap-3">
                <label className="text-xs font-black text-brand-night/40 uppercase tracking-widest ml-1">Descripción del problema</label>
                <textarea 
                  className="w-full rounded-2xl border border-slate-100 bg-white px-6 py-5 text-brand-night focus:bg-white focus:ring-4 focus:ring-primary/10 transition-shadow outline-none h-32 font-medium text-base leading-relaxed"
                  placeholder="Describe los detalles para recibir una mejor atención..."
                />
              </div>
              <div className="grid grid-cols-2 gap-8">
                <Input label="Fecha" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="font-bold" />
                <Input label="Hora" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="font-bold" />
              </div>
            </div>
          </section>

          <section className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-100 border border-slate-50">
            <h2 className="text-2xl font-black text-brand-night mb-8 tracking-tight flex items-center gap-4">
              <span className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm">2</span>
              Ubicación de Visita
            </h2>
            <Input label="Dirección de tu hogar" placeholder="CALLE, NUMERO, CP" className="py-4 px-6 font-bold" />
          </section>
        </div>

        <aside className="md:col-span-2 animate-in fade-in slide-in-from-right-8 duration-1000">
          <Card className="sticky top-10 p-10 border-none shadow-2xl shadow-primary/10 overflow-hidden relative group rounded-[3rem]">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">🔒</div>
            <div className="flex items-center gap-6 mb-10 pb-10 border-b border-slate-50">
              <Avatar name="Indigo Moda" size="lg" className="ring-4 ring-primary/5" />
              <div>
                <p className="text-[10px] font-black text-brand-night/30 uppercase tracking-widest leading-none mb-1">Profesional Seleccionado</p>
                <p className="text-xl font-black text-brand-night tracking-tight">Indigo</p>
                <p className="text-[10px] uppercase font-bold text-primary tracking-widest mt-1">Moda y Costura</p>
              </div>
            </div>

            <div className="space-y-6 mb-10">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-brand-night/60">Costo base</span>
                <span className="text-lg font-black text-brand-night">$450.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-brand-night/60">Garantía Escrow</span>
                <span className="text-lg font-black text-brand-night">$85.00</span>
              </div>
              <div className="flex justify-between items-center pt-8 border-t border-slate-100 border-dashed">
                <span className="text-xl font-black text-brand-night uppercase tracking-tighter">Total</span>
                <span className="text-4xl font-black text-primary tracking-tighter">$535.00</span>
              </div>
            </div>

            <Button 
              variant="primary" 
              size="lg" 
              onClick={handleCreateOrder}
              disabled={loading || !date || !time}
              className={`w-full py-7 text-[11px] font-black uppercase tracking-[0.3em] rounded-[1.5rem] transition-all transform ${(!date || !time) ? 'opacity-50' : 'shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95'}`}
            >
              {loading ? (
                 <span className="animate-pulse">Procesando...</span>
              ) : (
                'Solicitar Servicio'
              )}
            </Button>
            
            <div className="mt-8 text-center text-[10px] font-bold text-brand-night/30 flex justify-center gap-2">
              <span>💳</span> Pago seguro garantizado por Stripe
            </div>
          </Card>
        </aside>
      </div>
    </main>
  );
}
