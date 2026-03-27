"use client";

import { useSearchParams } from 'next/navigation';
import { Logo } from '@i-mendly/shared/Logo';
import { Button } from '@i-mendly/shared/components/Button';
import { Card } from '@i-mendly/shared/components/Card';
import { Avatar } from '@i-mendly/shared/components/Avatar';
import { Badge } from '@i-mendly/shared/components/Badge';
import { ArrowLeft, Filter, MapPin, Star, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { MOCK_PROVIDERS } from '@i-mendly/shared/constants/mocks';
import { useState, useMemo } from 'react';

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

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [userLocation] = useState({ lat: 25.6667, lng: -100.4000 }); // San Pedro default

  const filteredProviders = useMemo(() => {
    return MOCK_PROVIDERS.filter(p => {
      // @ts-ignore
      const dist = getDistance(userLocation.lat, userLocation.lng, p.lat, p.lng);
      const matchesQuery = p.category.toLowerCase().includes(query.toLowerCase()) || 
                           p.name.toLowerCase().includes(query.toLowerCase());
      return matchesQuery && dist <= 20; // Only within 20km
    }).sort((a, b) => (a.price || 0) - (b.price || 0)); // Sort by price by default
  }, [query, userLocation]);

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <header className="px-8 py-8 flex items-center justify-between sticky top-0 bg-slate-50/90 backdrop-blur-xl z-50">
        <button 
          onClick={() => window.history.back()}
          className="w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center text-brand-night hover:text-primary transition-all border border-slate-100"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 px-6">
           <p className="text-[10px] font-black text-brand-night/30 uppercase tracking-widest">Resultados para</p>
           <h1 className="text-xl font-black text-brand-night uppercase tracking-tighter">{query || 'Todos los Servicios'}</h1>
        </div>
        <button className="w-12 h-12 rounded-2xl bg-brand-night text-white shadow-xl flex items-center justify-center">
          <Filter size={18} />
        </button>
      </header>

      <div className="px-8 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between py-4">
           <p className="text-xs font-bold text-slate-400">
             Encontramos <span className="text-brand-night">{filteredProviders.length}</span> profesionales cerca de ti
           </p>
            <Badge variant="success" className="py-2 px-4 text-[9px] font-black tracking-widest uppercase bg-emerald-500 text-white border-none shadow-lg shadow-emerald-500/20">RADIO 20KM</Badge>
        </div>

        {filteredProviders.length > 0 ? (
          <div className="space-y-6">
            {filteredProviders.map((p) => (
              <Link key={p.id} href={`/cliente/providers/${p.id}`} className="block">
                <Card className="p-8 rounded-[2.5rem] border-none shadow-[0_20px_64px_-12px_rgba(0,0,0,0.06)] hover:shadow-[0_32px_96px_-12px_rgba(124,58,237,0.15)] transition-all duration-500 group bg-white border border-transparent hover:border-primary/10">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="relative">
                      <Avatar src={(p as any).image} name={p.name} className="w-24 h-24 rounded-3xl shadow-xl ring-4 ring-slate-50" />
                      <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white w-8 h-8 rounded-xl flex items-center justify-center shadow-lg border-2 border-white">
                        <Star size={14} fill="white" />
                      </div>
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                        <Badge variant="default" className="text-[8px] font-black tracking-widest uppercase py-1 bg-brand-night text-white border-none">{p.category}</Badge>
                        <span className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <MapPin size={10} className="text-primary" /> {getDistance(userLocation.lat, userLocation.lng, p.lat, p.lng).toFixed(1)} km
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-brand-night mb-2 tracking-tighter uppercase">{p.name}</h3>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-md">
                        Especialista en servicios boutique de {p.category.toLowerCase()}. Atención personalizada y garantía de calidad.
                      </p>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-4 min-w-[150px]">
                      <div className="text-right">
                         <p className="text-[10px] font-black text-brand-night/20 uppercase tracking-widest mb-1">Precio base</p>
                         <p className="text-3xl font-black text-brand-night tracking-tighter">${p.price}<span className="text-sm font-bold text-slate-300">/hr</span></p>
                      </div>
                      <Button className="w-full md:w-auto px-8 py-5 rounded-2xl shadow-lg shadow-primary/10 text-[9px] font-black uppercase tracking-[0.3em]">
                        Contratar
                      </Button>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
             <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
                <Search size={40} className="text-slate-200" />
             </div>
             <h3 className="text-2xl font-black text-brand-night tracking-tight mb-2 uppercase">Sin resultados</h3>
             <p className="text-slate-400 font-medium">No encontramos proveedores de "{query}" en un radio de 20km.</p>
             <Link href="/cliente/categories" className="inline-block mt-8">
                <Button variant="outline" className="px-10 rounded-2xl text-[10px] font-black uppercase tracking-widest">Ver Categorías</Button>
             </Link>
          </div>
        )}
      </div>
    </main>
  );
}

// Internal mock for safety if not in constant
const Search = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);
