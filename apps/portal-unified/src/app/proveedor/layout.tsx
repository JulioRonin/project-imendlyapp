import type { Metadata } from 'next';
import { ProviderSidebar } from './components/Sidebar';
import { ProviderGuard } from '@/components/provider/ProviderGuard';

export const metadata: Metadata = {
  title: 'Profesionales · I mendly',
  description: 'Portal de profesionales certificados I mendly',
};

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Solo profesionales certificados entran al portal (ver ProviderGuard);
  // el login y el onboarding quedan abiertos para poder postularse.
  return (
    <div className="flex min-h-screen bg-linen">
      <ProviderGuard>
        <ProviderSidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {children}
        </div>
      </ProviderGuard>
    </div>
  );
}
