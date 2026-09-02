"use client";

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';

/** Chip de filtro — activa: pill ink con texto blanco (patrón de referencia). */
export function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 snap-start px-5 h-11 rounded-full text-[13px] font-semibold v2-press transition-colors duration-300 ${
        active
          ? 'bg-[#1B1A17] text-white v2-shadow-lift'
          : 'bg-white text-[#7A7468] border border-black/[0.05] hover:text-[#1B1A17]'
      }`}
    >
      {label}
    </button>
  );
}

/** Encabezado de sección: título + acción a la derecha. */
export function SectionHead({
  title,
  action,
  href,
}: {
  title: string;
  action?: string;
  href?: string;
}) {
  return (
    <div className="flex items-end justify-between mb-5">
      <h2 className="text-xl font-semibold tracking-tight text-[#1B1A17]">{title}</h2>
      {action && href && (
        <Link
          href={href}
          className="group flex items-center gap-1.5 text-[13px] font-semibold text-primary"
        >
          {action}
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

/** Tile de categoría: squircle de tinte verde con ícono + label. */
export function IconTile({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-3 p-5 bg-white rounded-[1.75rem] v2-shadow-soft v2-press v2-float"
    >
      <span className="w-14 h-14 rounded-[1.15rem] bg-[#E7F2E9] text-primary flex items-center justify-center">
        {icon}
      </span>
      <span className="text-[12.5px] font-semibold text-[#1B1A17]">{label}</span>
    </button>
  );
}

/** Pill de calificación compacta. */
export function RatingPill({ value, className = '' }: { value: number; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 bg-white rounded-full px-3 h-9 v2-shadow-lift ${className}`}
    >
      <Star size={13} className="text-amber-400 fill-amber-400" />
      <span className="text-[13px] font-bold text-[#1B1A17] tabular-nums">
        {value.toFixed(1)}
      </span>
    </span>
  );
}

/** Barra de progreso segmentada (patrón fintech de referencia). */
export function SegmentBar({
  total,
  done,
  className = '',
}: {
  total: number;
  done: number;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
            i < done ? 'bg-primary' : 'bg-black/[0.07]'
          }`}
        />
      ))}
    </div>
  );
}

/** Revela el contenido con .v2-rise cuando entra al viewport. */
export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${shown ? 'v2-rise' : 'opacity-0'} ${className}`}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
