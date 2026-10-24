"use client";

import React from 'react';
import { BadgeCheck, FileText, Home, Images } from 'lucide-react';
import { useOnboarding, onlyDigits, fileCount } from './OnboardingContext';
import { WizardFooter, FileSlot, LABEL_CLS, INPUT_CLS } from './WizardParts';
import { LegalConsent } from '@/components/legal/LegalConsent';

const TEXTAREA_CLS = 'w-full bg-sand rounded-[1.25rem] border-0 px-5 py-4 text-[14px] font-medium text-ink placeholder:text-faint outline-none focus:ring-2 focus:ring-lavender/60 resize-none transition-shadow';

export const Step3Docs: React.FC<{ onNext: () => void; onBack: () => void }> = ({ onNext, onBack }) => {
  const { data, updateDocuments } = useOnboarding();
  const docs = data.documents || {};
  const files = docs.files || {};

  const refOk = (i: 1 | 2) =>
    ((docs[`testimonial${i}_name`] as string) || '').trim().length >= 3 &&
    onlyDigits((docs[`testimonial${i}_contact`] as string) || '').length === 10;

  const missing =
    !fileCount(files.antecedentes) ? 'Sube tu constancia de antecedentes no penales' :
    !fileCount(files.domicilio) ? 'Sube tu comprobante de domicilio' :
    fileCount(files.portafolio) < 3 ? 'Sube al menos 3 fotos de trabajos realizados' :
    !refOk(1) ? 'Completa tu primera referencia (nombre y celular de 10 dígitos)' :
    !refOk(2) ? 'Completa tu segunda referencia (nombre y celular de 10 dígitos)' :
    !docs.references_consent ? 'Confirma que tus referencias aceptaron ser contactadas' : '';

  const RefBlock = ({ i }: { i: 1 | 2 }) => (
    <div className={`space-y-3 ${i === 2 ? 'pt-5 border-t border-line' : ''}`}>
      <p className="text-[12px] font-semibold text-ink">Referencia {i}</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={LABEL_CLS} htmlFor={`ref${i}-name`}>Nombre del cliente</label>
          <input
            id={`ref${i}-name`} placeholder={i === 1 ? 'Ej. María G.' : 'Ej. Juan P.'}
            value={(docs[`testimonial${i}_name`] as string) || ''}
            onChange={e => updateDocuments({ [`testimonial${i}_name`]: e.target.value })}
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS} htmlFor={`ref${i}-phone`}>Celular</label>
          <input
            id={`ref${i}-phone`} type="tel" inputMode="numeric" placeholder="10 dígitos"
            value={(docs[`testimonial${i}_contact`] as string) || ''}
            onChange={e => updateDocuments({ [`testimonial${i}_contact`]: onlyDigits(e.target.value).slice(0, 10) })}
            className={`${INPUT_CLS} tabular-nums`}
          />
        </div>
      </div>
      <textarea
        className={TEXTAREA_CLS} rows={2}
        placeholder="¿Qué trabajo le hiciste? (opcional)"
        value={(docs[`testimonial${i}_text`] as string) || ''}
        onChange={e => updateDocuments({ [`testimonial${i}_text`]: e.target.value })}
      />
    </div>
  );

  return (
    <div className="flex-1 flex flex-col space-y-5">
      <section className="v2-scale bg-cream rounded-[2.25rem] v2-shadow-soft p-6">
        <p className="text-[14px] font-medium text-muted mb-2">Estos documentos sostienen tu certificación. Todos son obligatorios salvo las certificaciones.</p>
        <FileSlot field="antecedentes" title="Constancia de antecedentes no penales" hint="Vigencia máxima de 3 meses." icon={<FileText size={19} />} />
        <FileSlot field="domicilio" title="Comprobante de domicilio" hint="Luz, agua o teléfono, máximo 3 meses de antigüedad." icon={<Home size={19} />} />
        <FileSlot field="portafolio" title="Portafolio de trabajos" hint="Fotos de trabajos tuyos terminados: mínimo 3." icon={<Images size={19} />} accept="image/*" multiple min={3} />
        <FileSlot field="certificaciones" title="Certificaciones técnicas" hint="Cursos, constancias o licencias que respalden tu oficio." icon={<BadgeCheck size={19} />} multiple min={1} optional />
      </section>

      <section className="v2-scale bg-cream rounded-[2.25rem] v2-shadow-soft p-6" style={{ animationDelay: '80ms' }}>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-deep">Obligatorio</p>
        <h3 className="mt-1 text-[19px] font-semibold tracking-tight text-ink">Dos referencias de clientes</h3>
        <p className="mt-1 text-[13px] font-medium text-muted mb-6">Llamaremos a cada una para confirmar la calidad de tu trabajo.</p>
        <div className="space-y-6">
          <RefBlock i={1} />
          <RefBlock i={2} />
          <LegalConsent
            id="ob-refs" checked={!!docs.references_consent}
            onChange={value => updateDocuments({ references_consent: value })}
          >
            Confirmo que estas personas aceptaron compartir su nombre y teléfono para que I mendly las contacte
            únicamente para verificar mi trabajo.
          </LegalConsent>
        </div>
      </section>

      <WizardFooter onBack={onBack} onNext={onNext} canNext={!missing} missing={missing} />
    </div>
  );
};
