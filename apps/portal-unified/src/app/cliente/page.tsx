"use client";

import {
  Search,
  MapPin,
  LogOut,
  ChevronRight,
  Zap,
  Droplets,
  Wind,
  Paintbrush,
  Hammer,
  Bug,
  Armchair,
  Sparkles,
  User,
  Bell,
  Navigation,
  Shield,
  ShieldCheck,
  BadgeCheck,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Avatar } from '@i-mendly/shared/components/Avatar';
import { ClientNav } from '@/components/client/ClientNav';
import { Chip, SectionHead, IconTile, RatingPill, Reveal } from '@/components/client/ui';

const CATEGORIES = [
  { name: 'Electricidad', icon: Zap, slug: 'Electricidad' },
  { name: 'Plomería', icon: Droplets, slug: 'Plomería' },
  { name: 'Climas', icon: Wind, slug: 'Climas/AC' },
  { name: 'Pintura', icon: Paintbrush, slug: 'Pintura' },
  { name: 'Albañilería', icon: Hammer, slug: 'Albañilería' },
  { name: 'Limpieza', icon: Sparkles, slug: 'Limpieza' },
  { name: 'Carpintería', icon: Armchair, slug: 'Carpintería' },
  { name: 'Fumigación', icon: Bug, slug: 'Fumigación' },
];

const SUGGESTIONS = [
  'Electricista', 'Plomería', 'Limpieza', 'Climas/AC', 'Pintura',
  'Carpintería', 'Jardinería', 'Cerrajería', 'Fumigación', 'Remodelación', 'Moda y costura', 'Pisos', 'Herrería'
];

export default function ClientHome() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [location, setLocation] = useState("México");
  const [isLocating, setIsLocating] = useState(false);
  const [profileIncomplete, setProfileIncomplete] = useState(false);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [featured, setFeatured] = useState<any[]>([]);
  const [activeChip, setActiveChip] = useState('Todos');

  useEffect(() => {
    const checkProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check users table for phone
      const { data: userData } = await supabase
        .from('users')
        .select('phone, full_name')
        .eq('id', user.id)
        .single();

      if (userData?.full_name) setFirstName(userData.full_name.split(' ')[0]);

      // Check user_addresses table
      const { data: addrData } = await supabase
        .from('user_addresses')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      if (!userData?.phone || !addrData || addrData.length === 0) {
        setProfileIncomplete(true);
      }
    };

    const fetchFeatured = async () => {
      const { data } = await supabase
        .from('providers')
        .select('id, category, rating, reviews_count, is_verified, base_price, users ( full_name, avatar_url )')
        .eq('is_verified', true)
        .order('rating', { ascending: false })
        .limit(6);
      if (data) setFeatured(data);
    };

    checkProfile();
    fetchFeatured();
  }, []);

  const handleSearch = (term?: string) => {
    const finalTerm = term || searchTerm;
    if (finalTerm) {
      router.push(`/cliente/search?q=${encodeURIComponent(finalTerm)}`);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleLocate = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        // Simulated location naming
        setLocation("Ciudad Juárez");
        setIsLocating(false);
      }, () => setIsLocating(false));
    } else {
      setIsLocating(false);
    }
  };

  const chipFilter = (label: string) => {
    setActiveChip(label);
    if (label !== 'Todos') router.push(`/cliente/search?q=${encodeURIComponent(label)}`);
  };

  return (
    <main className="min-h-screen bg-[#F3F4F1] pb-36">
      {/* Aviso de perfil incompleto */}
      {profileIncomplete && (
        <div className="v2-rise bg-[#151714] text-white py-3 px-6 flex items-center justify-between gap-4 sticky top-0 z-[60]">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-8 h-8 shrink-0 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
              <Shield size={15} />
            </span>
            <p className="text-[12px] font-semibold truncate">
              Completa tu perfil <span className="text-white/50 hidden sm:inline">— teléfono y dirección para solicitar servicios</span>
            </p>
          </div>
          <Link
            href="/cliente/profile"
            className="shrink-0 text-[12px] font-bold bg-primary px-4 py-2 rounded-full v2-press"
          >
            Completar
          </Link>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* ── HERO verde con saludo y buscador ── */}
        <header className="v2-rise relative v2-hero-grad text-white rounded-b-[2.75rem] md:rounded-[2.75rem] md:mt-5 md:mx-6 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-20 w-72 h-72 rounded-full bg-black/10 blur-3xl pointer-events-none" />

          <div className="relative px-6 md:px-12 pt-7 pb-16">
            {/* Fila superior */}
            <div className="flex items-center justify-between mb-8">
              <div className="group relative">
                <Avatar name={firstName || 'Cliente'} size="md" className="cursor-pointer ring-2 ring-white/30" />
                <div className="absolute top-full left-0 mt-3 w-48 bg-white rounded-[1.25rem] v2-shadow-float p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <button
                    onClick={() => router.push('/cliente/profile')}
                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#F3F4F1] text-[13px] font-semibold text-[#151714] flex items-center gap-3"
                  >
                    <User size={15} /> Ver perfil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 text-[13px] font-semibold text-red-500 flex items-center gap-3"
                  >
                    <LogOut size={15} /> Cerrar sesión
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleLocate}
                  className="flex items-center gap-2 h-10 px-4 rounded-full bg-white/15 backdrop-blur text-[12px] font-semibold v2-press"
                >
                  {isLocating
                    ? <Navigation size={13} className="animate-spin" />
                    : <MapPin size={13} />}
                  {isLocating ? 'Ubicando…' : location}
                </button>
                <button aria-label="Notificaciones" className="w-10 h-10 rounded-full bg-white/15 backdrop-blur flex items-center justify-center v2-press">
                  <Bell size={17} />
                </button>
              </div>
            </div>

            {/* Saludo */}
            <p className="v2-rise v2-d1 text-[15px] font-medium text-white/75 mb-1">
              Hola{firstName ? `, ${firstName}` : ''} 👋
            </p>
            <h1 className="v2-rise v2-d2 text-[34px] md:text-5xl font-bold tracking-tight leading-[1.08] mb-8 max-w-xl">
              ¿Qué arreglamos hoy en tu casa?
            </h1>

            {/* Buscador */}
            <div className="v2-rise v2-d3 relative max-w-2xl">
              <div className="flex items-center gap-2 bg-white rounded-full p-2 v2-shadow-float">
                <div className="flex-1 flex items-center gap-3 pl-4 min-w-0">
                  <Search size={19} className="shrink-0 text-[#A8ADA6]" />
                  <input
                    type="text"
                    placeholder="Busca un servicio o proyecto"
                    value={searchTerm}
                    onFocus={() => setShowSuggestions(true)}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full h-12 bg-transparent text-[#151714] text-[15px] font-semibold placeholder:text-[#A8ADA6] placeholder:font-medium outline-none"
                  />
                </div>
                <button
                  onClick={() => handleSearch()}
                  className="shrink-0 h-12 px-6 rounded-full bg-[#151714] text-white text-[13px] font-bold v2-press"
                >
                  Buscar
                </button>
              </div>

              {/* Sugerencias */}
              {showSuggestions && searchTerm.length > 0 && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowSuggestions(false)} />
                  <div className="absolute top-full left-0 right-0 mt-3 p-2 rounded-[1.75rem] v2-shadow-float z-20 v2-scale bg-white">
                    {SUGGESTIONS.filter(s => s.toLowerCase().includes(searchTerm.toLowerCase())).map((s, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSearchTerm(s);
                          setShowSuggestions(false);
                          handleSearch(s);
                        }}
                        className="w-full text-left px-5 py-3.5 rounded-[1.15rem] hover:bg-[#F3F4F1] text-[14px] font-semibold text-[#151714] flex items-center justify-between group transition-colors"
                      >
                        <span>{s}</span>
                        <ChevronRight size={15} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-primary" />
                      </button>
                    ))}
                    {SUGGESTIONS.filter(s => s.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                      <p className="px-5 py-6 text-center text-[#A8ADA6] text-[13px] font-medium">
                        Presiona Enter para buscar “{searchTerm}”
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* ── Chips de categorías, empalmadas sobre el hero ── */}
        <div className="v2-rise v2-d4 relative z-10 -mt-7 px-6 md:px-12">
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar snap-x pb-1">
            <Chip label="Todos" active={activeChip === 'Todos'} onClick={() => chipFilter('Todos')} />
            {CATEGORIES.map(c => (
              <Chip key={c.slug} label={c.name} active={activeChip === c.name} onClick={() => chipFilter(c.slug)} />
            ))}
          </div>
        </div>

        {/* ── Proveedores destacados — tarjetas image-forward ── */}
        {featured.length > 0 && (
          <section className="v2-rise v2-d5 mt-10 pl-6 md:pl-12">
            <div className="pr-6 md:pr-12">
              <SectionHead title="Certificados destacados" action="Ver todos" href="/cliente/search?q=" />
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pr-6 md:pr-12 pb-2">
              {featured.map((p, i) => {
                const name = p.users?.full_name || 'Proveedor';
                return (
                  <Link
                    key={p.id}
                    href={`/cliente/providers/${p.id}`}
                    className="snap-start shrink-0 w-[78%] sm:w-[340px] group"
                  >
                    <article className="relative h-[420px] rounded-[2.25rem] overflow-hidden v2-shadow-lift v2-press v2-float bg-[#151714]">
                      {p.users?.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.users.avatar_url}
                          alt={name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="absolute inset-0 v2-hero-grad flex items-center justify-center">
                          <span className="text-white/90 text-7xl font-bold">
                            {name.split(' ').map((w: string) => w[0]).slice(0, 2).join('')}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                      {p.is_verified && (
                        <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md text-white rounded-full pl-2.5 pr-3.5 h-9 text-[12px] font-semibold">
                          <BadgeCheck size={14} className="text-white" /> Certificado
                        </span>
                      )}
                      <RatingPill value={Number(p.rating) || 0} className="absolute top-4 right-4" />

                      <div className="absolute inset-x-0 bottom-0 p-5">
                        <h3 className="text-white text-[21px] font-bold tracking-tight leading-tight">{name}</h3>
                        <p className="text-white/60 text-[13px] font-medium mb-4">
                          {p.category} · {p.reviews_count} reseñas
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="h-12 px-6 inline-flex items-center rounded-full bg-white text-[#151714] text-[13px] font-bold v2-press">
                            Ver perfil
                          </span>
                          {p.base_price > 0 && (
                            <span className="text-white/80 text-[13px] font-semibold tabular-nums">
                              desde ${Number(p.base_price).toFixed(0)}
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Banner ink: Tablero de Proyectos ── */}
        <Reveal className="mt-12 px-6 md:px-12">
          <div className="relative overflow-hidden rounded-[2.25rem] bg-[#151714] text-white p-8 md:p-12 v2-shadow-float">
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/25 blur-3xl pointer-events-none" />
            <div className="relative flex flex-col md:flex-row md:items-center gap-8">
              <div className="flex-1">
                <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary mb-4">
                  <ShieldCheck size={14} /> Tablero de proyectos
                </span>
                <h2 className="text-[26px] md:text-3xl font-bold tracking-tight leading-tight mb-3">
                  Publica tu proyecto y deja que te busquen
                </h2>
                <p className="text-[14px] font-medium text-white/55 max-w-lg">
                  Una pérgola, una cocina, una remodelación. Recibe hasta 5 ofertas de
                  proveedores verificados — con anticipo protegido y Garantía I mendly.
                </p>
              </div>
              <div className="flex flex-col gap-3 md:w-56">
                <Link
                  href="/cliente/proyectos/nuevo"
                  className="h-14 rounded-full bg-primary text-white text-[13px] font-bold flex items-center justify-center shadow-lg shadow-primary/30 v2-press hover:bg-primary-dark transition-colors"
                >
                  Publicar proyecto
                </Link>
                <Link
                  href="/cliente/proyectos"
                  className="h-14 rounded-full border border-white/15 text-white/85 text-[13px] font-semibold flex items-center justify-center v2-press hover:bg-white/10 transition-colors"
                >
                  Ver mis proyectos
                </Link>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ── Grid de categorías ── */}
        <Reveal className="mt-12 px-6 md:px-12">
          <SectionHead title="Categorías" action="Explorar" href="/cliente/categories" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {CATEGORIES.map(cat => (
              <IconTile
                key={cat.slug}
                icon={<cat.icon size={24} strokeWidth={2} />}
                label={cat.name}
                onClick={() => router.push(`/cliente/search?q=${encodeURIComponent(cat.slug)}`)}
              />
            ))}
          </div>
        </Reveal>

        {/* ── Franja de confianza ── */}
        <Reveal className="mt-12 px-6 md:px-12">
          <div className="rounded-[2.25rem] bg-[#E9F7EF] p-7 md:p-9 flex flex-col sm:flex-row sm:items-center gap-5">
            <span className="w-14 h-14 shrink-0 rounded-[1.15rem] bg-white text-primary flex items-center justify-center v2-shadow-soft">
              <ShieldCheck size={26} />
            </span>
            <div className="flex-1">
              <h3 className="text-[17px] font-bold tracking-tight text-[#151714] mb-1">
                Garantía I mendly de hasta $10,000 MXN
              </h3>
              <p className="text-[13.5px] font-medium text-[#70756E]">
                Paga dentro de la app y tu anticipo queda protegido. Si algo sale mal,
                lo corregimos con otro certificado o te reembolsamos.
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      <ClientNav />
    </main>
  );
}
