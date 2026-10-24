import { supabaseAdmin } from '@/lib/server/supabaseAdmin';
import { releaseAdvance, releaseFinal } from '@/lib/server/money';
import { PLAN } from '@/lib/pricing';

/**
 * Tarea programada (Vercel Cron). Vercel manda "Authorization: Bearer <CRON_SECRET>".
 *  1. Confirma solas las entregas sin respuesta del cliente (solo si ya pagó todo).
 *  2. Libera los pagos cuya retención de 24 h ya venció.
 *  3. Reintenta adelantos que no se pudieron enviar al iniciar.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return new Response('No autorizado', { status: 401 });
  }
  const db = supabaseAdmin();
  const now = new Date();
  const report = { autoConfirmed: 0, released: 0, advances: 0, skipped: [] as string[] };

  // 1. Auto-confirmación
  const cutoff = new Date(now.getTime() - PLAN.autoConfirmHours * 3600_000).toISOString();
  const { data: stale, error: e1 } = await db.from('orders').select('id, display_id')
    .eq('status', 'completed').is('confirmed_at', null).eq('payment_status', 'paid')
    .eq('payout_hold', false).lt('delivered_at', cutoff).limit(200);
  if (e1) return Response.json({ error: e1.message }, { status: 500 });
  for (const o of stale ?? []) {
    await db.from('orders').update({ confirmed_at: now.toISOString(), release_at: now.toISOString() }).eq('id', o.id);
    report.autoConfirmed++;
  }

  // 2. Pagos finales
  const { data: due, error: e2 } = await db.from('orders').select('id, display_id')
    .not('confirmed_at', 'is', null).lte('release_at', now.toISOString())
    .eq('payout_hold', false).neq('status', 'cancelled').limit(200);
  if (e2) return Response.json({ error: e2.message, report }, { status: 500 });
  for (const o of due ?? []) {
    try {
      const r = await releaseFinal(o.id);
      if ('released' in r) report.released++;
      else if (r.skipped !== 'Ya liberado') report.skipped.push(`${o.display_id}: ${r.skipped}`);
    } catch (err) {
      report.skipped.push(`${o.display_id}: error ${(err as Error).message}`);
    }
  }

  // 3. Adelantos pendientes
  const { data: started, error: e3 } = await db.from('orders').select('id, display_id')
    .in('status', ['in_progress', 'completed']).gt('advance_amount', 0).eq('payout_hold', false).limit(200);
  if (e3) return Response.json({ error: e3.message, report }, { status: 500 });
  for (const o of started ?? []) {
    try {
      const r = await releaseAdvance(o.id);
      if ('released' in r) report.advances++;
    } catch { /* se reintenta en la siguiente corrida */ }
  }

  return Response.json(report);
}
