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
  LogOut,
  Briefcase,
  Newspaper,
  LifeBuoy,
  ArrowUpRight
} from 'lucide-react';
import { Logo } from '@i-mendly/shared/Logo';

const cn = (...classes: (any)[]) => classes.filter(Boolean).join(' ');

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/proveedor', icon: LayoutDashboard },
  { label: 'Tablero', href: '/proveedor/tablero', icon: Newspaper },
  { label: 'Agenda', href: '/proveedor/agenda', icon: Calendar },
  { label: 'Servicios', href: '/proveedor/servicios', icon: Briefcase },
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
      {/* Botón flotante (móvil) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        className="lg:hidden fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full bg-ink text-white flex items-center justify-center v2-shadow-float v2-press"
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Velo (móvil) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[50] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:sticky top-0 left-0 h-screen w-[272px] bg-cream border-r border-line z-[55] flex flex-col transition-transform duration-500 lg:translate-x-0 outline-none",
        !isOpen && "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="px-7 pt-8 pb-7">
          <Logo size={30} />
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3.5 h-12 px-4 rounded-[1.15rem] text-[13px] font-semibold transition-colors duration-300 v2-press",
                  isActive
                    ? "bg-primary-light text-primary"
                    : "text-muted hover:text-ink hover:bg-sand/60"
                )}
              >
                <item.icon
                  size={18}
                  strokeWidth={isActive ? 2.2 : 2}
                  className={cn("shrink-0 transition-colors", isActive ? "text-primary" : "text-faint")}
                />
                <span className="flex-1 truncate">{item.label}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
              </Link>
            );
          })}
        </nav>

        {/* Soporte + cerrar sesión */}
        <div className="p-4 space-y-2">
          <div className="bg-linen rounded-[1.5rem] p-4 flex items-center gap-3">
            <span className="w-10 h-10 shrink-0 rounded-[0.9rem] bg-primary-light text-primary flex items-center justify-center">
              <LifeBuoy size={17} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-ink leading-tight">¿Necesitas ayuda?</p>
              <p className="text-[11.5px] font-medium text-muted mt-0.5 truncate">Soporte para profesionales</p>
            </div>
            <button
              aria-label="Contactar soporte"
              className="w-9 h-9 shrink-0 rounded-full bg-ink text-white flex items-center justify-center v2-press"
            >
              <ArrowUpRight size={15} />
            </button>
          </div>

          <button
            onClick={() => window.location.href = '/role-selection'}
            className="w-full h-12 flex items-center gap-3.5 px-4 rounded-[1.15rem] text-[13px] font-semibold text-error/80 hover:text-error hover:bg-error/5 transition-colors v2-press"
          >
            <LogOut size={18} className="shrink-0" />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}
