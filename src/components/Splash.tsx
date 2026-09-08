"use client";

import { useEffect, useState } from "react";

const IMAGES = [
  "/assets/electrician.png",
  "/assets/plumbing.png",
  "/assets/ac_work.png",
  "/assets/painting_work.png",
];

export function Splash() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 1200);
    const interval = setInterval(() => setCurrentIndex((prev) => (prev + 1) % IMAGES.length), 450);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={`pointer-events-none fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#111111] transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`} aria-hidden={!isVisible}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(187,167,246,.18),transparent_38%),radial-gradient(circle_at_25%_75%,rgba(255,170,120,.14),transparent_34%)]" />
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-[26px] bg-[#F8F5F0] text-[#111111] shadow-[0_0_70px_rgba(255,170,120,.2)]">
          <span className="text-4xl font-black tracking-[-0.15em]">M</span>
        </div>
        <p className="text-sm font-semibold tracking-[0.3em] text-[#F8F5F0]">i mendly</p>
        <p className="mt-3 text-[9px] font-bold uppercase tracking-[0.35em] text-white/35">Tu hogar, en buenas manos</p>
        <div className="mt-8 flex gap-1.5" aria-label="Cargando i mendly">
          {IMAGES.map((_, i) => <span key={i} className={`h-1 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-7 bg-[#FFAA78]' : 'w-1.5 bg-white/20'}`} />)}
        </div>
      </div>
    </div>
  );
}
