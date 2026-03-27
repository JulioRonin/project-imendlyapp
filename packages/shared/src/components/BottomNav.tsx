"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  BarChart3, 
  MessageCircle, 
  User, 
  LogOut 
} from 'lucide-react';

interface BottomNavProps {
  onLogout?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onLogout }) => {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, href: '/cliente', label: 'Home' },
    { icon: BarChart3, href: '/cliente/orders', label: 'Órdenes' },
    { icon: MessageCircle, href: '/cliente/reports', label: 'Reportes' },
    { icon: User, href: '/cliente/profile', label: 'Perfil' },
  ];

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Default fallback
      window.location.href = '/login';
    }
  };

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-brand-night/95 backdrop-blur-xl rounded-full px-10 py-5 flex items-center gap-12 shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-50 border border-white/5">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        
        return (
          <Link 
            key={item.href} 
            href={item.href} 
            className={`transition-all transform hover:scale-110 active:scale-90 ${
              isActive ? 'text-white' : 'text-white/30 hover:text-white'
            }`}
          >
            <Icon size={22} strokeWidth={2} />
          </Link>
        );
      })}
      
      <button 
        onClick={handleLogout}
        className="text-white/30 hover:text-im-error transition-all transform hover:scale-110 active:scale-90"
      >
        <LogOut size={22} strokeWidth={2} />
      </button>
    </nav>
  );
};
