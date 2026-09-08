'use client';

import { ArrowUpRight, Check, Home, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import Link from 'next/link';

const trustSignals = ['Identidad verificada', 'Anticipo protegido', 'Garantía hasta $10,000 MXN'];

export default function RoleSelectionPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#111111] text-[#F8F5F0]">
      <section className="relative isolate min-h-screen px-5 py-5 sm:px-8 lg:px-12">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -right-32 -top-40 h-[32rem] w-[32rem] rounded-full bg-[#BBA7F6]/18 blur-3xl" />
          <div className="absolute -bottom-48 -left-24 h-[28rem] w-[28rem] rounded-full bg-[#FFAA78]/16 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.35)_1px,transparent_1px)] [background-size:72px_72px]" />
        </div>

        <header className="mx-auto flex max-w-[1440px] items-center justify-between border-b border-white/10 pb-5">
          <Link href="/role-selection" className="group flex items-center gap-3" aria-label="i mendly, inicio">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F8F5F0] text-[#111111] shadow-[0_0_40px_rgba(255,170,120,.15)] transition-transform duration-200 group-hover:-rotate-6">
              <span className="text-lg font-black tracking-[-0.15em]">M</span>
            </span>
            <span className="text-sm font-semibold tracking-[0.24em] text-[#F8F5F0]">i mendly</span>
          </Link>
          <Link href="/admin" className="rounded-full border border-white/15 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55 transition hover:border-white/35 hover:text-white">
            Acceso equipo
          </Link>
        </header>

        <div className="mx-auto grid min-h-[calc(100vh-6.5rem)] max-w-[1440px] items-center gap-14 py-14 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:gap-20 lg:py-20">
          <div className="max-w-2xl">
            <div className="mb-8 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#BBA7F6]">
              <span className="h-px w-10 bg-[#BBA7F6]" />
              Concierge para tu hogar
            </div>
            <h1 className="max-w-xl text-[clamp(3.4rem,7vw,7.5rem)] font-semibold leading-[0.92] tracking-[-0.07em] text-[#F8F5F0]">
              Lo difícil de tu hogar, <span className="text-[#FFAA78]">resuelto.</span>
            </h1>
            <p className="mt-8 max-w-lg text-lg leading-8 text-white/58 sm:text-xl">
              Profesionales que conocemos, pagos que protegemos y alguien que responde cuando lo necesitas.
            </p>

            <div className="mt-10 flex flex-wrap gap-x-5 gap-y-3">
              {trustSignals.map((signal) => (
                <div key={signal} className="flex items-center gap-2 text-xs font-medium text-white/72">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3CBFA1]/18 text-[#3CBFA1]"><Check size={12} strokeWidth={3} /></span>
                  {signal}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <RoleCard
              eyebrow="Para tu hogar"
              title="Necesito resolver algo"
              description="Encuentra manos expertas para lo que tu casa necesita, con respaldo de principio a fin."
              href="/login"
              icon={<Home size={22} strokeWidth={1.7} />}
              className="bg-[#F8F5F0] text-[#111111] sm:translate-y-8"
              buttonClass="bg-[#111111] text-[#F8F5F0] hover:bg-[#3CBFA1]"
              note="Publica tu proyecto gratis"
            />
            <RoleCard
              eyebrow="Para profesionales"
              title="Quiero ofrecer mi oficio"
              description="Crece con clientes reales, reputación visible y cobro protegido después de cada trabajo."
              href="/proveedor/login"
              icon={<Wrench size={22} strokeWidth={1.7} />}
              className="bg-[#262626] text-[#F8F5F0] border border-white/10"
              buttonClass="bg-[#FFAA78] text-[#111111] hover:bg-[#F486A1]"
              note="Únete a la red curada"
            />
            <div className="col-span-full mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-white/58 sm:mt-8">
              <ShieldCheck className="shrink-0 text-[#3CBFA1]" size={19} />
              <span>Tu anticipo se mantiene protegido dentro de i mendly hasta que el trabajo avance.</span>
              <ArrowUpRight className="ml-auto shrink-0 text-white/35" size={17} />
            </div>
          </div>
        </div>

        <footer className="mx-auto flex max-w-[1440px] items-center justify-between border-t border-white/10 pt-5 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/32">
          <span>i mendly · Ciudad Juárez</span>
          <span className="hidden items-center gap-2 sm:flex"><Sparkles size={13} /> Curaduría local, servicio humano</span>
        </footer>
      </section>
    </main>
  );
}

function RoleCard({
  eyebrow,
  title,
  description,
  href,
  icon,
  className,
  buttonClass,
  note,
}: {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  className: string;
  buttonClass: string;
  note: string;
}) {
  return (
    <article className={`group relative flex min-h-[330px] flex-col justify-between overflow-hidden rounded-[2rem] p-7 shadow-[0_24px_80px_rgba(0,0,0,.2)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_32px_96px_rgba(0,0,0,.32)] ${className}`}>
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border border-current opacity-[0.08] transition duration-500 group-hover:scale-125" />
      <div>
        <div className="mb-12 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.24em] opacity-50">{eyebrow}</span>
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-current/10">{icon}</span>
        </div>
        <h2 className="max-w-xs text-3xl font-semibold leading-[1.02] tracking-[-0.05em]">{title}</h2>
        <p className="mt-4 max-w-sm text-sm leading-6 opacity-58">{description}</p>
      </div>
      <Link href={href} className={`mt-8 flex items-center justify-between rounded-2xl px-4 py-3 text-xs font-bold transition duration-200 active:scale-[0.98] ${buttonClass}`}>
        <span>{note}</span>
        <ArrowUpRight size={17} />
      </Link>
    </article>
  );
}
