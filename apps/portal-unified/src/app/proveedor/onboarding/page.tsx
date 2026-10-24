"use client";

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { SegmentBar } from '@/components/client/ui';
import { OnboardingProvider } from './components/OnboardingContext';
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
  'Datos personales',
  'Verificación de identidad',
  'Documentos y antecedentes',
  'Servicios y especialidad',
  'Entrevista de calidad',
  'Examen de certificación',
  'Resumen y envío',
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const steps = [
    <Step0Welcome onNext={nextStep} onBack={() => {}} />,
    <Step1Personal onNext={nextStep} onBack={prevStep} />,
    <Step2Identity onNext={nextStep} onBack={prevStep} />,
    <Step3Docs onNext={nextStep} onBack={prevStep} />,
    <Step4Services onNext={nextStep} onBack={prevStep} />,
    <Step5Interview onNext={nextStep} onBack={prevStep} />,
    <Step6Exam onNext={nextStep} onBack={prevStep} />,
    <Step7Review onNext={nextStep} onBack={prevStep} />
  ];

  return (
    <OnboardingProvider>
      <main className="min-h-screen bg-linen overflow-x-hidden">
        {step === 0 ? (
          steps[0]
        ) : (
          <div className="max-w-md mx-auto px-6 flex flex-col min-h-screen">
            {/* Cabecera del wizard */}
            <header className="v3-blur-in sticky top-0 z-50 bg-linen/85 backdrop-blur-xl -mx-6 px-6 py-5">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={prevStep}
                  aria-label="Volver"
                  className="w-12 h-12 shrink-0 rounded-full bg-cream v2-shadow-soft flex items-center justify-center text-ink v2-press"
                >
                  <ArrowLeft size={19} />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-deep">
                    Paso {step} de 7
                  </p>
                  <h1 className="text-[22px] font-semibold tracking-tight text-ink leading-tight truncate">
                    {STEP_TITLES[step]}
                  </h1>
                </div>
              </div>
              <SegmentBar total={7} done={step} className="mt-4" />
            </header>

            <div key={step} className="flex-1 flex flex-col mt-2">
              {steps[step]}
            </div>
          </div>
        )}
      </main>
    </OnboardingProvider>
  );
}
