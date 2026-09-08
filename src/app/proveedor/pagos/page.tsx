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
  ChevronRight,
  X,
  Target,
  BarChart2,
  CheckCircle2,
  Users
} from 'lucide-react';
import { Button } from '@i-mendly/shared/components/Button';
import { Card } from '@i-mendly/shared/components/Card';
import { Badge } from '@i-mendly/shared/components/Badge';

const TRANSACTIONS = [
  { id: 'TX-8821', type: 'service_payout', description: 'Pago Limpieza Profunda - ORD-9901', date: '25 Mar, 2026', daysAgo: 1, amount: '+ $450.00', status: 'completed' },
  { id: 'TX-8820', type: 'service_payout', description: 'Pago Plomería - ORD-9882', date: '23 Mar, 2026', daysAgo: 3, amount: '+ $1,200.00', status: 'completed' },
  { id: 'TX-8819', type: 'system_fee', description: 'Comisión Plataforma (15%)', date: '21 Mar, 2026', daysAgo: 5, amount: '- $180.00', status: 'completed' },
  { id: 'TX-8818', type: 'withdrawal', description: 'Retiro a Cuenta Santander ****4421', date: '15 Mar, 2026', daysAgo: 11, amount: '- $5,000.00', status: 'processing' },
  { id: 'TX-8817', type: 'service_payout', description: 'Pago Pintura - ORD-9855', date: '28 Feb, 2026', daysAgo: 26, amount: '+ $3,400.00', status: 'completed' },
  { id: 'TX-8816', type: 'service_payout', description: 'Pago Electricidad - ORD-9810', date: '15 Feb, 2026', daysAgo: 39, amount: '+ $850.00', status: 'completed' },
];

export default function PaymentsPage() {
  const [filter, setFilter] = useState<'7' | '30' | 'all'>('7');
  const [showReportModal, setShowReportModal] = useState(false);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);

  const filteredTransactions = TRANSACTIONS.filter(tx => {
    if (filter === '7') return tx.daysAgo <= 7;
    if (filter === '30') return tx.daysAgo <= 30;
    return true;
  });

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8F9FB]">
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
            <Button 
                onClick={() => setShowReportModal(true)}
                variant="primary" 
                className="rounded-[1.25rem] h-12 px-8 flex items-center gap-2 shadow-lg shadow-primary/20"
            >
                <Download size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Exportar Reporte</span>
            </Button>
        </div>
      </header>

      <main className="flex-1 p-10 overflow-y-auto space-y-10">
        {/* Wealth Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Saldo Disponible - Premium Dark Card */}
            <div className="p-8 rounded-[2.5rem] bg-brand-night text-white overflow-hidden relative group shadow-2xl shadow-brand-night/20 border border-brand-night flex flex-col justify-between min-h-[180px]">
                {/* SVG Refined Background */}
                <div className="absolute inset-0 opacity-20 transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-3">
                    <svg className="w-full h-full object-cover" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5"/>
                                <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                            </linearGradient>
                        </defs>
                        <path fill="url(#g)" d="M0,0 L100,0 L100,100 L0,100 Z" />
                        <circle cx="80" cy="80" r="40" fill="#a78bfa" fillOpacity="0.3" filter="blur(20px)" />
                        <circle cx="20" cy="20" r="60" fill="#10b981" fillOpacity="0.2" filter="blur(30px)" />
                    </svg>
                </div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Saldo Disponible</p>
                    <div className="mt-4">
                        <p className="text-4xl font-black tracking-tighter text-white drop-shadow-md">$8,420<span className="text-xl text-white/50">.50</span></p>
                    </div>
                </div>
            </div>

            {/* Ingresos Mes */}
            <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm relative group overflow-hidden flex flex-col justify-between min-h-[180px] hover:shadow-xl hover:shadow-emerald-500/5 transition-all">
                <div className="absolute -right-4 -top-4 w-32 h-32 bg-emerald-50 rounded-full blur-3xl group-hover:scale-[1.8] group-hover:opacity-100 opacity-60 transition-all duration-700" />
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">Ingresos Mes</p>
                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-500">
                            <TrendingUp size={14} />
                        </div>
                    </div>
                    <div>
                        <p className="text-3xl font-black text-brand-night tracking-tight">$31,200</p>
                        <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-tighter bg-emerald-50 inline-flex px-2 py-1 rounded-lg">
                            <ArrowUpRight size={12} /> +12.4% vs Mes Ant
                        </div>
                    </div>
                </div>
            </div>

            {/* Servicios Realizados */}
            <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm relative group overflow-hidden flex flex-col justify-between min-h-[180px] hover:shadow-xl hover:shadow-primary/5 transition-all">
                <div className="absolute -left-4 -bottom-4 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:scale-[1.8] group-hover:opacity-100 opacity-60 transition-all duration-700" />
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">Servicios Realizados</p>
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                            <Wallet size={14} />
                        </div>
                    </div>
                    <div>
                        <p className="text-3xl font-black text-brand-night tracking-tight">48</p>
                        <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                            En Marzo hasta hoy
                        </div>
                    </div>
                </div>
            </div>

            {/* Retiros Totales */}
            <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm relative group overflow-hidden flex flex-col justify-between min-h-[180px] hover:shadow-xl hover:shadow-amber-500/5 transition-all">
                <div className="absolute right-0 top-0 w-32 h-32 bg-amber-50 rounded-full blur-3xl group-hover:scale-[1.8] group-hover:opacity-100 opacity-60 transition-all duration-700 translate-x-1/2 -translate-y-1/2" />
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">Retiros Totales</p>
                        <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-500">
                            <History size={14} />
                        </div>
                    </div>
                    <div>
                        <p className="text-3xl font-black text-brand-night tracking-tight">$22,800</p>
                        <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-amber-600/80 uppercase tracking-tighter">
                            Último retiro: 15 Mar
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Charts & Detail Grid */}
        <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-brand-night tracking-tight uppercase">Actividad Financiera</h3>
                    <div className="flex gap-2">
                        {[
                          { id: '7', label: '7 Días' }, 
                          { id: '30', label: '30 Días' }, 
                          { id: 'all', label: 'Todo' }
                        ].map(f => (
                            <button 
                              key={f.id} 
                              onClick={() => setFilter(f.id as any)}
                              className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-colors ${
                                filter === f.id ? 'bg-primary text-white shadow-sm shadow-primary/20' : 'text-slate-300 hover:text-brand-night hover:bg-slate-100'
                              }`}
                            >
                              {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredTransactions.length === 0 && (
                      <div className="p-8 text-center text-slate-400 font-bold text-sm bg-white rounded-3xl border border-dashed border-slate-200">
                        No hay transacciones en este periodo.
                      </div>
                    )}

                    {filteredTransactions.map((tx) => (
                        <div key={tx.id} className="group bg-white rounded-3xl p-6 border border-slate-50 hover:border-slate-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-xl hover:shadow-slate-200/20">
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
                            
                            <div className="text-left md:text-right flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start ml-16 md:ml-0">
                                <p className={`text-[16px] font-black italic mb-0 md:mb-1 ${
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
                    <Card className="p-8 rounded-[2.5rem] border-slate-100/60 bg-white shadow-sm">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Facturación Bruta</span>
                                <span className="text-[14px] font-black text-brand-night">$36,705.88</span>
                            </div>
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-brand-coral">Comisión Mendly (15%)</span>
                                <span className="text-[14px] font-black text-brand-coral">-$5,505.88</span>
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

                        <button 
                            onClick={() => setShowAddAccountModal(true)}
                            className="w-full p-6 border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center gap-3 text-slate-400 hover:border-slate-300 hover:text-brand-night hover:bg-slate-50 transition-all group bg-white"
                        >
                            <CreditCard size={20} className="group-hover:scale-110 transition-transform text-slate-300 group-hover:text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Añadir Nueva Cuenta</span>
                        </button>
                    </div>
                </section>
            </div>
        </div>
      </main>

      {/* KPI Report Modal Overlay */}
      {showReportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-brand-night/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95 duration-500">
            <button 
              onClick={() => setShowReportModal(false)}
              className="absolute top-6 right-6 w-10 h-10 bg-slate-50 text-slate-400 hover:text-brand-night rounded-full flex items-center justify-center transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="p-10 border-b border-slate-100 flex items-center gap-6">
              <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center">
                <BarChart2 size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-brand-night uppercase tracking-tighter">Reporte Ejecutivo KPI</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Periodo: Marzo 2026 • Generado a las 19:00</p>
              </div>
            </div>

            <div className="p-10 space-y-10 bg-slate-50/50">
              {/* Objectives */}
              <section>
                <h3 className="text-sm font-black text-brand-night uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Target size={18} className="text-primary" /> Cumplimiento de Objetivos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6 border-none shadow-sm rounded-3xl">
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Objetivo Mensual</p>
                        <p className="text-2xl font-black text-brand-night">$40,000</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Actual</p>
                        <p className="text-xl font-black text-emerald-600">$31,200</p>
                      </div>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full w-[78%] transition-all duration-1000" />
                    </div>
                    <p className="text-[9px] font-bold text-slate-400 mt-3 text-right">78% Completado</p>
                  </Card>

                  <Card className="p-6 border-none shadow-sm rounded-3xl">
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Conversión de Clientes</p>
                        <p className="text-2xl font-black text-brand-night">85%</p>
                      </div>
                      <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center rounded-xl">
                        <Users size={20} />
                      </div>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full w-[85%] transition-all duration-1000" />
                    </div>
                    <p className="text-[9px] font-bold text-slate-400 mt-3 text-right">Excelente nivel de cierre</p>
                  </Card>
                </div>
              </section>

              {/* KPI Details */}
              <section>
                <h3 className="text-sm font-black text-brand-night uppercase tracking-widest mb-6 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-primary" /> Indicadores Clave
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Tiempo de Rpta.', val: '< 15 min', trend: '-2 min', status: 'good' },
                    { label: 'Cancelaciones', val: '2.1%', trend: '-0.5%', status: 'good' },
                    { label: 'Ticket Promedio', val: '$650', trend: '+$45', status: 'good' },
                    { label: 'Retención M/M', val: '64%', trend: '+4%', status: 'good' },
                  ].map((kpi, i) => (
                    <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm text-center">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">{kpi.label}</p>
                      <p className="text-xl font-black text-brand-night mb-2">{kpi.val}</p>
                      <Badge variant="success" className="mx-auto px-2 py-0.5 text-[8px] bg-emerald-50 text-emerald-600">{kpi.trend}</Badge>
                    </div>
                  ))}
                </div>
              </section>

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                 <Button variant="ghost" onClick={() => setShowReportModal(false)} className="text-xs font-black uppercase tracking-widest h-12 px-6">
                   Cerrar
                 </Button>
                 <Button variant="primary" className="text-xs font-black uppercase tracking-widest h-12 px-8 shadow-lg shadow-primary/30">
                   Descargar PDF
                 </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Bank Account Modal */}
      {showAddAccountModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-brand-night/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl relative animate-in zoom-in-95 duration-500 overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shadow-inner">
                  <Building size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-brand-night uppercase tracking-tighter">Nueva Cuenta</h2>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Datos bancarios para retiros</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAddAccountModal(false)}
                className="w-10 h-10 bg-white border border-slate-100 text-slate-400 hover:text-brand-night rounded-full flex items-center justify-center transition-colors hover:shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-night uppercase tracking-widest ml-1">Banco Destino</label>
                    <div className="relative">
                        <select className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-[13px] font-bold text-brand-night appearance-none focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer">
                            <option value="">Selecciona tu banco</option>
                            <option value="bbva">BBVA Bancomer</option>
                            <option value="santander">Santander</option>
                            <option value="banorte">Banorte</option>
                            <option value="citibanamex">Citibanamex</option>
                            <option value="hsbc">HSBC</option>
                            <option value="scotiabank">Scotiabank</option>
                        </select>
                        <ChevronRight size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-night uppercase tracking-widest ml-1">Titular de la Cuenta</label>
                    <input 
                        type="text" 
                        placeholder="Nombre completo del titular"
                        className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-[13px] font-bold text-brand-night placeholder:text-slate-300 focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-night uppercase tracking-widest ml-1">CLABE Interbancaria (18 dígitos)</label>
                    <input 
                        type="text" 
                        maxLength={18}
                        placeholder="000000000000000000"
                        className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-[15px] font-black tracking-[0.2em] text-brand-night placeholder:text-slate-300 focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed max-w-[200px]">
                    El tiempo de validación de una nueva cuenta es de 24 hrs.
                </p>
                <div className="flex gap-3">
                    <Button variant="ghost" onClick={() => setShowAddAccountModal(false)} className="h-12 px-6 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-200/50">
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={() => setShowAddAccountModal(false)} className="h-12 px-8 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20">
                        Guardar Cuenta
                    </Button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
