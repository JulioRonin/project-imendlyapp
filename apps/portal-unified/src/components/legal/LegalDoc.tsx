// Maquetación editorial de los documentos legales (Nocturne Atelier).
// Componentes de servidor: sin estado, se pueden imprimir y enlazar por ancla.

import Link from 'next/link';
import { Logo } from '@i-mendly/shared/Logo';
import { COMPANY, LEGAL_LINKS, LEGAL_UPDATED, LEGAL_VERSION } from '@/lib/legal';

const NAV = [
  { href: LEGAL_LINKS.terminos, label: 'Términos para clientes' },
  { href: LEGAL_LINKS.profesionales, label: 'Términos para profesionales' },
  { href: LEGAL_LINKS.privacidad, label: 'Aviso de privacidad' },
  { href: LEGAL_LINKS.garantia, label: 'Garantía I mendly' },
];

export function LegalDoc({
  current,
  eyebrow,
  title,
  intro,
  children,
}: {
  current: string;
  eyebrow: string;
  title: string;
  intro: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-linen text-ink">
      <header className="sticky top-0 z-40 bg-linen/85 backdrop-blur-xl border-b border-line">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/cliente" aria-label="Ir a I mendly"><Logo size={26} /></Link>
          <Link href="/cliente" className="text-[12.5px] font-semibold text-muted hover:text-ink">Volver a la app</Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-20">
        <nav aria-label="Documentos legales" className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
          {NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={item.href === current ? 'page' : undefined}
              className={`shrink-0 h-10 px-4 rounded-full text-[12.5px] font-semibold flex items-center transition-colors ${
                item.href === current ? 'bg-ink text-white' : 'bg-cream text-muted hover:text-ink'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <p className="mt-10 text-[10px] font-bold uppercase tracking-[0.18em] text-primary-deep">{eyebrow}</p>
        <h1 className="mt-2 text-[34px] sm:text-[44px] font-semibold tracking-tight leading-[1.05]">{title}</h1>
        <p className="mt-3 text-[12.5px] font-semibold text-muted tabular-nums">
          Versión {LEGAL_VERSION} · Última actualización: {LEGAL_UPDATED}
        </p>
        <div className="mt-6 text-[15px] leading-relaxed font-medium text-ink/80 space-y-3">{intro}</div>

        <article className="mt-10 space-y-4">{children}</article>

        <footer className="mt-14 pt-8 border-t border-line text-[12.5px] font-medium text-muted space-y-1">
          <p>{COMPANY.legalName} · {COMPANY.address}</p>
          <p>
            Privacidad: <a className="underline" href={`mailto:${COMPANY.privacyEmail}`}>{COMPANY.privacyEmail}</a> · Soporte:{' '}
            <a className="underline" href={`mailto:${COMPANY.supportEmail}`}>{COMPANY.supportEmail}</a>
          </p>
        </footer>
      </div>
    </main>
  );
}

export function Section({ id, n, title, children }: { id?: string; n: number | string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 bg-cream rounded-[1.75rem] p-6 sm:p-8">
      <h2 className="flex items-baseline gap-3 text-[19px] sm:text-[21px] font-semibold tracking-tight">
        <span className="text-[12px] font-bold text-primary-deep tabular-nums">{String(n).padStart(2, '0')}</span>
        {title}
      </h2>
      <div className="mt-4 text-[14.5px] leading-relaxed font-medium text-ink/80 space-y-3 [&_strong]:text-ink [&_strong]:font-semibold [&_a]:underline [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:list-disc [&_ol]:space-y-2 [&_ol]:pl-5 [&_ol]:list-decimal">
        {children}
      </div>
    </section>
  );
}

export function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-lavender-light rounded-[1.5rem] p-5 text-[14px] leading-relaxed font-medium text-ink/85">{children}</div>
  );
}
