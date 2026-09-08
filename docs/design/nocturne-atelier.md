# Paleta vanguardista — i Mendly

## Concepto

La captura aporta una referencia muy clara: **oscuridad inmersiva, superficies casi negras, acentos suaves de lavanda y rosa, y una sección melocotón de alta energía**. Para i Mendly propongo convertir ese lenguaje en una identidad llamada **Nocturne Atelier**: una base nocturna de concierge, acentos cálidos para acción y señales de confianza más sobrias para que el producto siga siendo profesional y confiable.

La vanguardia no vendrá de usar muchos colores, sino de crear tensión entre una superficie negra editorial y acentos suaves, casi luminosos. El resultado debe sentirse más cercano a una marca de diseño, movilidad premium y fintech selectiva que a una app genérica de servicios.

## Paleta principal

| Token | Hex | Nombre | Uso recomendado |
|---|---:|---|---|
| `ink-950` | `#111111` | Ink Night | Fondo principal de onboarding, navegación, modales y superficies de alto contraste. |
| `ink-900` | `#191919` | Soft Black | Cards oscuras, paneles, footer y estados elevados sobre el fondo nocturno. |
| `ink-800` | `#262626` | Graphite | Bordes suaves, campos oscuros, botones secundarios y contenedores de interacción. |
| `cloud-50` | `#FAF8F4` | Warm Cloud | Fondo principal de cliente y superficies editoriales claras. |
| `cloud-100` | `#F1EEE8` | Warm Sand | Secciones alternas, skeletons, empty states y fondos de formularios. |
| `peach-500` | `#FFAA78` | Atelier Peach | CTA principal, highlights de contratación, progreso y módulos de descubrimiento. |
| `peach-300` | `#FFD0B4` | Soft Peach | Hover, fondos de chips, selección ligera y degradados. |
| `lavender-400` | `#BBA7F6` | Electric Lavender | Acento de marca, estados informativos, links seleccionados y detalles vanguardistas. |
| `lavender-200` | `#E6DFFF` | Lavender Mist | Fondo sutil para insights, onboarding y tarjetas de recomendaciones. |
| `rose-400` | `#F486A1` | Signal Rose | Favoritos, alertas suaves, interacción emocional y acentos de campañas. |
| `mint-500` | `#3CBFA1` | Verified Mint | Verificación, fondos protegidos, trabajo aceptado y estados de confianza. |
| `mint-100` | `#DDF5EE` | Mint Wash | Fondo de badges, confirmaciones y mensajes de seguridad. |
| `text-primary` | `#171717` | Carbon Text | Texto principal en superficies claras. |
| `text-secondary` | `#6F6B66` | Stone Text | Texto secundario, metadata y explicación. |
| `text-on-dark` | `#F8F5F0` | Moon Text | Texto sobre superficies oscuras. |

## Gradientes de marca

### Atelier Glow

`linear-gradient(135deg, #FFAA78 0%, #F486A1 48%, #BBA7F6 100%)`

Debe reservarse para hero, banners de campaña o momentos de bienvenida. No usarlo en cada botón: perdería exclusividad.

### Night Concierge

`linear-gradient(145deg, #111111 0%, #262626 64%, #3D315B 100%)`

Ideal para navegación, confirmaciones de pago protegido, tarjetas de proveedor curado y módulos de soporte.

### Verified Horizon

`linear-gradient(120deg, #3CBFA1 0%, #BBA7F6 100%)`

Usarlo de forma muy puntual para estados de confianza o logros del proveedor. Debe comunicar “verificado” sin parecer una alerta de sistema.

## Reglas de aplicación

La interfaz pública puede usar `Warm Cloud` como lienzo principal y reservar `Ink Night` para navegación, headers de alto impacto, paneles de garantía y CTA de soporte. La entrada y los estados de alta emoción pueden ser oscuros, siguiendo la captura; el flujo de contratación debe volver a superficies cálidas para facilitar lectura y comparación.

El color `Atelier Peach` será el CTA primario del cliente: “Publicar proyecto”, “Solicitar cotización” o “Continuar al pago protegido”. `Verified Mint` será exclusivamente semántico: proveedor verificado, anticipo protegido, trabajo aceptado y pago liberado. No debe usarse para decorar elementos sin significado de confianza.

`Electric Lavender` funcionará como firma vanguardista: navegación activa, recomendaciones I mendly, IA, filtros seleccionados y detalles de marca. `Signal Rose` debe permanecer escaso y reservarse para favoritos, incidencias y acciones que requieren atención.

## Tipografía y forma

La recomendación es mantener **Urbanist** para operación, navegación y datos, combinada con una serif editorial de contraste moderado para titulares de marca. Los titulares no deben usar mayúsculas completas de manera sistemática; la captura demuestra que una frase corta con caja normal puede sentirse más sofisticada y legible.

Los radios deben reducirse respecto al estado actual. Propongo `12px` para controles, `20px` para cards funcionales, `28px` para módulos de marca y `999px` solo para chips, badges y pills. La interfaz puede mantener una o dos superficies muy redondeadas en el hero, pero no todas las tarjetas.

Las sombras deben ser más atmosféricas y menos pesadas: `0 18px 60px rgba(17,17,17,.10)` sobre claro y bordes de `rgba(255,255,255,.10)` sobre oscuro. El lujo debe venir de espacio, contraste y fotografía, no de sombras enormes.

## Accesibilidad de color

El melocotón y el lavanda son excelentes acentos visuales, pero no deben usarse como color de texto pequeño sobre blanco. Para texto y acciones críticas se utilizará `Ink Night` o un verde oscuro derivado de `Verified Mint`. Los estados de éxito y error siempre tendrán etiqueta o icono además del color.

## Veredicto

La paleta recomendada es **Nocturne Atelier**: negro editorial para confianza y sofisticación, melocotón para acción y cercanía, lavanda para innovación, rosa para emoción controlada y menta para verificación. Es más vanguardista que la paleta verde/coral actual, pero conserva la calidez necesaria para un servicio del hogar.
