"use client";

import { useCallback, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export type AppRole = 'client' | 'provider' | 'admin';

export interface SessionState {
  user: User | null;
  role: AppRole | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

/** Sesión de Supabase + rol real (leído de public.users, no del cliente). */
export function useSession(): SessionState {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data: { user: current } } = await supabase.auth.getUser();
    setUser(current);
    if (current) {
      const { data } = await supabase.from('users').select('role').eq('id', current.id).single();
      setRole((data?.role as AppRole) ?? null);
    } else {
      setRole(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const { data: sub } = supabase.auth.onAuthStateChange(() => { refresh(); });
    return () => sub.subscription.unsubscribe();
  }, [refresh]);

  return { user, role, loading, refresh };
}
