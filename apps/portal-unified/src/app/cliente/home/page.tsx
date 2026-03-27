"use client";

import { Logo } from '@i-mendly/shared/Logo';
import { Button } from '@i-mendly/shared/components/Button';
import { Card } from '@i-mendly/shared/components/Card';
import { Input } from '@i-mendly/shared/components/Input';
import { Avatar } from '@i-mendly/shared/components/Avatar';
import { Badge } from '@i-mendly/shared/components/Badge';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Zap, Droplets, Sparkles, Wind, Paintbrush, 
  LayoutGrid, Bell, Settings, 
  MapPin, BarChart3, MessageCircle, User,
  Send, X, Sparkle, LogOut, Car
} from 'lucide-react';
import { BottomNav } from '@i-mendly/shared';
import { MOCK_PROVIDERS } from '@i-mendly/shared/constants/mocks';

// Helper for distance (Haversine simplified)
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const CATEGORIES = [
  { name: 'Electricista', icon: <Zap size={24} strokeWidth={1.5} />, color: 'from-amber-400 to-orange-500', light: 'bg-amber-50', image: '/assets/electrician.png' },
  { name: 'Plomería', icon: <Droplets size={24} strokeWidth={1.5} />, color: 'from-blue-400 to-indigo-600', light: 'bg-blue-50', image: '/assets/plumbing.png' },
  { name: 'Limpieza', icon: <Sparkles size={24} strokeWidth={1.5} />, color: 'from-emerald-400 to-teal-600', light: 'bg-emerald-50', image: '/assets/cleaning_professional.png' },
  { name: 'Carwash', icon: <Car size={24} strokeWidth={1.5} />, color: 'from-blue-300 to-blue-500', light: 'bg-blue-50', image: '/assets/carwash_boutique.png' },
  { name: 'Climas/AC', icon: <Wind size={24} strokeWidth={1.5} />, color: 'from-cyan-400 to-blue-500', light: 'bg-cyan-50', image: '/assets/ac_work.png' },
];

const OFFERS = [
  { 
    id: '1', 
    title: 'Mantenimiento de AC', 
    price: 550, 
    tag: 'OFERTA', 
    icon: '❄️',
    gradient: 'from-cyan-50 via-white to-blue-50',
    provider: 'Elena Torres',
    image: '/assets/plumbing.png'
  },
  { 
    id: '2', 
    title: 'Revisión Eléctrica', 
    price: 450, 
    tag: 'NUEVO', 
    icon: '⚡',
    gradient: 'from-amber-50 via-white to-orange-50',
    provider: 'Juan Pérez',
    image: '/assets/electrician_work.png'
  }
];

export default function ClientHome() {
  const router = useRouter();
  const [showChat, setShowChat] = useState(false);

  const handleLogout = () => {
    router.push('/role-selection');
  };
  const [userLocation, setUserLocation] = useState({ lat: 25.6667, lng: -100.4000 }); // San Pedro
  const [isLocating, setIsLocating] = useState(false);

  const nearbyProviders = MOCK_PROVIDERS.filter(p => {
    // @ts-ignore
    const dist = getDistance(userLocation.lat, userLocation.lng, p.lat, p.lng);
    return dist <= 20; // 20km radius
  });

  const requestLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setIsLocating(false);
      }, () => {
        setIsLocating(false);
      });
    } else {
      setIsLocating(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <header className="px-8 py-6 flex items-center justify-between sticky top-0 bg-slate-50/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <Avatar name="Julio" size="md" className="ring-2 ring-primary/10 shadow-lg" />
          <div onClick={requestLocation} className="cursor-pointer group">
            <p className="text-[10px] font-black text-brand-night/30 uppercase tracking-widest group-hover:text-primary transition-colors">Tu Ubicación {isLocating ? '(Buscando...)' : ''}</p>
            <p className="text-xs font-bold text-brand-night flex items-center gap-1.5 uppercase tracking-tighter">
              San Pedro Garza García <MapPin size={12} className="text-primary group-hover:scale-125 transition-transform" strokeWidth={3} />
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-brand-night/40 hover:text-primary hover:scale-110 transition-all">
            <Bell size={18} strokeWidth={2} />
          </button>
          <button className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-brand-night/40 hover:text-primary hover:scale-110 transition-all">
            <Settings size={18} strokeWidth={2} />
          </button>
        </div>
      </header>

      <div className="px-8 mt-4 space-y-12">
        {/* Hero Section */}
        <div>
          <h1 className="text-4xl font-black text-brand-night leading-[1.1] tracking-tighter mb-8">
            Descubre al profesional <br /> ideal hoy mismo
          </h1>
          
          <div className="relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <span className="text-brand-night/20 text-xl">🔍</span>
            </div>
            <input 
              type="text" 
              placeholder="Buscar por servicio (ej. Plomería)" 
              className="w-full bg-white border-none rounded-3xl py-6 pl-14 pr-6 text-brand-night font-bold shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] outline-none focus:ring-4 focus:ring-primary/5 transition-all"
            />
            <div className="absolute inset-y-0 right-4 flex items-center">
              <button className="w-10 h-10 rounded-2xl bg-brand-night text-white flex items-center justify-center shadow-xl">
                <LayoutGrid size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Categories (Trending Brands style) */}
        <section>
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-2xl font-black text-brand-night tracking-tight">Categorías Populares</h2>
            <Link href="/cliente/categories" className="text-xs font-black text-primary uppercase tracking-[0.2em] hover:underline">Ver Todo</Link>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 pb-8 px-2">
            {CATEGORIES.map((cat, i) => (
              <Link key={i} href={`/cliente/search?q=${cat.name}`} className="flex-shrink-0">
                <Card className={`w-32 h-36 rounded-[2.5rem] border-none shadow-[0_20px_40px_-10px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center gap-4 hover:scale-105 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 cursor-pointer bg-white group p-0`}>
                  <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/5 transition-colors duration-500 text-brand-night/40 group-hover:text-primary`}>
                    {cat.icon}
                  </div>
                  <p className="text-[10px] font-black uppercase text-brand-night/60 group-hover:text-brand-night tracking-widest transition-colors">{cat.name}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Offers Section */}
        <section>
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-2xl font-black text-brand-night tracking-tight">Selección I mendly</h2>
            <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-widest shadow-sm">Top Rated</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-2 pb-20">
            {nearbyProviders.slice(0, 2).map((p) => {
              const offer = OFFERS.find(o => o.title.includes(p.category)) || OFFERS[0];
              return (
              <Card key={p.id} className="p-0 rounded-[3rem] border-none shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] overflow-hidden group bg-white">
                <div className={`h-72 relative flex items-center justify-center overflow-hidden`}>
                  <img 
                    src={p.category === 'Electricista' ? '/assets/electrician.png' : p.category === 'Climas/AC' ? '/assets/ac_work.png' : '/assets/plumbing.png'} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-8 left-8">
                    <Badge variant="default" className="py-2.5 px-5 shadow-2xl text-[10px] font-black tracking-widest uppercase">DISPONIBLE</Badge>
                  </div>
                  <button className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-xl hover:bg-primary hover:text-white transition-all transform hover:scale-110 active:scale-95 text-xl">
                    ♥
                  </button>
                </div>
                <div className="p-10 bg-white">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-3">En tu radio (20km)</p>
                      <h3 className="text-2xl font-black text-brand-night mb-2 tracking-tight uppercase tracking-tighter">{p.category}</h3>
                      <div className="flex items-center gap-3">
                        <Avatar name={p.name} size="sm" />
                        <p className="text-xs font-bold text-brand-night/40">{p.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-brand-night/20 uppercase mb-2 tracking-widest">Base/hora</p>
                      <p className="text-4xl font-black text-brand-night tracking-tighter">${p.price}</p>
                    </div>
                  </div>
                  <Link href={`/cliente/providers/${p.id}`} className="block mt-8">
                    <Button className="w-full py-6 text-xs font-black uppercase tracking-[0.4em] rounded-2xl shadow-xl shadow-primary/10 group-hover:bg-primary transition-colors">
                      Ver Detalles
                    </Button>
                  </Link>
                </div>
              </Card>
              );
            })}
          </div>
        </section>
      </div>

      {/* Chatbot Floating Button & Modal */}
      <button 
        onClick={() => setShowChat(!showChat)}
        className={`fixed bottom-32 right-8 w-14 h-14 ${showChat ? 'bg-brand-night' : 'bg-primary'} text-white rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group`}>
        {showChat ? <X size={24} /> : <MessageCircle size={28} strokeWidth={1.5} />}
      </button>

      {showChat && (
        <Card className="fixed bottom-48 right-8 w-[350px] h-[500px] bg-white rounded-[2.5rem] shadow-[0_32px_128px_rgba(0,0,0,0.2)] z-50 border-none flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-500">
          <div className="p-6 bg-brand-night text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Sparkle size={20} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest">I mendly AI</p>
              <p className="text-[10px] text-white/40 font-bold uppercase">Agente Inteligente</p>
            </div>
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50">
            <div className="bg-white p-4 rounded-2xl rounded-tl-sm text-xs font-bold text-brand-night shadow-sm max-w-[80%]">
              ¡Hola Julio! Soy tu asistente IA. ¿Necesitas ayuda para encontrar un proveedor de pintura o clima hoy?
            </div>
            <div className="bg-primary/5 p-4 rounded-2xl rounded-tr-sm text-xs font-bold text-primary shadow-sm max-w-[80%] ml-auto text-right">
              Busco un pintor cerca de San Pedro para este fin de semana.
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-sm text-xs font-bold text-brand-night shadow-sm max-w-[80%]">
              He encontrado a Carlos Ruíz, está a solo 13km de tu ubicación y tiene excelentes reseñas en Pintura Mural. ¿Quieres que lo contacte?
            </div>
          </div>

          <div className="p-6 bg-white border-t border-slate-50 flex gap-3">
            <input type="text" placeholder="Escribe tu mensaje..." className="flex-1 bg-slate-50 rounded-xl px-5 text-xs font-bold outline-none" />
            <button className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Send size={16} />
            </button>
          </div>
        </Card>
      )}

      {/* Bottom Nav (Standardized) */}
      <BottomNav onLogout={handleLogout} />
    </main>
  );
}
