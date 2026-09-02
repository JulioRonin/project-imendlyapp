"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, ClipboardList, Newspaper, User, Plus } from 'lucide-react';

const ITEMS = [
  { href: '/cliente', icon: Home, label: 'Inicio', exact: true },
  // 'ordenes' cubre la ruta de detalle /cliente/ordenes/[id]
  { href: '/cliente/orders', icon: ClipboardList, label: 'Órdenes', also: '/cliente/ordenes' },
  { href: '/cliente/proyectos', icon: Newspaper, label: 'Proyectos' },
  { href: '/cliente/profile', icon: User, label: 'Perfil' },
] as { href: string; icon: typeof Home; label: string; exact?: boolean; also?: string }[];

/** Nav inferior flotante del portal cliente — pill de vidrio con FAB central. */
export function ClientNav() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (item: (typeof ITEMS)[number]) =>
    item.exact
      ? pathname === item.href
      : pathname.startsWith(item.href) || (item.also ? pathname.startsWith(item.also) : false);

  const left = ITEMS.slice(0, 2);
  const right = ITEMS.slice(2);

  const renderItem = (item: (typeof ITEMS)[number]) => {
    const active = isActive(item);
    return (
      <Link
        key={item.href}
        href={item.href}
        aria-label={item.label}
        className="relative flex flex-col items-center justify-center w-14 h-14 v2-press"
      >
        <item.icon
          size={22}
          strokeWidth={active ? 2.4 : 2}
          className={`transition-colors duration-300 ${active ? 'text-[#1F1C18]' : 'text-[#ADA398]'}`}
        />
        <span
          className={`absolute bottom-2 w-1.5 h-1.5 rounded-full bg-primary transition-all duration-300 ${active ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
        />
      </Link>
    );
  };

  return (
    <nav className="fixed bottom-5 inset-x-0 z-[70] flex justify-center px-6 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-1 glass rounded-full px-3 py-1.5">
        {left.map(renderItem)}
        <button
          onClick={() => router.push('/cliente/proyectos/nuevo')}
          aria-label="Publicar proyecto"
          className="mx-1 w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 v2-press hover:bg-primary-dark transition-colors"
        >
          <Plus size={24} strokeWidth={2.5} />
        </button>
        {right.map(renderItem)}
      </div>
    </nav>
  );
}
