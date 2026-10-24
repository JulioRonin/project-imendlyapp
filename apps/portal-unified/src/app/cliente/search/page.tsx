"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, SearchX, BadgeCheck, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect , Suspense} from 'react';
import { supabase } from '../../../lib/supabase';
import { ClientNav } from '@/components/client/ClientNav';
import { RatingPill } from '@/components/client/ui';

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

// Fotografía editorial de cada oficio (banco en /public/assets)
const TRADE_PHOTO: Record<string, string> = {
  electricidad: '/assets/electrician.png',
  electricista: '/assets/electrician.png',
  'plomería': '/assets/plumbing.png',
  plomeria: '/assets/plumbing.png',
  'carpintería': '/assets/carpentry.png',
  carpinteria: '/assets/carpentry.png',
  climas: '/assets/ac_work.png',
  'climas/ac': '/assets/ac_work.png',
  pintura: '/assets/painting_work.png',
  'jardinería': '/assets/gardening.png',
  jardineria: '/assets/gardening.png',
  limpieza: '/assets/cleaning_professional.png',
  'cerrajería': '/assets/locksmith.png',
  cerrajeria: '/assets/locksmith.png',
  costura: '/assets/fashion_sewing.png',
  'moda y costura': '/assets/fashion_sewing.png',
};
const FALLBACK_PHOTO = '/assets/provider_dashboard_hero.png';

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

  const heroPhoto = TRADE_PHOTO[query.toLowerCase()] || FALLBACK_PHOTO;

  return (
    <main className="min-h-screen bg-linen pb-36 overflow-x-hidden">
      {/* ── Cabecera fotográfica del oficio ── */}
      <header className="v3-blur-in relative h-[300px] md:h-[360px] rounded-b-[2.75rem] overflow-hidden bg-ink">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={heroPhoto} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />

        <div className="relative max-w-5xl mx-auto px-6 pt-6">
          <button
            onClick={() => window.history.back()}
            aria-label="Regresar"
            className="w-11 h-11 rounded-full glass flex items-center justify-center text-ink v2-press"
          >
            <ArrowLeft size={19} />
          </button>
        </div>

        <div className="absolute inset-x-0 bottom-5 md:bottom-7">
          <div className="max-w-5xl mx-auto px-5 md:px-6">
            <div className="v3-blur-in glass rounded-[1.9rem] p-5 md:p-6 flex items-center justify-between gap-4" style={{ animationDelay: '200ms' }}>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-deep mb-1">Resultados</p>
                <h1 className="text-[24px] md:text-[30px] font-semibold tracking-tight leading-tight text-ink truncate">
                  {query || 'Todos los servicios'}
                </h1>
                <p className="mt-1 text-[13px] font-medium text-muted">
                  {isLoading ? (
                    'Buscando certificados cerca de ti…'
                  ) : (
                    <>
                      <span className="font-bold text-ink tabular-nums">{filteredProviders.length}</span>{' '}
                      {filteredProviders.length === 1 ? 'profesional' : 'profesionales'} cerca de ti
                    </>
                  )}
                </p>
              </div>
              <span className="hidden sm:inline-flex shrink-0 items-center gap-1.5 h-10 px-4 rounded-full bg-ink text-on-dark text-[12px] font-semibold">
                <MapPin size={13} className="text-primary" /> Ciudad Juárez
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto">
        {/* ── Tabs subrayadas (lavanda) ── */}
        <div className="v3-blur-in mt-6 px-6 flex gap-7 overflow-x-auto no-scrollbar" style={{ animationDelay: '320ms' }}>
          {[{ name: 'Todos', slug: '' }, ...CATEGORIES].map(c => {
            const active = c.slug === '' ? (!activeCategory && !query) : activeCategory?.slug === c.slug;
            return (
              <button
                key={c.slug || 'todos'}
                onClick={() => router.push(c.slug ? `/cliente/search?q=${encodeURIComponent(c.slug)}` : '/cliente/search')}
                className={`relative shrink-0 pb-3 text-[14px] transition-colors duration-300 ${active ? 'font-semibold text-ink' : 'font-medium text-faint hover:text-muted'}`}
              >
                {c.name}
                <span className={`absolute left-0 right-0 -bottom-px h-[3px] rounded-full bg-lavender transition-transform duration-500 origin-left ${active ? 'scale-x-100' : 'scale-x-0'}`} />
              </button>
            );
          })}
        </div>

        <div className="px-6 mt-7">
          {isLoading ? (
            /* ── Skeletons ── */
            <div className="space-y-5 pl-6">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="relative">
                  <div className="flex items-center gap-4 bg-cream rounded-[2rem] p-4 pl-0 v2-shadow-soft">
                    <div className="-ml-6 w-[104px] h-[124px] shrink-0 rounded-[1.6rem] v2-shimmer" />
                    <div className="flex-1 space-y-2.5 py-2">
                      <div className="h-4 w-2/3 rounded-full v2-shimmer" />
                      <div className="h-3 w-1/3 rounded-full v2-shimmer" />
                      <div className="h-3 w-1/2 rounded-full v2-shimmer" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProviders.length > 0 ? (
            /* ── Tarjetas apiladas con foto que se sale ── */
            <div className="space-y-5 pl-6">
              {filteredProviders.map((p, i) => {
                const initials = p.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('');
                return (
                  <div
                    key={p.id}
                    className={`relative ${i < 8 ? `v2-rise v2-d${i + 1}` : 'v2-rise v2-d8'}`}
                  >
                    {/* Tarjeta sombra detrás */}
                    <div className="absolute inset-y-3 left-3 right-[-10px] rounded-[2rem] bg-clay-deep" />
                    <Link href={`/cliente/providers/${p.id}`} className="block">
                      <article className="relative bg-cream rounded-[2rem] p-4 pl-0 flex items-center gap-4 v2-press v2-float">
                        {/* Foto / iniciales saliéndose del marco */}
                        <div className="-ml-6 shrink-0 w-[104px] h-[124px] rounded-[1.6rem] overflow-hidden v3-lift-shadow bg-ink">
                          {p.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-clay-deep text-on-dark text-3xl font-semibold">
                              {initials}
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 py-1">
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-[16.5px] font-semibold tracking-tight text-ink truncate">
                              {p.name}
                            </h3>
                            {p.verified && (
                              <BadgeCheck size={15} className="shrink-0 text-mint-deep" />
                            )}
                          </div>
                          <p className="text-[12.5px] font-medium text-muted truncate mt-0.5">
                            {(p.categories || []).slice(0, 2).join(' · ') || 'Servicios'}
                          </p>
                          <div className="mt-2.5">
                            <RatingPill value={Number(p.rating) || 0} />
                          </div>
                          <div className="flex items-center gap-2 mt-2.5">
                            <span className="text-[13.5px] font-bold text-primary-deep tabular-nums">
                              desde ${p.price}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-faint">
                              <MapPin size={11} />
                              {getDistance(userLocation.lat, userLocation.lng, p.lat, p.lng).toFixed(1)} km
                            </span>
                          </div>
                        </div>

                        <span className="shrink-0 w-11 h-11 rounded-full bg-ink text-on-dark flex items-center justify-center -mr-1">
                          <ArrowUpRight size={16} />
                        </span>
                      </article>
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ── Estado vacío ── */
            <div className="v2-rise py-20 text-center">
              <div className="w-24 h-24 rounded-[1.75rem] bg-primary-light text-primary-deep flex items-center justify-center mx-auto mb-7">
                <SearchX size={38} strokeWidth={1.8} />
              </div>
              <h3 className="text-[21px] font-semibold tracking-tight text-ink mb-2">
                Sin resultados
              </h3>
              <p className="text-[14px] font-medium text-muted max-w-xs mx-auto">
                No encontramos proveedores de “{query}” en un radio de 20 km.
              </p>
              <Link
                href="/cliente/categories"
                className="inline-flex items-center justify-center h-14 px-8 mt-8 rounded-full bg-ink text-on-dark text-[13px] font-bold v2-press"
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
    <Suspense fallback={<div className="min-h-screen bg-linen" />}>
      <SearchResults />
    </Suspense>
  );
}
