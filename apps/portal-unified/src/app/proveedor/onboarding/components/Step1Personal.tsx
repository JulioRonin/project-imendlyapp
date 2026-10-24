"use client";

import { useState } from 'react';
import Link from 'next/link';
import { MailCheck } from 'lucide-react';
import { useOnboarding, isAdult, isEmail, onlyDigits } from './OnboardingContext';
import { WizardFooter, LABEL_CLS, INPUT_CLS, ERROR_CLS } from './WizardParts';
import { LegalConsent } from '@/components/legal/LegalConsent';
import { LEGAL_LINKS } from '@/lib/legal';

export const Step1Personal: React.FC<{ onNext: () => void; onBack: () => void }> = ({ onNext, onBack }) => {
  const { data, updateData, createAccount } = useOnboarding();
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptSensitive, setAcceptSensitive] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmSent, setConfirmSent] = useState(false);

  const touch = (k: string) => setTouched(t => ({ ...t, [k]: true }));

  const v = {
    name: (data.full_name || '').trim().split(/\s+/).length >= 2,
    birth: isAdult(data.birth_date),
    phone: onlyDigits(data.phone || '').length === 10,
    email: isEmail(data.email),
    password: (data.password || '').length >= 8,
  };

  const missing =
    !v.name ? 'Escribe tu nombre y apellido' :
    !v.birth ? 'Debes ser mayor de 18 años' :
    !v.phone ? 'El celular debe tener 10 dígitos' :
    !v.email ? 'Escribe un correo válido' :
    !v.password ? 'La contraseña necesita al menos 8 caracteres' :
    !acceptTerms ? 'Acepta los términos y el aviso de privacidad' :
    !acceptSensitive ? 'Autoriza el uso de tus datos de identificación' : '';

  const submit = async () => {
    if (missing) return;
    setLoading(true);
    setError(null);
    const result = await createAccount();
    setLoading(false);
    if (result.status === 'session') onNext();
    else if (result.status === 'confirm') setConfirmSent(true);
    else setError(result.message || 'No pudimos crear tu cuenta.');
  };

  if (confirmSent) {
    return (
      <div className="flex-1 flex flex-col">
        <section className="v2-scale bg-cream rounded-[2.25rem] v2-shadow-soft p-8 text-center">
          <span className="mx-auto w-16 h-16 rounded-[1.4rem] bg-mint-light text-mint-deep flex items-center justify-center">
            <MailCheck size={28} />
          </span>
          <h2 className="mt-5 text-[24px] font-semibold tracking-tight text-ink">Confirma tu correo</h2>
          <p className="mt-2 text-[14px] font-medium text-muted">
            Enviamos un enlace a <span className="font-semibold text-ink">{data.email}</span>. Ábrelo desde este mismo dispositivo:
            te traerá de vuelta aquí para continuar con la verificación de tu identidad.
          </p>
          <Link href="/proveedor/login" className="mt-6 w-full h-14 rounded-full bg-ink text-white text-[13px] font-bold flex items-center justify-center v2-press">
            Ya lo confirmé, iniciar sesión
          </Link>
        </section>
      </div>
    );
  }

  const field = (key: keyof typeof v, msg: string) =>
    touched[key] && !v[key] ? <p className={ERROR_CLS}>{msg}</p> : null;

  return (
    <div className="flex-1 flex flex-col space-y-5">
      <section className="v2-scale bg-cream rounded-[2.25rem] v2-shadow-soft p-6 space-y-4">
        <p className="text-[14px] font-medium text-muted">Crea tu cuenta de profesional. Con ella darás seguimiento a tu solicitud.</p>

        <div>
          <label className={LABEL_CLS} htmlFor="ob-name">Nombre completo</label>
          <input id="ob-name" autoComplete="name" placeholder="Ej. Juan Pérez López" value={data.full_name || ''} onBlur={() => touch('name')} onChange={e => updateData({ full_name: e.target.value })} className={INPUT_CLS} />
          {field('name', 'Escribe nombre y apellido, como aparece en tu INE.')}
        </div>
        <div>
          <label className={LABEL_CLS} htmlFor="ob-company">Nombre comercial (opcional)</label>
          <input id="ob-company" placeholder="Ej. Soluciones del Hogar" value={data.company_name || ''} onChange={e => updateData({ company_name: e.target.value })} className={INPUT_CLS} />
        </div>
        <div>
          <label className={LABEL_CLS} htmlFor="ob-birth">Fecha de nacimiento</label>
          <input id="ob-birth" type="date" value={data.birth_date || ''} onBlur={() => touch('birth')} onChange={e => updateData({ birth_date: e.target.value })} className={`${INPUT_CLS} tabular-nums`} />
          {field('birth', 'Solo pueden registrarse personas mayores de 18 años.')}
        </div>
        <div>
          <label className={LABEL_CLS} htmlFor="ob-phone">Celular (10 dígitos)</label>
          <input id="ob-phone" type="tel" inputMode="numeric" autoComplete="tel" placeholder="656 123 4567" value={data.phone || ''} onBlur={() => touch('phone')} onChange={e => updateData({ phone: onlyDigits(e.target.value).slice(0, 10) })} className={`${INPUT_CLS} tabular-nums`} />
          {field('phone', 'Escribe tu celular a 10 dígitos, sin lada internacional.')}
        </div>
        <div>
          <label className={LABEL_CLS} htmlFor="ob-email">Correo electrónico</label>
          <input id="ob-email" type="email" autoComplete="email" placeholder="nombre@correo.com" value={data.email || ''} onBlur={() => touch('email')} onChange={e => updateData({ email: e.target.value })} className={INPUT_CLS} />
          {field('email', 'Revisa el formato del correo.')}
        </div>
        <div>
          <label className={LABEL_CLS} htmlFor="ob-pass">Contraseña</label>
          <input id="ob-pass" type="password" autoComplete="new-password" placeholder="Mínimo 8 caracteres" value={data.password || ''} onBlur={() => touch('password')} onChange={e => updateData({ password: e.target.value })} className={INPUT_CLS} />
          {field('password', 'Usa al menos 8 caracteres.')}
        </div>
      </section>

      <section className="v2-scale bg-cream rounded-[2.25rem] v2-shadow-soft p-6 space-y-3" style={{ animationDelay: '80ms' }}>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-deep">Tu consentimiento</p>
        <p className="text-[13px] font-medium text-muted">Léelos con calma: para certificarte pediremos documentos personales.</p>

        <LegalConsent id="ob-terms" checked={acceptTerms} onChange={setAcceptTerms}>
          Soy mayor de 18 años y acepto los{' '}
          <Link href={LEGAL_LINKS.profesionales} target="_blank">Términos y condiciones para profesionales</Link>{' '}
          y el <Link href={LEGAL_LINKS.privacidad} target="_blank">Aviso de privacidad</Link> de I mendly.
        </LegalConsent>

        <LegalConsent id="ob-sensitive" tone="sensitive" checked={acceptSensitive} onChange={setAcceptSensitive}>
          <strong className="text-ink font-semibold">Consentimiento expreso para datos sensibles.</strong>{' '}
          Autorizo a I mendly a tratar mi identificación oficial (INE), CURP, la fotografía de mi rostro, mi comprobante de
          domicilio y mi constancia de antecedentes no penales con la única finalidad de verificar mi identidad e idoneidad
          y certificarme como profesional, conforme al{' '}
          <Link href={`${LEGAL_LINKS.privacidad}#datos-sensibles`} target="_blank">Aviso de privacidad</Link>.
          Puedo revocar este consentimiento en cualquier momento.
        </LegalConsent>

        {error && <p className="p-4 rounded-[1.25rem] bg-rose/15 text-error text-[13px] font-semibold text-center">{error}</p>}
      </section>

      <WizardFooter onBack={onBack} onNext={submit} canNext={!missing} missing={missing} label="Crear mi cuenta" loading={loading} />
    </div>
  );
};
