# I mendly Design System — "Arcilla & Lino"
> Línea de diseño DEFINITIVA para toda la app (cliente, proveedor, admin, auth).
> Sustituye la paleta verde original y las specs v2/v3 anteriores.
> Referencias: apps editoriales de mobiliario y lifestyle — la fotografía es el diseño.

## 1. Paleta (única fuente de verdad: `globals.css` → `@theme`)

```
SUPERFICIES CÁLIDAS
  linen   #F4F0E8   fondo de toda pantalla            → bg-linen
  sand    #EAE3D8   superficies secundarias, inputs    → bg-sand
  cream   #FBF8F2   tarjetas sólidas                   → bg-cream
  white   #FFFFFF   solo dentro de vidrio / pills

TINTA
  ink     #1F1C18   texto principal, botones fuertes   → text-ink / bg-ink
  muted   #7B7267   texto secundario                   → text-muted
  faint   #ADA398   placeholders, iconos inactivos     → text-faint
  line    rgba(31,28,24,.07) bordes casi invisibles    → border-line

ACENTO — ARCILLA (el único acento de acción)
  primary       #C8663E   CTAs, links, dots activos    → bg-primary / text-primary
  primary-dark  #B0552F   hover / pressed              → bg-primary-dark
  primary-light #F6E6DD   tintes, pills suaves         → bg-primary-light
  clay-deep     #8A4529   tarjeta sombra apilada, texto sobre claro → bg-clay-deep

SECUNDARIO — SALVIA (verificado / éxito / naturaleza)
  sage        #7F9A78                                    → text-sage / bg-sage
  sage-light  #E9EFE5                                    → bg-sage-light

SEMÁNTICOS (con moderación)
  warning #C98A2B (ocre)   error #B8402E (teja)

GRADIENTE HERO (clase .v2-hero-grad, ahora arcilla):
  linear-gradient(150deg, #D98A66 0%, #C8663E 45%, #8A4529 100%)
```

Regla: **un solo acento de acción (arcilla)**. La salvia comunica estado
(verificado, completado, garantía), nunca acción. Nada de slate/gray de Tailwind.

## 2. Tipografía — Urbanist (300–800)

- Display editorial: 600, tracking -0.03em, 34–56px. Sentence case SIEMPRE.
- Montos: 700 tabular-nums, protagonistas (24–52px).
- Eyebrows: 700, 10–11px, uppercase, tracking 0.18em, color primary o muted.
- Body: 500, 14–15px. Captions 12–13px muted.
- PROHIBIDO el estilo antiguo: `font-black uppercase tracking-widest` en títulos.

## 3. Materiales

- **Fotografía** a sangre completa con overlay `from-ink/70` desde abajo.
  Banco en `/public/assets`. Cada pantalla principal abre con foto o con
  un titular editorial grande; nunca con un bloque plano de color.
- **Vidrio** `.glass` (blanco 74% + blur) para TODA tarjeta que vaya sobre foto.
  `.glass-dark` para pills sobre fotos claras.
- **Tarjetas** `bg-cream rounded-[1.75rem]` con `.v2-shadow-soft`; grandes
  `rounded-[2.25rem]`–`[2.75rem]`. Sin bordes visibles.
- **Apilado**: tarjeta con otra detrás desplazada en `bg-clay-deep`.
- **Foto que se sale**: margen negativo + `.v3-lift-shadow`.
- **Hotspots**: pills `.glass` con dot `bg-primary` + `.v3-pulse-ring`.
- **Tabs**: texto subrayado con barra `bg-primary` 3px (scale-x animado).
  Chips (`Chip`) solo para selección en formularios.
- **Botones**: primario pill `bg-ink text-white` h-14 700 13px (el negro es
  el botón fuerte, como en las referencias); acento `bg-primary` para el CTA
  principal de la pantalla; secundario `.glass` o `bg-cream`. Todo con `.v2-press`.
- **Inputs**: `bg-sand rounded-[1.25rem]` sin borde, `focus:ring-2 ring-primary/30`.
- **Nav cliente**: pill `.glass` flotante con FAB `bg-primary`.
- **Shell proveedor/admin (desktop)**: sidebar `bg-cream` con separador `border-line`,
  ítem activo `bg-primary-light text-primary` con dot; header de contenido con
  titular editorial y, cuando aplique, foto de cabecera con vidrio.

## 4. Motion (clases en globals.css)

- Entrada de texto/hero: `.v3-blur-in` (+ `style={{animationDelay}}` escalonado).
- Entrada de listas/tarjetas: `.v2-rise` + `.v2-d1..d8`.
- Táctil: `.v2-press` en todo lo clickeable; `.v2-float` en tarjetas desktop.
- Fotos: `.v3-photo` (zoom lento en hover). Hotspots: `.v3-pop`.
- Paneles expandibles: `.v3-panel`. Loading: `.v2-shimmer`.
- Splash: `.v3-kenburns` + `.v3-mark-in` + `.v3-track-in` + `.v3-exit-up`,
  una vez por sesión, nunca más de ~2.7s en total.
- `prefers-reduced-motion` respetado por todas las clases.

## 5. Componentes compartidos

- `src/components/client/ui.tsx`: `Chip`, `SectionHead`, `IconTile`, `RatingPill`,
  `SegmentBar`, `Reveal`.
- `src/components/client/ClientNav.tsx`: nav flotante del cliente.
- `packages/shared/src/Logo.tsx`: isotipo en arcilla (o blanco en `variant="dark"`).

## 6. Reglas duras para cualquier pantalla (todos los portales)

1. Fondo `bg-linen`. Nunca blanco pleno, nunca `slate-*`, nunca `#F8F9FB`.
2. Solo colores nombrados del tema (`ink`, `muted`, `faint`, `primary`, `sage`…).
   Nada de hex sueltos en JSX.
3. NO tocar lógica: fetches, handlers, estados, rutas, Suspense. Solo JSX/clases.
4. Cada pantalla entra animada (blur-in en cabecera, rise escalonado en listas).
5. Estados vacíos: ícono en squircle `bg-primary-light text-primary`, título 600,
   texto muted, CTA pill. Nada de bordes punteados.
6. Espacio generoso: `px-6` móvil, secciones separadas por aire, no por líneas.
