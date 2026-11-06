# Frankie, la mascota de KnowLink

Frankie es la ballena franca austral de KnowLink. Acompaña al usuario en los momentos en que la app
le habla: errores, advertencias, confirmaciones, estados vacíos y mensajes de ánimo. La idea es que
sea un personaje que **comunica una emoción**, no una imagen decorativa.

Todo el sistema vive en `src/shared/frankie/`. Hay una galería de desarrollo en
`http://localhost:5173/dev/frankie` (solo existe con `npm run dev`) para ver cada expresión,
accesorio y componente sin tener que reproducir cada pantalla.

---

## Cómo está hecho

Una sola ilustración de base + una cara dibujada encima en SVG:

- `assets/frankie-base.webp` es la ilustración original **sin ojo, ceja ni comisura de la boca**
  (se borraron y se rellenaron con el color del cuerpo; los parches blancos de la cabeza, la aleta y
  las salpicaduras quedan intactos). Es lo que hace que todas las variantes sean la misma ballena.
- `frankie.moods.tsx` dibuja la cara de cada ánimo (ojo, ceja, boca, rubor) en las coordenadas de la
  imagen original (1000 × 783).
- `frankie.accessories.tsx` dibuja los detalles que cuentan la situación (confeti, lágrima, "?"…).
- `frankie.module.css` tiene los movimientos (flotar, saltar, parpadear…) y respeta
  `prefers-reduced-motion`.

Ventaja de hacerlo en SVG: la cara parpadea, el cuerpo se mueve y los accesorios se animan sin
generar un archivo por expresión.

> **Si se actualiza la ilustración original**, hay que volver a generar la base sin cara y revisar
> las coordenadas del ojo `(632, 361)` y de la boca `(666, 418)` en `frankie.moods.tsx`.

## Expresiones (`FrankieMood`)

| Ánimo | Cuándo | Accesorio por defecto |
|---|---|---|
| `happy` | Saludo, estado neutro amable, "todo en orden" | — |
| `celebrate` | Logros y acciones completadas | confeti, destellos |
| `sad` | Errores: comprensión, sin dramatismo ni culpa | lágrima |
| `worried` | Advertencias y acciones delicadas | gota de sudor |
| `surprised` | Novedades | signo de exclamación |
| `thinking` | Sin resultados, dudas, "¿estás seguro?" | signo de pregunta |
| `sleepy` | Todo tranquilo, todavía no hay nada | zzz |
| `love` | Motivación, agradecimiento | corazones |

Accesorios disponibles: `confetti`, `sparkles`, `hearts`, `question`, `exclamation`, `sweat`,
`tear`, `zzz`, `magnifier`, `hardhat`. Se pueden cambiar con la prop `accessories` (`[]` = ninguno).

## Qué usar en cada caso

| Situación | Componente |
|---|---|
| Aviso breve tras una acción | `toast` de `@/shared/lib/toast` |
| Diálogo de resultado (éxito, error, advertencia, info) | `FeedbackDialog` / `useFeedbackDialog` |
| Confirmar una acción | `AppConfirmDialog` (`warning` → piensa, `danger` → se preocupa) |
| Cabecera de un diálogo propio | `FrankieHero` |
| Lista o sección sin contenido | `FrankieEmptyState` (o `EmptyState`, `CommunityEmptyState`) |
| Fallo al cargar una sección | `FrankieErrorState` (con botón de reintentar) |
| Nota dentro de una pantalla (reemplaza `Alert`) | `FrankieCallout` |
| Ilustración principal de una pantalla (login, registro) | `FrankieIllustration` |
| Lo que Frankie dice, en un globo | `FrankieSpeechBubble` |
| 404 / error fatal de la app | `NotFoundPage` / `AppErrorBoundary` |
| Avatar chico (toasts, listas) | `<Frankie crop="face" />` |

### Toasts

Importar siempre `toast` desde `@/shared/lib/toast`, **no** desde `sonner`. El mensaje que se pasa
es el detalle; el encabezado ("¡Listo!", "Uy, algo no salió bien"…) lo pone Frankie y cambia en
cada aviso. La API es la de siempre: `toast.success("…")`, `toast.error("…", { id })`.

## Reglas de uso (para no saturar)

1. **Un Frankie por situación.** No repetirlo junto a otro en la misma pantalla. Los avisos usan
   solo su cara; los estados vacíos, el cuerpo completo.
2. **Frankie no reemplaza al texto.** Es decorativo (`aria-hidden`) salvo que se pase `label`; lo
   importante siempre está dicho con palabras.
3. **Voz cercana, en voseo, sin culpar.** En errores se hace cargo ("tuvimos un tropiezo"); en
   advertencias avisa sin asustar; en logros celebra la acción concreta.
4. **Los textos de `frankie.copy.ts`** son la fuente de los encabezados, las frases de ánimo y los
   mensajes de las páginas de error.
5. El mensaje diario de la comunidad (`FrankieDailyMessage`) aparece una vez por día y se puede
   ocultar; no agregar más mensajes que interrumpan.
