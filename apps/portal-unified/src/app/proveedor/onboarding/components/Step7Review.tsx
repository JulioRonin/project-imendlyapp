"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { User, Wrench, CalendarCheck, MessageSquareQuote, FileCheck2, GraduationCap } from 'lucide-react';
import { useOnboarding, fileCount, isCurp } from './OnboardingContext';
import { WizardFooter } from './WizardParts';
import { LegalConsent } from '@/components/legal/LegalConsent';
import { LEGAL_LINKS } from '@/lib/legal';

const EYEBROW = 'text-[10px] font-bold uppercase tracking-[0.18em]';

const SPECIALTY: Record<string, string> = {
  elec: 'Electricidad', plom: 'Plomería', pint: 'Pintura', clim: 'Climas/AC',
  limp: 'Limpieza', alba: 'Albañilería', carp: 'Carpintería', fumi: 'Fumigación',
};

const REQUIRED_FILES = ['profile_photo', 'ine_front', 'ine_back', 'selfie_ine', 'antecedentes', 'domicilio'] as const;

export const Step7Review: React.FC<{ onNext: () => void; onBack: () => void }> = ({ onBack }) => {
  const { data, submitApplication } = useOnboarding();
  const [veracity, setVeracity] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const docs = data.documents || {};
  const files = docs.files || {};
  const requiredDone = REQUIRED_FILES.filter(f => fileCount(files[f]) > 0).length;
  const portfolio = fileCount(files.portafolio);
  const certs = fileCount(files.certificaciones);

  // Última barrera: aunque se llegue aquí por un borrador viejo, no se envía incompleto
  const missing =
    !isCurp(docs.curp) || requiredDone < REQUIRED_FILES.length || portfolio < 3 ? 'Faltan documentos: regresa a los pasos de identidad y documentos' :
    !docs.testimonial1_name || !docs.testimonial2_name || !docs.references_consent ? 'Faltan tus dos referencias' :
    !data.main_specialty ? 'Falta tu especialidad' :
    !data.interview?.time ? 'Falta agendar tu entrevista' :
    !data.exam?.passed ? 'Debes aprobar el examen de certificación' :
    !veracity ? 'Confirma la declaración de veracidad' : '';

  const handleSubmit = async () => {
    if (missing) return;
    setSubmitting(true);
    setError(null);
    const result = await submitApplication();
    setSubmitting(false);
    // Si todo salió bien, la página cambia sola al estado "solicitud enviada"
    if (!result.success) setError(result.error || 'No pudimos enviar tu solicitud. Intenta de nuevo.');
  };

  const rows = [
    {
      icon: <User size={18} />,
      label: 'Datos personales',
      value: data.full_name || 'Sin nombre',
      hint: [data.email, data.phone].filter(Boolean).join(' · ') || 'Sin datos de contacto',
    },
    {
      icon: <FileCheck2 size={18} />,
      label: 'Documentos',
      value: `${requiredDone} de ${REQUIRED_FILES.length} obligatorios · ${portfolio} fotos de portafolio`,
      hint: `CURP ${docs.curp || 'pendiente'}${certs ? ` · ${certs} certificación(es)` : ''}`,
    },
    {
      icon: <Wrench size={18} />,
      label: 'Especialidad',
      value: data.main_specialty === 'otro' ? data.other_specialty_name : SPECIALTY[data.main_specialty || ''] || 'Sin especialidad',
      hint: data.main_specialty === 'otro'
        ? 'Especialidad propia'
        : `${data.sub_services?.length || 0} servicio(s) · ${data.availability?.useGeofence ? 'radio libre de 10 km' : `${data.zones?.length || 0} zona(s)`}`,
    },
    {
      icon: <CalendarCheck size={18} />,
      label: 'Entrevista',
      value: data.interview?.label || 'Sin agendar',
      hint: 'Videollamada de 15 min con el equipo de I mendly',
    },
    {
      icon: <GraduationCap size={18} />,
      label: 'Examen',
      value: data.exam?.passed ? 'Aprobado' : 'Pendiente',
      hint: data.exam?.score != null ? `Calificación: ${data.exam.score}%` : undefined,
    },
    {
      icon: <MessageSquareQuote size={18} />,
      label: 'Referencias',
      value: docs.testimonial1_name && docs.testimonial2_name ? `${docs.testimonial1_name} y ${docs.testimonial2_name}` : 'Incompletas',
      hint: docs.references_consent ? 'Aceptaron ser contactadas' : undefined,
    },
  ];

  return (
    <div className="flex-1 flex flex-col space-y-5">
      <section className="v2-scale bg-cream rounded-[2.25rem] v2-shadow-soft p-6">
        <p className="text-[14px] font-medium text-muted mb-4">Revisa que toda tu información sea correcta antes de enviar.</p>
        <div className="-mx-2">
          {rows.map((row, i) => (
            <div key={row.label} className={`v2-rise v2-d${Math.min(i + 1, 5)} flex items-start gap-4 px-2 py-4 border-b border-line last:border-b-0`}>
              <span className="w-11 h-11 shrink-0 rounded-[1rem] bg-primary-light text-primary-deep flex items-center justify-center">
                {row.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className={`${EYEBROW} text-muted`}>{row.label}</p>
                <p className="mt-1 text-[15px] font-semibold text-ink leading-tight">{row.value}</p>
                {row.hint && <p className="mt-0.5 text-[12.5px] font-medium text-muted truncate">{row.hint}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="v2-scale bg-cream rounded-[2.25rem] v2-shadow-soft p-6 space-y-3" style={{ animationDelay: '80ms' }}>
        <p className={`${EYEBROW} text-primary-deep`}>Declaración</p>
        <LegalConsent id="ob-veracity" tone="sensitive" checked={veracity} onChange={setVeracity}>
          <strong className="text-ink font-semibold">Declaro bajo protesta de decir verdad</strong> que la información y los
          documentos que entrego son auténticos y me pertenecen. Entiendo que I mendly puede verificarlos con las fuentes
          correspondientes y que cualquier dato falso es motivo para rechazar mi solicitud o dar de baja mi cuenta, conforme a los{' '}
          <Link href={LEGAL_LINKS.profesionales} target="_blank">Términos para profesionales</Link>.
        </LegalConsent>
        {error && <p className="p-4 rounded-[1.25rem] bg-rose/15 text-error text-[13px] font-semibold text-center">{error}</p>}
      </section>

      <WizardFooter onBack={onBack} onNext={handleSubmit} canNext={!missing} missing={missing} label="Confirmar y enviar" loading={submitting} />
    </div>
  );
};
