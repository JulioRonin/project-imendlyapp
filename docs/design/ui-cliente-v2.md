# UI Cliente — "Lino & Esmeralda" (v3, editorial) sobre base "Esmeralda Aire" (v2)
> Spec de rediseño del portal cliente. Fuente de verdad para todas las pantallas.
> Se conserva ÚNICAMENTE: verde de marca (#3DB87A) y tipografía Urbanist.
> Todo lo demás (fondos, tarjetas, sombras, radios, motion, navegación) es nuevo.

## 0. Capa v3 — la fotografía ES el diseño (vigente, prevalece sobre v2)

Referencias: apps editoriales de mobiliario/lifestyle. Reglas que se suman a v2:

```
PALETA CÁLIDA (reemplaza los neutros fríos de v2)
  lino #F4F1EA (fondo)   arena #EBE6DC   crema #FBF9F4 (tarjetas)
  tinta #1B1A17   muted #7A7468   faint #ACA598   tinte verde #E7F2E9
  verde #3DB87A (único acento) · verde profundo #1E7A4E (texto sobre claro / tarjeta sombra)

VIDRIO   clase `.glass` (blanco 74% + blur 24px + borde blanco) y `.glass-dark`.
         Toda tarjeta que vaya SOBRE una foto es de vidrio, nunca blanca sólida.
FOTOS    Banco en /public/assets. Siempre a sangre completa con overlay
         `from-[#1B1A17]/70` desde abajo. Hero fotográfico en cada pantalla principal.
         Fotos que se SALEN de la tarjeta: margen negativo + `.v3-lift-shadow`.
APILADO  Tarjeta con otra detrás desplazada (verde profundo) = patrón "stack".
HOTSPOTS Pills de vidrio con dot verde pulsante (`.v3-pulse-ring`) sobre la foto,
         entrada `.v3-pop` escalonada.
TABS     Texto subrayado (barra verde 3px animada con scale-x), NO chips, para
         filtros principales. Los chips quedan para selección en formularios.
MOSAICO  Grid tipo masonry con `columns-2 md:columns-4`, alturas alternadas.
MOTION   `.v3-blur-in` (desenfoque → nítido) para entradas de texto/hero;
         `.v3-photo` zoom lento en hover; `.v3-panel` expansión de paneles;
         splash: `.v3-kenburns` + `.v3-mark-in` + `.v3-track-in` + `.v3-exit-up`.
SPLASH   Una vez por sesión (sessionStorage), 1.9s + salida 0.85s. Nunca bloquear más.
```

## 1. Dirección

Referencias: apps fintech/booking premium — tarjetas image-forward con esquinas
muy redondeadas, hero de color con saludo personal, chips de filtro, nav
flotante con botón central, tarjetas que se empalman, barras de progreso
segmentadas, MUCHO aire. Sensación: fluida, táctil, moderna, profesional.

## 2. Tokens (ya definidos en `globals.css`, prefijo `v2`)

```
FONDOS      --v2-ground: #F3F4F1 (porcelana con sesgo verde — fondo de TODAS las pantallas)
            --v2-card: #FFFFFF   --v2-card-soft: #FAFBF8
TINTA       --v2-ink: #151714    --v2-muted: #70756E    --v2-faint: #A8ADA6
VERDE       #3DB87A (primario) · #2A9460 (hover) · #E9F7EF (tinte suave)
HERO        gradiente verde: linear-gradient(150deg,#43C688,#2FA36B 45%,#1E7A4E)
            (clase util: .v2-hero-grad)
TARJETA INK #151714 sólido con glow verde blur (banners de énfasis)
LÍNEAS      rgba(21,23,20,.06) — bordes casi invisibles
RADIOS      tarjetas 28px (rounded-[1.75rem]) · grandes 36-44px (rounded-[2.75rem])
            · pills 999
SOMBRAS     .v2-shadow-soft  0 2px 10px rgba(21,23,20,.04)
            .v2-shadow-lift  0 12px 32px -16px rgba(21,23,20,.12)
            .v2-shadow-float 0 24px 48px -20px rgba(21,23,20,.16)
```

## 3. Tipografía (Urbanist, pesos cargados 300–800)

- Display (saludos, montos): 600–700, tracking -0.03em, tamaños grandes (28–44px)
- Números de dinero: 700, `tabular-nums`
- Labels/eyebrows: 700, 10–11px, uppercase, tracking 0.18em, color muted/faint
- Body: 500, 14–15px
- PROHIBIDO el patrón viejo: `font-black uppercase` en títulos largos.
  Los títulos van en sentence case, solo los eyebrows en uppercase.

## 4. Motion (clases en globals.css)

- Entrada: `.v2-rise` (fade + translateY 18px, 700ms, bezier(.22,1,.36,1))
  con delays `.v2-d1` … `.v2-d8` para stagger de secciones/tarjetas.
- Aparición de tarjeta: `.v2-scale` (fade + scale .94→1)
- Táctil: `.v2-press` en TODO elemento clickeable grande (scale .965 al presionar)
- Hover: `.v2-float` (translateY -4px + sombra float) en tarjetas de desktop
- Skeleton: `.v2-shimmer`
- Carruseles: `overflow-x-auto snap-x snap-mandatory .no-scrollbar`, tarjetas
  `snap-start shrink-0` con la siguiente asomándose (peek) — así se logra el
  efecto de tarjetas apiladas de la referencia.
- `prefers-reduced-motion` ya está respetado en las clases; no agregar JS de animación.

## 5. Componentes compartidos (`src/components/client/`)

- `ClientNav.tsx` — nav inferior flotante: pill blanca con blur y sombra float,
  4 iconos (Inicio /cliente · Órdenes /cliente/orders · Proyectos /cliente/proyectos
  · Perfil /cliente/profile) + FAB verde central (+) → /cliente/proyectos/nuevo.
  Ícono activo: verde con dot debajo. Móntalo en TODA pantalla cliente y da
  `pb-36` al main para que no tape contenido.
- `ui.tsx` — exporta:
  - `Chip` {label, active, onClick} — pill; activa = fondo ink texto blanco;
    inactiva = blanca con borde línea. (Patrón de la referencia.)
  - `SectionHead` {title, action?, href?} — título 600 20px + link verde a la derecha.
  - `IconTile` {icon, label, onClick} — tile blanca rounded-[1.75rem] con el ícono
    dentro de un squircle de tinte verde suave; para grids de categorías.
  - `RatingPill` {value} — pill blanca compacta con ★ y número 700.
  - `SegmentBar` {total, done} — barra de progreso segmentada (referencia
    fintech): segmentos redondeados, hechos en verde, pendientes en línea.
  - `Reveal` {children, delay?} — wrapper con IntersectionObserver que aplica
    `.v2-rise` al entrar al viewport (para secciones bajo el fold).

## 6. Patrones firma (usar en todas las pantallas)

1. **Hero de color**: bloque con `.v2-hero-grad`, texto blanco, esquinas
   inferiores rounded-b-[2.75rem] (o tarjeta completa rounded-[2.75rem] con
   margen en desktop). Contiene saludo/título de pantalla + buscador o resumen.
2. **Empalme**: el primer contenido bajo un hero SIEMPRE se traslapa con
   `-mt-8`/`-mt-10` + z-10 (chips, tarjeta de resumen, buscador).
3. **Tarjeta de proveedor image-forward** (referencia beauty): imagen a sangre
   completa (avatar_url o, si no hay, gradiente ink con iniciales grandes),
   overlay `bg-gradient-to-t from-black/70 via-black/10 to-transparent`,
   nombre 600 blanco + categoría caption abajo, `RatingPill` y CTA pill blanca
   ("Reservar"/"Ver perfil") sobre la imagen.
4. **Banner ink**: tarjeta #151714 con glow verde (`div` absoluto blur-3xl
   bg-primary/20) para CTAs de énfasis (tablero, garantía).
5. **Header de pantalla interna**: flecha atrás en círculo blanco v2-shadow-soft
   + título 600 (sentence case) + eyebrow arriba en verde. Sticky con
   `bg-[#F3F4F1]/85 backdrop-blur-xl`.
6. **Estados vacíos**: ilustración = ícono lucide grande dentro de squircle de
   tinte verde, título 600, texto muted, CTA pill verde. Nada de bordes punteados.
7. **Barras segmentadas** en tarjetas de órdenes (estado del ciclo) y pasos de wizard.

## 7. Reglas duras para cualquier pantalla

- NO tocar lógica: fetches de Supabase, handlers, estados y rutas quedan
  idénticos. Solo cambia el JSX/estilos. Conservar los wrappers de Suspense.
- Fondo de página: `bg-[#F3F4F1]`, nunca blanco pleno ni slate-50.
- Montar `<ClientNav />` y `pb-36`. Eliminar imports muertos del viejo BottomNav.
- Solo existe UN color de acento: el verde. Semánticos: ámbar #B45309 (aviso),
  rojo #DC2626 (error) — con moderación.
- Botón primario: pill verde (rounded-full) h-14, texto blanco 700 13px
  sentence case, sombra shadow-primary/25, `.v2-press`.
- Botón secundario: pill blanca borde línea, texto ink 600.
- Inputs: fondo blanco (sobre ground) o #FAFBF8, rounded-[1.25rem], sin borde,
  focus ring-2 ring-primary/30, texto 600.
- Espaciado generoso: px-6 móvil, secciones separadas por espacio, no por líneas.
- `max-w-md mx-auto` para flujos móviles (wizard/checkout);
  `max-w-7xl` para home/listados con grid responsivo en desktop.
- Cada pantalla entra con stagger: hero `.v2-rise`, secciones siguientes
  `.v2-rise .v2-d2/.v2-d3` o `<Reveal>`.
```
