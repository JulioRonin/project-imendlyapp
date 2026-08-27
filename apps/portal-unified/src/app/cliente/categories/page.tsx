"use client";

import { ArrowLeft, ArrowRight, Zap, Droplets, Sparkles, Wind, Paintbrush, Hammer, Flower2, Lock, Bug, Ruler, Scissors, Car, Layers, Flame } from 'lucide-react';
import { ClientNav } from '@/components/client/ClientNav';
import Link from 'next/link';

const ALL_CATEGORIES = [
  { name: 'Electricidad', icon: <Zap size={32} strokeWidth={1.5} />, image: '/assets/electrician.png', description: 'Instalaciones, reparaciones y cortocircuitos.' },
  { name: 'Plomería', icon: <Droplets size={32} strokeWidth={1.5} />, image: '/assets/plumbing.png', description: 'Tuberías, fugas y mantenimiento hidráulico.' },
  { name: 'Limpieza', icon: <Sparkles size={32} strokeWidth={1.5} />, image: '/assets/cleaning_professional.png', description: 'Limpieza profunda y mantenimiento de espacios con personal calificado.' },
  { name: 'Climas/AC', icon: <Wind size={32} strokeWidth={1.5} />, image: '/assets/ac_work.png', description: 'Mantenimiento preventivo y correctivo de AC.' },
  { name: 'Pintura', icon: <Paintbrush size={32} strokeWidth={1.5} />, image: '/assets/painting_work.png', description: 'Interiores, exteriores y acabados de lujo.' },
  { name: 'Carpintería', icon: <Hammer size={32} strokeWidth={1.5} />, image: '/assets/carpentry.png', description: 'Muebles a medida y reparaciones de madera.', comingSoon: true },
  { name: 'Jardinería', icon: <Flower2 size={32} strokeWidth={1.5} />, image: '/assets/gardening.png', description: 'Diseño de paisajes y cuidado de áreas verdes.' },
  { name: 'Cerrajería', icon: <Lock size={32} strokeWidth={1.5} />, image: '/assets/locksmith.png', description: 'Aperturas de emergencia y chapas de seguridad.' },
  { name: 'Fumigación', icon: <Bug size={32} strokeWidth={1.5} />, image: '/assets/fumigation_professional.png', description: 'Control de plagas especializado con equipo profesional.' },
  { name: 'Carwash', icon: <Car size={32} strokeWidth={1.5} />, image: '/assets/carwash_boutique.png', description: 'Estética automotriz, detallado y limpieza premium a domicilio.' },
  { name: 'Remodelación', icon: <Ruler size={32} strokeWidth={1.5} />, image: '/assets/electrician_work.png', description: 'Renovación total de espacios y albañilería.', comingSoon: true },
  { name: 'Moda y costura', icon: <Scissors size={32} strokeWidth={1.5} />, image: '/assets/fashion_sewing.png', description: 'Vestidos a medida, ajustes y diseño personalizado.' },
  { name: 'Pisos', icon: <Layers size={32} strokeWidth={1.5} />, image: '/images/pisos.png', description: 'Instalación profesional de pisos de madera, laminados, cerámicos y pulido.' },
  { name: 'Herrería', icon: <Flame size={32} strokeWidth={1.5} />, image: '/images/herreria.png', description: 'Trabajos de herrería estructural, forja, portones, protectores y soldadura especializada.' },
];

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-[#F3F4F1] pb-36">
      <div className="max-w-7xl mx-auto">
        {/* ── Hero verde compacto ── */}
        <header className="v2-rise relative v2-hero-grad text-white rounded-b-[2.75rem] md:rounded-[2.75rem] md:mt-5 md:mx-6 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-28 -left-16 w-64 h-64 rounded-full bg-black/10 blur-3xl pointer-events-none" />

          <div className="relative px-6 md:px-12 pt-6 pb-16">
            <Link
              href="/cliente"
              aria-label="Regresar al inicio"
              className="inline-flex w-11 h-11 rounded-full bg-white/15 backdrop-blur items-center justify-center v2-press mb-7"
            >
              <ArrowLeft size={19} />
            </Link>

            <p className="v2-rise v2-d1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/70 mb-2">
              Explora
            </p>
            <h1 className="v2-rise v2-d2 text-[32px] md:text-4xl font-bold tracking-tight leading-[1.1] mb-2">
              Categorías
            </h1>
            <p className="v2-rise v2-d3 text-[14.5px] font-medium text-white/75 max-w-md">
              Encuentra al certificado ideal para cada rincón de tu casa.
            </p>
          </div>
        </header>

        {/* ── Grid empalmado sobre el hero ── */}
        <div className="relative z-10 -mt-8 px-6 md:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ALL_CATEGORIES.map((cat, i) => (
              <Link
                key={cat.name}
                href={`/cliente/search?q=${encodeURIComponent(cat.name)}`}
                className={i < 8 ? `v2-rise v2-d${Math.min(i + 1, 8)}` : ''}
              >
                <article className="group h-full flex items-center gap-5 bg-white rounded-[1.75rem] p-5 v2-shadow-soft v2-press v2-float">
                  {/* Imagen / ícono en squircle de tinte verde */}
                  <div className="relative w-[4.5rem] h-[4.5rem] shrink-0 rounded-[1.25rem] bg-[#E9F7EF] overflow-hidden flex items-center justify-center text-primary">
                    {cat.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                      />
                    ) : (
                      cat.icon
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-[16px] font-semibold tracking-tight text-[#151714] truncate">
                        {cat.name}
                      </h2>
                      {cat.comingSoon && (
                        <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.18em] text-[#A8ADA6] bg-[#F3F4F1] rounded-full px-2.5 py-1">
                          Pronto
                        </span>
                      )}
                    </div>
                    <p className="text-[12.5px] font-medium text-[#70756E] leading-snug mt-0.5 line-clamp-2">
                      {cat.description}
                    </p>
                  </div>

                  <span className="shrink-0 w-9 h-9 rounded-full bg-[#F3F4F1] text-[#151714] flex items-center justify-center transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <ClientNav />
    </main>
  );
}
