# I mendly Design System — "Nocturne Atelier"
> Línea de diseño DEFINITIVA para toda la app (cliente, proveedor, admin, auth).
> Paleta propuesta por Manus (ver `nocturne-atelier.md`), cableada aquí como tokens.
> Referencias: apps editoriales de mobiliario y lifestyle — la fotografía es el diseño.

## 1. Paleta (única fuente de verdad: `globals.css` → `@theme`)

```
SUPERFICIES
  linen (Warm Cloud)  #FAF8F4   fondo principal claro           → bg-linen
  sand  (Warm Sand)   #F1EEE8   secciones alternas, inputs      → bg-sand
  cream               #FFFFFF   tarjetas sólidas sobre claro    → bg-cream
  ink   (Ink Night)   #111111   nav, modales, hero oscuro, CTA fuerte → bg-ink
  ink-900 (Soft Black)#191919   tarjetas oscuras                → bg-ink-900
  ink-800 (Graphite)  #262626   bordes/campos sobre oscuro      → bg-ink-800

TEXTO
  text-ink   #111111 · text-muted (Stone) #6F6B66 · text-faint #A39E97
  on-dark (Moon) #F8F5F0 sobre superficies oscuras            → text-on-dark
  line rgba(17,17,17,.07) bordes casi invisibles               → border-line

ACENTO DE ACCIÓN — ATELIER PEACH
  primary        #FFAA78   CTA primario: bg-primary + TEXTO INK (nunca blanco)
  primary-light  #FFD0B4   hover, chips, tintes                → bg-primary-light
  primary-dark   #E98C5A   pressed                             → bg-primary-dark
  primary-deep   #C26A38   peach LEGIBLE para texto/íconos     → text-primary-deep
  ⚠ El peach nunca va como texto pequeño sobre claro: usa text-primary-deep.

FIRMA DE MARCA — ELECTRIC LAVENDER
  lavender       #BBA7F6   nav activa, filtro seleccionado, recomendaciones → bg-lavender
  lavender-light #E6DFFF   fondos de insight/onboarding        → bg-lavender-light
  lavender-deep  #3D315B   tarjeta sombra apilada, cierre de gradiente oscuro → bg-clay-deep

CONFIANZA — VERIFIED MINT (solo semántico)
  mint #3CBFA1 · mint-light #DDF5EE · mint-deep #1F8A72 (texto)
  alias: sage / sage-light apuntan a mint.

EMOCIÓN — SIGNAL ROSE (escaso)
  rose #F486A1: favoritos, incidencias, campañas              → bg-rose / text-rose

SEMÁNTICOS: warning #B8641F · error #D0466B (texto legible; el rose es el fondo suave)

GRADIENTES
  .v2-hero-grad     Atelier Glow     135deg #FFAA78 → #F486A1 → #BBA7F6  (hero/bienvenida)
  .v3-night-grad    Night Concierge  145deg #111111 → #262626 → #3D315B  (nav, pago protegido)
  .v3-verified-grad Verified Horizon 120deg #3CBFA1 → #BBA7F6            (logros, muy puntual)
```

Reglas: **peach = acción, lavanda = marca/estado activo, mint = confianza, rose = emoción.**
El negro editorial (ink) es el botón fuerte y el fondo de los momentos de alta emoción
(entrada, garantía, pago protegido); la contratación vuelve a superficies claras.
Nada de slate/gray de Tailwind.

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
