"use client";

import React from 'react';
import { Button } from '@i-mendly/shared/components/Button';

export const Step0Welcome: React.FC<{ onNext: () => void; onBack: () => void }> = ({ onNext }) => {
  return (
    <div className="flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-700">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-8 border border-primary/20">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.63 3.11a14.98 14.98 0 0 0-4.41 8.23c-.49 2.15-.45 4.41.13 6.53l-3.84 2.21a.75.75 0 0 0 .33 1.39h5.91a2.25 2.25 0 0 1 2.25 2.25v1.386c0 .99 1.077 1.58 1.905.99l2.714-2.141a2.25 2.25 0 0 0 .893-1.78V15.5y-1.13Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.63 3.11a14.98 14.98 0 0 0-4.41 8.23c-.49 2.15-.45 4.41.13 6.53l-3.84 2.21a.75.75 0 0 0 .33 1.39h5.91a2.25 2.25 0 0 1 2.25 2.25v1.386c0 .99 1.077 1.58 1.905.99l2.714-2.141a2.25 2.25 0 0 0 .893-1.78V15.5y-1.13Z" />
        </svg>
      </div>
      
      <h1 className="text-4xl font-black mb-4 tracking-tighter">Únete a la élite del servicio</h1>
      <p className="text-white/60 text-lg mb-10 max-w-sm font-medium">
        I mendly conecta a los mejores profesionales con clientes que valoran el trabajo bien hecho.
      </p>

      <div className="grid grid-cols-1 gap-4 w-full mb-12">
        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 text-left">
          <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.546 1.159 3.696 1.159 5.242 0l1.121-.841a1.5 1.5 0 0 1 0-2.4l-1.121-.84a1.5 1.5 0 0 0-1.875 0l-1.121.841a1.5 1.5 0 0 1-2.4 0l-1.121-.841a1.5 1.5 0 0 0-1.875 0L7.5 12" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold">Gana más</p>
            <p className="text-xs text-white/40">Tarifas competitivas y pagos puntuales.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 text-left">
          <div className="bg-primary/20 text-primary p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold">Tú decides cuándo</p>
            <p className="text-xs text-white/40">Gestiona tu propia agenda y disponibilidad.</p>
          </div>
        </div>
      </div>

      <Button variant="primary" className="w-full text-base font-black py-4" onClick={onNext}>
        Comenzar mi aplicación
      </Button>
      
      <p className="mt-6 text-[10px] font-black uppercase tracking-widest text-white/20">
        El proceso toma menos de 5 minutos
      </p>
    </div>
  );
};
