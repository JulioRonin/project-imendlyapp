"use client";

import React, { useState } from 'react';
import { Button } from '@i-mendly/shared/components/Button';
import { Badge } from '@i-mendly/shared/components/Badge';
import { useOnboarding } from './OnboardingContext';

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
      <div className="flex flex-col items-center text-center animate-in zoom-in-95 duration-700">
        <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-8 relative border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
          </svg>
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 p-2.5 rounded-full border-4 border-brand-night animate-pulse" />
        </div>

        <Badge variant="silver" className="mb-4 px-4 py-1.5 shadow-lg bg-brand-night text-white border-brand-night/50">ESTADO: EN REVISIÓN</Badge>
        
        <h2 className="text-4xl font-black mb-4 tracking-tighter">¡Solicitud Enviada!</h2>
        <p className="text-white/60 text-lg mb-10 max-w-sm font-medium">
          Estamos revisando tus documentos. Recibirás una notificación en menos de 24 horas.
        </p>

        <div className="w-full space-y-3 mb-12">
          <div className="bg-white/5 p-5 rounded-2xl border border-white/10 text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-2">Próximo paso</p>
            <p className="text-sm font-bold text-white/80">Confirmación de Entrevista</p>
            <p className="text-xs text-white/40 mt-1">Te enviaremos el enlace de Zoom por correo y WhatsApp.</p>
          </div>
        </div>

        <Button variant="secondary" className="w-full" onClick={() => window.location.href = '/'}>
          Volver al inicio
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-3xl font-black mb-2 tracking-tight">Resumen y Envío</h2>
      <p className="text-white/50 mb-8 font-medium">Revisa que toda tu información sea correcta antes de enviar.</p>

      <div className="space-y-4 mb-10">
        <div className="bg-white/5 p-5 rounded-[2rem] border border-white/5">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Datos Personales</p>
          <p className="text-white font-bold">{data.full_name || 'Sin nombre'}</p>
          <p className="text-white/50 text-xs">{(data.email || data.phone) ? `${data.email || ''} • ${data.phone || ''}` : 'Sin datos de contacto'}</p>
        </div>

        <div className="bg-white/5 p-5 rounded-[2rem] border border-white/5">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Especialidad</p>
          <p className="text-white font-bold capitalize">{data.main_specialty === 'otro' ? data.other_specialty_name : data.main_specialty}</p>
          <p className="text-white/50 text-xs">{data.sub_services?.length} sub-servicios seleccionados</p>
        </div>

        <div className="bg-white/5 p-5 rounded-[2rem] border border-white/5">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Entrevista Agendada</p>
          <p className="text-white font-bold">{data.interview?.date === 'today' ? 'Hoy' : data.interview?.date} a las {data.interview?.time}</p>
        </div>

        <div className="bg-white/5 p-5 rounded-[2rem] border border-white/5">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Recomendaciones</p>
          <p className="text-white font-bold">
            {data.documents?.testimonial1_name ? 'Incluidas' : 'No proporcionadas'}
          </p>
          {data.documents?.testimonial1_name && (
            <p className="text-white/50 text-xs">De {data.documents.testimonial1_name}{data.documents.testimonial2_name ? ` y ${data.documents.testimonial2_name}` : ''}</p>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="ghost" onClick={onBack} className="flex-1 text-white/40 hover:text-white border-white/10" disabled={isSubmitting}>Atrás</Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit} 
          className="flex-[2] bg-emerald-600 hover:bg-emerald-500 border-none shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Confirmar y Enviar'}
        </Button>
      </div>
    </div>
  );
};
