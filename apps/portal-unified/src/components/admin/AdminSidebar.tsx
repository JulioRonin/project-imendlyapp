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
  LogOut
} from 'lucide-react';

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    router.push('/role-selection');
  };

  const navItems = [
    { label: 'Dashboard', icon: <BarChart3 size={18} />, href: '/admin' },
    { label: 'Disputas', icon: <AlertCircle size={18} />, href: '/admin/disputas' },
    { label: 'Onboarding', icon: <UserPlus size={18} />, href: '/admin/proveedores/onboarding' },
    { label: 'Profesionales', icon: <Users size={18} />, href: '/admin/professionals' },
    { label: 'Finanzas', icon: <TrendingUp size={18} />, href: '/admin/finanzas' },
    { label: 'Master Plan', icon: <Zap size={18} />, href: '/admin/master-plan' },
    { label: 'Configuración', icon: <Settings size={18} />, href: '/admin/configuraciones' },
  ];

  return (
    <aside className="w-64 bg-black-rich text-white flex flex-col sticky top-0 h-screen p-6 shrink-0 z-50">
      <div className="mb-12">
        <Logo size={32} variant="dark" />
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map((item, i) => {
          // Check if exactly matching or if it's a sub-path (e.g., /admin/professionals/new)
          const isActive = item.href === '/admin' 
            ? pathname === '/admin' 
            : pathname.startsWith(item.href);

          return (
            <Link key={i} href={item.href}>
              <div className={`
                flex items-center gap-3 px-4 py-3 rounded-pill transition-all
                ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20 font-semibold' : 'text-white/50 hover:text-white hover:bg-white/5'}
              `}>
                {item.icon}
                <span className="text-sm font-[500]">{item.label}</span>
              </div>
            </Link>
          );
        })}
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
  );
}
