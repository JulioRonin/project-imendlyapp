"use client";

import React, { useState } from 'react';
import { Logo } from '@i-mendly/shared/Logo';
import { Card } from '@i-mendly/shared/components/Card';
import { Badge } from '@i-mendly/shared/components/Badge';
import { Button } from '@i-mendly/shared/components/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  AlertCircle, 
  BarChart3, 
  UserPlus, 
  TrendingUp, 
  Zap,
  ArrowLeft,
  DollarSign,
  PieChart,
  Calendar,
  Layers,
  Search,
  Filter,
  FileText,
  ArrowUpRight,
  LogOut,
  Settings
} from 'lucide-react';

const CATEGORY_PERFORMANCE = [
  { name: 'Plomería', sales: '$240,000', commission: '15%', revenue: '$36,000' },
  { name: 'Electricidad', sales: '$180,000', commission: '12%', revenue: '$21,600' },
  { name: 'Limpieza', sales: '$120,000', commission: '18%', revenue: '$21,600' },
  { name: 'Cerrajería', sales: '$85,000', commission: '14%', revenue: '$11,900' },
  { name: 'Pintura', sales: '$72,000', commission: '10%', revenue: '$7,200' },
];
export default function FinancePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'ventas' | 'volumen'>('ventas');
  const [selectedMonth, setSelectedMonth] = useState('Marzo 2026');

  const handleLogout = () => {
    router.push('/role-selection');
  };

  const navItems = [
    { label: 'Dashboard', icon: <BarChart3 size={18} />, href: '/admin' },
    { label: 'Disputas', icon: <AlertCircle size={18} />, href: '/admin/disputas' },
    { label: 'Onboarding', icon: <UserPlus size={18} />, href: '/admin/proveedores/onboarding' },
    { label: 'Finanzas', icon: <TrendingUp size={18} />, href: '/admin/finanzas', active: true },
    { label: 'Master Plan', icon: <Zap size={18} />, href: '/admin/master-plan' },
    { label: 'Configuración', icon: <Settings size={18} />, href: '/admin/configuraciones' },
  ];

  const categories = [
    { name: 'Plomería', sales: '$245,000', volume: 145, commission: '15%', revenue: '$36,750' },
    { name: 'Electricidad', sales: '$182,000', volume: 122, commission: '12%', revenue: '$21,840' },
    { name: 'Limpieza', sales: '$112,000', volume: 98, commission: '18%', revenue: '$20,160' },
    { name: 'Pintura', sales: '$95,000', volume: 85, commission: '15%', revenue: '$14,250' },
    { name: 'Cerrajería', sales: '$72,000', volume: 54, commission: '20%', revenue: '$14,400' },
  ];

  return (
    <main className="min-h-screen bg-silver font-urbanist flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-black-rich text-white flex flex-col sticky top-0 h-screen p-6">
        <div className="mb-12">
          <Logo size={32} variant="dark" />
        </div>
        <nav className="flex-1 space-y-2">
          {navItems.map((item, i) => (
            <Link key={i} href={item.href}>
              <div className={`
                flex items-center gap-3 px-4 py-3 rounded-pill transition-all
                ${item.active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-white/50 hover:text-white hover:bg-white/5'}
              `}>
                {item.icon}
                <span className="text-sm font-[500]">{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>
        
        <div className="pt-6 border-t border-white/10 mt-6">
           <button 
             onClick={handleLogout}
             className="flex items-center gap-3 px-4 py-3 rounded-pill w-full text-im-error hover:bg-im-error/10 transition-all font-[600] text-sm"
           >
             <LogOut size={18} />
             Cerrar Sesión
           </button>
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-1 max-w-7xl mx-auto px-8 py-12">
        <header className="mb-12 flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-[600] tracking-tight text-black-rich mb-2">Finanzas y Comisiones</h2>
            <p className="text-gray-soft text-sm">Consolidado mensual de ventas, retenciones y revenue por categoría.</p>
          </div>
          <div className="flex gap-4 items-center">
             <div className="relative group">
                <button className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-pill border-[0.5px] border-black/5 text-sm font-[600] text-black-rich hover:bg-silver-light/20 transition-all">
                   <Calendar size={18} className="text-primary" />
                   {selectedMonth}
                </button>
                {/* Simulated dropdown */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-float border border-black/5 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-50 overflow-hidden">
                   {['Marzo 2026', 'Febrero 2026', 'Enero 2026'].map(m => (
                     <button key={m} onClick={() => setSelectedMonth(m)} className="w-full text-left px-5 py-3 text-xs hover:bg-silver-light/30 transition-colors uppercase font-[600]">
                        {m}
                     </button>
                   ))}
                </div>
             </div>
             <Link href="/admin/reporte-financiero">
                <Button variant="primary" className="rounded-pill px-8 gap-2 bg-primary text-white">
                   <FileText size={18} /> Generar Reporte
                </Button>
             </Link>
          </div>
        </header>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
           <Card variant="dark" className="p-10 group overflow-hidden relative flex flex-col items-center text-center justify-center min-h-[220px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[40px] rounded-pill -mr-16 -mt-16 group-hover:bg-primary/20 transition-colors" />
              <div className="flex items-center gap-3 mb-6 opacity-60">
                 <DollarSign size={20} />
                 <p className="text-[10px] uppercase font-[600] tracking-widest leading-none">Total Ventas (GMV)</p>
              </div>
              <p className="text-5xl font-[600] tracking-tighter mb-4">$842,500</p>
              <div className="flex items-center gap-2 text-[10px] font-[600] text-primary bg-primary/10 px-3 py-1.5 rounded-pill">
                 <ArrowUpRight size={12} />
                 +12.5% crec. mensual
              </div>
           </Card>

           <Card variant="floating" className="p-10 border-none bg-white group hover:shadow-2xl transition-all min-h-[220px] flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-8 text-black-rich/40">
                 <PieChart size={20} />
                 <p className="text-[10px] uppercase font-[600] tracking-widest">Comisiones Netas</p>
              </div>
              <p className="text-4xl font-[600] text-black-rich tracking-tight mb-4">$101,100</p>
              <div className="flex items-center gap-2 text-[10px] font-[600] text-primary">
                 <Zap size={12} />
                 12% Margen Promedio
              </div>
           </Card>

           <Card variant="floating" className="p-10 border-none bg-white min-h-[220px] flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-8 text-gray-soft">
                 <AlertCircle size={20} />
                 <p className="text-[10px] uppercase font-[600] tracking-widest">En Disputas (Escrow)</p>
              </div>
              <p className="text-4xl font-[600] text-black-rich tracking-tight mb-4">$4,450</p>
              <p className="text-[10px] text-gray-soft">0.5% del volumen total</p>
           </Card>
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <Card variant="default" className="lg:col-span-2 p-10">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-xl font-[600] text-black-rich tracking-tight font-urbanist">Rendimiento por Categoría</h3>
                 <div className="flex bg-silver-light/30 rounded-pill p-1">
                    <button 
                      onClick={() => setActiveTab('ventas')}
                      className={`px-6 py-1.5 rounded-pill text-xs font-[600] transition-all ${activeTab === 'ventas' ? 'bg-white text-black-rich shadow-sm' : 'text-gray-soft hover:text-black-rich'}`}>
                      Ventas
                    </button>
                    <button 
                      onClick={() => setActiveTab('volumen')}
                      className={`px-6 py-1.5 rounded-pill text-xs font-[600] transition-all ${activeTab === 'volumen' ? 'bg-white text-black-rich shadow-sm' : 'text-gray-soft hover:text-black-rich'}`}>
                      Volumen
                    </button>
                 </div>
              </div>
              
              <div className="space-y-2">
                 <div className="grid grid-cols-4 pb-4 px-4 text-[10px] font-[600] text-gray-soft uppercase tracking-widest border-b border-black/5">
                    <span>Categoría</span>
                    <span className="text-center">{activeTab === 'ventas' ? 'Ventas Totales' : 'Solicitudes'}</span>
                    <span className="text-center">Comisión %</span>
                    <span className="text-right">Monto Comisión</span>
                 </div>
                 {categories.map((cat, i) => (
                   <div key={i} className="grid grid-cols-4 items-center p-4 rounded-md hover:bg-silver-light/30 transition-colors group">
                      <span className="text-sm font-[600] text-black-rich">{cat.name}</span>
                      <span className="text-sm text-center text-black-rich/60 font-[500]">{activeTab === 'ventas' ? cat.sales : `${cat.volume} serv.`}</span>
                      <span className="text-sm text-center font-[600] text-primary">{cat.commission}</span>
                      <span className="text-sm text-right font-[600] text-black-rich">{cat.revenue}</span>
                   </div>
                 ))}
                 <div className="grid grid-cols-4 px-6 pt-6 border-t border-black/5 text-lg font-[600] items-center">
                    <span className="text-gray-soft uppercase text-xs">Total</span>
                    <span className="text-center text-black-rich">
                       {activeTab === 'ventas' 
                         ? `$${categories.reduce((acc, cat) => acc + parseInt(cat.sales.replace(/[^0-9]/g, '')), 0).toLocaleString()}` 
                         : `${categories.reduce((acc, cat) => acc + cat.volume, 0)} serv.`}
                    </span>
                    <span className="text-center text-gray-soft text-sm">--</span>
                    <span className="text-right text-primary">
                       {`$${categories.reduce((acc, cat) => acc + parseInt(cat.revenue.replace(/[^0-9]/g, '')), 0).toLocaleString()}`}
                    </span>
                 </div>
              </div>
           </Card>

           {/* Distribution Mini Chart Area */}
           <div className="space-y-8">
              <Card variant="default" className="p-8">
                 <h3 className="text-lg font-[600] text-black-rich tracking-tight mb-8">Estructura de Margen</h3>
                 <div className="space-y-6">
                    <p className="text-sm text-gray-600 leading-relaxed mb-6">
                       Distribución de ingresos operativos por tipo de retención aplicada.
                    </p>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center text-xs">
                          <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-pill bg-primary" /> Transaccional (10%)</span>
                          <span className="font-[600]">$62,400</span>
                       </div>
                       <div className="flex justify-between items-center text-xs">
                          <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-pill bg-black-rich" /> Premium Ads (5%)</span>
                          <span className="font-[600]">$28,150</span>
                       </div>
                       <div className="flex justify-between items-center text-xs">
                          <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-pill bg-im-warning" /> Penalizaciones (2%)</span>
                          <span className="font-[600]">$10,550</span>
                       </div>
                    </div>
                    <div className="h-4 w-full bg-silver-light rounded-sm mt-8 flex overflow-hidden">
                       <div className="h-full bg-primary" style={{ width: '60%' }} />
                       <div className="h-full bg-black-rich" style={{ width: '25%' }} />
                       <div className="h-full bg-im-warning" style={{ width: '15%' }} />
                    </div>
                 </div>
              </Card>

              <Card variant="silver" className="p-8 border-none bg-[#F5F5F5]">
                 <h4 className="text-sm font-[600] text-black-rich mb-4">Nota Fiscal</h4>
                 <p className="text-[10px] text-gray-soft leading-relaxed">
                    Todos los montos mostrados son antes de IVA. Las facturas de comisiones se generan automáticamente al final de cada ciclo de pago.
                 </p>
                 <Button variant="ghost" size="sm" className="mt-4 p-0 text-primary hover:bg-transparent hover:underline text-[10px] uppercase font-[600] tracking-widest">Configurar Facturación</Button>
              </Card>
           </div>
        </div>
      </div>
    </main>
  );
}
