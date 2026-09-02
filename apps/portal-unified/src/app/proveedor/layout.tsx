import type { Metadata } from 'next';
import { ProviderSidebar } from './components/Sidebar';

export const metadata: Metadata = {
  title: 'Portal de Proveedores - I Mendly',
  description: 'Panel de control para proveedores de servicios I Mendly',
};

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-linen">
      <ProviderSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
