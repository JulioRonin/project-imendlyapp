"use client";

import type { ReactNode } from 'react';
import { Check } from 'lucide-react';

/**
 * Casilla de consentimiento. Nunca viene marcada por defecto: el
 * consentimiento debe ser una acción expresa de la persona.
 */
export function LegalConsent({
  checked,
  onChange,
  children,
  tone = 'default',
  id,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  children: ReactNode;
  tone?: 'default' | 'sensitive';
  id: string;
}) {
  return (
    <label
      htmlFor={id}
      className={`flex items-start gap-3.5 p-4 rounded-[1.25rem] cursor-pointer transition-colors ${
        tone === 'sensitive' ? 'bg-lavender-light/70' : 'bg-sand/70'
      } ${checked ? 'ring-1 ring-ink/10' : ''}`}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={`mt-0.5 w-6 h-6 shrink-0 rounded-[0.5rem] flex items-center justify-center transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-lavender ${
          checked ? 'bg-ink text-white' : 'bg-cream border border-line'
        }`}
      >
        {checked && <Check size={14} strokeWidth={3} />}
      </span>
      <span className="text-[12.5px] leading-relaxed font-medium text-muted [&_a]:font-semibold [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-2">
        {children}
      </span>
    </label>
  );
}
