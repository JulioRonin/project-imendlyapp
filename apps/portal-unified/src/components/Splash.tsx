"use client";

import { useEffect, useState } from "react";
import { Logo } from "@i-mendly/shared/Logo";

const IMAGES = [
  "/assets/electrician.png",
  "/assets/plumbing.png",
  "/assets/ac_work.png",
  "/assets/painting_work.png"
];

export function Splash() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 4000);

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="relative w-full h-[60vh] overflow-hidden">
        {IMAGES.map((img, i) => (
          <img
            key={img}
            src={img}
            alt="service"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === currentIndex ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
      </div>

      <div className="flex flex-col items-center text-center mt-[-80px] z-10 px-8">
        <div className="w-24 h-24 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center mb-10 border border-slate-50">
          <Logo className="w-12 h-12 text-brand-night" />
        </div>
        <h1 className="text-4xl font-black text-brand-night tracking-[0.2em] mb-4 uppercase">I mendly</h1>
        <p className="text-brand-night/40 text-[10px] font-black tracking-[0.5em] uppercase">Servicios Boutique para el Hogar</p>
        
        <div className="mt-16 flex gap-2">
          {IMAGES.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-500 ${i === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-slate-100'}`} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
