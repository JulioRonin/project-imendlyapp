'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Bell, Check, ChevronRight, MapPin, Search, ShieldCheck, Sparkles, Star, Wrench } from 'lucide-react';
import { Avatar } from '@i-mendly/shared/components/Avatar';
import { Badge } from '@i-mendly/shared/components/Badge';
import { BottomNav } from '@i-mendly/shared';
import { MOCK_PROVIDERS } from '@i-mendly/shared/constants/mocks';

const categories = [
  { name: 'Plomería', image: '/assets/plumbing.png', tint: 'bg-[#E6DFFF]' },
  { name: 'Electricidad', image: '/assets/electrician.png', tint: 'bg-[#FFD0B4]' },
  { name: 'Limpieza', image: '/assets/cleaning_professional.png', tint: 'bg-[#DDF5EE]' },
  { name: 'Climas / AC', image: '/assets/ac_work.png', tint: 'bg-[#E6DFFF]' },
];

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const radius = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export default function ClientHome() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [userLocation] = useState({ lat: 25.6667, lng: -100.4000 });
  const nearbyProviders = MOCK_PROVIDERS.filter((provider) => getDistance(userLocation.lat, userLocation.lng, provider.lat, provider.lng) <= 20).slice(0, 3);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    router.push(`/cliente/search?q=${encodeURIComponent(query || 'servicios para el hogar')}`);
  };

  return (
    <main className="min-h-screen bg-[#FAF8F4] pb-28 text-[#171717]">
      <header className="sticky top-0 z-40 border-b border-[#171717]/[0.06] bg-[#FAF8F4]/90 px-5 py-4 backdrop-blur-xl sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar name="Julio" size="md" className="ring-2 ring-[#BBA7F6]/40" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6F6B66]">Tu hogar, hoy</p>
              <button className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-[#171717]"><MapPin size={12} className="text-[#3CBFA1]" /> San Pedro Garza García</button>
            </div>
          </div>
          <button aria-label="Ver notificaciones" className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#171717] shadow-[0_8px_24px_rgba(17,17,17,.07)] transition hover:-translate-y-0.5"><Bell size={17} /></button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-12 px-5 pt-10 sm:px-8 sm:pt-14">
        <section className="grid items-end gap-8 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <div className="mb-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#BBA7F6]"><span className="h-px w-8 bg-[#BBA7F6]" /> Selección local</div>
            <h1 className="max-w-xl text-5xl font-semibold leading-[0.96] tracking-[-0.06em] sm:text-7xl">¿Qué necesita <span className="text-[#FFAA78]">tu hogar?</span></h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-[#6F6B66]">Cuéntanos qué quieres resolver. Te conectamos con profesionales que conocemos y respaldamos.</p>
          </div>
          <form onSubmit={handleSearch} className="rounded-[1.5rem] border border-[#171717]/[0.06] bg-white p-2 shadow-[0_18px_60px_rgba(17,17,17,.08)]">
            <div className="flex items-center gap-3 px-4"><Search size={19} className="text-[#6F6B66]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ej. reparar una fuga..." className="h-12 min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-[#6F6B66]/60" aria-label="Buscar un servicio" /><button className="flex h-11 items-center gap-2 rounded-xl bg-[#111111] px-4 text-xs font-bold text-white transition hover:bg-[#3CBFA1]">Buscar <ArrowUpRight size={15} /></button></div>
          </form>
        </section>

        <section>
          <div className="mb-5 flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#6F6B66]">Empieza por aquí</p><h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em]">Servicios para cada día</h2></div><Link href="/cliente/categories" className="flex items-center gap-1 text-xs font-bold text-[#171717]">Ver todo <ChevronRight size={14} /></Link></div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {categories.map((category) => <Link key={category.name} href={`/cliente/search?q=${encodeURIComponent(category.name)}`} className={`group relative flex min-h-[150px] overflow-hidden rounded-[1.5rem] p-5 ${category.tint}`}><div className="relative z-10"><p className="max-w-[100px] text-lg font-semibold leading-tight tracking-[-0.04em]">{category.name}</p><span className="mt-5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/70 transition group-hover:translate-x-1"><ArrowUpRight size={15} /></span></div><img src={category.image} alt="" className="absolute -bottom-2 -right-5 h-28 w-28 rounded-2xl object-cover mix-blend-multiply opacity-85 transition duration-500 group-hover:scale-110" /></Link>)}
          </div>
        </section>

        <section className="rounded-[1.75rem] bg-[#111111] p-6 text-[#F8F5F0] shadow-[0_24px_80px_rgba(17,17,17,.16)] sm:p-8"><div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between"><div className="max-w-xl"><div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#BBA7F6]"><ShieldCheck size={15} /> Protección i mendly</div><h2 className="text-3xl font-semibold leading-tight tracking-[-0.05em] sm:text-4xl">Tu anticipo no se libera hasta que el trabajo avance.</h2><p className="mt-3 max-w-lg text-sm leading-6 text-white/52">Si algo no sale como esperabas, abrimos una solución contigo: corrección, reemplazo o reembolso según los términos.</p></div><Link href="/cliente/proyectos" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#FFAA78] px-5 py-3 text-xs font-bold text-[#111111] transition hover:bg-[#F486A1]">Cómo funciona <ArrowUpRight size={16} /></Link></div></section>

        <section><div className="mb-5 flex items-end justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#6F6B66]">Curados para ti</p><h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em]">Profesionales cerca de ti</h2></div><span className="rounded-full bg-[#DDF5EE] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#247E69]">Verificados</span></div><div className="grid gap-4 md:grid-cols-3">{nearbyProviders.map((provider) => <Link key={provider.id} href={`/cliente/providers/${provider.id}`} className="group rounded-[1.5rem] border border-[#171717]/[0.06] bg-white p-3 shadow-[0_12px_40px_rgba(17,17,17,.06)] transition hover:-translate-y-1 hover:shadow-[0_18px_60px_rgba(17,17,17,.1)]"><div className="relative h-40 overflow-hidden rounded-[1.1rem] bg-[#F1EEE8]"><img src={provider.category === 'Electricista' ? '/assets/electrician.png' : provider.category === 'Climas/AC' ? '/assets/ac_work.png' : '/assets/plumbing.png'} alt={provider.category} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><Badge variant="default" className="absolute left-3 top-3 bg-[#DDF5EE] text-[#247E69]">VERIFICADO</Badge></div><div className="p-3"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6F6B66]">{provider.category}</p><h3 className="mt-1 text-lg font-semibold tracking-[-0.04em]">{provider.name}</h3></div><div className="flex items-center gap-1 text-xs font-bold"><Star size={13} className="fill-[#FFAA78] text-[#FFAA78]" /> 4.9</div></div><div className="mt-4 flex items-center justify-between text-xs text-[#6F6B66]"><span className="flex items-center gap-1"><MapPin size={13} /> Cerca de ti</span><span className="font-bold text-[#171717]">Desde ${provider.price}/h</span></div></div></Link>)}</div></section>

        <section className="flex flex-wrap items-center justify-between gap-4 border-t border-[#171717]/[0.08] pt-6 text-xs text-[#6F6B66]"><span className="flex items-center gap-2"><Check size={15} className="text-[#3CBFA1]" /> Profesionales seleccionados por i mendly</span><span className="flex items-center gap-2"><Wrench size={14} /> Servicio humano cuando lo necesites</span><Sparkles size={17} className="text-[#BBA7F6]" /></section>
      </div>
      <BottomNav onLogout={() => router.push('/role-selection')} />
    </main>
  );
}
