"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Loader2, MailCheck, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { LEGAL_LINKS, legalMetadata } from '@/lib/legal';
import { LegalConsent } from '@/components/legal/LegalConsent';

type Mode = 'signup' | 'login' | 'confirm';

const LABEL = 'block text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-2 ml-1';
const INPUT = 'w-full h-13 py-3.5 px-5 bg-sand rounded-[1.25rem] border-0 text-[15px] font-semibold text-ink placeholder:text-faint placeholder:font-medium outline-none focus:ring-2 focus:ring-lavender/60';

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
const onlyDigits = (v: string) => v.replace(/\D/g, '');

/**
 * Registro / inicio de sesión "en el momento": el cliente navega libre y
 * solo se le pide cuenta cuando va a hacer algo que la requiere
 * (publicar, solicitar, pagar). Al terminar llama a onAuthed().
 */
export function AuthSheet({
  open,
  onClose,
  onAuthed,
  reason = 'Crea tu cuenta para continuar',
  initialMode = 'signup',
}: {
  open: boolean;
  onClose: () => void;
  onAuthed: () => void;
  reason?: string;
  initialMode?: 'signup' | 'login';
}) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { if (open) { setMode(initialMode); setError(null); } }, [open, initialMode]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const signupValid =
    name.trim().split(/\s+/).length >= 2 &&
    isEmail(email) &&
    onlyDigits(phone).length === 10 &&
    password.length >= 8 &&
    accepted;

  const loginValid = isEmail(email) && password.length > 0;

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupValid) return;
    setLoading(true);
    setError(null);
    const { data, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: typeof window !== 'undefined' ? window.location.href : undefined,
        data: {
          full_name: name.trim(),
          role: 'client',
          phone: onlyDigits(phone),
          legal: legalMetadata(['terminos_clientes', 'aviso_privacidad']),
        },
      },
    });
    setLoading(false);
    if (authError) {
      setError(/registered|exists/i.test(authError.message)
        ? 'Ya existe una cuenta con este correo. Inicia sesión.'
        : 'No pudimos crear tu cuenta. Revisa tus datos e intenta de nuevo.');
      return;
    }
    if (data.session) onAuthed();
    else setMode('confirm');
  };

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginValid) return;
    setLoading(true);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (authError) {
      setError(/confirm/i.test(authError.message)
        ? 'Confirma tu correo antes de entrar: revisa tu bandeja de entrada.'
        : 'Correo o contraseña incorrectos.');
      return;
    }
    onAuthed();
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-end md:items-center justify-center" role="dialog" aria-modal="true" aria-label={reason}>
      <button aria-label="Cerrar" onClick={onClose} className="absolute inset-0 bg-ink/45 backdrop-blur-sm" />

      <div className="v2-rise relative w-full md:max-w-md max-h-[92dvh] overflow-y-auto bg-linen rounded-t-[2.25rem] md:rounded-[2.25rem] px-6 pt-6 pb-8 v2-shadow-float">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-deep">
              {mode === 'login' ? 'Bienvenido de vuelta' : mode === 'confirm' ? 'Casi listo' : 'Un paso más'}
            </p>
            <h2 className="mt-1.5 text-[24px] font-semibold tracking-tight leading-tight text-ink">
              {mode === 'login' ? 'Inicia sesión' : mode === 'confirm' ? 'Confirma tu correo' : reason}
            </h2>
          </div>
          <button onClick={onClose} aria-label="Cerrar" className="w-10 h-10 shrink-0 rounded-full bg-cream flex items-center justify-center text-ink v2-press">
            <X size={17} />
          </button>
        </div>

        {mode === 'confirm' ? (
          <div className="mt-6 text-center">
            <span className="mx-auto w-16 h-16 rounded-[1.4rem] bg-mint-light text-mint-deep flex items-center justify-center">
              <MailCheck size={28} />
            </span>
            <p className="mt-5 text-[14px] font-medium text-muted">
              Te enviamos un enlace a <span className="font-semibold text-ink">{email}</span>. Ábrelo para activar tu cuenta y volverás a este mismo punto.
            </p>
            <button onClick={() => setMode('login')} className="mt-6 w-full h-14 rounded-full bg-ink text-white text-[13px] font-bold v2-press">
              Ya lo confirmé, iniciar sesión
            </button>
          </div>
        ) : mode === 'signup' ? (
          <form onSubmit={signUp} className="mt-6 space-y-4">
            <p className="text-[13.5px] font-medium text-muted -mt-2">
              Es gratis y toma un minuto. Necesitamos tu cuenta para proteger tu pago y tu información.
            </p>
            <div>
              <label className={LABEL} htmlFor="as-name">Nombre completo</label>
              <input id="as-name" autoComplete="name" value={name} onChange={e => setName(e.target.value)} placeholder="Nombre y apellido" className={INPUT} />
            </div>
            <div>
              <label className={LABEL} htmlFor="as-email">Correo</label>
              <input id="as-email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nombre@correo.com" className={INPUT} />
            </div>
            <div>
              <label className={LABEL} htmlFor="as-phone">Celular (10 dígitos)</label>
              <input id="as-phone" type="tel" inputMode="numeric" autoComplete="tel" value={phone} onChange={e => setPhone(onlyDigits(e.target.value).slice(0, 10))} placeholder="656 123 4567" className={`${INPUT} tabular-nums`} />
            </div>
            <div>
              <label className={LABEL} htmlFor="as-pass">Contraseña</label>
              <input id="as-pass" type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" className={INPUT} />
            </div>

            <LegalConsent id="as-legal" checked={accepted} onChange={setAccepted}>
              Soy mayor de 18 años y acepto los{' '}
              <Link href={LEGAL_LINKS.terminos} target="_blank">Términos y condiciones</Link> y el{' '}
              <Link href={LEGAL_LINKS.privacidad} target="_blank">Aviso de privacidad</Link> de I mendly.
            </LegalConsent>

            {error && <p className="p-3.5 rounded-[1.1rem] bg-rose/15 text-error text-[12.5px] font-semibold text-center">{error}</p>}

            <button
              type="submit"
              disabled={!signupValid || loading}
              className={`w-full h-14 rounded-full text-[13px] font-bold flex items-center justify-center gap-2 transition-colors ${
                signupValid ? 'bg-ink text-white v2-press' : 'bg-sand text-faint cursor-not-allowed'
              }`}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <>Crear cuenta y continuar <ArrowUpRight size={16} /></>}
            </button>
            <p className="text-center text-[13px] font-medium text-muted">
              ¿Ya tienes cuenta?{' '}
              <button type="button" onClick={() => { setMode('login'); setError(null); }} className="font-semibold text-ink underline underline-offset-2">Inicia sesión</button>
            </p>
          </form>
        ) : (
          <form onSubmit={signIn} className="mt-6 space-y-4">
            <div>
              <label className={LABEL} htmlFor="as-lemail">Correo</label>
              <input id="as-lemail" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nombre@correo.com" className={INPUT} />
            </div>
            <div>
              <label className={LABEL} htmlFor="as-lpass">Contraseña</label>
              <input id="as-lpass" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className={INPUT} />
            </div>
            {error && <p className="p-3.5 rounded-[1.1rem] bg-rose/15 text-error text-[12.5px] font-semibold text-center">{error}</p>}
            <button
              type="submit"
              disabled={!loginValid || loading}
              className={`w-full h-14 rounded-full text-[13px] font-bold flex items-center justify-center gap-2 transition-colors ${
                loginValid ? 'bg-ink text-white v2-press' : 'bg-sand text-faint cursor-not-allowed'
              }`}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <>Entrar <ArrowUpRight size={16} /></>}
            </button>
            <p className="text-center text-[13px] font-medium text-muted">
              ¿Primera vez aquí?{' '}
              <button type="button" onClick={() => { setMode('signup'); setError(null); }} className="font-semibold text-ink underline underline-offset-2">Crea tu cuenta</button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
