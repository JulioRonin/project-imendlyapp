"use client";

import { useSearchParams } from 'next/navigation';
import { Button } from '@i-mendly/shared/components/Button';
import { Card } from '@i-mendly/shared/components/Card';
import { CheckCircle2, Home, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id') || 'ORD-0000';

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-10 animate-in fade-in zoom-in duration-1000">
         <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 transform -translate-y-8" />
            <div className="relative w-32 h-32 bg-primary rounded-[3rem] shadow-2xl shadow-primary/40 flex items-center justify-center mx-auto mb-10 border-4 border-white">
               <CheckCircle2 size={64} className="text-white" strokeWidth={3} />
            </div>
         </div>

         <div className="space-y-4">
            <h1 className="text-4xl font-black text-brand-night tracking-tighter uppercase">¡Pago Exitoso!</h1>
            <p className="text-slate-400 font-medium px-4">
               Tu solicitud ha sido enviada al profesional. Te notificaremos en cuanto el servicio sea confirmado.
            </p>
         </div>

         <Card className="p-8 rounded-[2.5rem] bg-slate-50 border-none flex flex-col items-center gap-2">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">ID de Seguimiento</p>
            <p className="text-xl font-black text-brand-night uppercase tracking-tighter">{orderId}</p>
         </Card>

         <div className="space-y-4 pt-6 text-center">
            <Link href={`/cliente/ordenes/${orderId}`} className="block">
               <Button className="w-full py-7 text-[10px] tracking-[0.4em] uppercase font-black rounded-2xl shadow-2xl shadow-primary/20 flex gap-4">
                  Seguir mi Orden <ArrowRight size={16} />
               </Button>
            </Link>
            <Link href="/cliente/home" className="block mt-4">
               <button className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-brand-night transition-colors mx-auto">
                  <Home size={14} /> Volver al Inicio
               </button>
            </Link>
         </div>
      </div>
    </main>
  );
}
