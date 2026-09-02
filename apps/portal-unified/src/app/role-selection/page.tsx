"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { Logo } from '@i-mendly/shared/Logo';

const ROLES = [
  {
    key: 'cliente',
    href: '/login',
    img: '/assets/painting_work.png',
    eyebrow: 'Para tu hogar',
    title: 'Necesito un servicio',
    text: 'Proveedores verificados, anticipo protegido y Garantía I mendly.',
    cta: 'Entrar como cliente',
  },
  {
    key: 'proveedor',
    href: '/proveedor/login',
    img: '/assets/carpentry.png',
    eyebrow: 'Para profesionales',
    title: 'Ofrezco mi oficio',
    text: 'Clientes reales en tu zona y cobro garantizado al día siguiente.',
    cta: 'Entrar como profesional',
  },
] as const;

export default function RoleSelectionPage() {
  const router = useRouter();
  const [chosen, setChosen] = useState<string | null>(null);

  const choose = (role: (typeof ROLES)[number]) => {
    if (chosen) return;
    setChosen(role.key);
    // El panel se expande antes de navegar: la transición es parte del flujo
    setTimeout(() => router.push(role.href), 650);
  };

  return (
    <main className="min-h-[100dvh] bg-[#F4F1EA] flex flex-col">
      {/* Cabecera editorial */}
      <header className="v3-blur-in px-6 md:px-12 pt-8 pb-5 flex items-end justify-between max-w-7xl mx-auto w-full">
        <div>
          <Logo size={30} />
          <h1 className="mt-6 text-[34px] md:text-6xl font-semibold tracking-tight leading-[1.02] text-[#1B1A17] max-w-2xl">
            Tu hogar, <span className="text-primary">en buenas manos.</span>
          </h1>
        </div>
        <span className="hidden md:inline-flex items-center gap-2 glass rounded-full px-4 h-11 text-[13px] font-semibold text-[#1B1A17]">
          <ShieldCheck size={15} className="text-primary" /> Ciudad Juárez
        </span>
      </header>

      {/* Paneles fotográficos */}
      <section className="flex-1 flex flex-col md:flex-row gap-3 md:gap-4 px-4 md:px-12 pb-5 max-w-7xl mx-auto w-full min-h-[62vh]">
        {ROLES.map((role, i) => {
          const isChosen = chosen === role.key;
          const dimmed = chosen !== null && !isChosen;
          return (
            <button
              key={role.key}
              type="button"
              onClick={() => choose(role)}
              style={{ flexGrow: isChosen ? 3 : dimmed ? 0.35 : 1, animationDelay: `${180 + i * 140}ms` }}
              className={`v3-panel v3-blur-in group relative flex-1 min-h-[220px] rounded-[2.5rem] overflow-hidden text-left outline-none focus-visible:ring-4 focus-visible:ring-primary/40 ${dimmed ? 'opacity-50' : ''}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={role.img}
                alt=""
                className={`absolute inset-0 w-full h-full object-cover v3-photo ${isChosen ? 'scale-[1.08]' : ''}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1B1A17]/80 via-[#1B1A17]/15 to-transparent" />

              {/* Tarjeta de vidrio */}
              <div className="absolute inset-x-4 bottom-4 md:inset-x-6 md:bottom-6 glass rounded-[1.9rem] p-5 md:p-7 flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary mb-1.5">{role.eyebrow}</p>
                  <h2 className="text-[22px] md:text-[28px] font-semibold tracking-tight leading-tight text-[#1B1A17]">{role.title}</h2>
                  <p className="mt-1.5 text-[13px] md:text-[14px] font-medium text-[#7A7468] max-w-xs">{role.text}</p>
                </div>
                <span className="shrink-0 w-14 h-14 rounded-full bg-[#1B1A17] text-white flex items-center justify-center transition-transform duration-500 group-hover:rotate-45 group-active:scale-95">
                  <ArrowUpRight size={22} />
                </span>
              </div>

              <span className="absolute top-5 left-5 glass rounded-full px-3.5 h-9 inline-flex items-center text-[12px] font-semibold text-[#1B1A17]">
                {role.cta}
              </span>
            </button>
          );
        })}
      </section>

      <footer className="v3-blur-in px-6 pb-7 text-center" style={{ animationDelay: '600ms' }}>
        <Link href="/admin" className="text-[11px] font-semibold text-[#ACA598] hover:text-[#1B1A17] transition-colors tracking-wide">
          Acceso equipo I mendly
        </Link>
      </footer>
    </main>
  );
}
