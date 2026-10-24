"use client";

import { ArrowLeft, ArrowUpRight, Zap, Droplets, Sparkles, Wind, Paintbrush, Hammer, Flower2, Lock, Bug, Ruler, Scissors, Car, Layers, Flame } from 'lucide-react';
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

// Alturas alternas del mosaico (mismo ritmo que el home)
const TILE_HEIGHT = ['h-64', 'h-44', 'h-52'];

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-linen pb-36 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* ── Cabecera editorial ── */}
        <header className="pt-7">
          <div className="v3-blur-in flex items-center justify-between">
            <Link
              href="/cliente"
              aria-label="Regresar al inicio"
              className="w-11 h-11 rounded-full bg-cream v2-shadow-soft flex items-center justify-center text-ink v2-press"
            >
              <ArrowLeft size={19} />
            </Link>
            <span className="inline-flex items-center h-10 px-4 rounded-full bg-cream v2-shadow-soft text-[12px] font-semibold text-ink tabular-nums">
              {ALL_CATEGORIES.length} oficios
            </span>
          </div>

          <p className="v3-blur-in mt-9 text-[10px] font-bold uppercase tracking-[0.18em] text-primary-deep" style={{ animationDelay: '120ms' }}>
            Explora
          </p>
          <h1 className="v3-blur-in mt-2 text-[36px] md:text-[56px] font-semibold tracking-tight leading-[1.02] text-ink max-w-2xl" style={{ animationDelay: '220ms' }}>
            Un certificado para cada rincón de tu casa.
          </h1>
          <p className="v3-blur-in mt-4 text-[15px] font-medium text-muted max-w-md" style={{ animationDelay: '320ms' }}>
            Elige el oficio y te mostramos a los profesionales verificados de tu zona.
          </p>
        </header>

        {/* ── Mosaico fotográfico ── */}
        <div className="mt-9 columns-2 md:columns-4 gap-3.5">
          {ALL_CATEGORIES.map((cat, i) => (
            <Link
              key={cat.name}
              href={`/cliente/search?q=${encodeURIComponent(cat.name)}`}
              className={`group relative block w-full mb-3.5 break-inside-avoid rounded-[1.9rem] overflow-hidden text-left v2-press v2-rise ${TILE_HEIGHT[i % 3]} ${i < 8 ? `v2-d${i + 1}` : 'v2-d8'}`}
            >
              {cat.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover v3-photo" />
              ) : (
                <div className="absolute inset-0 bg-primary-light text-primary-deep flex items-center justify-center">
                  {cat.icon}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/5 to-transparent" />

              {cat.comingSoon && (
                <span className="absolute top-3.5 left-3.5 glass rounded-full px-3 h-8 inline-flex items-center text-[11px] font-semibold text-ink">
                  Pronto
                </span>
              )}

              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-on-dark text-[16px] font-semibold tracking-tight leading-tight">{cat.name}</p>
                  <p className="text-on-dark/65 text-[12px] font-medium mt-0.5 line-clamp-2">{cat.description}</p>
                </div>
                <span className="shrink-0 w-9 h-9 rounded-full glass flex items-center justify-center text-ink transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight size={15} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <ClientNav />
    </main>
  );
}
