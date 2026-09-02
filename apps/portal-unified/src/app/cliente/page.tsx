"use client";

import {
  Search,
  MapPin,
  LogOut,
  ChevronRight,
  ArrowUpRight,
  Heart,
  User,
  Bell,
  Navigation,
  Shield,
  ShieldCheck,
  BadgeCheck,
  Star,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Avatar } from '@i-mendly/shared/components/Avatar';
import { ClientNav } from '@/components/client/ClientNav';
import { Reveal } from '@/components/client/ui';

// Oficios con su fotografía editorial (banco de imágenes del proyecto)
const TRADES = [
  { name: 'Electricidad', slug: 'Electricidad', img: '/assets/electrician.png', from: 'desde $180' },
  { name: 'Plomería', slug: 'Plomería', img: '/assets/plumbing.png', from: 'desde $350' },
  { name: 'Carpintería', slug: 'Carpintería', img: '/assets/carpentry.png', from: 'desde $1,500' },
  { name: 'Climas', slug: 'Climas/AC', img: '/assets/ac_work.png', from: 'desde $400' },
  { name: 'Pintura', slug: 'Pintura', img: '/assets/painting_work.png', from: 'desde $50/m²' },
  { name: 'Jardinería', slug: 'Jardinería', img: '/assets/gardening.png', from: 'desde $300' },
  { name: 'Limpieza', slug: 'Limpieza', img: '/assets/cleaning_professional.png', from: 'desde $400' },
  { name: 'Cerrajería', slug: 'Cerrajería', img: '/assets/locksmith.png', from: 'desde $250' },
];

const TABS = ['Todos', 'Electricidad', 'Plomería', 'Carpintería', 'Climas/AC', 'Pintura', 'Jardinería', 'Limpieza'];

// Etiquetas flotantes sobre la foto del hero (patrón "hotspot" de la referencia)
const HOTSPOTS = [
  { label: 'Pintura', price: 'desde $50/m²', style: { top: '18%', left: '7%' }, delay: 700 },
  { label: 'Pérgola', price: 'desde $12,000', style: { top: '44%', right: '6%' }, delay: 900 },
  { label: 'Cocina integral', price: 'desde $18,000', style: { bottom: '42%', left: '12%' }, delay: 1100 },
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
  const [activeTab, setActiveTab] = useState('Todos');
  const [liked, setLiked] = useState<Record<string, boolean>>({});

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

  const pickTab = (tab: string) => {
    setActiveTab(tab);
    if (tab !== 'Todos') router.push(`/cliente/search?q=${encodeURIComponent(tab)}`);
  };

  const filteredSuggestions = SUGGESTIONS.filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <main className="min-h-screen bg-[#F4F1EA] pb-36 overflow-x-hidden">
      {/* Aviso de perfil incompleto */}
      {profileIncomplete && (
        <div className="v2-rise bg-[#1B1A17] text-white py-3 px-6 flex items-center justify-between gap-4 sticky top-0 z-[60]">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-8 h-8 shrink-0 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
              <Shield size={15} />
            </span>
            <p className="text-[12px] font-semibold truncate">
              Completa tu perfil <span className="text-white/50 hidden sm:inline">— teléfono y dirección para solicitar servicios</span>
            </p>
          </div>
          <Link href="/cliente/profile" className="shrink-0 text-[12px] font-bold bg-primary px-4 py-2 rounded-full v2-press">
            Completar
          </Link>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* ── Barra superior ── */}
        <div className="v3-blur-in flex items-center justify-between pt-7">
          <div className="group relative flex items-center gap-3">
            <Avatar name={firstName || 'Cliente'} size="md" className="cursor-pointer ring-4 ring-white" />
            <div className="absolute top-full left-0 mt-3 w-48 bg-white rounded-[1.25rem] v2-shadow-float p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <button onClick={() => router.push('/cliente/profile')} className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#F4F1EA] text-[13px] font-semibold text-[#1B1A17] flex items-center gap-3">
                <User size={15} /> Ver perfil
              </button>
              <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 text-[13px] font-semibold text-red-500 flex items-center gap-3">
                <LogOut size={15} /> Cerrar sesión
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleLocate} className="flex items-center gap-2 h-10 px-4 rounded-full bg-white/70 text-[12px] font-semibold text-[#1B1A17] v2-press">
              {isLocating ? <Navigation size={13} className="animate-spin text-primary" /> : <MapPin size={13} className="text-primary" />}
              {isLocating ? 'Ubicando…' : location}
            </button>
            <button aria-label="Notificaciones" className="w-10 h-10 rounded-full bg-white/70 flex items-center justify-center text-[#1B1A17] v2-press">
              <Bell size={17} />
            </button>
          </div>
        </div>

        {/* ── Saludo editorial ── */}
        <div className="mt-9">
          <p className="v3-blur-in text-[15px] font-medium text-[#7A7468]" style={{ animationDelay: '120ms' }}>
            Hola{firstName ? `, ${firstName}` : ''}
          </p>
          <h1 className="v3-blur-in text-[36px] md:text-[56px] font-semibold tracking-tight leading-[1.02] text-[#1B1A17] mt-1 max-w-2xl" style={{ animationDelay: '220ms' }}>
            ¿Qué arreglamos hoy?
          </h1>
        </div>

        {/* ── Buscador de vidrio ── */}
        <div className="v3-blur-in relative mt-6 max-w-xl" style={{ animationDelay: '340ms' }}>
          <div className="flex items-center gap-2 glass rounded-full p-1.5">
            <div className="flex-1 flex items-center gap-3 pl-4 min-w-0">
              <Search size={18} className="shrink-0 text-[#ACA598]" />
              <input
                type="text"
                placeholder="Busca un servicio o proyecto"
                value={searchTerm}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full h-11 bg-transparent text-[#1B1A17] text-[15px] font-semibold placeholder:text-[#ACA598] placeholder:font-medium outline-none"
              />
            </div>
            <button onClick={() => handleSearch()} className="shrink-0 h-11 w-11 rounded-full bg-[#1B1A17] text-white flex items-center justify-center v2-press">
              <ArrowUpRight size={18} />
            </button>
          </div>
          {showSuggestions && searchTerm.length > 0 && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowSuggestions(false)} />
              <div className="absolute top-full left-0 right-0 mt-3 p-2 rounded-[1.75rem] bg-white v2-shadow-float z-20 v2-scale">
                {filteredSuggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => { setSearchTerm(s); setShowSuggestions(false); handleSearch(s); }}
                    className="w-full text-left px-5 py-3.5 rounded-[1.15rem] hover:bg-[#F4F1EA] text-[14px] font-semibold text-[#1B1A17] flex items-center justify-between group transition-colors"
                  >
                    <span>{s}</span>
                    <ChevronRight size={15} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-primary" />
                  </button>
                ))}
                {filteredSuggestions.length === 0 && (
                  <p className="px-5 py-6 text-center text-[#ACA598] text-[13px] font-medium">Presiona Enter para buscar “{searchTerm}”</p>
                )}
              </div>
            </>
          )}
        </div>

        {/* ── Tabs subrayadas (patrón editorial) ── */}
        <div className="v3-blur-in mt-8 -mx-6 md:mx-0 px-6 md:px-0 flex gap-7 overflow-x-auto no-scrollbar" style={{ animationDelay: '440ms' }}>
          {TABS.map(tab => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => pickTab(tab)}
                className={`relative shrink-0 pb-3 text-[14px] transition-colors duration-300 ${active ? 'font-semibold text-[#1B1A17]' : 'font-medium text-[#ACA598] hover:text-[#7A7468]'}`}
              >
                {tab}
                <span className={`absolute left-0 right-0 -bottom-px h-[3px] rounded-full bg-primary transition-transform duration-500 origin-left ${active ? 'scale-x-100' : 'scale-x-0'}`} />
              </button>
            );
          })}
        </div>

        {/* ── Hero fotográfico con etiquetas flotantes ── */}
        <section className="v3-blur-in mt-6" style={{ animationDelay: '520ms' }}>
          <div className="group relative h-[520px] md:h-[600px] rounded-[2.5rem] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/painting_work.png" alt="Casa luminosa recién pintada" className="absolute inset-0 w-full h-full object-cover v3-photo" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1B1A17]/70 via-transparent to-transparent" />

            {HOTSPOTS.map(h => (
              <button
                key={h.label}
                onClick={() => handleSearch(h.label)}
                style={{ ...h.style, animationDelay: `${h.delay}ms` }}
                className="v3-pop absolute glass rounded-full pl-2.5 pr-4 h-10 flex items-center gap-2.5 v2-press"
              >
                <span className="relative w-2.5 h-2.5">
                  <span className="absolute inset-0 rounded-full bg-primary v3-pulse-ring" />
                  <span className="absolute inset-0 rounded-full bg-primary" />
                </span>
                <span className="text-[12.5px] font-semibold text-[#1B1A17]">{h.label}</span>
                <span className="text-[12px] font-medium text-[#7A7468]">{h.price}</span>
              </button>
            ))}

            <div className="absolute inset-x-5 bottom-5 md:inset-x-7 md:bottom-7 glass rounded-[1.9rem] p-5 md:p-6 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary mb-1">Tablero de proyectos</p>
                <h2 className="text-[21px] md:text-[24px] font-semibold tracking-tight leading-tight text-[#1B1A17]">Publica tu proyecto</h2>
                <p className="mt-1 text-[13px] font-medium text-[#7A7468]">Hasta 5 ofertas de verificados, con anticipo protegido</p>
              </div>
              <Link href="/cliente/proyectos/nuevo" className="shrink-0 h-14 px-6 rounded-full bg-[#1B1A17] text-white text-[13px] font-bold flex items-center gap-2 v2-press">
                Publicar <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Certificados destacados: tarjetas apiladas con foto que se sale ── */}
        {featured.length > 0 && (
          <Reveal className="mt-14">
            <div className="flex items-end justify-between mb-7">
              <h2 className="text-[24px] font-semibold tracking-tight text-[#1B1A17]">Certificados destacados</h2>
              <Link href="/cliente/search?q=" className="text-[13px] font-semibold text-primary flex items-center gap-1">Ver todos <ChevronRight size={15} /></Link>
            </div>
            <div className="flex gap-7 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-6 px-10 md:mx-0 md:px-4 pb-6 pt-3">
              {featured.map((p, i) => {
                const name = p.users?.full_name || 'Proveedor';
                const initials = name.split(' ').map((w: string) => w[0]).slice(0, 2).join('');
                return (
                  <div key={p.id} className="snap-start shrink-0 w-[300px] relative pl-6 v2-rise" style={{ animationDelay: `${i * 90}ms` }}>
                    {/* Tarjeta sombra detrás (patrón apilado de la referencia) */}
                    <div className="absolute inset-y-3 left-9 right-[-10px] rounded-[2rem] bg-[#1E7A4E]" />
                    <article className="relative bg-[#FBF9F4] rounded-[2rem] p-5 pl-0 flex items-center gap-4 v2-press v2-float">
                      {/* Foto que se sale de la tarjeta */}
                      <div className="-ml-6 shrink-0 w-[104px] h-[124px] rounded-[1.6rem] overflow-hidden v3-lift-shadow bg-[#1B1A17]">
                        {p.users?.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.users.avatar_url} alt={name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#43C688] to-[#1E7A4E] text-white text-3xl font-semibold">{initials}</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 py-1">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-[17px] font-semibold tracking-tight text-[#1B1A17] truncate">{name}</h3>
                          {p.is_verified && <BadgeCheck size={15} className="shrink-0 text-primary" />}
                        </div>
                        <p className="text-[12.5px] font-medium text-[#7A7468] mt-0.5">{p.category}</p>
                        <div className="flex items-center gap-1 mt-2.5">
                          <Star size={13} className="text-amber-400 fill-amber-400" />
                          <span className="text-[13px] font-bold text-[#1B1A17] tabular-nums">{Number(p.rating || 0).toFixed(1)}</span>
                          <span className="text-[12px] text-[#ACA598]">· {p.reviews_count} reseñas</span>
                        </div>
                        {p.base_price > 0 && <p className="mt-2 text-[13px] font-bold text-[#1E7A4E] tabular-nums">desde ${Number(p.base_price).toFixed(0)}</p>}
                      </div>
                      <div className="shrink-0 flex flex-col gap-2 -mr-1">
                        <button
                          aria-label="Guardar"
                          onClick={() => setLiked(l => ({ ...l, [p.id]: !l[p.id] }))}
                          className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors v2-press ${liked[p.id] ? 'bg-primary text-white' : 'bg-white text-[#1B1A17]'}`}
                        >
                          <Heart size={16} className={liked[p.id] ? 'fill-white' : ''} />
                        </button>
                        <Link href={`/cliente/providers/${p.id}`} aria-label="Ver perfil" className="w-11 h-11 rounded-full bg-[#1B1A17] text-white flex items-center justify-center v2-press">
                          <ArrowUpRight size={16} />
                        </Link>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          </Reveal>
        )}

        {/* ── Explora por oficio: mosaico fotográfico ── */}
        <Reveal className="mt-12">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-[24px] font-semibold tracking-tight text-[#1B1A17]">Explora por oficio</h2>
            <Link href="/cliente/categories" className="text-[13px] font-semibold text-primary flex items-center gap-1">Todos <ChevronRight size={15} /></Link>
          </div>
          <div className="columns-2 md:columns-4 gap-3.5">
            {TRADES.map((t, i) => (
              <button
                key={t.slug}
                onClick={() => router.push(`/cliente/search?q=${encodeURIComponent(t.slug)}`)}
                className={`group relative w-full mb-3.5 break-inside-avoid rounded-[1.9rem] overflow-hidden text-left v2-press ${i % 3 === 0 ? 'h-64' : i % 3 === 1 ? 'h-44' : 'h-52'}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.img} alt={t.name} className="absolute inset-0 w-full h-full object-cover v3-photo" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B1A17]/75 via-[#1B1A17]/5 to-transparent" />
                <div className="absolute inset-x-4 bottom-4">
                  <p className="text-white text-[16px] font-semibold tracking-tight leading-tight">{t.name}</p>
                  <p className="text-white/65 text-[12px] font-medium mt-0.5">{t.from}</p>
                </div>
              </button>
            ))}
          </div>
        </Reveal>

        {/* ── Garantía: vidrio sobre foto cálida ── */}
        <Reveal className="mt-10">
          <div className="relative rounded-[2.5rem] overflow-hidden h-[240px] md:h-[280px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/provider_dashboard_hero.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[#1B1A17]/20" />
            <div className="absolute inset-4 md:inset-6 glass rounded-[1.9rem] p-6 md:p-8 flex items-center gap-5">
              <span className="w-14 h-14 shrink-0 rounded-full bg-[#1B1A17] text-primary flex items-center justify-center">
                <ShieldCheck size={26} />
              </span>
              <div>
                <h3 className="text-[19px] md:text-[22px] font-semibold tracking-tight text-[#1B1A17] leading-tight">Garantía I mendly de hasta $10,000 MXN</h3>
                <p className="mt-1.5 text-[13.5px] font-medium text-[#7A7468] max-w-md">Paga dentro de la app y tu anticipo queda protegido. Si algo sale mal, lo corregimos con otro certificado o te reembolsamos.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <ClientNav />
    </main>
  );
}
