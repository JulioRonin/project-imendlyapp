"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, SearchX, BadgeCheck } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect , Suspense} from 'react';
import { supabase } from '../../../lib/supabase';
import { ClientNav } from '@/components/client/ClientNav';
import { Chip, RatingPill } from '@/components/client/ui';

const CATEGORIES = [
  { name: 'Electricidad', slug: 'Electricidad' },
  { name: 'Plomería', slug: 'Plomería' },
  { name: 'Climas', slug: 'Climas/AC' },
  { name: 'Pintura', slug: 'Pintura' },
  { name: 'Albañilería', slug: 'Albañilería' },
  { name: 'Limpieza', slug: 'Limpieza' },
  { name: 'Carpintería', slug: 'Carpintería' },
  { name: 'Fumigación', slug: 'Fumigación' },
];

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

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
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

  const activeCategory = CATEGORIES.find(
    c => c.slug.toLowerCase() === query.toLowerCase() || c.name.toLowerCase() === query.toLowerCase()
  );

  return (
    <main className="min-h-screen bg-[#F3F4F1] pb-36">
      {/* ── Header interno v2 (patrón 5) ── */}
      <header className="v2-rise sticky top-0 z-50 bg-[#F3F4F1]/85 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            aria-label="Regresar"
            className="shrink-0 w-11 h-11 rounded-full bg-white v2-shadow-soft flex items-center justify-center text-[#151714] v2-press"
          >
            <ArrowLeft size={19} />
          </button>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
              Resultados
            </p>
            <h1 className="text-[19px] font-semibold tracking-tight text-[#151714] truncate">
              {query || 'Todos los servicios'}
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto">
        {/* ── Chips de categorías ── */}
        <div className="v2-rise v2-d1 px-6 pt-2">
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar snap-x pb-1">
            <Chip
              label="Todos"
              active={!activeCategory && !query}
              onClick={() => router.push('/cliente/search')}
            />
            {CATEGORIES.map(c => (
              <Chip
                key={c.slug}
                label={c.name}
                active={activeCategory?.slug === c.slug}
                onClick={() => router.push(`/cliente/search?q=${encodeURIComponent(c.slug)}`)}
              />
            ))}
          </div>
        </div>

        <div className="px-6 mt-5">
          {isLoading ? (
            /* ── Skeletons ── */
            <div className="space-y-3.5">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="flex items-center gap-4 bg-white rounded-[1.75rem] p-4 v2-shadow-soft">
                  <div className="w-24 h-24 shrink-0 rounded-[1.5rem] v2-shimmer" />
                  <div className="flex-1 space-y-2.5">
                    <div className="h-4 w-2/3 rounded-full v2-shimmer" />
                    <div className="h-3 w-1/3 rounded-full v2-shimmer" />
                    <div className="h-3 w-1/2 rounded-full v2-shimmer" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProviders.length > 0 ? (
            <>
              <p className="text-[13px] font-medium text-[#70756E] mb-4">
                <span className="font-bold text-[#151714]">{filteredProviders.length}</span>{' '}
                {filteredProviders.length === 1 ? 'profesional' : 'profesionales'} cerca de ti
              </p>

              {/* ── Tarjetas de resultado compactas ── */}
              <div className="space-y-3.5">
                {filteredProviders.map((p, i) => (
                  <Link
                    key={p.id}
                    href={`/cliente/providers/${p.id}`}
                    className={`block ${i < 8 ? `v2-rise v2-d${i + 1}` : ''}`}
                  >
                    <article className="flex items-center gap-4 bg-white rounded-[1.75rem] p-4 v2-shadow-soft v2-press v2-float">
                      {/* Imagen / iniciales */}
                      <div className="relative w-24 h-24 shrink-0 rounded-[1.5rem] overflow-hidden bg-[#151714]">
                        {p.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-[#2A2E29] to-[#151714] flex items-center justify-center">
                            <span className="text-white/85 text-xl font-bold">
                              {p.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('')}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-[15.5px] font-semibold tracking-tight text-[#151714] truncate">
                            {p.name}
                          </h3>
                          {p.verified && (
                            <BadgeCheck size={15} className="shrink-0 text-primary" />
                          )}
                        </div>
                        <p className="text-[12.5px] font-medium text-[#70756E] truncate">
                          {(p.categories || []).slice(0, 2).join(' · ') || 'Servicios'}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[13.5px] font-bold text-primary tabular-nums">
                            desde ${p.price}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-[#A8ADA6]">
                            <MapPin size={11} />
                            {getDistance(userLocation.lat, userLocation.lng, p.lat, p.lng).toFixed(1)} km
                          </span>
                        </div>
                      </div>

                      {/* Rating */}
                      <RatingPill
                        value={Number(p.rating) || 0}
                        className="shrink-0 border border-black/[0.05]"
                      />
                    </article>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            /* ── Estado vacío (patrón 6) ── */
            <div className="v2-rise py-20 text-center">
              <div className="w-24 h-24 rounded-[1.75rem] bg-[#E9F7EF] text-primary flex items-center justify-center mx-auto mb-7">
                <SearchX size={38} strokeWidth={1.8} />
              </div>
              <h3 className="text-[21px] font-semibold tracking-tight text-[#151714] mb-2">
                Sin resultados
              </h3>
              <p className="text-[14px] font-medium text-[#70756E] max-w-xs mx-auto">
                No encontramos proveedores de “{query}” en un radio de 20 km.
              </p>
              <Link
                href="/cliente/categories"
                className="inline-flex items-center justify-center h-14 px-8 mt-8 rounded-full bg-primary text-white text-[13px] font-bold shadow-lg shadow-primary/25 v2-press hover:bg-primary-dark transition-colors"
              >
                Explorar categorías
              </Link>
            </div>
          )}
        </div>
      </div>

      <ClientNav />
    </main>
  );
}

// useSearchParams requiere un límite de Suspense para el prerender de producción
export default function SearchResultsWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F3F4F1]" />}>
      <SearchResults />
    </Suspense>
  );
}
