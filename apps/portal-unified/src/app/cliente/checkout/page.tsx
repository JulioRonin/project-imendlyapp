"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Avatar } from '@i-mendly/shared/components/Avatar';
import { Logo } from '@i-mendly/shared/Logo';
import {
  ArrowLeft, CreditCard, Landmark, ShoppingBag,
  ShieldCheck, Check, Info, Copy,
} from 'lucide-react';
import { useState, useEffect , Suspense} from 'react';
import { supabase } from '../../../lib/supabase';

type PaymentStep = 'selection' | 'details';
type PaymentMethod = 'stripe' | 'conekta_spei' | 'conekta_oxxo';

const METHOD_OPTIONS: { id: PaymentMethod; icon: typeof CreditCard; title: string; caption: string }[] = [
  { id: 'stripe', icon: CreditCard, title: 'Tarjeta internacional', caption: 'Crédito o débito · Apple Pay (Stripe)' },
  { id: 'conekta_spei', icon: Landmark, title: 'Transferencia SPEI', caption: 'Comisión 0% · Liberación inmediata (Conekta)' },
  { id: 'conekta_oxxo', icon: ShoppingBag, title: 'Pago en OXXO', caption: 'Efectivo · Referencia digital (Conekta)' },
];

const inputCls =
  'w-full h-14 px-5 rounded-[1.25rem] bg-[#FBF8F2] text-[#1F1C18] text-[14px] font-semibold placeholder:text-[#ADA398] placeholder:font-medium outline-none focus:ring-2 focus:ring-primary/30 transition-shadow';

function CheckoutPage() {
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
    <div className="space-y-3">
      {METHOD_OPTIONS.map((opt, i) => {
        const active = method === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => setMethod(opt.id)}
            className={`v2-rise v2-d${i + 1} w-full p-5 rounded-[1.75rem] flex items-center gap-4 text-left v2-press transition-all ${
              active
                ? 'bg-[#F6E6DD]/70 ring-2 ring-primary v2-shadow-lift'
                : 'bg-white v2-shadow-soft'
            }`}
          >
            <span className={`w-12 h-12 shrink-0 rounded-[1.05rem] flex items-center justify-center transition-colors ${
              active ? 'bg-primary text-white' : 'bg-[#F6E6DD] text-primary'
            }`}>
              <opt.icon size={22} />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-[14.5px] font-semibold text-[#1F1C18] tracking-tight">{opt.title}</span>
              <span className="block text-[12.5px] font-medium text-[#7B7267]">{opt.caption}</span>
            </span>
            {active && (
              <span className="w-6 h-6 shrink-0 rounded-full bg-primary text-white flex items-center justify-center">
                <Check size={13} strokeWidth={3} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  const renderDetails = () => {
    switch (method) {
      case 'stripe':
        return (
          <div className="v2-rise bg-white p-7 rounded-[1.75rem] v2-shadow-soft space-y-5">
            <div className="flex items-center gap-3.5">
              <span className="w-11 h-11 rounded-[1.05rem] bg-[#F6E6DD] text-primary flex items-center justify-center">
                <CreditCard size={20} />
              </span>
              <h3 className="text-[16px] font-semibold tracking-tight text-[#1F1C18]">Datos de tarjeta</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#ADA398] mb-2 ml-1">Número de tarjeta</p>
                <input placeholder="0000 0000 0000 0000" className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#ADA398] mb-2 ml-1">Expiración</p>
                  <input placeholder="MM / YY" className={inputCls} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#ADA398] mb-2 ml-1">CVC</p>
                  <input placeholder="123" className={inputCls} />
                </div>
              </div>
            </div>
            <p className="flex items-center gap-2 text-[12px] text-[#7B7267] font-medium">
              <ShieldCheck size={14} className="text-primary" />
              Encriptado con SSL de 256 bits
            </p>
          </div>
        );
      case 'conekta_spei':
        return (
          <div className="v2-rise bg-white p-7 rounded-[1.75rem] v2-shadow-soft space-y-5">
            <div className="bg-amber-50 p-5 rounded-[1.25rem] flex gap-3.5">
              <Info size={18} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[13px] text-amber-700 font-medium leading-relaxed">
                Realiza la transferencia exacta desde tu banca móvil. El servicio se confirmará automáticamente al recibir los fondos.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-5 rounded-[1.25rem] bg-[#FBF8F2]">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#ADA398] mb-1">Banco receptor</p>
                  <p className="text-[14px] font-semibold text-[#1F1C18]">STP (Sistema de Transf.)</p>
                </div>
                <Copy size={16} className="text-[#ADA398] hover:text-primary cursor-pointer transition-colors" />
              </div>
              <div className="flex justify-between items-center p-5 rounded-[1.25rem] bg-[#FBF8F2]">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#ADA398] mb-1">CLABE interbancaria</p>
                  <p className="text-[14px] font-semibold text-[#1F1C18] tabular-nums">6461 8011 2400 0000 01</p>
                </div>
                <Copy size={16} className="text-[#ADA398] hover:text-primary cursor-pointer transition-colors" />
              </div>
              <div className="flex justify-between items-center p-5 rounded-[1.25rem] bg-[#FBF8F2]">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#ADA398] mb-1">Concepto</p>
                  <p className="text-[14px] font-semibold text-[#1F1C18]">PAGO IMENDLY {provider.name.split(' ')[0]}</p>
                </div>
                <Copy size={16} className="text-[#ADA398] hover:text-primary cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
        );
      case 'conekta_oxxo':
        return (
          <div className="v2-rise bg-white p-7 rounded-[1.75rem] v2-shadow-soft space-y-7 text-center">
            <div className="space-y-4">
              <span className="w-20 h-20 rounded-[1.5rem] bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                <ShoppingBag size={32} strokeWidth={1.8} />
              </span>
              <h3 className="text-[18px] font-semibold tracking-tight text-[#1F1C18]">Ficha de pago OXXO</h3>
            </div>

            <div className="py-7 border-y border-black/[0.06] space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#ADA398]">Referencia de pago</p>
              <div className="bg-[#FBF8F2] p-5 rounded-[1.25rem]">
                <p className="text-[22px] font-bold text-[#1F1C18] tracking-[0.14em] tabular-nums">1234-5678-9012-34</p>
              </div>
              {/* Simulated barcode */}
              <div className="flex gap-1 justify-center h-14 opacity-30 mt-5">
                {[1,3,1,2,5,1,2,4,1,3,1,2,4,1,2,5,1,3,1].map((w, i) => (
                  <div key={i} className="bg-black h-full rounded-sm" style={{ width: `${w * 2}px` }} />
                ))}
              </div>
              <p className="text-[11px] font-medium text-[#ADA398]">Válido por 48 horas</p>
            </div>

            <div className="text-left space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#1F1C18] mb-2">Instrucciones</p>
              <ol className="text-[13px] text-[#7B7267] font-medium space-y-2 list-decimal ml-4">
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
      <div className="min-h-screen flex items-center justify-center bg-[#F4F0E8]">
        <div className="text-center animate-pulse">
          <Logo size={48} className="mx-auto mb-4" />
          <p className="text-[13px] font-semibold text-[#7B7267]">Cargando checkout…</p>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F0E8]">
        <div className="text-center px-8">
          <h1 className="text-[22px] font-semibold tracking-tight text-[#1F1C18] mb-3">Servicio no encontrado</h1>
          <p className="text-[14px] font-medium text-[#7B7267] mb-8 max-w-xs mx-auto">
            El enlace es inválido o el profesional ya no está disponible.
          </p>
          <button
            onClick={() => router.push('/cliente')}
            className="h-14 px-8 rounded-full bg-primary text-white text-[13px] font-bold shadow-lg shadow-primary/25 v2-press hover:bg-primary-dark transition-colors"
          >
            Ir al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F0E8] pb-12">
      {/* ── Header interno v2 ── */}
      <header className="v2-rise sticky top-0 z-50 bg-[#F4F0E8]/85 backdrop-blur-xl">
        <div className="max-w-md mx-auto px-6 py-5 flex items-center gap-4">
          <button
            onClick={() => step === 'details' ? setStep('selection') : router.back()}
            aria-label="Volver"
            className="w-12 h-12 shrink-0 rounded-full bg-white v2-shadow-soft flex items-center justify-center text-[#1F1C18] v2-press"
          >
            <ArrowLeft size={19} />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
              {step === 'selection' ? 'Resumen de contratación' : 'Finalizar transacción'}
            </p>
            <h1 className="text-[22px] font-semibold tracking-tight text-[#1F1C18] leading-tight">
              {step === 'selection' ? 'Selección de pago' : 'Detalles de pago'}
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-6 mt-2 space-y-6">
        {/* ── Resumen — tarjeta ink con total protagonista ── */}
        <section className="v2-rise v2-d1 relative overflow-hidden rounded-[2.25rem] bg-[#1F1C18] text-white p-7 v2-shadow-float">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/25 blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="flex items-center gap-3.5 mb-6">
              <Avatar src={(provider as any).image} name={provider.name} size="md" className="ring-2 ring-white/15" />
              <div className="min-w-0">
                <h3 className="text-[15px] font-semibold tracking-tight truncate">{provider.name}</h3>
                <p className="text-[12px] font-medium text-white/50">{provider.categories?.[0] || 'Servicio'}</p>
              </div>
            </div>

            {/* Desglose */}
            <div className="space-y-2.5 border-t border-white/10 pt-5 mb-6">
              {selectedServices.length > 0 ? (
                selectedServices.map((s, i) => {
                  const service = (provider.services || []).find((ps: any) => ps.name === s);
                  return (
                    <div key={i} className="flex justify-between items-center gap-4">
                      <span className="text-[13px] font-medium text-white/50 truncate">{s}</span>
                      <span className="text-[13.5px] font-semibold text-white tabular-nums">${service?.price || 0}</span>
                    </div>
                  );
                })
              ) : (
                <div className="flex justify-between items-center gap-4">
                  <span className="text-[13px] font-medium text-white/50">Reserva de servicio</span>
                  <span className="text-[13.5px] font-semibold text-white tabular-nums">${provider.price}</span>
                </div>
              )}
            </div>

            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary mb-2">Total a pagar</p>
            <p className="text-[44px] font-bold tracking-tight leading-none tabular-nums">${basePrice}</p>
          </div>
        </section>

        {/* ── Método / detalles ── */}
        {step === 'selection' ? renderSelection() : renderDetails()}

        {/* ── Protección Escrow ── */}
        <div className="v2-rise v2-d4 rounded-[1.75rem] bg-[#F6E6DD] p-6 flex items-center gap-4">
          <span className="w-12 h-12 shrink-0 rounded-[1.05rem] bg-white text-primary flex items-center justify-center v2-shadow-soft">
            <ShieldCheck size={22} />
          </span>
          <div>
            <p className="text-[13.5px] font-bold tracking-tight text-[#1F1C18] mb-0.5">Pago protegido por I mendly</p>
            <p className="text-[12.5px] font-medium text-[#7B7267] leading-relaxed">
              Tu dinero está seguro en Escrow hasta que confirmes la finalización de tu servicio.
            </p>
          </div>
        </div>

        {/* ── Método seleccionado (solo en detalles) ── */}
        {step === 'details' && (
          <div className="flex items-center gap-3 px-1">
            <span className="w-9 h-9 rounded-[0.85rem] bg-white v2-shadow-soft flex items-center justify-center text-[#1F1C18]">
              {method === 'stripe' ? <CreditCard size={15} /> : method === 'conekta_spei' ? <Landmark size={15} /> : <ShoppingBag size={15} />}
            </span>
            <p className="text-[12.5px] font-semibold text-[#7B7267]">
              Método: <span className="text-[#1F1C18]">{method === 'stripe' ? 'Stripe' : method === 'conekta_spei' ? 'Conekta SPEI' : 'Conekta OXXO'}</span>
            </p>
          </div>
        )}

        {errorStatus && (
          <div className="p-4 bg-red-50 rounded-[1.25rem]">
            <p className="text-[12.5px] font-semibold text-red-600 text-center">{errorStatus}</p>
          </div>
        )}

        {/* ── Confirmar — pill verde sticky abajo ── */}
        <div className="sticky bottom-5 z-40 pt-2">
          <button
            onClick={handleProceed}
            disabled={isProcessing}
            className="w-full h-14 rounded-full bg-primary text-white text-[13px] font-bold shadow-lg shadow-primary/25 v2-press hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:pointer-events-none"
          >
            {isProcessing ? 'Procesando…' : step === 'selection' ? 'Continuar' : 'Confirmar pago seguro'}
          </button>
        </div>

        <p className="text-center text-[11.5px] font-medium text-[#ADA398] leading-relaxed">
          Al pagar confirmas que estás de acuerdo con nuestras{' '}
          <span className="text-[#1F1C18] font-semibold underline">Políticas de privacidad</span>
        </p>
      </div>
    </main>
  );
}

// useSearchParams requiere un límite de Suspense para el prerender de producción
export default function CheckoutPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F4F0E8]" />}>
      <CheckoutPage />
    </Suspense>
  );
}
