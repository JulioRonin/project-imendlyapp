"use client";

import { useSearchParams } from 'next/navigation';
import { Logo } from '@i-mendly/shared/Logo';
import { Button } from '@i-mendly/shared/components/Button';
import { Card } from '@i-mendly/shared/components/Card';
import { Avatar } from '@i-mendly/shared/components/Avatar';
import { Badge } from '@i-mendly/shared/components/Badge';
import { ArrowLeft, Filter, MapPin, Star, Clock, ChevronRight } from 'lucide-react';
import { TopInsignia } from '@/components/TopInsignia';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

// Helper for distance (Haversine simplified)
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c || 0;
};

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [userLocation] = useState({ lat: 31.7333, lng: -106.4833 }); // Ciudad Juárez default
  const [providers, setProviders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRealProviders = async () => {
      setIsLoading(true);
      try {
        // Fetch ALL providers and their services/users to filter in JS
        const { data, error } = await supabase
          .from('providers')
          .select(`
            id,
            categories,
            category,
            rating,
            is_verified,
            is_top,
            account_status,
            users!inner ( full_name, avatar_url ),
            provider_services ( name, price, max_price, is_range, unit )
          `);

        if (error) throw error;

        const allFormatted = (data || []).map(p => {
          const user = Array.isArray(p.users) ? p.users[0] : p.users;
          const primaryService = p.provider_services?.[0] || { price: 0, unit: 'Servicio', is_range: false, max_price: 0 };
          const cats = p.categories || (p.category ? [p.category] : []);
          
          return {
            id: p.id,
            name: user?.full_name || 'Profesional i-Mendly',
            image: user?.avatar_url || '',
            categories: cats,
            rating: p.rating || 4.8,
            verified: p.is_verified,
            isTop: p.is_top || false,
            status: p.account_status,
            price: primaryService.price,
            maxPrice: primaryService.max_price,
            isRange: primaryService.is_range,
            unit: primaryService.unit || 'Servicio',
            lat: 31.7333 + (Math.random() - 0.5) * 0.1,
            lng: -106.4833 + (Math.random() - 0.5) * 0.1
          };
        });

        // Filter in JS for maximum flexibility during development
        const filtered = allFormatted.filter(p => {
          if (!query) return true;
          const searchLower = query.toLowerCase();
          return p.name.toLowerCase().includes(searchLower) || 
                 p.categories.some((c: string) => c.toLowerCase().includes(searchLower));
        });

        setProviders(filtered);
      } catch (err) {
        console.error('Error fetching search results:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealProviders();
  }, [query]);

  const filteredProviders = providers.sort((a, b) => (a.price || 0) - (b.price || 0));

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
                      {p.isTop && (
                        <div className="absolute -top-2 -left-2 z-10 scale-125">
                          <TopInsignia size={32} showLabel={false} />
                        </div>
                      )}
                      {p.verified && (
                        <div className="absolute -bottom-2 -right-2 bg-primary text-white w-8 h-8 rounded-xl flex items-center justify-center shadow-lg border-2 border-white">
                          <Star size={14} fill="white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
                        {(p.categories || []).map((cat: string) => (
                          <Badge 
                            key={cat}
                            variant="default" 
                            className="text-[7.5px] font-black tracking-[0.15em] uppercase py-1.5 px-3 bg-primary/10 text-primary border-none rounded-full shadow-sm hover:bg-primary/20 transition-all cursor-default"
                          >
                            {cat}
                          </Badge>
                        ))}
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400/60 uppercase tracking-widest ml-1">
                          <div className="w-1 h-1 rounded-full bg-slate-200" />
                          <MapPin size={10} className="text-primary/60" /> {getDistance(userLocation.lat, userLocation.lng, p.lat, p.lng).toFixed(1)} km
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-black text-brand-night tracking-tighter uppercase leading-none">{p.name}</h3>
                        <div className="flex items-center gap-1.5 bg-amber-50 text-amber-600 px-2 py-0.5 rounded-lg border border-amber-100 text-[10px] font-black">
                           <Star size={10} fill="currentColor" /> {p.rating}
                        </div>
                        {p.verified && (
                          <div className="flex items-center gap-1 bg-primary/5 text-primary px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border border-primary/10">
                            <ChevronRight size={10} className="text-primary/40" /> Certificado
                          </div>
                        )}
                        {p.isTop && (
                           <TopInsignia size={18} className="ml-2" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold leading-relaxed max-w-md uppercase tracking-wide opacity-80">
                        Especialista en servicios boutique de {(p.categories?.[0] || 'Servicios').toLowerCase()}. Atención personalizada y garantía de calidad.
                      </p>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-4 min-w-[200px]">
                      <div className="text-right">
                         <p className="text-[10px] font-black text-brand-night/20 uppercase tracking-widest mb-1">Costo Estimado</p>
                         <div className="flex flex-col items-end">
                            <p className="text-3xl font-black text-brand-night tracking-tighter leading-none">
                              ${p.price}
                              {p.isRange && <span className="text-sm font-bold text-slate-300 mx-1">a ${p.maxPrice}</span>}
                            </p>
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">Por {p.unit}</span>
                         </div>
                      </div>
                      <div className="w-full md:w-auto">
                        <Button className="w-full md:w-auto px-8 py-5 rounded-2xl shadow-lg shadow-primary/10 text-[9px] font-black uppercase tracking-[0.3em]">
                          Ver Perfil
                        </Button>
                      </div>
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
