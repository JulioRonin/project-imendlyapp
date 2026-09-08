"use client";

import { useState } from 'react';
import { Logo } from '@i-mendly/shared/Logo';
import { Card } from '@i-mendly/shared/components/Card';
import { Badge } from '@i-mendly/shared/components/Badge';
import { Button } from '@i-mendly/shared/components/Button';
import { Avatar } from '@i-mendly/shared/components/Avatar';
import { Input } from '@i-mendly/shared/components/Input';

import { MOCK_STATS } from '@i-mendly/shared/constants/mocks';
import Link from 'next/link';
import { 
  TrendingUp, 
  Users, 
  Settings, 
  AlertCircle, 
  BarChart3, 
  UserPlus,
  ArrowUpRight,
  Zap,
  DollarSign,
  LogOut,
  Shield
} from 'lucide-react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';

export default function AdminDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [key, setKey] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.toLowerCase() === 'sushi' && pin === '3619') {
      setIsAuthorized(true);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  if (!isAuthorized) {
    return (
      <main className="min-h-screen bg-brand-night flex items-center justify-center p-6 font-urbanist overflow-hidden relative">
        {/* Animated Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary opacity-20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary opacity-10 blur-[100px] rounded-full" />
        
        <div className="relative z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex justify-center mb-12 transform hover:scale-105 transition-transform duration-500">
            <Logo size={100} orientation="vertical" variant="dark" />
          </div>

          <Card variant="glass" className="p-10 md:p-12 rounded-[3.5rem] border-white/10 shadow-[0_48px_128px_-32px_rgba(0,0,0,0.5)] bg-white/5 backdrop-blur-3xl overflow-hidden relative group">
            {/* Visual indicators */}
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Shield size={64} className="text-white" />
            </div>

            <div className="text-center mb-10">
              <h1 className="text-3xl font-black text-white tracking-tight mb-2 uppercase">Admin Entry</h1>
              <p className="text-primary text-[10px] font-black uppercase tracking-[0.5em] opacity-80">Security Protocol Required</p>
            </div>

            <form onSubmit={handleVerify} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Key Name</label>
                  <Input 
                    placeholder="ENTER KEY" 
                    value={key}
                    onChange={e => setKey(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-14 rounded-2xl text-xs font-bold uppercase tracking-widest focus:bg-white/10 focus:border-primary/50 transition-all text-center" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Access PIN</label>
                  <Input 
                    type="password" 
                    placeholder="••••" 
                    maxLength={4}
                    value={pin}
                    onChange={e => setPin(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-14 rounded-2xl text-lg font-black uppercase tracking-[1em] focus:bg-white/10 focus:border-primary/50 transition-all text-center pl-4" 
                  />
                </div>
              </div>

              {error && (
                <div className="py-3 px-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-black uppercase tracking-widest text-center animate-in shake duration-300">
                  Access Denied • Invalid Credentials
                </div>
              )}

              <Button 
                type="submit" 
                className={`w-full h-16 text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl transition-all ${error ? 'bg-red-500 text-white' : 'bg-primary text-white hover:bg-primary/80 shadow-[0_20px_48px_rgba(124,58,237,0.3)]'}`}
              >
                {error ? 'Invalid' : 'Authorize Access'}
              </Button>
            </form>
          </Card>
        </div>
      </main>
    )
  }

  const stats = [
    { label: 'GMV del Mes', value: '$842,500', icon: <DollarSign size={20} />, growth: '+12.5%', trend: 'up' },
    { label: 'Revenue Mensual', value: '$101,100', icon: <BarChart3 size={20} />, growth: '+8.2%', trend: 'up' },
    { label: 'Clientes Activos', value: '1,240', icon: <Users size={20} />, growth: '+4.1%', trend: 'up' },
    { label: 'Proveedores Activos', value: '458', icon: <UserPlus size={20} />, growth: '+6.8%', trend: 'up' },
  ];

  const topServices = [
    { name: 'Plomería Integral', sales: 145, growth: 12 },
    { name: 'Electricista Certificado', sales: 122, growth: 8 },
    { name: 'Limpieza Profunda', sales: 98, growth: 15 },
    { name: 'Pintura Fachadas', sales: 85, growth: -2 },
    { name: 'Soporte Técnico', sales: 64, growth: 5 },
  ];

  const topProviders = [
    { name: 'Juan Pérez', rating: 4.9, services: 82 },
    { name: 'María Garcia', rating: 5.0, services: 75 },
    { name: 'Roberto Solis', rating: 4.8, services: 64 },
    { name: 'Lucía Méndez', rating: 4.9, services: 58 },
    { name: 'Armando Casas', rating: 4.7, services: 52 },
  ];
  return (
    <main className="min-h-screen bg-silver font-urbanist flex">
      <AdminSidebar />
      <div className="flex-1 max-w-7xl mx-auto px-8 py-12">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-[600] tracking-tight text-black-rich mb-2">Resumen de Operación</h2>
            <div className="flex items-center gap-4">
               <p className="text-gray-soft text-sm">Insights avanzados del mes de</p>
               <select className="bg-transparent border-none text-primary font-[600] text-sm focus:ring-0 cursor-pointer outline-none">
                  <option>Marzo 2026</option>
                  <option>Febrero 2026</option>
                  <option>Enero 2026</option>
                  <option>Diciembre 2025</option>
               </select>
            </div>
          </div>
          <div className="flex gap-3">
             <Link href="/admin/reporte">
                <Button variant="secondary" size="sm">Exportar Reporte</Button>
             </Link>
             <Link href="/admin/master-plan">
               <Button variant="primary" size="sm" className="gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                 Launch 2026
               </Button>
             </Link>
          </div>
        </header>

        {/* Primary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
          {stats.map((s, i) => (
            <Card key={i} variant="floating" className="flex flex-col items-start p-6 group">
              <div className="flex justify-between w-full mb-4">
                 <div className="w-8 h-8 rounded-pill bg-silver-light/50 flex items-center justify-center text-black-rich/60 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    {s.icon}
                 </div>
                 <div className="flex items-center gap-1 text-[9px] font-[600] text-primary">
                    <ArrowUpRight size={10} />
                    {s.growth}
                 </div>
              </div>
              <p className="text-[9px] font-[600] text-gray-soft uppercase tracking-wider mb-1">{s.label}</p>
              <p className="text-xl font-[600] text-black-rich tracking-tight">{s.value}</p>
            </Card>
          ))}
          {/* New Active Services Metric */}
          <Card variant="dark" className="flex flex-col items-start p-6 group">
              <div className="flex justify-between w-full mb-4">
                 <div className="w-8 h-8 rounded-pill bg-white/10 flex items-center justify-center text-primary">
                    <Zap size={16} />
                 </div>
                 <div className="flex items-center gap-1 text-[9px] font-[600] text-primary">
                    <ArrowUpRight size={10} />
                    +15.2%
                 </div>
              </div>
              <p className="text-[9px] font-[600] text-white/40 uppercase tracking-wider mb-1">Servicios Activos</p>
              <p className="text-xl font-[600] text-white tracking-tight">342</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Services Chart */}
          <Card variant="default" className="lg:col-span-2 p-8">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-lg font-[600] text-black-rich tracking-tight">Servicios con Mayor Demanda</h3>
                <Badge variant="silver">TOP 5</Badge>
             </div>
             <div className="space-y-6">
                {topServices.map((service, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm items-end">
                       <span className="font-[600] text-black-rich">{service.name}</span>
                       <span className="text-xs text-gray-soft">{service.sales} ventas · <span className={service.growth > 0 ? 'text-primary' : 'text-im-error'}>{service.growth}%</span></span>
                    </div>
                    <div className="h-2 bg-silver-light rounded-pill overflow-hidden">
                       <div 
                         className="h-full bg-primary rounded-pill transition-all duration-1000 delay-200"
                         style={{ width: `${(service.sales / topServices[0].sales) * 100}%` }}
                       />
                    </div>
                  </div>
                ))}
             </div>
          </Card>

          {/* Top Providers List */}
          <Card variant="default" className="p-8">
            <h3 className="text-lg font-[600] text-black-rich tracking-tight mb-8">Proveedores Estrella</h3>
            <div className="space-y-4">
               {topProviders.map((p, i) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-silver-light/20 rounded-md border-[0.5px] border-black/5">
                    <div className="flex items-center gap-4">
                      <Avatar name={p.name} size="sm" />
                      <div>
                        <p className="text-sm font-[600] text-black-rich">{p.name}</p>
                        <p className="text-[10px] text-gray-soft">{p.services} servicios completados</p>
                      </div>
                    </div>
                    <Badge variant="success">★ {p.rating}</Badge>
                 </div>
               ))}
            </div>
            <Button variant="secondary" size="sm" className="w-full mt-6">Ver todos los proveedores</Button>
          </Card>

          {/* Active Disputes - Highlighted Module */}
          <Card variant="default" className="lg:col-span-3 p-8 border-none bg-[#FFF8F1] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-im-warning/5 blur-[60px] rounded-full -mr-20 -mt-20 group-hover:bg-im-warning/10 transition-colors" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-pill bg-[#FFEEDD] flex items-center justify-center text-im-warning">
                    <AlertCircle size={22} />
                  </div>
                  <h3 className="text-xl font-[600] text-black-rich">Atención: 3 Disputas Activas</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Hay transacciones que requieren mediación inmediata para garantizar la seguridad del escrow. 
                  Una de ellas está marcada como <span className="text-im-error font-bold tracking-tight">CRÍTICA</span>.
                </p>
              </div>
              <Link href="/admin/disputas">
                <Button variant="primary" className="bg-black-rich hover:bg-black text-white px-8">Gestionar Disputas</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
