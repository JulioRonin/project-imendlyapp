"use client";

import React from 'react';
import { ArrowUpRight, Wallet, Clock, ShieldCheck } from 'lucide-react';
import { Logo } from '@i-mendly/shared/Logo';

export const Step0Welcome: React.FC<{ onNext: () => void; onBack: () => void }> = ({ onNext }) => {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden flex flex-col">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/carpentry.png" alt="Taller de carpintería" className="absolute inset-0 w-full h-full object-cover v3-kenburns" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-ink/10" />

      <div className="v3-blur-in relative z-10 px-6 pt-8 md:px-10 md:pt-10">
        <Logo size={30} variant="dark" />
      </div>

      <div className="relative z-10 mt-auto px-5 pb-6 md:px-10 md:pb-10 w-full max-w-md md:max-w-lg mx-auto">
        <div className="v3-blur-in glass rounded-[2.25rem] p-6 md:p-8" style={{ animationDelay: '200ms' }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-deep mb-2">Para profesionales</p>
          <h1 className="text-[30px] md:text-[36px] font-semibold tracking-tight leading-[1.04] text-ink">
            Únete a la red de profesionales certificados
          </h1>
          <p className="mt-3 text-[14px] font-medium text-muted">
            I mendly conecta a los mejores profesionales con clientes que valoran el trabajo bien hecho.
          </p>

          <div className="mt-6 space-y-2.5">
            <div className="v2-rise v2-d2 flex items-center gap-4 bg-cream/80 rounded-[1.5rem] p-4">
              <span className="w-11 h-11 shrink-0 rounded-[1rem] bg-primary-light text-primary-deep flex items-center justify-center">
                <Wallet size={18} />
              </span>
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-ink">Gana más</p>
                <p className="text-[12.5px] font-medium text-muted">Tarifas competitivas y pagos puntuales.</p>
              </div>
            </div>
            <div className="v2-rise v2-d3 flex items-center gap-4 bg-cream/80 rounded-[1.5rem] p-4">
              <span className="w-11 h-11 shrink-0 rounded-[1rem] bg-primary-light text-primary-deep flex items-center justify-center">
                <Clock size={18} />
              </span>
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-ink">Tú decides cuándo</p>
                <p className="text-[12.5px] font-medium text-muted">Gestiona tu propia agenda y disponibilidad.</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onNext}
            className="v2-rise v2-d4 mt-6 w-full h-14 rounded-full bg-primary hover:bg-primary-dark text-ink text-[13px] font-bold flex items-center justify-center gap-2 v2-press transition-colors shadow-lg shadow-primary/25"
          >
            Comenzar mi aplicación <ArrowUpRight size={17} />
          </button>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-[12px] font-semibold text-mint-deep">
            <ShieldCheck size={14} /> El proceso toma menos de 5 minutos
          </p>
        </div>
      </div>
    </section>
  );
};
