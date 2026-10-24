"use client";

import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  X,
  Camera,
  Tag
} from 'lucide-react';

interface Service {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
}

const INITIAL_SERVICES: Service[] = [
  { id: 1, name: 'Limpieza Profunda', category: 'Interiores', price: '$800 / hr', image: 'https://images.unsplash.com/photo-1581578731522-bc0cc1249767?auto=format&fit=crop&q=80&w=200' },
  { id: 2, name: 'Limpieza Express', category: 'Interiores', price: '$450 / hr', image: 'https://images.unsplash.com/photo-1527515545081-5db817172677?auto=format&fit=crop&q=80&w=200' },
];

const EYEBROW = 'text-[10px] font-bold uppercase tracking-[0.18em]';
const LABEL_CLS = `block ${EYEBROW} text-muted mb-2 ml-1`;
const INPUT_CLS = 'w-full h-14 px-5 bg-sand rounded-[1.25rem] border-0 text-[15px] font-semibold text-ink placeholder:text-faint placeholder:font-medium outline-none focus:ring-2 focus:ring-lavender/60 transition-shadow';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [isAdding, setIsAdding] = useState(false);

  // New service form state
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Interiores');
  const [newPrice, setNewPrice] = useState('');

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPrice) return;

    const newService: Service = {
      id: Date.now(),
      name: newName,
      category: newCategory,
      price: newPrice.includes('$') ? newPrice : `$${newPrice}`,
      image: 'https://images.unsplash.com/photo-1581578731522-bc0cc1249767?auto=format&fit=crop&q=80&w=200' // Placeholder image
    };

    setServices([...services, newService]);
    setIsAdding(false);
    setNewName('');
    setNewPrice('');
  };

  const handleDelete = (id: number) => {
    setServices(services.filter(s => s.id !== id));
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-linen">
      <main className="flex-1 overflow-y-auto px-6 md:px-12 pb-20 relative">
        <div className="max-w-6xl mx-auto">
          {/* ── Cabecera editorial ── */}
          <header className="pt-10 md:pt-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className={`v3-blur-in ${EYEBROW} text-primary-deep`}>Tu oferta</p>
              <h1 className="v3-blur-in text-[34px] md:text-[44px] font-semibold tracking-tight leading-[1.02] text-ink mt-2" style={{ animationDelay: '100ms' }}>
                Catálogo de servicios
              </h1>
              <p className="v3-blur-in mt-2 text-[14px] font-medium text-muted" style={{ animationDelay: '200ms' }}>
                Define qué ofreces y cuánto cobras
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="v3-blur-in h-14 px-6 rounded-full bg-primary hover:bg-primary-dark text-ink text-[13px] font-bold flex items-center justify-center gap-2 v2-press transition-colors"
              style={{ animationDelay: '300ms' }}
            >
              <Plus size={17} />
              Agregar servicio
            </button>
          </header>

          {/* ── Tarjetas ── */}
          <div className="mt-9 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {services.map((s, i) => (
              <article key={s.id} className={`v2-rise v2-d${Math.min(i + 1, 8)} group bg-cream rounded-[2.25rem] p-3 v2-shadow-soft v2-float flex flex-col`}>
                <div className="relative h-48 overflow-hidden rounded-[1.75rem]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.image} className="absolute inset-0 w-full h-full object-cover v3-photo" alt={s.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                  <span className="absolute top-3 left-3 glass rounded-full h-8 px-3 inline-flex items-center text-[11.5px] font-semibold text-ink">
                    {s.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete(s.id)}
                    aria-label="Eliminar servicio"
                    className="absolute top-3 right-3 w-9 h-9 glass rounded-full flex items-center justify-center text-error v2-press"
                  >
                    <Trash2 size={15} />
                  </button>
                  <h4 className="absolute bottom-4 left-5 right-5 text-[19px] font-semibold tracking-tight leading-tight text-white">{s.name}</h4>
                </div>
                <div className="p-4 pt-5 flex-1 flex flex-col">
                  <p className={`${EYEBROW} text-muted`}>Tarifa base</p>
                  <p className="mt-1.5 text-[26px] font-bold tabular-nums tracking-tight text-primary-deep leading-none">{s.price}</p>
                  <button type="button" className="mt-5 w-full h-12 rounded-full bg-sand text-ink text-[13px] font-bold v2-press">
                    Editar detalles
                  </button>
                </div>
              </article>
            ))}

            {/* Tarjeta para agregar — regla 5 */}
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className={`v2-rise v2-d${Math.min(services.length + 1, 8)} bg-cream rounded-[2.25rem] p-8 flex flex-col items-center justify-center text-center v2-shadow-soft v2-press v2-float min-h-[320px]`}
            >
              <span className="w-16 h-16 rounded-[1.4rem] bg-primary-light text-primary-deep flex items-center justify-center mb-5">
                <Camera size={26} />
              </span>
              <span className="text-[17px] font-semibold tracking-tight text-ink">Agregar un servicio</span>
              <span className="mt-1.5 text-[13px] font-medium text-muted max-w-[220px]">Impacta con tus mejores fotos y una tarifa clara.</span>
              <span className="mt-6 h-11 px-5 rounded-full bg-ink text-white text-[12.5px] font-bold inline-flex items-center gap-2">
                <Plus size={15} /> Nuevo
              </span>
            </button>
          </div>
        </div>

        {/* ── Formulario de nuevo servicio ── */}
        {isAdding && (
          <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="v2-scale w-full max-w-md bg-cream rounded-[2.5rem] p-7 md:p-8 relative v2-shadow-float">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                aria-label="Cerrar"
                className="absolute top-5 right-5 w-10 h-10 bg-sand text-ink rounded-full flex items-center justify-center v2-press"
              >
                <X size={16} />
              </button>

              <div className="mb-7">
                <span className="w-12 h-12 rounded-[1.05rem] bg-primary-light text-primary-deep flex items-center justify-center mb-4">
                  <Tag size={20} />
                </span>
                <p className={`${EYEBROW} text-primary-deep`}>Nuevo servicio</p>
                <h3 className="mt-1.5 text-[24px] font-semibold tracking-tight text-ink">Agrega un servicio a tu catálogo</h3>
                <p className="mt-1.5 text-[13.5px] font-medium text-muted">Ponle un nombre claro y una tarifa base.</p>
              </div>

              <form onSubmit={handleAddService} className="space-y-5">
                <div>
                  <label className={LABEL_CLS}>Nombre del servicio</label>
                  <input
                    placeholder="Ej. Instalación de minisplit"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className={INPUT_CLS}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={LABEL_CLS}>Categoría</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className={`${INPUT_CLS} appearance-none cursor-pointer`}
                    >
                      <option value="Interiores">Interiores</option>
                      <option value="Exteriores">Exteriores</option>
                      <option value="Tecnología">Tecnología</option>
                      <option value="Mantenimiento">Mantenimiento</option>
                    </select>
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Tarifa base</label>
                    <input
                      placeholder="Ej. $500 / hr"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className={`${INPUT_CLS} tabular-nums`}
                      required
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="h-14 px-6 rounded-full text-[13px] font-semibold text-muted hover:text-ink v2-press transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 h-14 rounded-full bg-primary hover:bg-primary-dark text-ink text-[13px] font-bold flex items-center justify-center gap-2 v2-press transition-colors"
                  >
                    <Plus size={16} /> Agregar servicio
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
