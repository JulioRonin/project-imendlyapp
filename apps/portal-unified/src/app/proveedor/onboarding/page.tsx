"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, BadgeCheck, Clock, Loader2, UserX } from 'lucide-react';
import { SegmentBar } from '@/components/client/ui';
import { OnboardingProvider, useOnboarding } from './components/OnboardingContext';
import { Step0Welcome } from './components/Step0Welcome';
import { Step1Personal } from './components/Step1Personal';
import { Step2Identity } from './components/Step2Identity';
import { Step3Docs } from './components/Step3Docs';
import { Step4Services } from './components/Step4Services';
import { Step5Interview } from './components/Step5Interview';
import { Step6Exam } from './components/Step6Exam';
import { Step7Review } from './components/Step7Review';

const STEP_TITLES = [
  '',
  'Crea tu cuenta',
  'Verificación de identidad',
  'Documentos y antecedentes',
  'Servicios y especialidad',
  'Entrevista de calidad',
  'Examen de certificación',
  'Resumen y envío',
];

function StatusCard({ icon, eyebrow, title, text, children }: {
  icon: React.ReactNode; eyebrow: string; title: string; text: string; children: React.ReactNode;
}) {
  return (
    <div className="max-w-md mx-auto px-6 min-h-[100dvh] flex flex-col justify-center py-10">
      <section className="v2-scale bg-cream rounded-[2.25rem] v2-shadow-soft p-8 flex flex-col items-center text-center">
        <span className="w-20 h-20 rounded-[1.75rem] bg-mint-light text-mint-deep flex items-center justify-center mb-6">{icon}</span>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-deep">{eyebrow}</p>
        <h1 className="mt-2 text-[28px] font-semibold tracking-tight leading-tight text-ink">{title}</h1>
        <p className="mt-3 text-[14px] font-medium text-muted">{text}</p>
        <div className="mt-7 w-full space-y-3">{children}</div>
      </section>
    </div>
  );
}

function OnboardingFlow() {
  const { phase, signOutAndRestart } = useOnboarding();
  const [step, setStep] = useState(0);

  // Con la cuenta ya creada no se regresa a la bienvenida ni al registro
  const minStep = phase === 'in-progress' ? 2 : 0;
  useEffect(() => {
    if (step < minStep) setStep(minStep);
  }, [minStep, step]);

  if (phase === 'loading') {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center text-muted">
        <Loader2 size={26} className="animate-spin" />
      </div>
    );
  }

  if (phase === 'submitted') {
    return (
      <StatusCard
        icon={<BadgeCheck size={34} />}
        eyebrow="Estado: en revisión"
        title="Solicitud enviada"
        text="Nuestro equipo revisará tus documentos y te confirmará la entrevista por correo y WhatsApp. Puedes ver el avance en tu portal."
      >
        <div className="w-full bg-lavender-light rounded-[1.5rem] p-5 text-left flex items-start gap-4">
          <span className="w-11 h-11 shrink-0 rounded-[1rem] bg-cream text-ink flex items-center justify-center"><Clock size={18} /></span>
          <p className="text-[13px] font-medium text-ink/80">
            Tu portal de profesional se activa en cuanto aprobemos tu certificación.
          </p>
        </div>
        <Link href="/proveedor" className="w-full h-14 rounded-full bg-ink text-white text-[13px] font-bold flex items-center justify-center gap-2 v2-press">
          Ver el estado de mi solicitud <ArrowRight size={16} />
        </Link>
      </StatusCard>
    );
  }

  if (phase === 'not-provider') {
    return (
      <StatusCard
        icon={<UserX size={32} />}
        eyebrow="Cuenta de cliente"
        title="Esta sesión es de cliente"
        text="Para trabajar como profesional necesitas una cuenta aparte, con su propio correo. Cierra esta sesión para crear tu cuenta de profesional."
      >
        <button
          type="button"
          onClick={() => { setStep(1); signOutAndRestart(); }}
          className="w-full h-14 rounded-full bg-primary text-ink text-[13px] font-bold flex items-center justify-center gap-2 v2-press"
        >
          Cerrar sesión y registrarme <ArrowRight size={16} />
        </button>
        <Link href="/cliente" className="w-full h-12 rounded-full text-[13px] font-semibold text-muted hover:text-ink flex items-center justify-center">
          Volver a I mendly
        </Link>
      </StatusCard>
    );
  }

  const next = () => setStep(s => Math.min(s + 1, 7));
  const back = () => setStep(s => Math.max(s - 1, minStep));

  const steps = [
    <Step0Welcome key={0} onNext={next} onBack={() => {}} />,
    <Step1Personal key={1} onNext={next} onBack={back} />,
    <Step2Identity key={2} onNext={next} onBack={minStep === 2 ? undefined : back} />,
    <Step3Docs key={3} onNext={next} onBack={back} />,
    <Step4Services key={4} onNext={next} onBack={back} />,
    <Step5Interview key={5} onNext={next} onBack={back} />,
    <Step6Exam key={6} onNext={next} onBack={back} />,
    <Step7Review key={7} onNext={next} onBack={back} />,
  ];

  if (step === 0) return steps[0];

  return (
    <div className="max-w-md mx-auto px-6 flex flex-col min-h-screen">
      <header className="v3-blur-in sticky top-0 z-50 bg-linen/85 backdrop-blur-xl -mx-6 px-6 py-5">
        <div className="flex items-center gap-4">
          {step > minStep ? (
            <button
              type="button"
              onClick={back}
              aria-label="Volver"
              className="w-12 h-12 shrink-0 rounded-full bg-cream v2-shadow-soft flex items-center justify-center text-ink v2-press"
            >
              <ArrowLeft size={19} />
            </button>
          ) : (
            <Link
              href="/proveedor/login"
              aria-label="Salir"
              className="w-12 h-12 shrink-0 rounded-full bg-cream v2-shadow-soft flex items-center justify-center text-ink v2-press"
            >
              <ArrowLeft size={19} />
            </Link>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-deep">Paso {step} de 7</p>
            <h1 className="text-[22px] font-semibold tracking-tight text-ink leading-tight truncate">{STEP_TITLES[step]}</h1>
          </div>
        </div>
        <SegmentBar total={7} done={step} className="mt-4" />
      </header>

      <div key={step} className="flex-1 flex flex-col mt-2">
        {steps[step]}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <OnboardingProvider>
      <main className="min-h-screen bg-linen overflow-x-hidden">
        <OnboardingFlow />
      </main>
    </OnboardingProvider>
  );
}
