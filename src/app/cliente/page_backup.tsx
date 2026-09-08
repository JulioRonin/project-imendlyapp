"use client";

import { Logo } from '@i-mendly/shared/Logo';
import { Button } from '@i-mendly/shared/components/Button';
import { Card } from '@i-mendly/shared/components/Card';
import { Input } from '@i-mendly/shared/components/Input';
import { Badge } from '@i-mendly/shared/components/Badge';
import { Avatar } from '@i-mendly/shared/components/Avatar';
import { 
  Sparkles, 
  Search, 
  MapPin, 
  LogOut, 
  ChevronRight, 
  Zap, 
  Droplets, 
  Wind, 
  Paintbrush,
  User,
  Bell,
  Navigation,
  Shield,
  ShieldCheck
} from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const CATEGORIES = [
  { name: 'Electricidad', icon: Zap, color: 'text-amber-500' },
  { name: 'Plomería', icon: Droplets, color: 'text-blue-500' },
  { name: 'Climas', icon: Wind, color: 'text-cyan-500' },
  { name: 'Pintura', icon: Paintbrush, color: 'text-purple-500' },
];

export default function ClientHome() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("México");
  const [isLocating, setIsLocating] = useState(false);

  const handleLogout = () => {
    router.push('/login');
  };

  const handleLocate = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        // Simulated location naming
        setLocation("Monterrey, NL");
        setIsLocating(false);
      }, () => setIsLocating(false));
    } else {
      setIsLocating(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFDFD] pb-32">
      {/* Header Boutique */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-50">
        <Logo size={32} />
        
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400">
            <MapPin size={12} className="text-primary" />
            {location}
          </div>
          
          <div className="h-8 w-[1px] bg-slate-100 hidden sm:block" />
          
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-brand-night hover:bg-slate-50 transition-all">
              <Bell size={20} strokeWidth={1.5} />
            </button>
            <div className="group relative">
              <Avatar name="Julio" size="md" className="cursor-pointer ring-2 ring-primary/5 hover:ring-primary/20 transition-all shadow-sm" />
              <div className="absolute top-full right-0 mt-4 w-48 bg-white rounded-2xl shadow-2xl border border-slate-50 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50">
                <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-3">
                  <User size={16} /> Ver Perfil
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 text-[10px] font-black uppercase tracking-widest text-red-500 flex items-center gap-3"
                >
                  <LogOut size={16} /> Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-8 pt-20 pb-24 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-6 py-2.5 rounded-full mb-8 shadow-sm border border-emerald-100/50 animate-in fade-in slide-in-from-top-4 duration-700">
          <Sparkles size={14} className="animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Nueva versión 1.0 disponible en {location}</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-brand-night leading-[1.1] mb-8 tracking-tighter max-w-4xl mx-auto">
          Servicios del hogar <span className="text-primary italic">con confianza</span> y certeza.
        </h1>
        <p className="text-lg md:text-xl text-brand-night/60 mb-12 max-w-2xl mx-auto font-medium">
          Conectamos a los mejores profesionales certificados con quienes buscan calidad, rapidez y seguridad en cada rincón de su hogar.
        </p>

        {/* Search & Location Block */}
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 p-2 bg-white rounded-[2.5rem] shadow-[0_32px_128px_-12px_rgba(0,0,0,0.12)] border border-slate-50">
            <div className="flex-1 relative group">
              <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
              <input 
                type="text"
                placeholder="¿Qué servicio necesitas?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-16 pl-14 pr-6 bg-transparent text-brand-night font-bold placeholder:text-slate-300 outline-none"
              />
            </div>
            <div className="h-16 w-[1px] bg-slate-100 hidden md:block" />
            <button 
              onClick={handleLocate}
              disabled={isLocating}
              className="flex items-center gap-3 px-8 h-16 rounded-2xl md:rounded-[2rem] hover:bg-slate-50 text-slate-400 font-bold transition-all whitespace-nowrap"
            >
              <Navigation size={18} className={isLocating ? 'animate-spin text-primary' : ''} />
              <span className="text-[11px] font-black uppercase tracking-widest">
                {isLocating ? 'Buscando...' : 'Mi ubicación'}
              </span>
            </button>
            <Button size="lg" className="h-16 px-10 rounded-2xl md:rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] shadow-xl shadow-primary/20">
              Buscar
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="px-8 pb-32 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12 px-2">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-brand-night tracking-tight uppercase">Categorías</h2>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Servicios más solicitados</p>
          </div>
          <Link href="/cliente/categories" className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.3em] hover:gap-3 transition-all">
            Ver todas <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, i) => (
            <Card key={i} className="group hover:bg-primary hover:scale-[1.02] transition-all duration-500 cursor-pointer border-none shadow-[0_20px_48px_-12px_rgba(0,0,0,0.05)] p-10 flex flex-col items-center text-center gap-6">
              <div className={`w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-500 ${cat.color} group-hover:text-white`}>
                <cat.icon size={28} strokeWidth={1.5} />
              </div>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-brand-night group-hover:text-white transition-colors">{cat.name}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Service Card Demo */}
      <section className="px-8 pb-40 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Card 1: Professional Profile */}
          <Card className="hover:scale-[1.02] cursor-pointer rounded-[3.5rem] p-12 border-none shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] bg-white group transition-all duration-500">
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-5 py-2 rounded-full border border-emerald-100/50">
                <ShieldCheck size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Verificado</span>
              </div>
              <span className="text-4xl font-black text-brand-night leading-none tracking-tighter">$450<span className="text-[10px] font-bold opacity-20 uppercase tracking-tighter ml-1">/h</span></span>
            </div>
            <div className="relative mb-8 w-24 h-24">
              <Avatar name="Juan Pérez" size="lg" className="w-full h-full ring-8 ring-slate-50 shadow-xl" />
              <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-xl shadow-lg border-4 border-white">
                <Zap size={16} fill="white" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-brand-night mb-2 tracking-tight uppercase group-hover:text-primary transition-colors">Juan Pérez</h3>
            <p className="text-[11px] font-black text-slate-300 mb-8 uppercase tracking-[0.2em]">Electricista Certificado Master</p>
            <p className="text-sm text-brand-night/60 leading-relaxed mb-10 font-medium opacity-80 group-hover:opacity-100 transition-opacity">
              Especialista en sistemas de alta tensión y domótica residencial con certificación internacional.
            </p>
            <div className="flex items-center gap-2 text-brand-night/30 font-black text-[10px] uppercase tracking-widest bg-slate-50 w-fit px-5 py-2 rounded-full">
              <Sparkles size={14} className="text-amber-400" /> 4.9 (124 reseñas)
            </div>
          </Card>

          {/* Card 2: Featured Service (Photorealistic + Glassmorphism) */}
          <Card variant="navy" className="group relative overflow-hidden rounded-[3.5rem] p-0 border-none shadow-[0_64px_128px_-32px_rgba(0,0,0,0.3)] min-h-[500px] flex flex-col justify-end">
            <img 
              src="/C:/Users/julio/.gemini/antigravity/brain/8e377ed7-ca16-4052-9aa1-41f80dfb1897/ac_maintenance_boutique_1774555085017.png" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] opacity-60" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-night via-brand-night/40 to-transparent" />
            
            <div className="relative z-10 p-12 backdrop-blur-xl bg-white/10 border-t border-white/20 rounded-t-[3rem] transition-all duration-700 flex flex-col items-center text-center">
               <Badge 
                 variant="warning" 
                 className="mb-6 font-black uppercase tracking-[0.3em] px-6 py-2.5 bg-amber-400 text-brand-night border-none shadow-2xl inline-flex"
               >
                 OFERTA LIMITADA
               </Badge>
               <h3 className="text-4xl font-black mb-4 uppercase tracking-tighter leading-tight text-white drop-shadow-2xl">
                 Mantenimiento <br/>de Climas
               </h3>
               <p className="text-white/80 mb-10 leading-relaxed text-sm font-medium drop-shadow-md max-w-[280px]">
                 Protocolo de revisión premium para sistemas de aire acondicionado central y mini-split.
               </p>
               <Link href="/cliente/search?q=Climas/AC" className="w-full">
                 <Button className="w-full py-7 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.4em] bg-white !text-emerald-600 hover:bg-emerald-50 border-none shadow-[0_20px_48px_rgba(0,0,0,0.4)] transition-all transform active:scale-95">
                   Reservar Ahora
                 </Button>
               </Link>
            </div>
          </Card>

          {/* Card 3: Trust & Glass (Cristal Labrado) */}
          <Card className="flex flex-col justify-between bg-[#F8F9FA] rounded-[3.5rem] p-12 overflow-hidden relative border-none shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] border-l border-white group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,_rgba(124,58,237,0.05),_transparent_70%)]" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-[2rem] bg-white shadow-xl flex items-center justify-center mb-10 text-primary group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
                <Shield size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-3xl font-black text-brand-night mb-6 uppercase tracking-tight leading-none">Garantía <br/>Escrow</h3>
              <p className="text-brand-night/50 text-base leading-relaxed mb-10 font-bold opacity-80 pr-2">
                Seguridad absoluta en cada transacción. Liberamos el pago solo tras tu plena satisfacción con el servicio final.
              </p>
              <div className="flex gap-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-8 h-1 bg-primary/10 rounded-full group-hover:bg-primary/30 transition-colors" />
                ))}
              </div>
            </div>
            
            <div className="relative z-10 mt-auto">
               <Logo className="opacity-[0.04] grayscale -mb-16 -mr-16 rotate-12 group-hover:scale-125 transition-transform duration-1000" size={240} />
            </div>
          </Card>
        </div>
      </section>

      {/* Footer Boutique */}
      <footer className="bg-brand-night text-white/40 py-24 px-8 text-center border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(255,255,255,0.03),_transparent_70%)]" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <Logo size={40} className="mx-auto mb-8 grayscale opacity-50 contrast-125" />
          <div className="flex justify-center gap-12 mb-12 text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
            <a href="#" className="hover:text-primary transition-colors">Servicios</a>
            <a href="#" className="hover:text-primary transition-colors">Zonas</a>
            <a href="#" className="hover:text-primary transition-colors">Privacidad</a>
            <a href="#" className="hover:text-primary transition-colors">Soporte</a>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] mb-4 text-primary">I mendly · 2026</p>
          <p className="text-xs max-w-sm mx-auto opacity-30 font-medium leading-relaxed">
            Plataforma confidencial para gestión de servicios domésticos premium. <br/>Calidad, rapidez y seguridad garantizada.
          </p>
        </div>
      </footer>
    </main>
  );
}
