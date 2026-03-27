"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  ClipboardList, 
  Wallet, 
  MessageSquareWarning, 
  Settings,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { Logo } from '@i-mendly/shared/Logo';

const cn = (...classes: (any)[]) => classes.filter(Boolean).join(' ');

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/proveedor', icon: LayoutDashboard },
  { label: 'Agenda', href: '/proveedor/agenda', icon: Calendar },
  { label: 'Órdenes', href: '/proveedor/ordenes', icon: ClipboardList },
  { label: 'Pagos', href: '/proveedor/pagos', icon: Wallet },
  { label: 'Disputas', href: '/proveedor/disputas', icon: MessageSquareWarning },
  { label: 'Configuración', href: '/proveedor/configuracion', icon: Settings },
];

export function ProviderSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  // Do not show sidebar on certain pages (login, onboarding)
  const isHidden = pathname === '/proveedor/login' || pathname?.startsWith('/proveedor/onboarding');
  if (isHidden) return null;

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-[60] w-14 h-14 bg-brand-night text-white rounded-2xl shadow-2xl flex items-center justify-center transition-transform active:scale-95"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[50] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={cn(
        "fixed lg:sticky top-0 left-0 h-screen w-[280px] bg-white border-r border-slate-100 z-[55] flex flex-col transition-transform duration-500 lg:translate-x-0 outline-none",
        !isOpen && "-translate-x-full"
      )}>
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-2 mb-10">
            <Logo size={32} />
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group relative",
                  isActive 
                    ? "bg-primary/5 text-primary shadow-sm" 
                    : "text-slate-400 hover:text-brand-night hover:bg-slate-50"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-full" />
                )}
                <item.icon size={20} className={cn(
                    "transition-transform duration-300 group-hover:scale-110",
                    isActive ? "text-primary" : "text-slate-300 group-hover:text-brand-night"
                )} />
                <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Support & Logout Card */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 mb-2">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 text-center">¿Necesitas ayuda?</p>
            <button className="w-full py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-brand-night hover:text-white transition-all shadow-sm">
              Soporte VIP
            </button>
          </div>
          
          <button 
            onClick={() => window.location.href = '/role-selection'}
            className="w-full h-14 flex items-center justify-center gap-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300 font-urbanist text-[11px] font-black uppercase tracking-widest group border border-red-100/50"
          >
            <LogOut size={18} className="transition-transform group-hover:-translate-x-1" />
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
}
