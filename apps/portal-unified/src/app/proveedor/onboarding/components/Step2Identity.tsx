"use client";

import React, { useState } from 'react';
import { Camera, CreditCard, IdCard, Lock, UserRound } from 'lucide-react';
import { useOnboarding, isCurp, isRfc, fileCount } from './OnboardingContext';
import { WizardFooter, FileSlot, LABEL_CLS, INPUT_CLS, ERROR_CLS } from './WizardParts';

const UPPER = `${INPUT_CLS} uppercase tabular-nums placeholder:normal-case`;

export const Step2Identity: React.FC<{ onNext: () => void; onBack?: () => void }> = ({ onNext, onBack }) => {
  const { data, updateDocuments } = useOnboarding();
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const docs = data.documents || {};
  const files = docs.files || {};

  const curpOk = isCurp(docs.curp);
  const rfcOk = !docs.rfc || isRfc(docs.rfc);

  const missing =
    !curpOk ? 'Escribe una CURP válida de 18 caracteres' :
    !rfcOk ? 'Revisa el RFC o déjalo vacío' :
    !fileCount(files.profile_photo) ? 'Sube tu foto de perfil' :
    !fileCount(files.ine_front) ? 'Sube el frente de tu INE' :
    !fileCount(files.ine_back) ? 'Sube el reverso de tu INE' :
    !fileCount(files.selfie_ine) ? 'Sube tu selfie sosteniendo tu INE' : '';

  return (
    <div className="flex-1 flex flex-col space-y-5">
      <section className="v2-scale bg-cream rounded-[2.25rem] v2-shadow-soft p-6 space-y-4">
        <p className="text-[14px] font-medium text-muted">Por tu seguridad y la de los clientes, validamos la identidad de cada profesional.</p>
        <div>
          <label className={LABEL_CLS} htmlFor="ob-curp">CURP</label>
          <input
            id="ob-curp" placeholder="18 caracteres" maxLength={18}
            value={docs.curp || ''}
            onBlur={() => setTouched(t => ({ ...t, curp: true }))}
            onChange={e => updateDocuments({ curp: e.target.value.toUpperCase().replace(/\s/g, '') })}
            className={UPPER}
          />
          {touched.curp && !curpOk && <p className={ERROR_CLS}>La CURP no tiene un formato válido. Revísala en tu INE.</p>}
        </div>
        <div>
          <label className={LABEL_CLS} htmlFor="ob-rfc">RFC (opcional, para facturación)</label>
          <input
            id="ob-rfc" placeholder="12 o 13 caracteres" maxLength={13}
            value={docs.rfc || ''}
            onBlur={() => setTouched(t => ({ ...t, rfc: true }))}
            onChange={e => updateDocuments({ rfc: e.target.value.toUpperCase().replace(/\s/g, '') })}
            className={UPPER}
          />
          {touched.rfc && !rfcOk && <p className={ERROR_CLS}>El RFC no tiene un formato válido.</p>}
        </div>
      </section>

      <section className="v2-scale bg-cream rounded-[2.25rem] v2-shadow-soft p-6" style={{ animationDelay: '80ms' }}>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-deep mb-1">Documentos de identidad</p>
        <FileSlot field="profile_photo" title="Foto de perfil profesional" hint="Rostro de frente, fondo claro. Es la que verán los clientes." icon={<UserRound size={19} />} accept="image/*" />
        <FileSlot field="ine_front" title="INE · frente" hint="Foto nítida, sin reflejos, con las 4 esquinas visibles." icon={<IdCard size={19} />} />
        <FileSlot field="ine_back" title="INE · reverso" icon={<CreditCard size={19} />} />
        <FileSlot field="selfie_ine" title="Selfie sosteniendo tu INE" hint="Tu rostro y la credencial deben verse claros." icon={<Camera size={19} />} accept="image/*" capture="user" />
      </section>

      <p className="flex items-start gap-2.5 px-2 text-[12px] font-medium text-muted">
        <Lock size={14} className="shrink-0 mt-0.5 text-mint-deep" />
        Tus documentos se guardan en un almacenamiento privado: solo tú y el equipo de verificación de I mendly pueden verlos. No se muestran a clientes.
      </p>

      <WizardFooter onBack={onBack} onNext={onNext} canNext={!missing} missing={missing} label="Validar y continuar" />
    </div>
  );
};
