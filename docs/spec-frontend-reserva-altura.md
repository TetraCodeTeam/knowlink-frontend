# Spec Frontend — Pantalla de reserva: calendario y tarjeta de reserva no llegan hasta abajo

## Metadata

| Campo | Valor |
|---|---|
| Tipo | Corrección visual (bug de layout) |
| Repo | `knowlink-frontend` |
| Rama base | `dev` (crear rama de trabajo, ej. `fix/booking-page-height`) |
| Módulo | `student/booking` |
| Origen | Observación de feedback: "Al entrar a reservar una sesión, tanto el recuadro del calendario como el de reservar una clase no llegan hasta abajo, por lo que queda mucho espacio vacío y se ve raro." |
| Alcance | Solo frontend. Sin cambios de backend, API, hooks ni estado. |
| Story relacionada | US-10 (Reservar turno con un tutor) |

## Diagnóstico (ya confirmado sobre el código)

- `StudentLayout` renderiza `<main>` con `minHeight: calc(100vh - TOPBAR_HEIGHT)`, pero **no** es contenedor flex ni le asigna alto a sus hijos.
- `BookingClassPage` tiene un `Box` raíz sin altura definida; la fila `display: flex; alignItems: stretch` que contiene el calendario y `BookingCard` mide solo lo que mide su contenido.
- `BookingCalendar` usa `height: "100%"` y `FullCalendar` usa `height="100%"`, pero ese porcentaje no se resuelve contra un padre sin alto definido, por lo que ambos colapsan al alto del contenido.
- Resultado: las dos tarjetas terminan donde termina su contenido y debajo queda espacio vacío.

## Stack confirmado

- React + TypeScript + MUI (estructura con `sx`) + FullCalendar (`@fullcalendar/react`, `timegrid`, `interaction`)
- Imports con alias `@/`
- Prettier: comillas dobles, punto y coma, `printWidth` 100, 2 espacios
- No usar `any`

## Archivos a modificar

1. `src/modules/student/booking/pages/BookingClassPage.tsx`
2. `src/modules/student/booking/components/BookingCalendar.tsx`

No se modifica `StudentLayout.tsx` ni `calendarBaseSx.ts` (ver "No hacer").

## Cambios requeridos

### 1. `BookingClassPage.tsx`

**a)** Agregar el import (junto a los demás imports de `@/`):

```ts
import { TOPBAR_HEIGHT } from "@/modules/student/components/StudentTopbar";
```

(`TOPBAR_HEIGHT` ya está exportado por `StudentTopbar`; es el mismo que usa `StudentLayout`.)

**b)** Reemplazar el `sx` del `Box` raíz del `return`:

```tsx
<Box
  sx={{
    display: "flex",
    flexDirection: "column",
    gap: 2,
    p: 4,
    boxSizing: "border-box",
    // Ocupa todo el alto visible debajo del topbar para que el calendario y la
    // tarjeta de reserva lleguen hasta abajo (sin hueco vacío). El minHeight
    // evita que se aplaste en pantallas bajas: ahí scrollea la página.
    height: `calc(100vh - ${TOPBAR_HEIGHT}px)`,
    minHeight: 720,
  }}
>
```

**c)** En la fila que contiene calendario y tarjeta, agregar `flex: 1`:

```tsx
<Box sx={{ display: "flex", gap: 4, alignItems: "stretch", flex: 1 }}>
```

**d)** En el contenedor del calendario, agregar `minWidth: 0`:

```tsx
<Box sx={{ flex: 1, minWidth: 0 }}>
  <BookingCalendar ... />
</Box>
```

### 2. `BookingCalendar.tsx`

En el `sx` del `Box` raíz del `return`, agregar `boxSizing: "border-box"` (el resto queda igual):

```tsx
sx={{
  ...bookingCalendarSx,
  height: "100%",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
}}
```

Motivo: `calendarBaseSx` aplica `p: 3` y borde; sin `border-box`, `height: 100%` más el padding desborda el contenedor.

## Criterios de aceptación (Gherkin)

```gherkin
Feature: Altura de la pantalla de reserva

  Scenario: El calendario y la tarjeta llegan hasta abajo
    Given un alumno en la pantalla de reserva con un tutor
    And una ventana de alto estándar de escritorio (>= 800 px)
    When la pantalla termina de cargar
    Then el recuadro del calendario y el recuadro "Reserva una clase" terminan a la misma altura
    And ambos llegan hasta el borde inferior del área de contenido, respetando el padding de la página
    And no queda espacio vacío entre el final de los recuadros y el final de la pantalla

  Scenario: El calendario mantiene su scroll interno
    Given la pantalla de reserva cargada
    When el alumno recorre los horarios de 08:00 a 24:00
    Then el scroll ocurre dentro del calendario
    And el recuadro del calendario no crece más allá del alto de la pantalla

  Scenario: Pantalla de alto reducido
    Given una ventana con menos de 720 px de alto de área de contenido
    When el alumno abre la pantalla de reserva
    Then la página scrollea verticalmente
    And ningún recuadro queda cortado ni aplastado

  Scenario: Aviso de hold activo con otro tutor
    Given el alumno tiene una selección en curso con otro tutor
    When abre la reserva con este tutor
    Then se muestra el Alert informativo arriba
    And los recuadros ocupan el alto restante sin salirse de la pantalla

  Scenario: Tarjeta con contenido extra
    Given el alumno selecciona una materia con modalidad presencial
    And aparece el bloque de ubicación y el desglose de precios completo
    Then la tarjeta de reserva sigue mostrando todo su contenido
    And si el contenido supera el alto disponible, la página scrollea sin cortar nada

  Scenario: Sin regresión funcional
    Given la pantalla de reserva con los cambios aplicados
    When el alumno selecciona un horario, lo deselecciona, reserva o deja vencer el timer
    Then el comportamiento es idéntico al anterior
```

## Advertencias de dependencias

- `BookingClassPage` se monta dentro de `StudentLayout`. El cálculo `100vh - TOPBAR_HEIGHT` replica el `minHeight` del `<main>` de ese layout; si cambia el alto del topbar, el ajuste lo sigue porque usa la misma constante.
- `bookingCalendarSx` extiende `calendarBaseSx` (compartido con el calendario de disponibilidad del tutor). Cualquier ajuste debe quedar en `BookingCalendar.tsx` o en `bookingCalendarSx.ts`, nunca en `calendarBaseSx.ts`.
- `BookingCard` tiene `width: 350` y es un `Paper` con `alignItems: stretch` del padre: **no** necesita cambios, se estira solo al alto de la fila.

## No hacer

- No modificar `StudentLayout.tsx` ni convertir el `<main>` en contenedor flex (afectaría a todas las páginas del alumno).
- No modificar `src/shared/styles/calendarBaseSx.ts` (lo comparte el calendario de disponibilidad del tutor).
- No tocar `BookingCard.tsx`, hooks (`useBookingRealtime`, `useActiveHold`, `useBookingFlow`, `useBookingForm`), API, schemas ni interfaces.
- No usar alturas fijas en píxeles para el calendario (solo el `minHeight: 720` de la página).
- No cambiar `slotMinTime`, `slotMaxTime` ni `slotDuration` de FullCalendar.
- No introducir `any`, estilos inline sueltos ni Tailwind para este ajuste (se resuelve con `sx` de MUI).
- No agregar dependencias nuevas.

## Definition of Done

- [ ] Los dos archivos modificados según esta spec, sin otros cambios fuera de alcance
- [ ] `npm run build` (o `tsc --noEmit`) sin errores de tipos
- [ ] `npm run lint` sin errores nuevos
- [ ] Prettier aplicado (comillas dobles, `;`, `printWidth` 100)
- [ ] Verificación visual en navegador a 1366×768, 1440×900 y 1920×1080: los dos recuadros llegan hasta abajo y terminan alineados
- [ ] Verificación en ventana baja (~600 px de alto): la página scrollea y no se corta nada
- [ ] Verificado con el Alert de hold activo visible y con modalidad presencial seleccionada
- [ ] Flujo completo probado: seleccionar horario → completar formulario → reservar, y deselección / "Volver" / vencimiento del timer
- [ ] Sin warnings nuevos en consola
- [ ] PR hacia `dev` con capturas antes/después
