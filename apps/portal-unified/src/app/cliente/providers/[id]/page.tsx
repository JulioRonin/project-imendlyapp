"use client";

import { useParams, useRouter } from 'next/navigation';
import { Logo } from '@i-mendly/shared/Logo';
import { Button } from '@i-mendly/shared/components/Button';
import { Card } from '@i-mendly/shared/components/Card';
import { Avatar } from '@i-mendly/shared/components/Avatar';
import { Badge } from '@i-mendly/shared/components/Badge';
import { TopInsignia } from '@/components/TopInsignia';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  MessageSquare, 
  Calendar as CalendarIcon,
  ChevronRight,
  Zap,
  CheckCircle2,
  Image as ImageIcon,
  Quote,
  Pencil
} from 'lucide-react';
import Link from 'next/link';
import { MOCK_PROVIDERS } from '@i-mendly/shared/constants/mocks';
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../../../lib/supabase';

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center animate-pulse">
          <Logo size={48} className="mx-auto mb-4" />
          <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Cargando Profesional...</p>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-black text-brand-night uppercase mb-4">Proveedor no encontrado</h1>
          <Link href="/cliente/search">
            <Button variant="outline">Volver a la búsqueda</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-32">
      {/* Premium Header */}
      <header className="px-8 py-8 flex items-center justify-between sticky top-0 bg-slate-50/90 backdrop-blur-xl z-50 border-b border-slate-100">
        <button 
          onClick={() => window.history.back()}
          className="w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center text-brand-night hover:text-primary transition-all border border-slate-100"
        >
          <ArrowLeft size={20} />
        </button>
        <Logo size={32} />
        <div className="w-12" />
      </header>

      <div className="max-w-7xl mx-auto px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Left Column: Profile Info & Work */}
          <div className="lg:col-span-2 space-y-16">
            <section className="flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
              <div className="relative">
                <Avatar src={(provider as any).image} name={provider.name} className="w-40 h-40 rounded-[3rem] shadow-2xl ring-8 ring-white" />
                {provider.isTop && (
                   <div className="absolute -top-4 -left-4 z-10 scale-150">
                      <TopInsignia size={48} showLabel={false} />
                   </div>
                )}
                {provider.verified && (
                  <div className="absolute -bottom-2 -right-2 bg-primary text-white p-3 rounded-2xl shadow-xl border-4 border-white">
                    <ShieldCheck size={20} />
                  </div>
                )}
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-2">
                  <h1 className="text-5xl font-black text-brand-night tracking-tighter uppercase leading-tight">{provider.name}</h1>
                  {provider.isTop && <TopInsignia size={32} />}
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <div className="flex flex-wrap gap-2.5">
                    {provider.categories?.map((cat: string) => (
                      <Badge 
                        key={cat} 
                        variant="default" 
                        className="bg-primary/10 text-primary border-none rounded-full px-5 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] shadow-sm hover:shadow-md transition-all cursor-default"
                      >
                        {cat}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full border border-amber-100 text-[10px] font-black uppercase tracking-widest">
                    <Star size={12} fill="currentColor" /> {provider.rating || 0} ({provider.reviews?.length || 0} reseñas)
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-5 text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                  <span className="flex items-center gap-2 max-w-[400px]">
                    <MapPin size={14} className="text-primary shrink-0" /> 
                    <span className="truncate">
                      {provider.zones?.length > 0 ? provider.zones.join(', ') : 'Cobertura Amplia'}
                    </span>
                  </span>
                  <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-slate-200" />
                  <span className="flex items-center gap-2">
                    <Zap size={14} className="text-primary" /> Radio {provider.coverage_radius_km || 10} KM
                  </span>
                  <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-slate-200" />
                  <span className="flex items-center gap-2">
                    <Clock size={14} className="text-primary" /> {provider.experience} años exp.
                  </span>
                </div>
              </div>
            </section>

            {/* About Section */}
            <section className="space-y-6">
              <h2 className="text-xl font-black text-brand-night uppercase tracking-tight">Acerca del Profesional</h2>
              <p className="text-lg text-slate-500 leading-relaxed font-medium bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-50">
                {provider.about}
              </p>
            </section>

            {/* Services Selection */}
            <section className="space-y-8">
              <div className="flex justify-between items-end">
                <h2 className="text-xl font-black text-brand-night uppercase tracking-tight">Selecciona Servicios</h2>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Puedes elegir varios</p>
              </div>
              <div className="space-y-12">
                {(provider.categories && provider.categories.length > 0 ? provider.categories : ['Servicios General']).map((cat: string) => {
                  const catServices = provider.services.filter((s: any) => 
                    !s.isCustom && (s.category === cat || (!s.category && cat === provider.categories?.[0]) || (cat === 'Servicios General'))
                  );
                  
                  if (catServices.length === 0) return null;

                  return (
                    <div key={cat} className="space-y-6">
                      <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] flex items-center gap-4">
                        <span className="shrink-0">{cat}</span>
                        <div className="h-[1px] w-full bg-slate-50" />
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {catServices.map((s: any, i: number) => {
                          const isSelected = selectedServices.includes(s.name);
                          return (
                            <button 
                              key={i} 
                              onClick={() => toggleService(s.name)}
                              className={`p-8 rounded-[2rem] text-left transition-all duration-300 border-2 ${
                                isSelected 
                                  ? 'bg-primary/5 border-primary shadow-inner' 
                                  : 'bg-white border-slate-50 shadow-sm hover:border-slate-200'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                                    isSelected ? 'bg-primary text-white' : 'bg-slate-50 text-slate-300'
                                  }`}>
                                    <CheckCircle2 size={24} />
                                  </div>
                                  <div>
                                    <span className={`text-[11px] font-black uppercase tracking-widest block ${isSelected ? 'text-primary' : 'text-slate-400'}`}>{provider.name}</span>
                                    <span className="text-sm font-bold text-brand-night uppercase tracking-tight">{s.name}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-xl font-black text-brand-night tracking-tighter leading-none">
                                    ${s.price}
                                    {s.isRange && <span className="text-sm font-bold text-slate-300 ml-1">- ${s.maxPrice}</span>}
                                  </p>
                                  <p className="text-[9px] font-bold text-slate-200 uppercase tracking-widest mt-1">Por {s.unit || 'srv'}</p>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Custom Request Option always at the end */}
                <div className="pt-4">
                  <button 
                    onClick={() => toggleService('Personalizado o Explica tu necesidad')}
                    className={`p-8 rounded-[2rem] text-left transition-all duration-300 border-2 w-full ${
                      selectedServices.includes('Personalizado o Explica tu necesidad')
                        ? 'bg-primary/5 border-primary shadow-inner' 
                        : 'bg-white border-slate-50 shadow-sm hover:border-slate-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                          selectedServices.includes('Personalizado o Explica tu necesidad') ? 'bg-primary text-white' : 'bg-slate-50 text-slate-300'
                        }`}>
                          <Pencil size={24} />
                        </div>
                        <div>
                          <span className={`text-[11px] font-black uppercase tracking-widest block ${selectedServices.includes('Personalizado o Explica tu necesidad') ? 'text-primary' : 'text-slate-400'}`}>Explícanos a detalle</span>
                          <span className="text-sm font-bold text-brand-night uppercase tracking-tight">Personalizado o Explica tu necesidad</span>
                        </div>
                      </div>
                      <span className="text-xl font-black text-brand-night tracking-tighter">Cotizar</span>
                    </div>
                  </button>
                </div>
              </div>

              {selectedServices.includes('Personalizado o Explica tu necesidad') && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500 mt-4 h-full">
                  <textarea 
                    value={customRequestText}
                    onChange={(e) => setCustomRequestText(e.target.value)}
                    placeholder="Describe exactamente qué necesitas. ¿Medidas, materiales, detalles específicos?"
                    className="w-full bg-white border-2 border-slate-100 rounded-[2rem] p-8 text-lg font-medium text-brand-night focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-inner h-40 resize-none"
                  />
                  <p className="text-[10px] font-black tracking-widest uppercase text-slate-400 mt-2 px-4">
                    Este monto requerirá cotización final por parte del proveedor tras su revisión.
                  </p>
                </div>
              )}
            </section>

            {/* Portfolio Section */}
            {(provider as any).portfolio && (
              <section className="space-y-8">
                <h2 className="text-xl font-black text-brand-night uppercase tracking-tight">Portafolio de Trabajos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {(provider as any).portfolio.map((item: any, i: number) => (
                    <div key={i} className="group relative overflow-hidden rounded-[3rem] shadow-2xl aspect-[4/3] bg-slate-200">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-night/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-10">
                        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                           <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-2">Proyecto Finalizado</p>
                           <h4 className="text-xl font-black text-white uppercase tracking-tight">{item.title}</h4>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews Section */}
            {provider.reviews && provider.reviews.length > 0 && (
              <section className="space-y-8">
                <h2 className="text-xl font-black text-brand-night uppercase tracking-tight">Experiencias de Clientes</h2>
                <div className="space-y-6">
                  {provider.reviews.map((review: any, i: number) => (
                    <Card key={i} className="p-10 rounded-[3rem] border-none shadow-sm bg-white overflow-hidden">
                      <div className="flex flex-col md:flex-row gap-8">
                        {review.photo && (
                          <div className="w-full md:w-48 h-48 shrink-0 rounded-[2rem] overflow-hidden shadow-lg">
                            <img src={review.photo} alt={review.user} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold uppercase text-xs">
                                {review.user.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-black text-brand-night uppercase text-xs tracking-widest">{review.user}</h4>
                                <p className="text-[10px] text-slate-300 font-bold">{review.date}</p>
                              </div>
                            </div>
                            <div className="flex gap-1 text-amber-400">
                              {[...Array(5)].map((_, idx) => (
                                <Star key={idx} size={14} fill={idx < Math.floor(review.rating) ? "currentColor" : "none"} strokeWidth={3} />
                              ))}
                            </div>
                          </div>
                          <div className="relative">
                            <Quote size={40} className="absolute -left-6 -top-4 text-slate-50 rotate-180" />
                            <p className="text-slate-500 text-lg font-medium leading-relaxed relative z-10 italic">
                              "{review.comment}"
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Checkout & Calendar */}
          <div className="space-y-8 sticky top-32">
            <Card className="p-10 rounded-[3.5rem] border-none shadow-[0_48px_128px_-12px_rgba(0,0,0,0.1)] bg-white overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8 opacity-5 text-brand-night transition-transform duration-700 group-hover:scale-150 group-hover:rotate-12">
                   <Zap size={100} />
              </div>
              
              <div className="text-center mb-10 relative z-10">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-2">Total Estimado</p>
                <h3 className="text-6xl font-black text-brand-night tracking-tighter transition-all duration-300">
                  ${totalPrice}<span className="text-sm font-bold text-slate-200">/MXN</span>
                </h3>
                {selectedServices.length > 0 && (
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-4">
                    {selectedServices.length} {selectedServices.length === 1 ? 'servicio seleccionado' : 'servicios seleccionados'}
                  </p>
                )}
              </div>
              
              <div className="space-y-4 mb-4 relative z-10">
                <Button 
                  onClick={handleBooking}
                  disabled={!isFormValid}
                  className={`w-full h-18 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all transform ${!isFormValid ? 'opacity-50 cursor-not-allowed bg-slate-300 hover:bg-slate-300 shadow-none' : 'shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 active:scale-95'}`}
                >
                  {isFormValid ? 'Reservar Ahora' : 'Completa Formulario'}
                </Button>
                
                <Button 
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  variant="outline" 
                  className={`w-full h-18 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all ${
                    isCalendarOpen ? 'border-primary text-primary bg-primary/5 shadow-inner' : 'border-slate-100 hover:bg-slate-50 text-slate-500'
                  }`}
                >
                  <CalendarIcon size={16} className="mr-3" />
                   {selectedDate && selectedTime ? `${selectedDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}, ${selectedTime}` : 'Elegir Fecha y Hora'}
                </Button>
              </div>

              {!isFormValid && (
                  <p className="text-[9px] font-black uppercase tracking-widest text-brand-coral text-center mb-10 animate-pulse">
                     Selecciona un servicio y horario
                  </p>
              )}

              {/* Collapsible Calendar */}
                  <div className={`transition-all duration-700 ease-in-out px-2 ${isCalendarOpen ? 'max-h-[800px] opacity-100 mb-10 scale-100' : 'max-h-0 opacity-0 overflow-hidden scale-95'}`}>
                     <div className="pt-8 border-t border-slate-50">
                        <div className="flex justify-between items-center mb-6">
                           <h4 className="text-[10px] font-black text-brand-night uppercase tracking-widest">
                             {currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                           </h4>
                           <div className="flex gap-2">
                              <button 
                                onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
                                className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 hover:text-brand-night transition-colors"
                              >
                                <ChevronRight className="rotate-180" size={14} />
                              </button>
                              <button 
                                onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
                                className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 hover:text-brand-night transition-colors"
                              >
                                <ChevronRight size={14} />
                              </button>
                           </div>
                        </div>
                        
                        <div className="grid grid-cols-7 gap-2 mb-8">
                           {['D','L','M','M','J','V','S'].map((d, i) => (
                              <div key={i} className="text-center text-[8px] font-black text-slate-200 uppercase">{d}</div>
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
                                    className={`h-10 rounded-xl text-[10px] font-bold transition-all ${
                                      isSelectedDay ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110 z-10' : 
                                      (isWorkingDay && !isPast) ? 'bg-slate-50 text-brand-night hover:bg-primary/10 hover:scale-105' : 'bg-transparent text-slate-200 cursor-not-allowed'
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
                          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                             <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-4">Horarios Disponibles</p>
                             <div className="grid grid-cols-2 gap-3">
                                {availableSlots.length > 0 ? availableSlots.map((t, i) => (
                                   <button 
                                     key={i} 
                                     onClick={() => setSelectedTime(t)}
                                     className={`py-4 rounded-xl text-[10px] font-black border transition-all ${
                                       selectedTime === t ? 'bg-brand-night text-white border-brand-night shadow-lg scale-105' : 
                                       'bg-white text-slate-400 border-slate-100 hover:border-slate-300 hover:scale-[1.02]'
                                     }`}
                                   >
                                      {t}
                                   </button>
                                )) : (
                                  <p className="col-span-2 text-[10px] font-bold text-slate-300 italic py-4 text-center">No hay horarios disponibles hoy.</p>
                                )}
                             </div>
                          </div>
                        )}
                     </div>
                  </div>

              <div className="pt-8 border-t border-slate-50 space-y-6 relative z-10">
                <div className="flex items-center gap-4 text-xs font-bold text-brand-night">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center">
                    <ShieldCheck size={16} />
                  </div>
                  Pago seguro Escrow garantizado
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-brand-night">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                    <MessageSquare size={16} />
                  </div>
                  Soporte 24/7 certificado
                </div>
              </div>
            </Card>

            {/* Quick Promo Card */}
            <div className="p-8 rounded-[2.5rem] bg-brand-night text-white overflow-hidden relative group shadow-2xl">
               <div className="absolute top-[-50px] left-[-50px] w-48 h-48 bg-primary opacity-10 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
               <ImageIcon size={100} className="absolute -right-8 -bottom-8 text-white/5 rotate-12" />
               <div className="relative z-10">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">Garantía Premium</h4>
                  <p className="text-xl font-black tracking-tighter mb-4 leading-tight uppercase">Satisfecho o te <br />devolvemos el 100%</p>
                  <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest leading-relaxed">
                     Protegemos tu inversión con nuestro sello exclusivo de calidad boutique.
                  </p>
               </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
