"use client";

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Clock, LogOut, ShieldCheck } from 'lucide-react';
import { Logo } from '@i-mendly/shared/Logo';
import { supabase } from '@/lib/supabase';
import { useSession } from '@/hooks/useSession';

type Access = 'checking' | 'active' | 'review' | 'not-provider';

// Rutas públicas del portal de profesionales (entrada y postulación)
const OPEN_PATHS = ['/proveedor/login', '/proveedor/onboarding'];

/**
 * El portal de profesionales es solo para profesionales certificados.
 * - Sin sesión → login de profesionales.
 * - Cuenta de cliente → aviso (no entra al portal).
 * - Profesional sin solicitud → termina su onboarding.
 * - Profesional con solicitud aún no aprobada → pantalla "en revisión".
 */
export function ProviderGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? '';
  const router = useRouter();
  const { user, role, loading } = useSession();
  const [access, setAccess] = useState<Access>('checking');
  const [appStatus, setAppStatus] = useState<string | null>(null);

  const isOpen = OPEN_PATHS.some(p => pathname === p || pathname.startsWith(`${p}/`));

  useEffect(() => {
    if (isOpen || loading) return;
    if (!user) { router.replace('/proveedor/login'); return; }
    if (role !== 'provider') { setAccess('not-provider'); return; }

    (async () => {
      const { data: provider } = await supabase
        .from('providers').select('account_status').eq('id', user.id).single();
      if (provider?.account_status === 'active') { setAccess('active'); return; }

      const { data: application } = await supabase
        .from('onboarding_applications').select('status').eq('user_id', user.id).maybeSingle();
      if (!application) { router.replace('/proveedor/onboarding'); return; }
      setAppStatus(application.status);
      setAccess('review');
    })();
  }, [isOpen, loading, user, role, router]);

  if (isOpen) return <>{children}</>;
  if (access === 'active') return <>{children}</>;

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace('/proveedor/login');
  };

  if (access === 'checking') {
    return (
      <main className="flex-1 min-h-screen bg-linen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-line border-t-ink animate-spin" />
      </main>
    );
  }

  const STAGE: Record<string, string> = {
    application: 'Recibida',
    revision: 'En revisión de documentos',
    interview: 'Entrevista',
    training: 'Capacitación',
  };

  return (
    <main className="flex-1 min-h-[100dvh] bg-linen flex flex-col items-center justify-center px-6 py-12">
      <div className="v3-blur-in w-full max-w-md">
        <Logo size={30} />
        <div className="mt-8 bg-cream rounded-[2.25rem] p-8 v2-shadow-soft">
          {access === 'review' ? (
            <>
              <span className="w-14 h-14 rounded-[1.25rem] bg-lavender-light text-lavender-deep flex items-center justify-center">
                <Clock size={24} />
              </span>
              <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-primary-deep">Tu solicitud</p>
              <h1 className="mt-1.5 text-[26px] font-semibold tracking-tight leading-tight text-ink">Estamos revisando tu expediente</h1>
              <p className="mt-2 text-[14px] font-medium text-muted">
                Etapa actual: <span className="font-semibold text-ink">{STAGE[appStatus ?? ''] ?? 'En proceso'}</span>.
                Te avisaremos por correo y WhatsApp en cuanto tu perfil esté certificado; mientras tanto el portal permanece cerrado.
              </p>
              <p className="mt-5 inline-flex items-center gap-2 text-[12.5px] font-semibold text-mint-deep">
                <ShieldCheck size={15} /> Tus documentos se guardan en un almacenamiento privado
              </p>
            </>
          ) : (
            <>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-error">Portal de profesionales</p>
              <h1 className="mt-1.5 text-[26px] font-semibold tracking-tight leading-tight text-ink">Esta cuenta no es de profesional</h1>
              <p className="mt-2 text-[14px] font-medium text-muted">
                Entraste con una cuenta de cliente. Para ofrecer servicios necesitas una cuenta de profesional: cierra sesión y postúlate con otro correo.
              </p>
              <Link href="/cliente" className="mt-6 w-full h-14 rounded-full bg-primary text-ink text-[13px] font-bold flex items-center justify-center v2-press">
                Volver a I mendly para clientes
              </Link>
            </>
          )}
          <button onClick={signOut} className="mt-3 w-full h-14 rounded-full bg-sand text-ink text-[13px] font-semibold flex items-center justify-center gap-2 v2-press">
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>
      </div>
    </main>
  );
}
