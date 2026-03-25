"use client";

import { Logo } from '@i-mendly/shared/Logo';
import { Button } from '@i-mendly/shared/components/Button';
import { Card } from '@i-mendly/shared/components/Card';
import { ArrowLeft, Zap, Droplets, Sparkles, Wind, Paintbrush, Hammer, Flower2, Lock, Bug, Ruler } from 'lucide-react';
import Link from 'next/link';

const ALL_CATEGORIES = [
  { name: 'Electricista', icon: <Zap size={32} strokeWidth={1.5} />, image: '/assets/electrician.png', description: 'Instalaciones, reparaciones y cortocircuitos.' },
  { name: 'Plomería', icon: <Droplets size={32} strokeWidth={1.5} />, image: '/assets/plumbing.png', description: 'Tuberías, fugas y mantenimiento hidráulico.' },
  { name: 'Limpieza', icon: <Sparkles size={32} strokeWidth={1.5} />, image: '/assets/plumbing.png', description: 'Limpieza profunda y mantenimiento de espacios.' },
  { name: 'Climas/AC', icon: <Wind size={32} strokeWidth={1.5} />, image: '/assets/ac_work.png', description: 'Mantenimiento preventivo y correctivo de AC.' },
  { name: 'Pintura', icon: <Paintbrush size={32} strokeWidth={1.5} />, image: '/assets/painting_work.png', description: 'Interiores, exteriores y acabados de lujo.' },
  { name: 'Carpintería', icon: <Hammer size={32} strokeWidth={1.5} />, image: '/assets/carpentry.png', description: 'Muebles a medida y reparaciones de madera.' },
  { name: 'Jardinería', icon: <Flower2 size={32} strokeWidth={1.5} />, image: '/assets/gardening.png', description: 'Diseño de paisajes y cuidado de áreas verdes.' },
  { name: 'Cerrajería', icon: <Lock size={32} strokeWidth={1.5} />, image: '/assets/locksmith.png', description: 'Aperturas de emergencia y chapas de seguridad.' },
  { name: 'Fumigación', icon: <Bug size={32} strokeWidth={1.5} />, image: '/assets/plumbing.png', description: 'Control de plagas residencial y comercial.' },
  { name: 'Remodelación', icon: <Ruler size={32} strokeWidth={1.5} />, image: '/assets/electrician_work.png', description: 'Renovación total de espacios y albañilería.' },
];

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Dynamic Header */}
      <header className="px-8 py-10 flex items-center justify-between sticky top-0 bg-slate-50/90 backdrop-blur-xl z-50">
        <Link href="/cliente/home">
          <button className="w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center text-brand-night hover:text-primary hover:scale-110 transition-all border border-slate-100">
            <ArrowLeft size={20} strokeWidth={3} />
          </button>
        </Link>
        <div className="text-center">
            <p className="text-[10px] font-black tracking-[0.5em] text-brand-night/20 uppercase mb-1">I Mendly</p>
            <h1 className="text-xl font-black text-brand-night uppercase tracking-tighter">Explorar Categorías</h1>
        </div>
        <div className="w-12" /> {/* Spacer */}
      </header>

      <div className="px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ALL_CATEGORIES.map((cat, i) => (
            <Link key={i} href={`/cliente/search?q=${cat.name}`}>
              <Card className="group relative h-96 rounded-[3.5rem] border-none overflow-hidden shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)] hover:shadow-[0_48px_128px_-12px_rgba(124,58,237,0.2)] transition-all duration-700 cursor-pointer p-0 bg-white">
                {/* Image Background */}
                <div 
                  className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                  style={{ backgroundImage: `url('${cat.image}')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-night/95 via-brand-night/20 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 p-10 flex flex-col justify-end z-10">
                  <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                     <div className="text-white">{cat.icon}</div>
                  </div>
                  
                  <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter leading-none">{cat.name}</h2>
                  <p className="text-white/40 text-xs font-medium leading-relaxed max-w-[80%] opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    {cat.description}
                  </p>
                  
                  <div className="mt-8 flex items-center gap-4">
                     <div className="h-[2px] w-8 bg-primary rounded-full" />
                     <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Explorar</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
