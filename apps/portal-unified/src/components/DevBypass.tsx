"use client";

import { useRouter } from 'next/navigation';
import { KeyRound, TriangleAlert } from 'lucide-react';
import { usePlatformStore } from '@/store/usePlatformStore';
import { supabase } from '@/lib/supabase';
import { DEV_BYPASS_ENABLED, DEMO_USERS, DEMO_PASSWORD, type DemoUser } from '@/lib/devAuth';

/**
 * Panel de acceso rápido para desarrollo.
 * Intenta primero un login real contra Supabase (funciona si ya corriste
 * seed_demo.sql). Si no hay sesión posible, entra en modo demo local para
 * poder recorrer las pantallas.
 */
export function DevBypassPanel() {
  const router = useRouter();
  const login = usePlatformStore(state => state.login);

  if (!DEV_BYPASS_ENABLED) return null;

  const enter = async (user: DemoUser) => {
    // 1. Intento de sesión real (usuarios de seed_demo.sql)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: DEMO_PASSWORD,
      });
      if (!error) {
        login(user.email, user.role);
        router.push(user.path);
        return;
      }
    } catch {
      // Sin Supabase configurado: seguimos al modo demo local.
    }

    // 2. Modo demo local: sin sesión real, las pantallas con datos irán vacías.
    login(user.email, user.role);
    router.push(user.path);
  };

  return (
    <div className="mt-10 pt-8 border-t border-dashed border-amber-300">
      <div className="flex items-center gap-2 mb-4">
        <KeyRound size={14} className="text-amber-500" />
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-500">
          Acceso rápido · solo desarrollo
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {DEMO_USERS.map(user => (
          <button
            key={user.role}
            type="button"
            onClick={() => enter(user)}
            className="py-4 px-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-black uppercase tracking-widest hover:bg-amber-100 transition-colors"
          >
            {user.label}
          </button>
        ))}
      </div>
      <p className="mt-3 text-[9px] font-bold text-slate-400 leading-relaxed">
        Entra con los usuarios de <code className="font-mono">seed_demo.sql</code>. Sin base de datos
        configurada, las pantallas cargan vacías.
      </p>
    </div>
  );
}

/** Franja fija: hace imposible operar un despliegue con el bypass activo sin notarlo. */
export function DevModeBanner() {
  if (!DEV_BYPASS_ENABLED) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[100] bg-amber-500 text-white py-1.5 px-4 flex items-center justify-center gap-2 pointer-events-none">
      <TriangleAlert size={12} />
      <span className="text-[9px] font-black uppercase tracking-[0.3em]">
        Modo demo · acceso sin autenticación habilitado
      </span>
    </div>
  );
}
