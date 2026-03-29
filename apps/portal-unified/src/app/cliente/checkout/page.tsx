"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@i-mendly/shared/components/Button';
import { Card } from '@i-mendly/shared/components/Card';
import { Avatar } from '@i-mendly/shared/components/Avatar';
import { Logo } from '@i-mendly/shared/Logo';
import { Badge } from '@i-mendly/shared/components/Badge';
import { Input } from '@i-mendly/shared/components/Input';
import { 
  ArrowLeft, CreditCard, Landmark, ShoppingBag, 
  ShieldCheck, Check, Smartphone, Info, Copy,
  CreditCard as CardIcon, Calendar, Lock as LockIcon
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

type PaymentStep = 'selection' | 'details';
type PaymentMethod = 'stripe' | 'conekta_spei' | 'conekta_oxxo';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const providerId = searchParams.get('providerId');
  const servicesParam = searchParams.get('services');
  const totalParam = searchParams.get('total');
  
  const [provider, setProvider] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState<PaymentStep>('selection');
  const [method, setMethod] = useState<PaymentMethod>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 1. Get current auth user
        const { data: { user } } = await supabase.auth.getUser();
        if (user) setCurrentUser(user);

        // 2. Fetch provider details
        if (providerId) {
          const { data, error } = await supabase
            .from('providers')
            .select('*, users(full_name, avatar_url), provider_services(*)')
            .eq('id', providerId)
            .single();

          if (data) {
            const normalizedProvider = {
              ...data,
              name: data.users?.full_name || data.name,
              image: data.users?.avatar_url || data.image,
              services: data.provider_services || []
            };
            setProvider(normalizedProvider);
          }
        }

        // 3. Fetch user addresses
        if (user) {
          const { data: addrData } = await supabase
            .from('user_addresses')
            .select('*')
            .eq('user_id', user.id);
          
          if (addrData) {
            setAddresses(addrData);
            if (addrData.length > 0) setSelectedAddress(addrData[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching checkout data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [providerId]);

  const selectedServices = servicesParam ? servicesParam.split(',') : [];
  const basePrice = totalParam ? parseInt(totalParam.replace(/[^0-9]/g, '')) : (provider?.price || 0);

  const handleProceed = async () => {
    if (step === 'selection') {
      setStep('details');
    } else {
      if (!currentUser) return alert('Debes iniciar sesión para continuar');
      
      setIsProcessing(true);
      setErrorStatus(null);
      console.log('Starting handleProceed...', { currentUser, providerId, basePrice, method });
      
      try {
        const orderDisplayId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
        const dateStr = searchParams.get('date');
        const timeStr = searchParams.get('time');
        const parseScheduledTime = (t: string) => {
          try {
            const cleanTime = t.replace(/\./g, '').toLowerCase(); // e.g. "05:00 p.m." -> "05:00 pm"
            const [time, period] = cleanTime.split(' ');
            let [h, m] = time.split(':').map(Number);
            if (period === 'pm' && h < 12) h += 12;
            if (period === 'am' && h === 12) h = 0;
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`;
          } catch (e) {
            return '12:00:00';
          }
        };
        const scheduledDate = dateStr && timeStr ? `${dateStr}T${parseScheduledTime(timeStr)}` : new Date().toISOString();
        
        const { data: newOrder, error } = await supabase
          .from('orders')
          .insert({
            display_id: orderDisplayId,
            client_id: currentUser.id,
            provider_id: providerId,
            service_requested: servicesParam || 'Servicio General',
            status: 'pending',
            total_amount: basePrice,
            scheduled_date: scheduledDate,
            address: selectedAddress ? `${selectedAddress.street}, ${selectedAddress.city}` : 'Dirección pendiente',
            payment_status: 'pending'
          })
          .select()
          .single();

        if (error) throw error;
        console.log('Order created successfully:', newOrder);
        router.push(`/cliente/ordenes/${newOrder.id}`);
      } catch (err: any) {
        console.error('CRITICAL: Error creating order:', err);
        setErrorStatus(err.message || 'Error desconocido al crear la orden');
        setIsProcessing(false);
      }
    }
  };

  const renderSelection = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-500">
      <button 
        onClick={() => setMethod('stripe')}
        className={`w-full p-6 rounded-[2rem] border-2 transition-all flex items-center gap-6 ${method === 'stripe' ? 'border-primary bg-primary/5 shadow-inner' : 'border-slate-100 bg-white shadow-sm'}`}
      >
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${method === 'stripe' ? 'bg-primary text-white' : 'bg-slate-50 text-slate-300'}`}>
          <CreditCard size={28} />
        </div>
        <div className="text-left flex-1">
          <p className="font-black text-brand-night uppercase text-xs tracking-widest">Tarjeta Internacional (Stripe)</p>
          <p className="text-[10px] text-slate-400 font-bold">Crédito o Débito / Apple Pay</p>
        </div>
        {method === 'stripe' && <Check size={20} className="text-primary" strokeWidth={3} />}
      </button>

      <button 
        onClick={() => setMethod('conekta_spei')}
        className={`w-full p-6 rounded-[2rem] border-2 transition-all flex items-center gap-6 ${method === 'conekta_spei' ? 'border-primary bg-primary/5 shadow-inner' : 'border-slate-100 bg-white shadow-sm'}`}
      >
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${method === 'conekta_spei' ? 'bg-primary text-white' : 'bg-slate-50 text-slate-300'}`}>
          <Landmark size={28} />
        </div>
        <div className="text-left flex-1">
          <p className="font-black text-brand-night uppercase text-xs tracking-widest">Transferencia SPEI (Conekta)</p>
          <p className="text-[10px] text-slate-400 font-bold">Comisión 0% / Liberación inmediata</p>
        </div>
        {method === 'conekta_spei' && <Check size={20} className="text-primary" strokeWidth={3} />}
      </button>

      <button 
        onClick={() => setMethod('conekta_oxxo')}
        className={`w-full p-6 rounded-[2rem] border-2 transition-all flex items-center gap-6 ${method === 'conekta_oxxo' ? 'border-primary bg-primary/5 shadow-inner' : 'border-slate-100 bg-white shadow-sm'}`}
      >
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${method === 'conekta_oxxo' ? 'bg-primary text-white' : 'bg-slate-50 text-slate-300'}`}>
          <ShoppingBag size={28} />
        </div>
        <div className="text-left flex-1">
          <p className="font-black text-brand-night uppercase text-xs tracking-widest">Pago en OXXO (Conekta)</p>
          <p className="text-[10px] text-slate-400 font-bold">Efectivo / Referencia digital</p>
        </div>
        {method === 'conekta_oxxo' && <Check size={20} className="text-primary" strokeWidth={3} />}
      </button>
    </div>
  );

  const renderDetails = () => {
    switch (method) {
      case 'stripe':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-50">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
                   <CardIcon size={20} />
                </div>
                <h3 className="text-sm font-black text-brand-night uppercase tracking-widest">Datos de Tarjeta</h3>
             </div>
             <div className="space-y-4">
                <div className="relative">
                   <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1.5 ml-1">Número de Tarjeta</p>
                   <Input placeholder="0000 0000 0000 0000" className="h-14 rounded-2xl border-slate-100 bg-slate-50/50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1.5 ml-1">Expiración</p>
                      <Input placeholder="MM / YY" className="h-14 rounded-2xl border-slate-100 bg-slate-50/50" />
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1.5 ml-1">CVC</p>
                      <Input placeholder="123" className="h-14 rounded-2xl border-slate-100 bg-slate-50/50" />
                   </div>
                </div>
             </div>
             <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                <ShieldCheck size={14} className="text-emerald-500" />
                Encriptado con SSL de 256 bits
             </div>
          </div>
        );
      case 'conekta_spei':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-50">
             <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex gap-4">
                <Info size={20} className="text-amber-500 shrink-0" />
                <p className="text-[10px] text-amber-700 font-bold leading-relaxed">
                   Realiza la transferencia exacta desde tu banca móvil. El servicio se confirmará automáticamente al recibir los fondos.
                </p>
             </div>
             <div className="space-y-5">
                <div className="flex justify-between items-center p-5 rounded-2xl bg-slate-50/80 border border-slate-100">
                   <div>
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Banco Receptor</p>
                      <p className="text-sm font-black text-brand-night uppercase">STP (Sistema de Transf.)</p>
                   </div>
                   <Copy size={16} className="text-slate-300 hover:text-primary cursor-pointer" />
                </div>
                <div className="flex justify-between items-center p-5 rounded-2xl bg-slate-50/80 border border-slate-100">
                   <div>
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">CLABE Interbancaria</p>
                      <p className="text-sm font-black text-brand-night">6461 8011 2400 0000 01</p>
                   </div>
                   <Copy size={16} className="text-slate-300 hover:text-primary cursor-pointer" />
                </div>
                <div className="flex justify-between items-center p-5 rounded-2xl bg-slate-50/80 border border-slate-100">
                   <div>
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Concepto</p>
                      <p className="text-sm font-black text-brand-night uppercase">PAGO IMENDLY {provider.name.split(' ')[0]}</p>
                   </div>
                   <Copy size={16} className="text-slate-300 hover:text-primary cursor-pointer" />
                </div>
             </div>
          </div>
        );
      case 'conekta_oxxo':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-50 text-center">
             <div className="space-y-4">
                <div className="w-24 h-24 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-xl">
                   <ShoppingBag size={40} />
                </div>
                <h3 className="text-lg font-black text-brand-night uppercase tracking-tighter">Ficha de Pago OXXO</h3>
             </div>

             <div className="py-8 border-y-2 border-dashed border-slate-100 space-y-4">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Referencia de Pago</p>
                <div className="bg-slate-50 p-6 rounded-2xl">
                   <p className="text-2xl font-black text-brand-night tracking-[0.2em]">1234-5678-9012-34</p>
                </div>
                {/* Simulated barcode */}
                <div className="flex gap-1 justify-center h-16 opacity-30 mt-6">
                   {[1,3,1,2,5,1,2,4,1,3,1,2,4,1,2,5,1,3,1].map((w, i) => (
                      <div key={i} className={`bg-black h-full rounded-sm`} style={{ width: `${w * 2}px` }} />
                   ))}
                </div>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Válido por 48 horas</p>
             </div>

             <div className="text-left space-y-3">
                <p className="text-[10px] font-black text-brand-night uppercase tracking-widest mb-2">Instrucciones</p>
                <ol className="text-[10px] text-slate-400 font-bold space-y-2 list-decimal ml-4">
                   <li>Dicta la referencia al cajero o muestra esta pantalla.</li>
                   <li>Realiza el pago en efectivo (se cobra comisión externa en OXXO).</li>
                   <li>Conserva tu comprobante de pago.</li>
                </ol>
             </div>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center animate-pulse">
          <Logo size={48} className="mx-auto mb-4" />
          <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Cargando Checkout...</p>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center px-8">
          <h1 className="text-2xl font-black text-brand-night uppercase mb-4 tracking-tighter">Servicio no encontrado</h1>
          <p className="text-xs text-slate-400 font-bold mb-8 uppercase tracking-widest">El enlace es inválido o el profesional ya no está disponible.</p>
          <Button onClick={() => router.push('/cliente')} variant="outline" className="px-10 rounded-2xl text-[10px] tracking-[0.2em] uppercase font-black">
            Ir al Inicio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-12">
      <header className="px-8 py-8 flex items-center justify-between sticky top-0 bg-slate-50/90 backdrop-blur-xl z-50">
        <button 
          onClick={() => step === 'details' ? setStep('selection') : router.back()} 
          className="w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center text-brand-night border border-slate-100"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 px-6 text-center">
           <p className="text-[10px] font-black text-brand-night/30 uppercase tracking-[0.3em]">
             {step === 'selection' ? 'Resumen de Contratación' : 'Finalizar Transacción'}
           </p>
           <h1 className="text-xl font-black text-brand-night uppercase tracking-tighter">
             {step === 'selection' ? 'Selección de Pago' : 'Detalles de Pago'}
           </h1>
        </div>
        <div className="w-12" />
      </header>

      <div className="px-8 max-w-4xl mx-auto grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-8">
           {step === 'selection' ? renderSelection() : renderDetails()}

           <div className="p-8 bg-brand-night rounded-[2.5rem] text-white flex items-center gap-6 relative overflow-hidden">
              <div className="absolute right-[-20px] top-[-20px] opacity-10">
                 <ShieldCheck size={120} strokeWidth={1} />
              </div>
              <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center border border-white/20">
                 <ShieldCheck size={32} />
              </div>
              <div className="relative z-10">
                 <p className="text-xs font-black uppercase tracking-widest mb-1">Pago Protegido por I Mendly</p>
                 <p className="text-[10px] text-white/40 font-bold leading-relaxed">
                    Tu dinero está seguro en Escrow hasta que confirmes la finalización satisfactoria de tu servicio.
                 </p>
              </div>
           </div>
        </div>

        <div className="lg:col-span-2">
           <Card className="p-10 rounded-[3rem] sticky top-36 border-none shadow-[0_48px_128px_-12px_rgba(0,0,0,0.1)] bg-white">
              <h2 className="text-lg font-black text-brand-night uppercase tracking-tight mb-8">Resumen Final</h2>
              
              <div className="flex items-center gap-4 mb-8">
                 <Avatar src={(provider as any).image} name={provider.name} className="w-16 h-16 rounded-2xl shadow-lg" />
                 <div>
                    <h3 className="font-black text-brand-night uppercase text-sm tracking-tight">{provider.name}</h3>
                    <Badge variant="default" className="text-[8px] uppercase tracking-widest px-2 py-0.5 mt-1">
                      {provider.categories?.[0] || 'Servicio'}
                    </Badge>
                 </div>
              </div>

              <div className="space-y-4 border-y border-slate-50 py-8 mb-8">
                 {selectedServices.length > 0 ? (
                    selectedServices.map((s, i) => {
                       const service = (provider.services || []).find((ps: any) => ps.name === s);
                       return (
                        <div key={i} className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                           <span className="text-slate-300">{s}</span>
                           <span className="text-brand-night">
                              ${service?.price || 0}
                           </span>
                        </div>
                       );
                    })
                 ) : (
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                       <span className="text-slate-300">Reserva de Servicio</span>
                       <span className="text-brand-night">${provider.price}</span>
                    </div>
                 )}
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest pt-4 border-t border-slate-100 mt-2">
                    <span className="text-brand-night">Total a Pagar</span>
                    <span className="text-2xl font-black text-brand-night tracking-tighter">${basePrice}</span>
                 </div>
              </div>

              <div className="mb-10">
                 <p className="text-[10px] font-black text-brand-night/20 uppercase tracking-[0.3em] mb-3">Método seleccionado</p>
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-brand-night">
                       {method === 'stripe' ? <CreditCard size={14} /> : method === 'conekta_spei' ? <Landmark size={14} /> : <ShoppingBag size={14} />}
                    </div>
                    <p className="text-[10px] font-black text-brand-night uppercase tracking-widest">
                       {method === 'stripe' ? 'Stripe' : method === 'conekta_spei' ? 'Conekta SPEI' : 'Conekta OXXO'}
                    </p>
                 </div>
              </div>

              <Button 
                onClick={handleProceed}
                disabled={isProcessing}
                className="w-full py-7 text-[10px] tracking-[0.4em] uppercase font-black rounded-2xl shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                {isProcessing ? 'Procesando...' : step === 'selection' ? 'Continuar' : 'Confirmar Pago Seguro'}
              </Button>

              {errorStatus && (
                <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl">
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-widest text-center">
                    {errorStatus}
                  </p>
                </div>
              )}
              
              <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-widest mt-6 leading-relaxed">
                 Al pagar confirmas que estás de acuerdo con nuestras <br />
                 <span className="text-brand-night underline">Políticas de Privacidad</span>
              </p>
           </Card>
        </div>
      </div>
    </main>
  );
}
