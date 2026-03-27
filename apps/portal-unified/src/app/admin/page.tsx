"use client";

import { Logo } from '@i-mendly/shared/Logo';
import { Card } from '@i-mendly/shared/components/Card';
import { Badge } from '@i-mendly/shared/components/Badge';
import { Button } from '@i-mendly/shared/components/Button';
import { Avatar } from '@i-mendly/shared/components/Avatar';

import { MOCK_STATS } from '@i-mendly/shared/constants/mocks';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  LogOut
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  
  const handleLogout = () => {
    router.push('/role-selection');
  };

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

  const navItems = [
    { label: 'Dashboard', icon: <BarChart3 size={18} />, href: '/admin', active: true },
    { label: 'Disputas', icon: <AlertCircle size={18} />, href: '/admin/disputas' },
    { label: 'Onboarding', icon: <UserPlus size={18} />, href: '/admin/proveedores/onboarding' },
    { label: 'Finanzas', icon: <TrendingUp size={18} />, href: '/admin/finanzas' },
    { label: 'Master Plan', icon: <Zap size={18} />, href: '/admin/master-plan' },
    { label: 'Configuración', icon: <Settings size={18} />, href: '/admin/configuraciones' },
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
