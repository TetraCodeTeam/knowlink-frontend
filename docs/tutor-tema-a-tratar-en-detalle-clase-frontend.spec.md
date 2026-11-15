# Spec Frontend — Mostrar el "Tema a tratar" del alumno en el detalle de la clase

> Pasar este archivo completo a OpenCode (DeepSeek V4 Flash) parado en `TetraCodeTeam/knowlink-frontend`, rama `dev`.

## Metadata

| Campo | Valor |
|---|---|
| Tipo | Mejora (campo ya disponible, falta mostrarlo) |
| Repo | `knowlink-frontend` |
| Rama base | `dev` (crear rama de trabajo, ej. `feat/class-detail-topic`) |
| Módulo | `class-history` |
| Origen | Observación de feedback: "La descripción que ingresa el estudiante cuando hace una reserva nunca se le muestra al tutor. Agregaría en el detalle de mis clases eso." |
| Alcance | **Solo frontend.** Sin cambios de backend, API ni estado global. |
| Historias relacionadas | US-10 (reservar turno), US-52 (agenda del tutor), historial de clases |

## Diagnóstico (ya confirmado sobre el código)

- El alumno escribe el texto en el campo **"Tema a tratar"** (`topic`) de `student/booking/components/BookingCard.tsx`. Es obligatorio (`booking.schema.ts`: `z.string().trim().min(1)`).
- El backend lo guarda en `Booking.topic` (columna `TEXT`) y **ya lo devuelve** en `GET /api/v1/bookings/{id}` dentro de `BookingHistoryDetailResponse.topic`. `BookingMapper.toDetail` lo copia sin filtrar por rol, así que el tutor ya lo recibe.
- El front ya lo tipa: `BookingHistoryDetail.topic: string` (`class-history/interfaces/responses/booking-history-detail.interface.ts`).
- **El problema:** `ClassHistoryCard.tsx` nunca renderiza `detail.topic`. Por eso ningún usuario lo ve.

Conclusión: el cambio es puramente de UI en una sola card.

## Stack y reglas (no negociables)

- React + TypeScript + MUI (`sx`) + `lucide-react`. Imports con alias `@/`.
- Sin `any`. Sin `style={{}}` inline. Prettier: comillas dobles, punto y coma, `printWidth` 100, 2 espacios, trailing comma ES5.
- No llamar axios desde componentes (no hace falta: el dato ya viene en `detail`).

## Archivos a modificar

1. `src/modules/class-history/components/ClassHistoryCard.tsx`
2. `src/modules/class-history/utils/classHistory.utils.ts` (helper chico, opcional pero recomendado)
3. `test/modules/class-history/ClassHistoryCard.topic.test.tsx` (archivo nuevo)

No tocar: `useBookingDetail.ts`, `classHistory.api.ts`, `booking-history-detail.interface.ts`, nada de `student/booking`, nada del backend.

## Comportamiento requerido

### Criterios de aceptación

```gherkin
Feature: Tema a tratar visible en el detalle de la clase

  Scenario: El tutor ve el tema que escribió el alumno
    Given soy tutor y tengo una clase en "Mis clases"
    And el alumno ingresó "Repaso de diagramas de clases UML" al reservar
    When expando el detalle de la clase
    Then veo una fila "Tema a tratar" con ese texto entre comillas

  Scenario: Aplica en todas las categorías
    Given una clase en Reservadas, En curso, Completadas, Canceladas o No confirmadas
    When expando el detalle
    Then veo el "Tema a tratar"

  Scenario: Reservas sin tema (datos viejos)
    Given el detalle llega con topic vacío, solo espacios o null
    When expando el detalle
    Then no se muestra la fila "Tema a tratar" ni queda un hueco

  Scenario: Texto largo o con saltos de línea
    Given el alumno escribió un tema de varios renglones
    When el tutor expande el detalle
    Then el texto se respeta con sus saltos de línea y no rompe el layout
    And no desplaza el botón de cancelar/calificar ni el cuadro del enlace de videollamada
```

### Reglas

1. La fila va **dentro del bloque `detail`** de la card expandida, en la columna izquierda (la que tiene duración, tarifa y modalidad), **después de la fila de modalidad**. Así queda arriba del cuadro "Enlace de la videollamada para el alumno", como en el mockup.
2. Formato de la fila (mismo patrón visual que las filas hermanas: `display: flex`, `gap: "10px"`, texto `fontSize: "0.85rem"`, `color: "#333"`):
   - Ícono `BookText` de `lucide-react`, `size={16}`, `color="#666"`, `flexShrink: 0`, `mt: "2px"`.
   - Texto: etiqueta **"Tema a tratar"** en gris (`color: "#666"`) seguida del contenido entre comillas tipográficas: `“{topic}”`, con `fontWeight: 500`.
3. Visible para **ambos roles** (`TUTOR` y `STUDENT`) y en **todas las categorías**: es la misma card y el alumno ve el texto que él mismo escribió. El requerimiento es para el tutor; si el equipo quiere limitarlo, alcanza con envolver la fila en `role === "TUTOR"`.
4. Texto del alumno = contenido no confiable: renderizarlo **solo como texto** de React (nunca `dangerouslySetInnerHTML`).
5. Layout robusto: `wordBreak: "break-word"`, `whiteSpace: "pre-wrap"`, `minWidth: 0` en el contenedor de texto y `flex: 1`.
6. Si `topic` es `null`, `undefined`, `""` o solo espacios, **no renderizar la fila**.

## Implementación

### 1. `classHistory.utils.ts` — helper

Agregar junto a los otros `export function`:

```ts
export function normalizeTopic(topic: string | null | undefined): string | null {
  const trimmed = topic?.trim();
  return trimmed ? trimmed : null;
}
```

### 2. `ClassHistoryCard.tsx`

- Sumar `BookText` al import existente de `lucide-react` y `normalizeTopic` al import de `classHistory.utils`.
- Dentro del bloque que ya renderiza `detail`, justo después del `<Box>` de modalidad (el que usa `buildModalityMessage(detail)`), agregar:

```tsx
{topic && (
  <Box sx={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
    <Box sx={{ flexShrink: 0, mt: "2px" }}>
      <BookText size={16} color="#666" />
    </Box>
    <Typography
      sx={{
        fontSize: "0.85rem",
        color: "#333",
        flex: 1,
        minWidth: 0,
        wordBreak: "break-word",
        whiteSpace: "pre-wrap",
      }}
    >
      <Box component="span" sx={{ color: "#666", mr: "6px" }}>
        Tema a tratar
      </Box>
      <Box component="span" sx={{ fontWeight: 500 }}>
        {`“${topic}”`}
      </Box>
    </Typography>
  </Box>
)}
```

- Definir `topic` antes del `return` de la card, pero solo cuando `detail` exista. Opción simple: dentro del JSX de `detail`, calcular con una IIFE no es prolijo; en su lugar declarar arriba del `return`:

```ts
const topic = normalizeTopic(detail?.topic);
```

  (`detail` es `undefined` mientras carga, y el bloque que usa `topic` solo se renderiza con `detail` cargado.)

- Si Prettier o ESLint se quejan de la longitud de línea, extraer la fila a un componente local `ClassTopicRow` en el mismo archivo (o en `components/ClassTopicRow.tsx` si el equipo prefiere un archivo por componente). No crear nada en `shared/`: solo lo usa este módulo.

## Tests

Crear `test/modules/class-history/ClassHistoryCard.topic.test.tsx` siguiendo el estilo de `ClassHistoryCategory.test.tsx` (Vitest + Testing Library; mockear `@/modules/class-history/hooks/useBookingDetail` con `vi.mock`, devolviendo un `detail` completo con los campos de `BookingHistoryDetail`, como en `RateBookingFlow.test.tsx`).

Casos mínimos (expandir la card con `fireEvent.click` sobre el botón `aria-label="Expandir detalle"`):

1. Con `topic: "Repaso de UML"` y `role="TUTOR"`: aparece "Tema a tratar" y `“Repaso de UML”`.
2. Con `role="STUDENT"`: también aparece (documenta la decisión del punto 3).
3. Con `topic: ""` y con `topic: "   "`: **no** aparece "Tema a tratar".
4. Con un tema con `<b>hola</b>`: se muestra como texto literal, sin nodo `<b>`.
5. Con modalidad `VIRTUAL` y `role="TUTOR"` en categoría `RESERVED`: conviven el "Tema a tratar" y "Enlace de la videollamada para el alumno".

## Verificación

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm test -- class-history
```

(si el repo usa npm en vez de pnpm, usar el equivalente; hay ambos lockfiles).

## No hacer

- No agregar endpoints, hooks ni queries: el dato ya viene en `useBookingDetail`.
- No tocar `student/booking` ni el schema del formulario de reserva.
- No truncar con "Ver más" ni agregar estado nuevo: mostrar el texto completo.
- No cambiar el orden ni el estilo de las demás filas (duración, tarifa, modalidad).

## Nota para backend (sin trabajo requerido)

Verificado en `knowlink-backend@dev`: `BookingMapper.toDetail` ya incluye `topic` y no lo omite por rol. **No hay tarea de backend.** Única observación opcional, fuera de este spec: `CreateBookingRequest.topic` tiene `@NotBlank` pero no `@Size`, y la columna es `TEXT`, así que hoy no hay tope de largo. Si se quiere acotar (ej. 500 caracteres), debería hacerse en un spec aparte junto con el `maxLength` del campo en `BookingCard.tsx`.
