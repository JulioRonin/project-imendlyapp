import { formatMxn } from '@/lib/pricing';

type Row = { label: string; value: number; hint?: string; strong?: boolean; muted?: boolean };

/** Desglose de precio para el cliente: sin letras chiquitas. */
export function PriceBreakdown({ subtotal, clientFee, total, deposit, balance, depositPercent }: {
  subtotal: number; clientFee: number; total: number; deposit?: number; balance?: number; depositPercent?: number;
}) {
  const rows: Row[] = [
    { label: 'Precio del profesional', value: subtotal },
    { label: 'Tarifa de servicio', value: clientFee, hint: 'Cubre el pago protegido y la Garantía I mendly', muted: true },
    { label: 'Total', value: total, strong: true },
  ];
  const split = deposit != null && balance != null && balance > 0 && deposit > 0;
  return (
    <div className="space-y-3">
      {rows.map(r => (
        <div key={r.label} className={`flex items-start justify-between gap-4 ${r.strong ? 'pt-3 border-t border-line' : ''}`}>
          <div className="min-w-0">
            <p className={`text-[14px] ${r.strong ? 'font-semibold text-ink' : 'font-medium text-muted'}`}>{r.label}</p>
            {r.hint && <p className="text-[11.5px] font-medium text-faint">{r.hint}</p>}
          </div>
          <p className={`shrink-0 tabular-nums ${r.strong ? 'text-[20px] font-semibold text-ink' : 'text-[14px] font-semibold text-ink'}`}>{formatMxn(r.value)}</p>
        </div>
      ))}
      {split && (
        <div className="mt-2 grid grid-cols-2 gap-2.5">
          <div className="p-3.5 rounded-[1.1rem] bg-sand">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">Anticipo {depositPercent ? `${depositPercent}%` : ''}</p>
            <p className="mt-1 text-[15px] font-semibold text-ink tabular-nums">{formatMxn(deposit!)}</p>
            <p className="text-[11px] font-medium text-faint">Al aceptar</p>
          </div>
          <div className="p-3.5 rounded-[1.1rem] bg-sand">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">Saldo</p>
            <p className="mt-1 text-[15px] font-semibold text-ink tabular-nums">{formatMxn(balance!)}</p>
            <p className="text-[11px] font-medium text-faint">Al confirmar la entrega</p>
          </div>
        </div>
      )}
    </div>
  );
}
