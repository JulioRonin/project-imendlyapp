"use client";

import React, { useState } from 'react';
import { 
  Camera, 
  ShieldCheck, 
  Globe, 
  Share2, 
  CheckCircle2,
  MapPin
} from 'lucide-react';
import { Button } from '@i-mendly/shared/components/Button';
import { Card } from '@i-mendly/shared/components/Card';
import { Input } from '@i-mendly/shared/components/Input';
import { Badge } from '@i-mendly/shared/components/Badge';
import { Avatar } from '@i-mendly/shared/components/Avatar';

const LOCATIONS = {
  'CDMX': ['Polanco', 'Condesa', 'Roma', 'Santa Fe', 'Centro Histórico'],
  'Monterrey': ['San Pedro', 'San Nicolás', 'Santa Catarina', 'Centro'],
  'Guadalajara': ['Zapopan', 'Providencia', 'Tlaquepaque'],
  'Juarez': ['Campestre', 'Pradera Dorada', 'Campos Elíseos'],
  'Chihuahua': ['San Felipe', 'Las Haciendas', 'Cantera']
};

export default function ConfigurationPage() {
  const [selectedCity, setSelectedCity] = useState<keyof typeof LOCATIONS | ''>('');
  const [selectedArea, setSelectedArea] = useState<string>('');

  const currentAreas = selectedCity ? LOCATIONS[selectedCity] : [];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F8F9FB]">
      <header className="h-24 px-10 border-b border-slate-100 bg-white flex items-center justify-between sticky top-0 z-10 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-brand-night tracking-tight uppercase">Configuración</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Perfil y preferencias de la cuenta</p>
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

      <main className="flex-1 p-10 overflow-y-auto space-y-10 custom-scrollbar">
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
                                        className="w-full bg-slate-50/50 border-none rounded-xl p-4 text-[11px] font-bold uppercase tracking-tight min-h-[100px] outline-none focus:ring-2 focus:ring-primary/20 transition-all custom-scrollbar"
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
                                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                                    <Globe size={18} className="text-slate-300 ml-2" />
                                    <input 
                                        type="text" 
                                        defaultValue="www.mendly.com/juanp" 
                                        className="bg-transparent border-none outline-none w-full text-[10px] font-bold text-slate-500 uppercase tracking-tight" 
                                    />
                                </div>
                                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                                    <Share2 size={18} className="text-slate-300 ml-2" />
                                    <input 
                                        type="text" 
                                        defaultValue="@juan_services" 
                                        className="bg-transparent border-none outline-none w-full text-[10px] font-bold text-slate-500 uppercase tracking-tight" 
                                    />
                                </div>
                            </div>
                        </Card>
                        <Card className="p-8 rounded-[2rem] border-slate-50 bg-white flex flex-col justify-center relative overflow-hidden group">
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 relative z-10">Zona de Trabajo Principal</p>
                            
                            <div className="space-y-4 relative z-10 w-full">
                                <div className="space-y-1.5 flex flex-col">
                                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Ciudad</label>
                                    <div className="relative">
                                        <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none" />
                                        <select 
                                            value={selectedCity} 
                                            onChange={(e) => {
                                                setSelectedCity(e.target.value as any);
                                                setSelectedArea('');
                                            }}
                                            className="w-full h-10 bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-4 text-[11px] font-bold uppercase tracking-tight outline-none focus:ring-2 focus:ring-primary/20 transition-all text-brand-night appearance-none cursor-pointer"
                                        >
                                            <option value="" disabled>Selecciona una Ciudad</option>
                                            <option value="CDMX">CDMX</option>
                                            <option value="Monterrey">Monterrey</option>
                                            <option value="Guadalajara">Guadalajara</option>
                                            <option value="Juarez">Ciudad Juárez</option>
                                            <option value="Chihuahua">Chihuahua</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="space-y-1.5 flex flex-col">
                                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Área Principal</label>
                                    <select 
                                        value={selectedArea} 
                                        onChange={(e) => setSelectedArea(e.target.value)}
                                        disabled={!selectedCity}
                                        className="w-full h-10 bg-slate-50 border border-slate-100 rounded-xl px-4 text-[11px] font-bold uppercase tracking-tight outline-none focus:ring-2 focus:ring-primary/20 transition-all text-brand-night appearance-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        <option value="" disabled>
                                            {selectedCity ? 'Selecciona un área' : 'Primero elige una ciudad'}
                                        </option>
                                        {currentAreas.map(area => (
                                            <option key={area} value={area}>{area}</option>
                                        ))}
                                    </select>
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
      </main>
    </div>
  );
}
