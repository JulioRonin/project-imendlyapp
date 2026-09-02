"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from '@i-mendly/shared/Logo';
import {
  BarChart3,
  AlertCircle,
  UserPlus,
  Users,
  TrendingUp,
  Zap,
  Settings,
  LogOut,
  Newspaper
} from 'lucide-react';

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    router.push('/role-selection');
  };

  const navItems = [
    { label: 'Dashboard', icon: <BarChart3 size={18} />, href: '/admin' },
    { label: 'Tablero', icon: <Newspaper size={18} />, href: '/admin/tablero' },
    { label: 'Disputas', icon: <AlertCircle size={18} />, href: '/admin/disputas' },
    { label: 'Onboarding', icon: <UserPlus size={18} />, href: '/admin/proveedores/onboarding' },
    { label: 'Profesionales', icon: <Users size={18} />, href: '/admin/professionals' },
    { label: 'Finanzas', icon: <TrendingUp size={18} />, href: '/admin/finanzas' },
    { label: 'Master Plan', icon: <Zap size={18} />, href: '/admin/master-plan' },
    { label: 'Configuración', icon: <Settings size={18} />, href: '/admin/configuraciones' },
  ];

  return (
    <aside className="w-64 shrink-0 sticky top-0 h-screen bg-cream border-r border-line flex flex-col p-5 z-50">
      <div className="px-3 pt-2 pb-8">
        <Logo size={30} />
        <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-faint">Panel de operación</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item, i) => {
          // Check if exactly matching or if it's a sub-path (e.g., /admin/professionals/new)
          const isActive = item.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(item.href);

          return (
            <Link
              key={i}
              href={item.href}
              className={`flex items-center gap-3 h-11 px-4 rounded-[1rem] text-[13px] font-semibold transition-colors duration-300 v2-press ${
                isActive
                  ? 'bg-primary-light text-primary'
                  : 'text-muted hover:text-ink hover:bg-sand/60'
              }`}
            >
              <span className={isActive ? 'text-primary' : 'text-faint'}>{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 mt-4 border-t border-line">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 h-11 px-4 rounded-[1rem] text-[13px] font-semibold text-error hover:bg-error/5 transition-colors v2-press"
        >
          <LogOut size={17} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
