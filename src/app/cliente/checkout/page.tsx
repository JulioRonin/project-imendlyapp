'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Check, ChevronRight, CreditCard, Landmark, LockKeyhole, MapPin, ShieldCheck, ShoppingBag } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

type PaymentMethod = 'stripe' | 'conekta_spei' | 'conekta_oxxo';
type PaymentStep = 'selection' | 'details';

type Provider = {
  id: string;
  name?: string;
  image?: string;
  price?: number;
  categories?: string[];
  provider_services?: { name: string; price?: number }[];
  services?: { name: string; price?: number }[];
};

function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const providerId = searchParams.get('providerId');
  const servicesParam = searchParams.get('services');
  const totalParam = searchParams.get('total');
  const [provider, setProvider] = useState<Provider | null>(null);
  const [step, setStep] = useState<PaymentStep>('selection');
  const [method, setMethod] = useState<PaymentMethod>('stripe');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
  const [selectedAddress, setSelectedAddress] = useState('Dirección pendiente');
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentUser(user);
          const { data: addresses } = await supabase.from('user_addresses').select('*').eq('user_id', user.id);
          if (addresses?.[0]) setSelectedAddress(`${addresses[0].street}, ${addresses[0].city}`);
        }
        if (providerId) {
          const { data } = await supabase.from('providers').select('*, users(full_name, avatar_url), provider_services(*)').eq('id', providerId).single();
          if (data) setProvider({ ...data, name: data.users?.full_name || data.name, image: data.users?.avatar_url || data.image, services: data.provider_services || [] });
        }
      } catch (error) {
        console.error('Error fetching checkout data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [providerId]);

  const selectedServices = servicesParam ? servicesParam.split(',') : [];
  const basePrice = totalParam ? Number(totalParam.replace(/[^0-9]/g, '')) : provider?.price || 0;
  const providerName = provider?.name || 'Profesional seleccionado';

  const handleProceed = async () => {
    if (step === 'selection') {
      setStep('details');
      return;
    }
    if (!currentUser) {
      setErrorStatus('Inicia sesión para continuar con un pago protegido.');
      return;
    }
    setIsProcessing(true);
    setErrorStatus(null);
    try {
      const orderDisplayId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const { data: newOrder, error } = await supabase.from('orders').insert({
        display_id: orderDisplayId,
        client_id: currentUser.id,
        provider_id: providerId,
        service_requested: servicesParam || 'Servicio general',
        status: 'pending',
        total_amount: basePrice,
        scheduled_date: new Date().toISOString(),
        address: selectedAddress,
        payment_status: 'pending',
      }).select().single();
      if (error) throw error;
      router.push(`/cliente/ordenes/${newOrder.id}`);
    } catch (error: unknown) {
      setErrorStatus(error instanceof Error ? error.message : 'No pudimos crear la orden. Intenta de nuevo.');
      setIsProcessing(false);
    }
  };

  if (isLoading) return <div className="flex min-h-screen items-center justify-center bg-[#FAF8F4]"><div className="text-center"><div className="mx-auto mb-4 h-10 w-10 animate-pulse rounded-2xl bg-[#111111]" /><p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#6F6B66]">Preparando tu reserva</p></div></div>;

  if (!provider) return <div className="flex min-h-screen items-center justify-center bg-[#FAF8F4] px-6"><div className="max-w-md text-center"><p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#BBA7F6]">i mendly</p><h1 className="mt-4 text-4xl font-semibold tracking-[-0.06em]">Este servicio ya no está disponible.</h1><p className="mt-4 text-sm leading-6 text-[#6F6B66]">Regresa al inicio para encontrar otra opción curada cerca de ti.</p><Link href="/cliente" className="mt-8 inline-flex rounded-xl bg-[#111111] px-5 py-3 text-xs font-bold text-white">Ir al inicio</Link></div></div>;

  return (
    <main className="min-h-screen bg-[#FAF8F4] pb-12 text-[#171717]">
      <header className="sticky top-0 z-40 border-b border-[#171717]/[0.06] bg-[#FAF8F4]/90 px-5 py-4 backdrop-blur-xl sm:px-8"><div className="mx-auto flex max-w-6xl items-center justify-between"><button onClick={() => step === 'details' ? setStep('selection') : router.back()} aria-label="Regresar" className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"><ArrowLeft size={17} /></button><div className="text-center"><p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#6F6B66]">{step === 'selection' ? 'Paso 1 de 2' : 'Paso 2 de 2'}</p><h1 className="mt-1 text-lg font-semibold tracking-[-0.04em]">{step === 'selection' ? 'Protege tu reserva' : 'Confirma tu pago'}</h1></div><span className="h-10 w-10 rounded-full bg-[#E6DFFF]" /></div></header>

      <div className="mx-auto grid max-w-6xl gap-8 px-5 pt-10 sm:px-8 lg:grid-cols-[1fr_380px] lg:pt-14">
        <div className="space-y-6">
          <section className="rounded-[1.75rem] bg-[#111111] p-7 text-[#F8F5F0] sm:p-9"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#BBA7F6]">Tu profesional</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.06em]">{providerName}</h2><p className="mt-2 text-sm text-white/52">{provider.categories?.[0] || 'Servicio para el hogar'} · Respaldo I mendly</p></div><ShieldCheck className="text-[#3CBFA1]" size={25} /></div><div className="mt-7 flex items-center gap-3 border-t border-white/10 pt-5 text-xs text-white/58"><MapPin size={15} className="text-[#FFAA78]" /> {selectedAddress}</div></section>

          {step === 'selection' ? <section><div className="mb-4"><p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#6F6B66]">Elige cómo pagar</p><h2 className="mt-1 text-2xl font-semibold tracking-[-0.05em]">Tu dinero queda protegido</h2></div><div className="space-y-3"><PaymentOption selected={method === 'stripe'} onClick={() => setMethod('stripe')} icon={<CreditCard size={19} />} title="Tarjeta" detail="Crédito, débito o Apple Pay" tag="Recomendado" /><PaymentOption selected={method === 'conekta_spei'} onClick={() => setMethod('conekta_spei')} icon={<Landmark size={19} />} title="Transferencia SPEI" detail="Sin comisión adicional" /><PaymentOption selected={method === 'conekta_oxxo'} onClick={() => setMethod('conekta_oxxo')} icon={<ShoppingBag size={19} />} title="Pago en OXXO" detail="Recibe una referencia digital" /></div></section> : <PaymentDetails method={method} />}

          <section className="rounded-[1.5rem] border border-[#3CBFA1]/20 bg-[#DDF5EE] p-5"><div className="flex gap-3"><LockKeyhole size={19} className="mt-0.5 shrink-0 text-[#247E69]" /><div><h3 className="text-sm font-bold text-[#247E69]">Anticipo protegido por i mendly</h3><p className="mt-1 text-xs leading-5 text-[#247E69]/75">El pago se mantiene en resguardo y solo se libera cuando confirmes que el trabajo avanzó correctamente. Si algo sale mal, abrimos una solución contigo.</p></div></div></section>
        </div>

        <aside className="lg:sticky lg:top-28 lg:h-fit"><section className="rounded-[1.75rem] bg-white p-6 shadow-[0_18px_60px_rgba(17,17,17,.09)] sm:p-7"><div className="flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#6F6B66]">Resumen</p><span className="rounded-full bg-[#E6DFFF] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-[#5D4C99]">Curado</span></div><div className="mt-6 space-y-3 border-b border-[#171717]/[0.08] pb-6">{selectedServices.length ? selectedServices.map((service) => <div key={service} className="flex justify-between gap-3 text-sm"><span className="text-[#6F6B66]">{service}</span><span className="font-semibold">${provider.services?.find((item) => item.name === service)?.price || 0}</span></div>) : <div className="flex justify-between text-sm"><span className="text-[#6F6B66]">Reserva de servicio</span><span className="font-semibold">${provider.price || basePrice}</span></div>}<div className="flex justify-between pt-4 text-base"><span className="font-semibold">Total protegido</span><span className="text-2xl font-semibold tracking-[-0.05em]">${basePrice}</span></div></div><div className="mt-5 flex items-center gap-3 text-xs text-[#6F6B66]"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F1EEE8]"><LockKeyhole size={14} /></span><span>Pago cifrado y retenido hasta tu aprobación</span></div><button onClick={handleProceed} disabled={isProcessing} className="mt-6 flex w-full items-center justify-between rounded-xl bg-[#FFAA78] px-4 py-4 text-xs font-bold text-[#111111] transition hover:bg-[#F486A1] disabled:cursor-wait disabled:opacity-60"><span>{isProcessing ? 'Procesando...' : step === 'selection' ? 'Continuar' : 'Confirmar pago protegido'}</span><ChevronRight size={17} /></button>{errorStatus && <p className="mt-4 rounded-xl bg-[#F486A1]/15 p-3 text-center text-xs font-semibold text-[#A3435C]">{errorStatus}</p>}<p className="mt-5 text-center text-[10px] leading-5 text-[#6F6B66]">Al continuar aceptas los términos de servicio y la política de garantía I mendly.</p></section></aside>
      </div>
    </main>
  );
}

function PaymentOption({ selected, onClick, icon, title, detail, tag }: { selected: boolean; onClick: () => void; icon: React.ReactNode; title: string; detail: string; tag?: string }) {
  return <button onClick={onClick} className={`flex w-full items-center gap-4 rounded-[1.25rem] border p-4 text-left transition ${selected ? 'border-[#FFAA78] bg-[#FFF0E6] shadow-sm' : 'border-[#171717]/[0.08] bg-white hover:border-[#BBA7F6]'}`}><span className={`flex h-11 w-11 items-center justify-center rounded-xl ${selected ? 'bg-[#111111] text-white' : 'bg-[#F1EEE8] text-[#6F6B66]'}`}>{icon}</span><span className="min-w-0 flex-1"><span className="flex items-center gap-2 text-sm font-bold">{title}{tag && <span className="rounded-full bg-[#DDF5EE] px-2 py-1 text-[8px] uppercase tracking-[0.12em] text-[#247E69]">{tag}</span>}</span><span className="mt-1 block text-xs text-[#6F6B66]">{detail}</span></span><span className={`flex h-5 w-5 items-center justify-center rounded-full border ${selected ? 'border-[#111111] bg-[#111111] text-white' : 'border-[#171717]/20'}`}>{selected && <Check size={12} strokeWidth={3} />}</span></button>;
}

function PaymentDetails({ method }: { method: PaymentMethod }) {
  if (method === 'conekta_oxxo') return <section className="rounded-[1.5rem] bg-white p-7 shadow-sm"><div className="flex items-center gap-3"><ShoppingBag className="text-[#F486A1]" /><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6F6B66]">Referencia OXXO</p><h2 className="mt-1 text-xl font-semibold">Paga en cualquier tienda</h2></div></div><div className="mt-7 rounded-xl bg-[#F1EEE8] p-6 text-center"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6F6B66]">Referencia</p><p className="mt-3 text-2xl font-semibold tracking-[0.15em]">1234 5678 9012</p><p className="mt-3 text-xs text-[#6F6B66]">Válida durante 48 horas</p></div></section>;
  if (method === 'conekta_spei') return <section className="rounded-[1.5rem] bg-white p-7 shadow-sm"><div className="flex items-center gap-3"><Landmark className="text-[#BBA7F6]" /><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6F6B66]">Transferencia SPEI</p><h2 className="mt-1 text-xl font-semibold">Transfiere de forma segura</h2></div></div><div className="mt-7 space-y-3 text-sm"><div className="rounded-xl bg-[#F1EEE8] p-4"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#6F6B66]">CLABE receptora</p><p className="mt-1 font-bold">6461 8011 2400 0000 01</p></div><div className="rounded-xl bg-[#F1EEE8] p-4"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#6F6B66]">Concepto</p><p className="mt-1 font-bold">PAGO IMENDLY</p></div></div></section>;
  return <section className="rounded-[1.5rem] bg-white p-7 shadow-sm"><div className="flex items-center gap-3"><CreditCard className="text-[#FFAA78]" /><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6F6B66]">Pago con tarjeta</p><h2 className="mt-1 text-xl font-semibold">Tus datos están protegidos</h2></div></div><div className="mt-7 space-y-4"><label className="block text-xs font-semibold text-[#6F6B66]">Número de tarjeta<input placeholder="0000 0000 0000 0000" className="mt-2 h-12 w-full rounded-xl border border-[#171717]/[0.08] bg-[#FAF8F4] px-4 text-sm outline-none focus:border-[#FFAA78]" /></label><div className="grid grid-cols-2 gap-3"><label className="block text-xs font-semibold text-[#6F6B66]">Vencimiento<input placeholder="MM / YY" className="mt-2 h-12 w-full rounded-xl border border-[#171717]/[0.08] bg-[#FAF8F4] px-4 text-sm outline-none focus:border-[#FFAA78]" /></label><label className="block text-xs font-semibold text-[#6F6B66]">CVC<input placeholder="123" className="mt-2 h-12 w-full rounded-xl border border-[#171717]/[0.08] bg-[#FAF8F4] px-4 text-sm outline-none focus:border-[#FFAA78]" /></label></div><p className="flex items-center gap-2 text-xs text-[#6F6B66]"><LockKeyhole size={14} className="text-[#3CBFA1]" /> Procesado con cifrado SSL</p></div></section>;
}

export default function CheckoutPageWrapper() {
  return <Suspense fallback={<div className="min-h-screen bg-[#FAF8F4]" />}><CheckoutPage /></Suspense>;
}
