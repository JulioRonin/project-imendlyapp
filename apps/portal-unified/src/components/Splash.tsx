"use client";

import { useEffect, useState } from "react";

const SEEN_KEY = "im-splash-seen";
const HOLD_MS = 1900;   // tiempo en pantalla antes de salir
const EXIT_MS = 850;    // duración de la salida (debe coincidir con .v3-exit-up)

/**
 * Splash cinemático: foto con Ken Burns, isotipo que entra con rebote,
 * wordmark que abre su tracking, y salida deslizando hacia arriba.
 * Se muestra una sola vez por sesión del navegador.
 */
export function Splash() {
  const [phase, setPhase] = useState<"hidden" | "in" | "out">("hidden");

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
    } catch {
      /* sin sessionStorage: mostrar igual */
    }
    setPhase("in");
    const exit = setTimeout(() => setPhase("out"), HOLD_MS);
    const done = setTimeout(() => {
      setPhase("hidden");
      try { sessionStorage.setItem(SEEN_KEY, "1"); } catch { /* noop */ }
    }, HOLD_MS + EXIT_MS);
    return () => { clearTimeout(exit); clearTimeout(done); };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[100] overflow-hidden bg-[#1F1C18] ${phase === "out" ? "v3-exit-up" : ""}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/provider_dashboard_hero.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover v3-kenburns"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1F1C18]/90 via-[#1F1C18]/30 to-[#1F1C18]/10" />

      <div className="relative h-full flex flex-col items-center justify-end pb-[16vh] px-8 text-white text-center">
        <svg
          width="76"
          height="68"
          viewBox="0 0 100 90"
          className="v3-mark-in mb-6"
          style={{ animationDelay: "120ms" }}
        >
          <path
            d="M 10,82 L 10,38 L 36,8 L 50,22 L 64,8 L 90,38 L 90,82 L 70,82 L 70,48 L 58,48 L 50,56 L 42,48 L 30,48 L 30,82 Z"
            fill="#FFFFFF"
          />
        </svg>
        <p
          className="v3-track-in text-[26px] font-light lowercase"
          style={{ animationDelay: "420ms" }}
        >
          i mendly
        </p>
        <p
          className="v3-blur-in mt-5 text-[15px] font-medium text-white/70"
          style={{ animationDelay: "900ms" }}
        >
          Tu hogar, en buenas manos.
        </p>
      </div>
    </div>
  );
}
