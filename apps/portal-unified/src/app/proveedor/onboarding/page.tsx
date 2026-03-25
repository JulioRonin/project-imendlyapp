"use client";

import { useState } from 'react';
import { Logo } from '@i-mendly/shared/Logo';
import { Button } from '@i-mendly/shared/components/Button';
import { Card } from '@i-mendly/shared/components/Card';
import { ProgressProvider } from './components/ProgressProvider';
import { Step0Welcome } from './components/Step0Welcome';
import { Step1Personal } from './components/Step1Personal';
import { Step2Identity } from './components/Step2Identity';
import { Step3Docs } from './components/Step3Docs';
import { Step4Services } from './components/Step4Services';
import { Step5Interview } from './components/Step5Interview';
import { Step6Review } from './components/Step6Review';

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const steps = [
    <Step0Welcome onNext={nextStep} />,
    <Step1Personal onNext={nextStep} onBack={prevStep} />,
    <Step2Identity onNext={nextStep} onBack={prevStep} />,
    <Step3Docs onNext={nextStep} onBack={prevStep} />,
    <Step4Services onNext={nextStep} onBack={prevStep} />,
    <Step5Interview onNext={nextStep} onBack={prevStep} />,
    <Step6Review />
  ];

  return (
    <main className="min-h-screen bg-brand-night text-white overflow-x-hidden relative">
      {/* Decorative Blob */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-coral opacity-[0.07] blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-xl mx-auto px-6 py-12 relative z-10">
        <div className="flex justify-center mb-12">
          <Logo size={60} />
        </div>
        
        {step > 0 && step < 6 && (
          <div className="mb-10">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-white/40">Paso {step} de 6</span>
              <span className="text-2xl font-black text-secondary-light">{Math.round((step / 6) * 100)}%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500 ease-out" 
                style={{ width: `${(step / 6) * 100}%` }}
              />
            </div>
          </div>
        )}

        {steps[step]}
      </div>
    </main>
  );
}
