"use client";

import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Wallet,
  Building,
  CreditCard,
  History,
  Info,
  ChevronRight
} from 'lucide-react';
import { Button } from '@i-mendly/shared/components/Button';
import { Card } from '@i-mendly/shared/components/Card';
import { Badge } from '@i-mendly/shared/components/Badge';

const TRANSACTIONS = [
  { id: 'TX-8821', type: 'service_payout', description: 'Pago Limpieza Profunda - ORD-9901', date: '25 Mar, 2026', amount: '+ $450.00', status: 'completed' },
  { id: 'TX-8820', type: 'service_payout', description: 'Pago Plomería - ORD-9882', date: '23 Mar, 2026', amount: '+ $1,200.00', status: 'completed' },
  { id: 'TX-8819', type: 'system_fee', description: 'Comisión Plataforma (15%)', date: '21 Mar, 2026', amount: '- $180.00', status: 'completed' },
  { id: 'TX-8818', type: 'withdrawal', description: 'Retiro a Cuenta Santander ****4421', date: '15 Mar, 2026', amount: '- $5,000.00', status: 'processing' },
];

export default function PaymentsPage() {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F8F9FB]">
      <header className="h-24 px-10 border-b border-slate-100 bg-white flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-black text-brand-night tracking-tight uppercase">Pagos & Finanzas</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Control de ingresos, comisiones y retiros</p>
        </div>

        <div className="flex items-center gap-4">
            <Button variant="outline" className="rounded-xl h-11 px-6 flex items-center gap-2 border-slate-200">
                <Calendar size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Marzo 2026</span>
            </Button>
            <Button variant="primary" className="rounded-[1.25rem] h-12 px-8 flex items-center gap-2 shadow-lg shadow-primary/20">
                <Download size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Exportar Reporte</span>
            </Button>
        </div>
      </header>

      <main className="flex-1 p-10 overflow-y-auto space-y-10">
        {/* Wealth Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-8 rounded-[2.5rem] bg-brand-night text-white overflow-hidden relative group">
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/80 mb-4">Saldo Disponible</p>
                    <p className="text-3xl font-black tracking-tighter mb-6">$8,420.50</p>
                    <Button variant="primary" className="w-full h-11 text-[9px] font-black uppercase tracking-[0.3em] rounded-xl hover:scale-105 transition-transform">
                        Retirar Fondos
                    </Button>
                </div>
            </Card>

            <Card className="p-8 rounded-[2.5rem] bg-white border-slate-100/60 shadow-sm relative group overflow-hidden">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Ingresos Mes</p>
                        <TrendingUp size={16} className="text-emerald-500" />
                    </div>
                    <p className="text-2xl font-black text-brand-night tracking-tight">$31,200</p>
                    <div className="mt-4 flex items-center gap-1.5 text-[9px] font-bold text-emerald-600 uppercase tracking-tighter">
                        <ArrowUpRight size={14} /> +12.4% vs Mes Anterior
                    </div>
                </div>
            </Card>

            <Card className="p-8 rounded-[2.5rem] bg-white border-slate-100/60 shadow-sm relative group overflow-hidden">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Servicios Realizados</p>
                        <Wallet size={16} className="text-primary" />
                    </div>
                    <p className="text-2xl font-black text-brand-night tracking-tight">48</p>
                    <div className="mt-4 flex items-center gap-1.5 text-[9px] font-bold text-slate-300 uppercase tracking-tighter">
                        En Marzo hasta hoy
                    </div>
                </div>
            </Card>

            <Card className="p-8 rounded-[2.5rem] bg-white border-slate-100/60 shadow-sm relative group overflow-hidden">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-amber-50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Retiros Totales</p>
                        <History size={16} className="text-amber-500" />
                    </div>
                    <p className="text-2xl font-black text-brand-night tracking-tight">$22,800</p>
                    <div className="mt-4 flex items-center gap-1.5 text-[9px] font-bold text-slate-300 uppercase tracking-tighter">
                        Último retiro: 15 Mar
                    </div>
                </div>
            </Card>
        </div>

        {/* Charts & Detail Grid */}
        <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-brand-night tracking-tight uppercase">Actividad Financiera</h3>
                    <div className="flex gap-2">
                        {['7 Días', '30 Días', 'Todo'].map(f => (
                            <button key={f} className="text-[9px] font-black uppercase tracking-widest text-slate-300 hover:text-brand-night px-2">{f}</button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    {TRANSACTIONS.map((tx) => (
                        <div key={tx.id} className="group bg-white rounded-3xl p-6 border border-slate-50 hover:border-slate-200 transition-all flex items-center justify-between hover:shadow-xl hover:shadow-slate-200/20">
                            <div className="flex items-center gap-5">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                                    tx.amount.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'
                                }`}>
                                    {tx.amount.startsWith('+') ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                                </div>
                                <div>
                                    <p className="text-[14px] font-black text-brand-night leading-tight mb-0.5">{tx.description}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{tx.date} • {tx.id}</p>
                                </div>
                            </div>
                            
                            <div className="text-right">
                                <p className={`text-[16px] font-black italic mb-1 ${
                                    tx.amount.startsWith('+') ? 'text-emerald-600' : 'text-slate-600 font-bold not-italic'
                                }`}>
                                    {tx.amount}
                                </p>
                                <Badge 
                                    variant={tx.status === 'completed' ? 'success' : 'default'} 
                                    className="text-[8px] font-black px-2 py-0.5 uppercase tracking-widest"
                                >
                                    {tx.status === 'completed' ? 'Conciliado' : 'Procesando'}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-10">
                <section className="space-y-6">
                    <h3 className="text-lg font-black text-brand-night tracking-tight uppercase">Estado de Cuenta</h3>
                    <Card className="p-8 rounded-[2.5rem] border-slate-100/60 bg-slate-50/50">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Facturación Bruta</span>
                                <span className="text-[14px] font-black text-brand-night">$36,705.88</span>
                            </div>
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-im-error">Comisión Mendly (15%)</span>
                                <span className="text-[14px] font-black text-im-error">-$5,505.88</span>
                            </div>
                            <div className="flex items-center justify-between pt-2">
                                <span className="text-[10px] font-black text-brand-night uppercase tracking-widest">Ingreso Neto</span>
                                <span className="text-[20px] font-black text-emerald-600 italic leading-none">$31,200.00</span>
                            </div>
                        </div>
                    </Card>
                </section>

                <section className="space-y-6">
                    <h3 className="text-lg font-black text-brand-night tracking-tight uppercase">Métodos de Retiro</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-6 bg-white rounded-3xl border border-primary/20 shadow-lg shadow-primary/5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center">
                                    <Building size={20} />
                                </div>
                                <div>
                                    <p className="text-[13px] font-black text-brand-night leading-tight mb-0.5">Santander ****4421</p>
                                    <p className="text-[9px] font-black text-primary uppercase tracking-widest">Principal</p>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-slate-200" />
                        </div>

                        <button className="w-full p-6 border-2 border-dashed border-slate-100 rounded-3xl flex items-center justify-center gap-3 text-slate-300 hover:border-slate-200 hover:text-slate-400 transition-all group">
                            <CreditCard size={20} className="group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Añadir Cuenta</span>
                        </button>
                    </div>
                </section>
            </div>
        </div>
      </main>
    </div>
  );
}
