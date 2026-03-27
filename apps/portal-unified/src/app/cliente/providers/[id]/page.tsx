"use client";

import { useParams, useRouter } from 'next/navigation';
import { Logo } from '@i-mendly/shared/Logo';
import { Button } from '@i-mendly/shared/components/Button';
import { Card } from '@i-mendly/shared/components/Card';
import { Avatar } from '@i-mendly/shared/components/Avatar';
import { Badge } from '@i-mendly/shared/components/Badge';
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
  Quote
} from 'lucide-react';
import Link from 'next/link';
import { MOCK_PROVIDERS } from '@i-mendly/shared/constants/mocks';
import { useMemo, useState } from 'react';

export default function ProviderProfile() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const provider = useMemo(() => {
    return MOCK_PROVIDERS.find(p => p.id === id);
  }, [id]);

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const totalPrice = useMemo(() => {
    if (!provider) return 0;
    const selected = provider.services.filter(s => selectedServices.includes(s.name));
    if (selected.length === 0) return provider.price;
    return selected.reduce((acc, s) => acc + s.price, 0);
  }, [provider, selectedServices]);

  const toggleService = (name: string) => {
    setSelectedServices(prev => 
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    );
  };

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
                {provider.verified && (
                  <div className="absolute -bottom-2 -right-2 bg-primary text-white p-3 rounded-2xl shadow-xl border-4 border-white">
                    <ShieldCheck size={20} />
                  </div>
                )}
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <Badge variant="success" className="bg-emerald-50 text-emerald-600 border-emerald-100 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest">
                    {provider.category}
                  </Badge>
                  <div className="flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full border border-amber-100 text-[10px] font-black uppercase tracking-widest">
                    <Star size={12} fill="currentColor" /> {provider.rating} ({provider.reviews} reseñas)
                  </div>
                </div>
                <h1 className="text-5xl font-black text-brand-night tracking-tighter uppercase leading-none">
                  {provider.name}
                </h1>
                <div className="flex items-center justify-center md:justify-start gap-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-2">
                    <MapPin size={14} className="text-primary" /> San Pedro, NL
                  </span>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(provider.services as any[]).map((s, i) => {
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
                            <span className={`text-[11px] font-black uppercase tracking-widest block ${isSelected ? 'text-primary' : 'text-slate-400'}`}>Precisión Boutique</span>
                            <span className="text-sm font-bold text-brand-night uppercase tracking-tight">{s.name}</span>
                          </div>
                        </div>
                        <span className="text-xl font-black text-brand-night tracking-tighter">${s.price}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
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
            {(provider as any).reviewData && (
              <section className="space-y-8">
                <h2 className="text-xl font-black text-brand-night uppercase tracking-tight">Experiencias de Clientes</h2>
                <div className="space-y-6">
                  {(provider as any).reviewData.map((review: any, i: number) => (
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
                    {selectedServices.length} {selectedServices.length === 1 ? 'ervicio seleccionado' : 'rvicios seleccionados'}
                  </p>
                )}
              </div>
              
              <div className="space-y-4 mb-10 relative z-10">
                <Button 
                  onClick={() => router.push(`/cliente/checkout?providerId=${id}&services=${selectedServices.join(',')}&total=${totalPrice}`)}
                  className="w-full h-18 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all active:scale-95"
                >
                  Reservar Ahora
                </Button>
                <Button 
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  variant="outline" 
                  className={`w-full h-18 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all ${
                    isCalendarOpen ? 'border-primary text-primary bg-primary/5 shadow-inner' : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <CalendarIcon size={16} className="mr-3" />
                  {isCalendarOpen ? 'Cerrar Agenda' : 'Consultar Disponibilidad'}
                </Button>
              </div>

              {/* Collapsible Calendar */}
              <div className={`transition-all duration-700 ease-in-out px-2 ${isCalendarOpen ? 'max-h-[500px] opacity-100 mb-10 scale-100' : 'max-h-0 opacity-0 overflow-hidden scale-95'}`}>
                 <div className="pt-8 border-t border-slate-50">
                    <div className="flex justify-between items-center mb-6">
                       <h4 className="text-[10px] font-black text-brand-night uppercase tracking-widest">Abril 2026</h4>
                       <div className="flex gap-2">
                          <button className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 hover:text-brand-night transition-colors"><ChevronRight className="rotate-180" size={14} /></button>
                          <button className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 hover:text-brand-night transition-colors"><ChevronRight size={14} /></button>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-2 mb-8">
                       {['D','L','M','M','J','V','S'].map((d, i) => (
                          <div key={i} className="text-center text-[8px] font-black text-slate-200 uppercase">{d}</div>
                       ))}
                       {[...Array(30)].map((_, i) => {
                          const day = i + 1;
                          const isAvailable = day > 10 && day < 25 && day !== 15 && day !== 18;
                          const isSelected = day === 21;
                          return (
                             <button 
                               key={i} 
                               disabled={!isAvailable}
                               className={`h-10 rounded-xl text-[10px] font-bold transition-all ${
                                 isSelected ? 'bg-primary text-white shadow-lg shadow-primary/30' : 
                                 isAvailable ? 'bg-slate-50 text-brand-night hover:bg-primary/10' : 'bg-transparent text-slate-200 cursor-not-allowed'
                               }`}
                             >
                                {day}
                             </button>
                          );
                       })}
                    </div>

                    <div className="space-y-3">
                       <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-4">Horarios Disponibles</p>
                       <div className="grid grid-cols-2 gap-3">
                          {['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'].map((t, i) => (
                             <button key={i} className={`py-4 rounded-xl text-[10px] font-black border transition-all ${i === 0 ? 'bg-brand-night text-white border-brand-night shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}>
                                {t}
                             </button>
                          ))}
                       </div>
                    </div>
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
