"use client";

import React, { useState } from 'react';
import { Logo } from '@i-mendly/shared/Logo';
import { Card } from '@i-mendly/shared/components/Card';
import { Button } from '@i-mendly/shared/components/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  LogOut, 
  Mail, 
  Phone,
  BarChart3,
  AlertCircle,
  UserPlus,
  TrendingUp,
  Zap,
  Globe,
  Moon,
  ChevronRight
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    // In a real app, clear sessions/tokens here
    router.push('/role-selection');
  };

  const navItems = [
    { label: 'Dashboard', icon: <BarChart3 size={18} />, href: '/admin' },
    { label: 'Disputas', icon: <AlertCircle size={18} />, href: '/admin/disputas' },
    { label: 'Onboarding', icon: <UserPlus size={18} />, href: '/admin/proveedores/onboarding' },
    { label: 'Finanzas', icon: <TrendingUp size={18} />, href: '/admin/finanzas' },
    { label: 'Master Plan', icon: <Zap size={18} />, href: '/admin/master-plan' },
    { label: 'Configuración', icon: <Settings size={18} />, href: '/admin/configuraciones', active: true },
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
        
        <div className="pt-6 border-t border-white/10">
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
      <div className="flex-1 max-w-5xl mx-auto px-8 py-12">
        <header className="mb-12">
          <h2 className="text-4xl font-[600] tracking-tight text-black-rich mb-2">Configuración</h2>
          <p className="text-gray-soft text-sm">Gestiona tu perfil, preferencias de seguridad y notificaciones.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Profile Section */}
           <div className="lg:col-span-1 space-y-8">
              <Card variant="default" className="p-8 flex flex-col items-center text-center">
                 <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 relative border-2 border-primary/20 shadow-inner">
                    <User size={48} className="text-primary" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full shadow-lg" />
                 </div>
                 <h3 className="text-xl font-[600] text-black-rich">Julio M.</h3>
                 <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary mb-6 bg-primary/5 px-4 py-1.5 rounded-pill border border-primary/10">Super Administrador</p>
                 
                 <div className="w-full space-y-4 text-left border-t border-black/5 pt-6">
                    <div className="flex items-center gap-3">
                       <Mail size={14} className="text-gray-400" />
                       <span className="text-xs text-gray-600">julio@imendly.com</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <Phone size={14} className="text-gray-400" />
                       <span className="text-xs text-gray-600">+52 (656) 123-4567</span>
                    </div>
                 </div>

                 <Button variant="secondary" size="sm" className="w-full mt-8 rounded-pill border-black/5 text-[10px] uppercase font-bold tracking-widest">
                    Editar Perfil
                 </Button>
              </Card>

              <Card variant="silver" className="p-6 border-none bg-black-rich text-white overflow-hidden relative group">
                 <div className="absolute -right-8 -top-8 w-24 h-24 bg-primary/20 blur-[40px] rounded-full group-hover:bg-primary/30 transition-all duration-700" />
                 <h4 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Shield size={14} className="text-primary" /> Seguridad
                 </h4>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px]">
                       <span className="text-white/60">2FA Activo</span>
                       <span className="text-primary font-bold">SI</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                       <span className="text-white/60">Último Acceso</span>
                       <span className="text-white">Hoy, 10:24 PM</span>
                    </div>
                 </div>
              </Card>
           </div>

           {/* Settings Details Section */}
           <div className="lg:col-span-2 space-y-8">
              <Card variant="default" className="p-10">
                 <h3 className="text-lg font-[600] text-black-rich mb-8 flex items-center gap-2">
                    <Bell size={20} className="text-primary" /> Preferencias de Sistema
                 </h3>
                 
                 <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-silver-light/30 transition-all cursor-pointer group">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-black/5">
                             <Bell size={18} className="text-gray-soft group-hover:text-primary transition-colors" />
                          </div>
                          <div>
                             <p className="text-sm font-[600] text-black-rich">Notificaciones Globales</p>
                             <p className="text-[10px] text-gray-soft">Recibir alertas de nuevas disputas y aplicantes.</p>
                          </div>
                       </div>
                       <div 
                         onClick={() => setNotifications(!notifications)}
                         className={`w-12 h-6 rounded-pill relative transition-all duration-300 shadow-inner ${notifications ? 'bg-primary' : 'bg-gray-200'}`}
                       >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${notifications ? 'right-1' : 'left-1'}`} />
                       </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-silver-light/30 transition-all cursor-pointer group">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-black/5">
                             <Moon size={18} className="text-gray-soft group-hover:text-primary transition-colors" />
                          </div>
                          <div>
                             <p className="text-sm font-[600] text-black-rich">Modo Oscuro</p>
                             <p className="text-[10px] text-gray-soft">Optimizar interfaz para entornos de poca luz.</p>
                          </div>
                       </div>
                       <div 
                         onClick={() => setDarkMode(!darkMode)}
                         className={`w-12 h-6 rounded-pill relative transition-all duration-300 shadow-inner ${darkMode ? 'bg-primary' : 'bg-gray-200'}`}
                       >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${darkMode ? 'right-1' : 'left-1'}`} />
                       </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-silver-light/30 transition-all cursor-pointer group">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-black/5">
                             <Globe size={18} className="text-gray-soft group-hover:text-primary transition-colors" />
                          </div>
                          <div>
                             <p className="text-sm font-[600] text-black-rich">Idioma del Sistema</p>
                             <p className="text-[10px] text-gray-soft">Español (México) - Latino América</p>
                          </div>
                       </div>
                       <ChevronRight size={16} className="text-gray-300" />
                    </div>
                 </div>
              </Card>

              <Card variant="default" className="p-10 border-im-error/10 bg-im-error/5">
                 <h3 className="text-lg font-[600] text-im-error mb-4 flex items-center gap-2">
                    <Shield size={20} /> Zona de Peligro
                 </h3>
                 <p className="text-xs text-im-error/60 mb-8 font-[300]">Estas acciones son irreversibles y afectarán tu acceso total al CRM.</p>
                 
                 <div className="flex gap-4">
                    <Button variant="ghost" className="rounded-pill border-im-error/20 text-im-error hover:bg-im-error hover:text-white text-[10px] uppercase font-bold tracking-widest px-8">
                       Borrar Cache de Sesión
                    </Button>
                    <Button 
                      onClick={handleLogout}
                      className="rounded-pill bg-im-error text-white hover:bg-red-700 text-[10px] uppercase font-bold tracking-widest px-8 shadow-lg shadow-im-error/20"
                    >
                       Cerrar Sesión Ahora
                    </Button>
                 </div>
              </Card>
           </div>
        </div>
      </div>
    </main>
  );
}
