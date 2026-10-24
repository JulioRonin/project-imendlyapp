"use client";

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { useSession } from '@/hooks/useSession';
import { AuthSheet } from '@/components/auth/AuthSheet';
import { ClientNav } from '@/components/client/ClientNav';

/**
 * Monta el contenido solo con sesión. Para invitados muestra una pantalla
 * que invita a crear cuenta sin sacarlos del flujo. Como el contenido se
 * monta después de autenticarse, sus fetch corren ya con usuario.
 */
export function RequireSession({
  children,
  title,
  text,
  image = '/assets/provider_dashboard_hero.png',
  showNav = true,
}: {
  children: ReactNode;
  title: string;
  text: string;
  image?: string;
  showNav?: boolean;
}) {
  const { user, loading } = useSession();
  const [sheet, setSheet] = useState<null | 'signup' | 'login'>(null);

  if (loading) {
    return (
      <main className="min-h-screen bg-linen px-6 pt-8 max-w-3xl mx-auto space-y-4">
        <div className="h-10 w-2/3 rounded-full v2-shimmer" />
        <div className="h-48 rounded-[2.25rem] v2-shimmer" />
        <div className="h-32 rounded-[1.75rem] v2-shimmer" />
      </main>
    );
  }

  if (user) return <>{children}</>;

  return (
    <main className="min-h-[100dvh] bg-linen pb-36">
      <section className="relative h-[52vh] min-h-[340px] rounded-b-[2.75rem] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover v3-kenburns" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />
        <Link href="/cliente" aria-label="Volver al inicio" className="absolute top-6 left-6 w-12 h-12 rounded-full glass flex items-center justify-center text-ink v2-press">
          <ArrowLeft size={19} />
        </Link>
      </section>

      <div className="relative -mt-24 px-5 max-w-md mx-auto">
        <div className="v3-blur-in glass rounded-[2.25rem] p-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-deep">Tu cuenta I mendly</p>
          <h1 className="mt-2 text-[26px] font-semibold tracking-tight leading-tight text-ink">{title}</h1>
          <p className="mt-2 text-[14px] font-medium text-muted">{text}</p>
          <div className="mt-6 space-y-2.5">
            <button onClick={() => setSheet('signup')} className="w-full h-14 rounded-full bg-ink text-white text-[13px] font-bold flex items-center justify-center gap-2 v2-press">
              Crear cuenta gratis <ArrowUpRight size={16} />
            </button>
            <button onClick={() => setSheet('login')} className="w-full h-14 rounded-full bg-cream text-ink text-[13px] font-semibold v2-press">
              Ya tengo cuenta
            </button>
          </div>
        </div>
      </div>

      <AuthSheet
        open={sheet !== null}
        initialMode={sheet ?? 'signup'}
        onClose={() => setSheet(null)}
        onAuthed={() => setSheet(null)}
      />
      {showNav && <ClientNav />}
    </main>
  );
}
