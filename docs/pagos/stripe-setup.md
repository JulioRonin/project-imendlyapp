# Cobros con Stripe: cómo funcionan y cómo activarlos

## Cómo se mueve el dinero

1. **El cliente paga a I mendly** dentro de la app: tarjeta, OXXO o SPEI.
   - Reserva directa: paga el total al reservar.
   - Proyecto del tablero: paga el anticipo al aceptar la oferta y el saldo al confirmar la entrega.
2. **I mendly retiene el dinero** en su saldo de Stripe.
3. **El profesional recibe su parte por Stripe Connect** en su cuenta Express:
   - adelanto para materiales al iniciar el trabajo, si la oferta tenía anticipo;
   - el resto 24 h después de que el cliente confirma la entrega.
4. La comisión, su IVA y la tarifa de servicio se quedan en I mendly.

Los números viven en `apps/portal-unified/src/lib/pricing.ts`. Las páginas legales los leen de ahí.

Cada orden guarda su precio, comisión y versión del plan al crearse. Cambiar el plan no altera órdenes existentes.

## Qué hacer en Stripe (una sola vez)

1. Crear la cuenta de Stripe de la empresa en México y activarla con los datos fiscales.
2. **Connect:** activar Connect como plataforma con cuentas **Express** en México.
3. **Métodos de pago:** en Configuración, activar Tarjetas, OXXO y Transferencia bancaria (SPEI).
   La app usa métodos automáticos: lo que actives aparece solo en el pago.
4. **Webhook:** crear un endpoint con esta URL:

   ```
   https://TU-DOMINIO/api/stripe/webhook
   ```

   Eventos de la cuenta: `payment_intent.succeeded`, `payment_intent.processing`, `payment_intent.payment_failed`,
   `payment_intent.canceled`, `charge.refunded`, `charge.dispute.created`.
   Activar también "escuchar eventos de cuentas conectadas" con `account.updated`.
5. Copiar las llaves y el secreto del webhook a Vercel. Ver `apps/portal-unified/.env.example`.

## Variables en Vercel

| Variable | Dónde se usa |
|---|---|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | navegador (formulario de pago) |
| `STRIPE_SECRET_KEY` | solo servidor |
| `STRIPE_WEBHOOK_SECRET` | solo servidor |
| `SUPABASE_SERVICE_ROLE_KEY` | solo servidor; escribe pagos y estados |
| `CRON_SECRET` | protege la tarea diaria de liberación de pagos |

## Tarea programada

`apps/portal-unified/vercel.json` corre `/api/cron/pagos` una vez al día a las 16:00 UTC (9:00 o 10:00 en Ciudad Juárez, según el horario de verano).
El plan Hobby de Vercel solo permite una ejecución diaria; con Pro se puede subir a cada hora.

Si la carpeta raíz del proyecto en Vercel no es `apps/portal-unified`, mueve `vercel.json` a esa raíz.

## Pruebas antes de producción

Usa las llaves de prueba (`sk_test_…`, `pk_test_…`). Para recibir webhooks en local:

```
stripe listen --forward-to localhost:3006/api/stripe/webhook
```

Tarjeta de prueba: `4242 4242 4242 4242`, cualquier fecha futura y cualquier CVC.

## Pendientes conocidos

- Retenciones de ISR e IVA de plataformas digitales a profesionales personas físicas: definir con el contador antes de producción.
- Ajuste de precio tras una visita de valoración: hoy una oferta de rango se cobra por su monto inicial.
- Reembolsos después de liberar un adelanto: quedan marcados para revisión del equipo, no son automáticos.
