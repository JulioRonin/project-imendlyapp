"use client";

import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Camera, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Globe, 
  Share2, 
  ChevronRight,
  Info,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@i-mendly/shared/components/Button';
import { Card } from '@i-mendly/shared/components/Card';
import { Input } from '@i-mendly/shared/components/Input';
import { Badge } from '@i-mendly/shared/components/Badge';
import { Avatar } from '@i-mendly/shared/components/Avatar';

const SERVICES = [
  { id: 1, name: 'Limpieza Profunda', category: 'Interiores', price: '$800 / hr', image: 'https://images.unsplash.com/photo-1581578731522-bc0cc1249767?auto=format&fit=crop&q=80&w=200' },
  { id: 2, name: 'Limpieza Express', category: 'Interiores', price: '$450 / hr', image: 'https://images.unsplash.com/photo-1527515545081-5db817172677?auto=format&fit=crop&q=80&w=200' },
];

export default function ConfigurationPage() {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'services'>('profile');

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F8F9FB]">
      <header className="h-24 px-10 border-b border-slate-100 bg-white flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-black text-brand-night tracking-tight uppercase">Configuración</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Perfil, servicios y preferencias de la cuenta</p>
        </div>

        <div className="flex items-center gap-4">
            <Button variant="outline" className="rounded-xl h-11 px-6 border-slate-200">
                <span className="text-[10px] font-black uppercase tracking-widest">Previsualizar Perfil</span>
            </Button>
            <Button variant="primary" className="rounded-[1.25rem] h-12 px-8 shadow-lg shadow-primary/20">
                <span className="text-[10px] font-black uppercase tracking-widest">Guardar Cambios</span>
            </Button>
        </div>
      </header>

      <main className="flex-1 p-10 overflow-y-auto space-y-10">
        <div className="flex gap-8 border-b border-slate-100 pb-2">
            <button
                onClick={() => setActiveSubTab('profile')}
                className={`text-[11px] font-black uppercase tracking-widest pb-3 transition-all relative ${
                    activeSubTab === 'profile' ? 'text-brand-night' : 'text-slate-300 hover:text-slate-400'
                }`}
            >
                Información de Perfil
                {activeSubTab === 'profile' && (
                    <div className="absolute bottom-0 left-1 right-1 h-1 bg-primary rounded-full" />
                )}
            </button>
            <button
                onClick={() => setActiveSubTab('services')}
                className={`text-[11px] font-black uppercase tracking-widest pb-3 transition-all relative ${
                    activeSubTab === 'services' ? 'text-brand-night' : 'text-slate-300 hover:text-slate-400'
                }`}
            >
                Catálogo de Servicios
                {activeSubTab === 'services' && (
                    <div className="absolute bottom-0 left-1 right-1 h-1 bg-primary rounded-full" />
                )}
            </button>
        </div>

        {activeSubTab === 'profile' ? (
            <div className="grid lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    <section className="space-y-6">
                        <h3 className="text-lg font-black text-brand-night tracking-tight uppercase">Datos Generales</h3>
                        <Card className="p-10 rounded-[2.5rem] border-slate-50 space-y-8 bg-white">
                            <div className="flex items-center gap-10">
                                <div className="relative group">
                                    <Avatar size="xl" name="Juan Perez" className="w-32 h-32 rounded-[2.5rem] border-4 border-slate-50" />
                                    <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-night text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                        <Camera size={18} />
                                    </button>
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre Público</label>
                                            <Input defaultValue="Juan Pérez" className="bg-slate-50/50 border-transparent h-12 rounded-xl text-[11px] font-bold uppercase tracking-tight" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Ocupación / Título</label>
                                            <Input defaultValue="Especialista en Limpieza" className="bg-slate-50/50 border-transparent h-12 rounded-xl text-[11px] font-bold uppercase tracking-tight" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Biografía / Presentación</label>
                                        <textarea 
                                            className="w-full bg-slate-50/50 border-none rounded-xl p-4 text-[11px] font-bold uppercase tracking-tight min-h-[100px] outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                            defaultValue="Mas de 10 años de experiencia brindando servicios de alta calidad para hogares exigentes."
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </section>

                    <section className="space-y-6">
                        <h3 className="text-lg font-black text-brand-night tracking-tight uppercase">Redes & Ubicación</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <Card className="p-8 rounded-[2rem] border-slate-50 bg-white space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <Globe size={18} className="text-slate-300" />
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">www.mendly.com/juanp</span>
                                    </div>
                                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <Share2 size={18} className="text-slate-300" />
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">@juan_services</span>
                                    </div>
                                </div>
                            </Card>
                            <Card className="p-8 rounded-[2rem] border-slate-50 bg-white flex flex-col justify-center">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Zona de Trabajo Principal</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                        <Globe size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-black text-brand-night">Lomas de Chapultepec</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Radio de 10km activo</p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </section>
                </div>

                <div className="space-y-8">
                    <Card variant="navy" className="p-8 rounded-[2.5rem] overflow-hidden relative">
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-primary/30 rounded-3xl flex items-center justify-center mb-6 border border-primary/20">
                                <ShieldCheck size={40} className="text-white" />
                            </div>
                            <h4 className="text-lg font-black mb-1 uppercase tracking-tight">Estado de Verificación</h4>
                            <Badge variant="success" className="px-4 py-1 text-[9px] font-black uppercase tracking-[0.2em] mb-6 shadow-lg shadow-primary/20">Partner Premium</Badge>
                            <p className="text-white/70 text-[10px] leading-relaxed px-4 font-medium">
                                Tu perfil cumple con todos los estándares de seguridad de I Mendly.
                            </p>
                            <div className="w-full h-[1px] bg-white/10 my-8" />
                            <div className="space-y-4 w-full">
                                {['Identidad', 'Domicilio', 'Seguro RC'].map((v, i) => (
                                    <div key={i} className="flex justify-between items-center bg-white/10 p-4 rounded-2xl border border-white/5">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-white">{v}</span>
                                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
                                            <CheckCircle2 size={14} className="text-white" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        ) : (
            <div className="space-y-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-black text-brand-night tracking-tight uppercase">Tus Servicios Activos</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Define qué ofreces y cuánto cobras</p>
                    </div>
                    <Button variant="primary" className="rounded-[1.25rem] h-12 px-8 flex items-center gap-2 shadow-lg shadow-primary/20">
                        <Plus size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Nuevo Servicio</span>
                    </Button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {SERVICES.map((s) => (
                        <Card key={s.id} className="p-0 rounded-[2.5rem] overflow-hidden bg-white border-slate-50 group hover:border-primary/20 transition-all hover:shadow-2xl hover:shadow-primary/5">
                            <div className="h-48 relative overflow-hidden">
                                <img src={s.image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={s.name} />
                                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                    <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mb-1">{s.category}</p>
                                    <h4 className="text-lg font-black text-white uppercase tracking-tight">{s.name}</h4>
                                </div>
                                <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-im-error hover:bg-im-error hover:text-white transition-all shadow-lg">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Tarifa Sugerida</p>
                                        <p className="text-2xl font-black text-brand-night italic">{s.price}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                                        <Settings size={20} className="text-slate-300" />
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full h-11 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border-slate-100 font-urbanist">
                                    Editar Detalles
                                </Button>
                            </div>
                        </Card>
                    ))}

                    {/* Add New Service Card */}
                    <button className="rounded-[2.5rem] border-4 border-dashed border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center p-12 text-slate-300 hover:border-primary/20 hover:bg-white hover:text-primary transition-all group min-h-[400px]">
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-primary/5 transition-colors">
                            <Plus size={32} />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-[0.3em]">Cargar Nuevo Trabajo</span>
                        <p className="text-[9px] mt-3 font-bold opacity-60">Impacta con tus mejores fotos</p>
                    </button>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}
