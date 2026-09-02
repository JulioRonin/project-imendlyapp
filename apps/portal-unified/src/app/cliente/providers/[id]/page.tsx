"use client";

import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  MessageSquare,
  Calendar as CalendarIcon,
  ChevronRight,
  CheckCircle2,
  Pencil,
  BadgeCheck,
  UserX,
} from 'lucide-react';
import Link from 'next/link';
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../../../lib/supabase';
import { RatingPill, Reveal } from '@/components/client/ui';

export default function ProviderProfile({ params }: { params: any }) {
  const router = useRouter();
  const resolvedParams: any = (React as any).use ? (React as any).use(params) : params;
  const id = resolvedParams?.id as string;
  const [provider, setProvider] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProviderData = async () => {
      setIsLoading(true);
      console.log('Fetching provider with ID:', id);
      try {
        // 1. Core provider + user data
        const { data: providerData, error: pError } = await supabase
          .from('providers')
          .select('*, users ( full_name, avatar_url )')
          .eq('id', id)
          .maybeSingle();

        if (pError) {
          console.error('Supabase error fetching provider:', pError);
          throw pError;
        }

        if (!providerData) {
          console.error('No provider data found in DB for ID:', id);
          setIsLoading(false);
          return;
        }

        // 2. Fetch services
        const { data: servicesData, error: sError } = await supabase
          .from('provider_services')
          .select('*')
          .eq('provider_id', id);

        if (sError) console.warn('Services fetch error:', sError);

        // 3. Fetch portfolio
        const { data: portfolioData, error: pfError } = await supabase
          .from('provider_portfolio')
          .select('*')
          .eq('provider_id', id);

        if (pfError) console.warn('Portfolio fetch error (ignore if table missing):', pfError);

        // 4. Fetch reviews
        const { data: reviewsData, error: rError } = await supabase
          .from('reviews')
          .select('*')
          .eq('provider_id', id);

        if (rError) console.warn('Reviews fetch error:', rError);

        // 5. Fetch availability
        const { data: availData, error: aError } = await supabase
          .from('provider_availability')
          .select('*')
          .eq('provider_id', id)
          .eq('is_active', true);

        if (aError) console.warn('Availability fetch error:', aError);

        // 5. Fetch existing orders (to block slots)
        const { data: ordersData, error: oError } = await supabase
          .from('orders')
          .select('scheduled_date')
          .eq('provider_id', id)
          .not('status', 'in', '(cancelled)');

        if (oError) console.warn('Orders fetch error:', oError);

        const user = Array.isArray(providerData.users) ? providerData.users[0] : providerData.users;

        const formatted = {
          ...providerData,
          name: user?.full_name || 'Profesional i-Mendly',
          image: user?.avatar_url || '',
          isTop: (providerData as any).is_top || false,
          categories: providerData.categories || (providerData.category ? [providerData.category] : []),
          services: [
            ...(servicesData || []).map((s: any) => ({
              id: s.id,
              name: s.name,
              price: s.price,
              isRange: s.is_range,
              maxPrice: s.max_price,
              unit: s.unit,
              category: s.category
            })),
            { id: 'custom', name: 'Personalizado o Explica tu necesidad', price: 0, isCustom: true }
          ],
          portfolio: (portfolioData || []).map((p: any) => ({
             id: p.id,
             title: p.title || '',
             image: p.image_url,
             description: p.description || ''
          })),
          reviews: (reviewsData || []).map((r: any) => ({
            id: r.id,
            user: r.user_name || 'Cliente i-Mendly',
            rating: r.rating,
            comment: r.comment,
            date: r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Reciente',
            photo: r.photo_url
          })),
          availability: availData || [],
          busySlots: (ordersData || []).map(o => new Date(o.scheduled_date)),
          verified: providerData.is_verified
        };

        setProvider(formatted);
      } catch (err) {
        console.error('Error fetching provider:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchProviderData();
  }, [id]);

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [customRequestText, setCustomRequestText] = useState('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3, 1)); // Default to April 2026 for now
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Slot Generation Logic
  const availableSlots = useMemo(() => {
    if (!selectedDate || !provider?.availability) return [];

    const dayOfWeek = selectedDate.getDay();
    const dayConfig = provider.availability.find((a: any) => a.day_of_week === dayOfWeek);

    if (!dayConfig || !dayConfig.is_active) return [];

    const slots = [];
    const startTimeStr = dayConfig.start_time || '09:00:00';
    const endTimeStr = dayConfig.end_time || '18:00:00';

    const [startH, startM] = startTimeStr.split(':').map(Number);
    const [endH, endM] = endTimeStr.split(':').map(Number);

    let current = new Date(selectedDate);
    current.setHours(startH, startM, 0, 0);

    const end = new Date(selectedDate);
    end.setHours(endH, endM, 0, 0);

    // Safety break
    let iterations = 0;
    while (current < end && iterations < 24) {
      iterations++;
      const timeStr = current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

      // Check if slot is busy (any overlap in the next hour)
      const slotStart = current.getTime();
      const slotEnd = slotStart + 3600000; // 1 hour later

      const isBusy = provider.busySlots.some((busy: Date) => {
        const busyTime = busy.getTime();
        return busyTime >= slotStart && busyTime < slotEnd;
      });

      if (!isBusy) {
        slots.push(timeStr);
      }

      current.setMinutes(current.getMinutes() + 60);
    }

    return slots;
  }, [selectedDate, provider]);

  const totalPrice = useMemo(() => {
    if (!provider) return 0;
    const selected = (provider.services || []).filter((s: any) => selectedServices.includes(s.name));
    let total = selected.reduce((acc: number, s: any) => acc + s.price, 0);
    // Custom is base price or quote
    if (selectedServices.includes('Personalizado o Explica tu necesidad')) {
      total += 450; // base deposit for custom
    }
    return total;
  }, [provider, selectedServices]);

  const toggleService = (name: string) => {
    setSelectedServices(prev =>
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    );
  };

  const isFormValid = selectedServices.length > 0 && selectedDate !== null && selectedTime !== null &&
    (selectedServices.includes('Personalizado o Explica tu necesidad') ? customRequestText.trim().length > 0 : true);

  const handleBooking = () => {
    if (!isFormValid) return;
    const dateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
    const services = [...selectedServices, customRequestText ? `(Custom: ${customRequestText})` : ''].filter(Boolean).join(',');
    router.push(`/cliente/checkout?providerId=${id}&services=${encodeURIComponent(services)}&total=${totalPrice}&date=${dateStr}&time=${encodeURIComponent(selectedTime)}`);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F4F1EA]">
        <div className="max-w-3xl mx-auto">
          <div className="h-[420px] md:rounded-[2.75rem] md:mt-5 v2-shimmer" />
          <div className="relative z-10 -mt-10 bg-white rounded-t-[2.75rem] md:rounded-[2.75rem] px-6 md:px-10 pt-9 pb-16 space-y-4">
            <div className="h-6 w-1/2 rounded-full v2-shimmer" />
            <div className="h-4 w-1/3 rounded-full v2-shimmer" />
            <div className="grid grid-cols-3 gap-3 pt-4">
              <div className="h-20 rounded-[1.25rem] v2-shimmer" />
              <div className="h-20 rounded-[1.25rem] v2-shimmer" />
              <div className="h-20 rounded-[1.25rem] v2-shimmer" />
            </div>
            <div className="h-24 rounded-[1.75rem] v2-shimmer" />
            <div className="h-24 rounded-[1.75rem] v2-shimmer" />
          </div>
        </div>
      </main>
    );
  }

  if (!provider) {
    return (
      <main className="min-h-screen bg-[#F4F1EA] flex items-center justify-center px-6">
        <div className="v2-rise text-center">
          <div className="w-24 h-24 rounded-[1.75rem] bg-[#E7F2E9] text-primary flex items-center justify-center mx-auto mb-7">
            <UserX size={38} strokeWidth={1.8} />
          </div>
          <h1 className="text-[21px] font-semibold tracking-tight text-[#1B1A17] mb-2">
            Proveedor no encontrado
          </h1>
          <p className="text-[14px] font-medium text-[#7A7468] max-w-xs mx-auto">
            Puede que este perfil ya no esté disponible.
          </p>
          <Link
            href="/cliente/search"
            className="inline-flex items-center justify-center h-14 px-8 mt-8 rounded-full bg-primary text-white text-[13px] font-bold shadow-lg shadow-primary/25 v2-press hover:bg-primary-dark transition-colors"
          >
            Volver a la búsqueda
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F1EA] pb-40">
      <div className="max-w-3xl mx-auto">
        {/* ── Hero image-forward ── */}
        <header className="v2-rise relative h-[420px] md:h-[460px] md:mt-5 md:rounded-[2.75rem] overflow-hidden bg-[#1B1A17]">
          {provider.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={provider.image}
              alt={provider.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#2A2E29] to-[#1B1A17] flex items-center justify-center">
              <span className="text-white/85 text-8xl font-bold">
                {provider.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('')}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Flecha atrás flotante */}
          <button
            onClick={() => window.history.back()}
            aria-label="Regresar"
            className="absolute top-5 left-5 md:top-6 md:left-6 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md v2-shadow-soft flex items-center justify-center text-[#1B1A17] v2-press z-10"
          >
            <ArrowLeft size={19} />
          </button>

          {/* Rating + Certificado flotantes */}
          <div className="absolute top-5 right-5 md:top-6 md:right-6 flex items-center gap-2 z-10">
            {provider.verified && (
              <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md text-white rounded-full pl-2.5 pr-3.5 h-9 text-[12px] font-semibold">
                <BadgeCheck size={14} /> Certificado
              </span>
            )}
            <RatingPill value={Number(provider.rating) || 0} />
          </div>

          {/* Nombre sobre la imagen */}
          <div className="absolute inset-x-0 bottom-0 px-6 md:px-10 pb-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/70 mb-1.5">
              {(provider.categories || []).slice(0, 2).join(' · ') || 'Profesional'}
            </p>
            <h1 className="text-white text-[30px] md:text-4xl font-bold tracking-tight leading-[1.1]">
              {provider.name}
            </h1>
          </div>
        </header>

        {/* ── Contenido empalmado ── */}
        <div className="relative z-10 -mt-10 bg-white rounded-t-[2.75rem] md:rounded-[2.75rem] px-6 md:px-10 pt-8 pb-10">
          {/* Chips de stats */}
          <div className="v2-rise v2-d1 grid grid-cols-3 gap-3">
            <div className="rounded-[1.25rem] bg-[#FBF9F4] border border-black/[0.04] py-4 flex flex-col items-center gap-1">
              <span className="flex items-center gap-1 text-[17px] font-bold text-[#1B1A17] tabular-nums">
                <Star size={14} className="text-amber-400 fill-amber-400" />
                {Number(provider.rating || 0).toFixed(1)}
              </span>
              <span className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#ACA598]">Rating</span>
            </div>
            <div className="rounded-[1.25rem] bg-[#FBF9F4] border border-black/[0.04] py-4 flex flex-col items-center gap-1">
              <span className="text-[17px] font-bold text-[#1B1A17] tabular-nums">
                {provider.reviews?.length || 0}
              </span>
              <span className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#ACA598]">Reseñas</span>
            </div>
            <div className="rounded-[1.25rem] bg-[#FBF9F4] border border-black/[0.04] py-4 flex flex-col items-center gap-1">
              <span className="text-[17px] font-bold text-[#1B1A17] tabular-nums">
                {provider.experience || 0}
              </span>
              <span className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#ACA598]">Años exp.</span>
            </div>
          </div>

          {/* Cobertura */}
          <div className="v2-rise v2-d2 flex flex-wrap items-center gap-x-5 gap-y-2 mt-5 text-[13px] font-medium text-[#7A7468]">
            <span className="flex items-center gap-1.5 min-w-0">
              <MapPin size={14} className="shrink-0 text-primary" />
              <span className="truncate">
                {provider.zones?.length > 0 ? provider.zones.join(', ') : 'Cobertura amplia'}
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-primary" />
              Radio {provider.coverage_radius_km || 10} km
            </span>
          </div>

          {/* Acerca */}
          {provider.about && (
            <section className="v2-rise v2-d3 mt-9">
              <h2 className="text-xl font-semibold tracking-tight text-[#1B1A17] mb-3">
                Acerca del profesional
              </h2>
              <p className="text-[14.5px] font-medium text-[#7A7468] leading-relaxed">
                {provider.about}
              </p>
            </section>
          )}

          {/* ── Servicios ── */}
          <section className="v2-rise v2-d4 mt-10">
            <div className="flex items-end justify-between mb-5">
              <h2 className="text-xl font-semibold tracking-tight text-[#1B1A17]">Servicios</h2>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#ACA598]">
                Elige varios
              </p>
            </div>

            <div className="space-y-8">
              {(provider.categories && provider.categories.length > 0 ? provider.categories : ['Servicios General']).map((cat: string) => {
                const catServices = provider.services.filter((s: any) =>
                  !s.isCustom && (s.category === cat || (!s.category && cat === provider.categories?.[0]) || (cat === 'Servicios General'))
                );

                if (catServices.length === 0) return null;

                return (
                  <div key={cat} className="space-y-3">
                    <h3 className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#ACA598]">
                      {cat}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {catServices.map((s: any, i: number) => {
                        const isSelected = selectedServices.includes(s.name);
                        return (
                          <button
                            key={i}
                            onClick={() => toggleService(s.name)}
                            className={`p-5 rounded-[1.75rem] text-left transition-colors duration-300 v2-press ${
                              isSelected
                                ? 'bg-[#E7F2E9] border border-primary/25'
                                : 'bg-white border border-black/[0.05] v2-shadow-soft hover:border-black/10'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3.5 min-w-0">
                                <span className={`w-10 h-10 shrink-0 rounded-[0.85rem] flex items-center justify-center transition-colors ${
                                  isSelected ? 'bg-primary text-white' : 'bg-[#F4F1EA] text-[#ACA598]'
                                }`}>
                                  <CheckCircle2 size={19} />
                                </span>
                                <div className="min-w-0">
                                  <p className="text-[14.5px] font-semibold text-[#1B1A17] leading-snug">
                                    {s.name}
                                  </p>
                                  <p className="text-[12px] font-medium text-[#ACA598]">
                                    Por {s.unit || 'servicio'}
                                  </p>
                                </div>
                              </div>
                              <p className="shrink-0 text-[16px] font-bold text-primary tabular-nums text-right">
                                ${s.price}
                                {s.isRange && (
                                  <span className="block text-[11.5px] font-semibold text-[#ACA598]">
                                    a ${s.maxPrice}
                                  </span>
                                )}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Opción personalizada, siempre al final */}
              <button
                onClick={() => toggleService('Personalizado o Explica tu necesidad')}
                className={`w-full p-5 rounded-[1.75rem] text-left transition-colors duration-300 v2-press ${
                  selectedServices.includes('Personalizado o Explica tu necesidad')
                    ? 'bg-[#E7F2E9] border border-primary/25'
                    : 'bg-white border border-black/[0.05] v2-shadow-soft hover:border-black/10'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className={`w-10 h-10 shrink-0 rounded-[0.85rem] flex items-center justify-center transition-colors ${
                      selectedServices.includes('Personalizado o Explica tu necesidad')
                        ? 'bg-primary text-white'
                        : 'bg-[#F4F1EA] text-[#ACA598]'
                    }`}>
                      <Pencil size={17} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[14.5px] font-semibold text-[#1B1A17] leading-snug">
                        Personalizado o Explica tu necesidad
                      </p>
                      <p className="text-[12px] font-medium text-[#ACA598]">
                        Explícanos a detalle
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 text-[14px] font-bold text-primary">Cotizar</span>
                </div>
              </button>
            </div>

            {selectedServices.includes('Personalizado o Explica tu necesidad') && (
              <div className="v2-scale mt-4">
                <textarea
                  value={customRequestText}
                  onChange={(e) => setCustomRequestText(e.target.value)}
                  placeholder="Describe exactamente qué necesitas. ¿Medidas, materiales, detalles específicos?"
                  className="w-full bg-[#FBF9F4] rounded-[1.25rem] p-5 text-[14.5px] font-semibold text-[#1B1A17] placeholder:text-[#ACA598] placeholder:font-medium outline-none focus:ring-2 focus:ring-primary/30 transition-shadow h-36 resize-none"
                />
                <p className="text-[12px] font-medium text-[#7A7468] mt-2 px-2">
                  Este monto requerirá cotización final por parte del proveedor tras su revisión.
                </p>
              </div>
            )}
          </section>

          {/* ── Agenda ── */}
          <section className="v2-rise v2-d5 mt-10">
            <h2 className="text-xl font-semibold tracking-tight text-[#1B1A17] mb-5">Agenda</h2>

            <button
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className={`w-full h-14 px-6 rounded-full flex items-center justify-center gap-2.5 text-[13px] font-semibold transition-colors v2-press ${
                isCalendarOpen
                  ? 'bg-[#E7F2E9] text-primary border border-primary/25'
                  : 'bg-white text-[#1B1A17] border border-black/[0.05] v2-shadow-soft'
              }`}
            >
              <CalendarIcon size={16} />
              {selectedDate && selectedTime
                ? `${selectedDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}, ${selectedTime}`
                : 'Elegir fecha y hora'}
            </button>

            {!isFormValid && (
              <p className="text-[12px] font-medium text-[#B45309] text-center mt-3">
                Selecciona un servicio y horario para continuar
              </p>
            )}

            {/* Calendario colapsable */}
            <div className={`transition-all duration-700 ease-in-out ${isCalendarOpen ? 'max-h-[800px] opacity-100 mt-6' : 'max-h-0 opacity-0 overflow-hidden'}`}>
              <div className="rounded-[1.75rem] bg-[#FBF9F4] border border-black/[0.04] p-5">
                <div className="flex justify-between items-center mb-5">
                  <h4 className="text-[14px] font-semibold text-[#1B1A17] capitalize">
                    {currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                  </h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
                      aria-label="Mes anterior"
                      className="w-9 h-9 rounded-full bg-white v2-shadow-soft flex items-center justify-center text-[#7A7468] hover:text-[#1B1A17] transition-colors v2-press"
                    >
                      <ChevronRight className="rotate-180" size={14} />
                    </button>
                    <button
                      onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
                      aria-label="Mes siguiente"
                      className="w-9 h-9 rounded-full bg-white v2-shadow-soft flex items-center justify-center text-[#7A7468] hover:text-[#1B1A17] transition-colors v2-press"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1.5 mb-6">
                  {['D','L','M','M','J','V','S'].map((d, i) => (
                    <div key={i} className="text-center text-[10px] font-bold uppercase tracking-[0.18em] text-[#ACA598]">{d}</div>
                  ))}
                  {/* Calendar Days */}
                  {(() => {
                    const year = currentMonth.getFullYear();
                    const month = currentMonth.getMonth();
                    const firstDayOfMonth = new Date(year, month, 1).getDay();
                    const daysInMonth = new Date(year, month + 1, 0).getDate();

                    const grid = [];
                    // Empty cells for offset
                    for (let j = 0; j < firstDayOfMonth; j++) {
                      grid.push(<div key={`empty-${j}`} />);
                    }

                    // Real days
                    for (let i = 1; i <= daysInMonth; i++) {
                      const day = i;
                      const dateObj = new Date(year, month, day);
                      const dayOfWeek = dateObj.getDay();
                      const isWorkingDay = provider.availability?.some((a: any) => a.day_of_week === dayOfWeek && a.is_active);
                      const isPast = dateObj < new Date(new Date().setHours(0,0,0,0));
                      const isSelectedDay = selectedDate?.getDate() === day && selectedDate?.getMonth() === month && selectedDate?.getFullYear() === year;

                      grid.push(
                        <button
                          key={day}
                          disabled={!isWorkingDay || isPast}
                          onClick={() => setSelectedDate(dateObj)}
                          className={`h-10 rounded-full text-[12px] font-semibold tabular-nums transition-colors v2-press ${
                            isSelectedDay ? 'bg-primary text-white shadow-lg shadow-primary/25' :
                            (isWorkingDay && !isPast) ? 'bg-white text-[#1B1A17] v2-shadow-soft hover:bg-[#E7F2E9]' : 'bg-transparent text-[#ACA598]/60 cursor-not-allowed'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    }
                    return grid;
                  })()}
                </div>

                {selectedDate && (
                  <div className="v2-scale space-y-3">
                    <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#ACA598]">
                      Horarios disponibles
                    </p>
                    <div className="grid grid-cols-2 gap-2.5">
                      {availableSlots.length > 0 ? availableSlots.map((t, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedTime(t)}
                          className={`h-12 rounded-full text-[12.5px] font-semibold tabular-nums transition-colors v2-press ${
                            selectedTime === t
                              ? 'bg-[#1B1A17] text-white v2-shadow-lift'
                              : 'bg-white text-[#7A7468] border border-black/[0.05] hover:text-[#1B1A17]'
                          }`}
                        >
                          {t}
                        </button>
                      )) : (
                        <p className="col-span-2 text-[13px] font-medium text-[#ACA598] py-4 text-center">
                          No hay horarios disponibles este día.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ── Portafolio ── */}
          {(provider as any).portfolio && (provider as any).portfolio.length > 0 && (
            <Reveal className="mt-10">
              <section>
                <h2 className="text-xl font-semibold tracking-tight text-[#1B1A17] mb-5">Portafolio</h2>
                <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-6 px-6 md:-mx-10 md:px-10 pb-2">
                  {(provider as any).portfolio.map((item: any, i: number) => (
                    <figure
                      key={i}
                      className="group snap-start shrink-0 w-[72%] sm:w-[300px] relative aspect-[4/3] rounded-[1.75rem] overflow-hidden bg-[#1B1A17] v2-shadow-lift v2-float"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                      />
                      {item.title && (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                          <figcaption className="absolute inset-x-0 bottom-0 p-5">
                            <p className="text-white text-[15px] font-semibold tracking-tight leading-snug">
                              {item.title}
                            </p>
                          </figcaption>
                        </>
                      )}
                    </figure>
                  ))}
                </div>
              </section>
            </Reveal>
          )}

          {/* ── Reseñas ── */}
          {provider.reviews && provider.reviews.length > 0 && (
            <Reveal className="mt-10">
              <section>
                <h2 className="text-xl font-semibold tracking-tight text-[#1B1A17] mb-5">Reseñas</h2>
                <div className="space-y-3.5">
                  {provider.reviews.map((review: any, i: number) => (
                    <article key={i} className="rounded-[1.75rem] bg-[#FBF9F4] border border-black/[0.04] p-5">
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-10 h-10 shrink-0 rounded-full bg-[#E7F2E9] text-primary flex items-center justify-center text-[14px] font-bold">
                            {review.user.charAt(0)}
                          </span>
                          <div className="min-w-0">
                            <h4 className="text-[13.5px] font-semibold text-[#1B1A17] truncate">{review.user}</h4>
                            <p className="text-[11.5px] font-medium text-[#ACA598]">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex gap-0.5 shrink-0 text-amber-400">
                          {[...Array(5)].map((_, idx) => (
                            <Star key={idx} size={13} fill={idx < Math.floor(review.rating) ? "currentColor" : "none"} />
                          ))}
                        </div>
                      </div>
                      <p className="text-[13.5px] font-medium text-[#7A7468] leading-relaxed">
                        “{review.comment}”
                      </p>
                      {review.photo && (
                        <div className="mt-4 rounded-[1.25rem] overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={review.photo} alt={review.user} className="w-full max-h-56 object-cover" />
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            </Reveal>
          )}

          {/* ── Confianza ── */}
          <Reveal className="mt-10">
            <div className="rounded-[1.75rem] bg-[#E7F2E9] p-6 space-y-4">
              <div className="flex items-center gap-3.5 text-[13.5px] font-semibold text-[#1B1A17]">
                <span className="w-10 h-10 shrink-0 rounded-[0.85rem] bg-white text-primary flex items-center justify-center v2-shadow-soft">
                  <ShieldCheck size={18} />
                </span>
                Pago seguro con anticipo protegido
              </div>
              <div className="flex items-center gap-3.5 text-[13.5px] font-semibold text-[#1B1A17]">
                <span className="w-10 h-10 shrink-0 rounded-[0.85rem] bg-white text-primary flex items-center justify-center v2-shadow-soft">
                  <MessageSquare size={18} />
                </span>
                Soporte certificado 24/7
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── CTA fijo inferior ── */}
      <div className="fixed bottom-0 inset-x-0 z-[70] bg-white/85 backdrop-blur-xl border-t border-black/[0.05]">
        <div className="max-w-3xl mx-auto px-6 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#ACA598]">
              Total estimado
            </p>
            <p className="text-[24px] font-bold tracking-tight text-[#1B1A17] tabular-nums leading-tight">
              ${totalPrice}
              <span className="text-[12px] font-semibold text-[#ACA598] ml-1">MXN</span>
            </p>
            {selectedServices.length > 0 && (
              <p className="text-[11.5px] font-medium text-primary">
                {selectedServices.length} {selectedServices.length === 1 ? 'servicio' : 'servicios'}
              </p>
            )}
          </div>
          <button
            onClick={handleBooking}
            disabled={!isFormValid}
            className={`shrink-0 h-14 px-8 rounded-full text-[13px] font-bold text-white transition-colors v2-press ${
              isFormValid
                ? 'bg-primary hover:bg-primary-dark shadow-lg shadow-primary/25'
                : 'bg-[#ACA598] cursor-not-allowed'
            }`}
          >
            Solicitar servicio
          </button>
        </div>
      </div>
    </main>
  );
}
