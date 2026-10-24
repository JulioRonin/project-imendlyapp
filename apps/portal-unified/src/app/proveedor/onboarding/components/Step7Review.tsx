"use client";

import React, { useState } from 'react';
import { ArrowRight, BadgeCheck, Loader2, User, Wrench, CalendarCheck, MessageSquareQuote, Clock } from 'lucide-react';
import { useOnboarding } from './OnboardingContext';

const EYEBROW = 'text-[10px] font-bold uppercase tracking-[0.18em]';

export const Step7Review: React.FC<{ onNext: () => void; onBack: () => void }> = ({ onBack }) => {
  const { data, submitApplication } = useOnboarding();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const result = await submitApplication();
    setIsSubmitting(false);
    if (result.success) {
      setIsSuccess(true);
    } else {
      alert("Hubo un error al enviar tu solicitud. Por favor intenta de nuevo.");
    }
  };

  if (isSuccess) {
    return (
      <div className="flex-1 flex flex-col">
        <section className="v2-scale bg-cream rounded-[2.25rem] v2-shadow-soft p-8 flex flex-col items-center text-center">
          <span className="w-20 h-20 rounded-[1.75rem] bg-mint-light text-mint-deep flex items-center justify-center mb-6">
            <BadgeCheck size={34} />
          </span>

          <span className="inline-flex items-center h-8 px-3.5 rounded-full bg-primary-light text-primary-deep text-[12px] font-semibold mb-4">
            Estado: en revisión
          </span>

          <h2 className="text-[30px] font-semibold tracking-tight leading-tight text-ink">Solicitud enviada</h2>
          <p className="mt-3 text-[14px] font-medium text-muted max-w-sm">
            Estamos revisando tus documentos. Recibirás una notificación en menos de 24 horas.
          </p>

          <div className="mt-7 w-full bg-lavender-light rounded-[1.5rem] p-5 text-left flex items-start gap-4">
            <span className="w-11 h-11 shrink-0 rounded-[1rem] bg-cream text-ink flex items-center justify-center">
              <Clock size={18} />
            </span>
            <div>
              <p className={`${EYEBROW} text-ink/60`}>Próximo paso</p>
              <p className="mt-1 text-[14px] font-semibold text-ink">Confirmación de entrevista</p>
              <p className="mt-0.5 text-[12.5px] font-medium text-ink/70">Te enviaremos el enlace de Zoom por correo y WhatsApp.</p>
            </div>
          </div>

          <button
            type="button"
            className="mt-7 w-full h-14 rounded-full bg-ink text-white text-[13px] font-bold flex items-center justify-center gap-2 v2-press"
            onClick={() => window.location.href = '/'}
          >
            Volver al inicio <ArrowRight size={16} />
          </button>
        </section>
      </div>
    );
  }

  const rows = [
    {
      icon: <User size={18} />,
      label: 'Datos personales',
      value: data.full_name || 'Sin nombre',
      hint: (data.email || data.phone) ? `${data.email || ''} · ${data.phone || ''}` : 'Sin datos de contacto',
    },
    {
      icon: <Wrench size={18} />,
      label: 'Especialidad',
      value: data.main_specialty === 'otro' ? data.other_specialty_name : data.main_specialty,
      hint: `${data.sub_services?.length} sub-servicios seleccionados`,
      capitalize: true,
    },
    {
      icon: <CalendarCheck size={18} />,
      label: 'Entrevista agendada',
      value: `${data.interview?.date === 'today' ? 'Hoy' : data.interview?.date} a las ${data.interview?.time}`,
      hint: 'Videollamada de 15 min con el equipo de CX',
    },
    {
      icon: <MessageSquareQuote size={18} />,
      label: 'Recomendaciones',
      value: data.documents?.testimonial1_name ? 'Incluidas' : 'No proporcionadas',
      hint: data.documents?.testimonial1_name
        ? `De ${data.documents.testimonial1_name}${data.documents.testimonial2_name ? ` y ${data.documents.testimonial2_name}` : ''}`
        : undefined,
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <section className="v2-scale bg-cream rounded-[2.25rem] v2-shadow-soft p-6">
        <p className="text-[14px] font-medium text-muted mb-4">Revisa que toda tu información sea correcta antes de enviar.</p>

        <div className="-mx-2">
          {rows.map((row, i) => (
            <div key={row.label} className={`v2-rise v2-d${i + 1} flex items-start gap-4 px-2 py-4 border-b border-line last:border-b-0`}>
              <span className="w-11 h-11 shrink-0 rounded-[1rem] bg-primary-light text-primary-deep flex items-center justify-center">
                {row.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className={`${EYEBROW} text-muted`}>{row.label}</p>
                <p className={`mt-1 text-[15px] font-semibold text-ink leading-tight ${row.capitalize ? 'capitalize' : ''}`}>{row.value}</p>
                {row.hint && <p className="mt-0.5 text-[12.5px] font-medium text-muted truncate">{row.hint}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Botonera sticky */}
      <div className="sticky bottom-0 mt-auto -mx-6 px-6 pt-4 pb-6 bg-gradient-to-t from-linen via-linen/95 to-transparent">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack} disabled={isSubmitting} className="h-14 px-6 rounded-full text-[13px] font-semibold text-muted hover:text-ink v2-press transition-colors disabled:opacity-50">Atrás</button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 h-14 rounded-full bg-primary text-ink hover:bg-primary-dark text-[13px] font-bold flex items-center justify-center gap-2 v2-press shadow-lg shadow-primary/25 transition-colors disabled:opacity-70"
          >
            {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Enviando…</> : <>Confirmar y enviar <ArrowRight size={16} /></>}
          </button>
        </div>
      </div>
    </div>
  );
};
