# US-15 — Liberar fondos al tutor según resultado de sesión (Frontend)

## Metadata

| Campo | Valor |
|---|---|
| ID Historia | US-15 |
| Épica | Sí — cubre confirmación/ausencia y disputa entre partes |
| Story Points | 13 (backend + frontend combinados) |
| Prioridad | ALTA |
| Módulo | payments (UI) |
| Tags | #RN-14 #RN-16 |
| Historias relacionadas | US-41 (confirmación por token), US-44 (pago/retención inicial), US-46 (reclamos tutor), US-47 (disputas alumno), US-21/US-22 (resolución admin) |
| Repo / branch | knowlink-frontend (`julian-salvucci`) |
| Depende de | Spec de backend `US-15-liberacion-fondos-backend.md` — endpoints `GET /api/bookings/{id}/funds` y `POST /api/admin/bookings/{id}/funds/retry` |

**Convención de idioma:** identificadores de código (componentes, hooks, tipos, props) en **inglés**. Todo texto visible en la UI (labels, tooltips, mensajes de notificación, estados) en **español**.

**Nota de alcance:** esta historia en frontend es principalmente de **lectura y notificación**. No existe ningún formulario para que tutor o alumno disparen manualmente una liberación o devolución: el proceso es automático en el backend. El único disparo manual visible en UI es el reintento post-disputa, exclusivo de un panel de administración.

---

## Contexto de UX

Tres superficies distintas consumen esta historia:

1. **Vista de detalle de reserva** (tutor y alumno) — sección de estado de fondos, de solo lectura.
2. **Notificaciones** — al finalizar la sesión (con CTA de reclamo) y al ejecutarse la transferencia (monto + concepto).
3. **Panel de administración** — visualización de reservas con fondos suspendidos por reclamo y acción de reintento tras resolver la disputa.

---

## Criterios de aceptación (Gherkin)

```gherkin
Feature: Visualización y notificación de liberación/devolución de fondos

  Background:
    Given estoy en la vista de detalle de una reserva "R" que ya finalizó

  Scenario: Fondos liberados al tutor
    Given el backend informa fundsStatus "RELEASED_TO_TUTOR" para "R"
    When se renderiza la sección de estado de fondos
    Then se muestra el label "Liberado al tutor"
    And se muestra el monto transferido y el concepto de la operación
    And la reserva se muestra con estado "Completada"

  Scenario: Fondos devueltos al alumno
    Given el backend informa fundsStatus "REFUNDED_TO_STUDENT" para "R"
    When se renderiza la sección de estado de fondos
    Then se muestra el label "Devuelto al alumno"
    And se muestra el monto devuelto y el concepto de la operación
    And la reserva se muestra con el estado correspondiente ("No cumplida por tutor" o "Sesión no realizada")

  Scenario: Fondos suspendidos por reclamo
    Given el backend informa fundsStatus "SUSPENDED_BY_CLAIM" para "R"
    When se renderiza la sección de estado de fondos
    Then se muestra el label "Suspendido por reclamo"
    And se muestra un texto explicando que la transferencia queda en espera hasta que un administrador resuelva la disputa
    And no se muestra ningún botón de acción para tutor o alumno

  Scenario: Fondos aún retenidos, sesión finalizada sin confirmación completa
    Given el backend informa fundsStatus "HELD" para "R"
    When se renderiza la sección de estado de fondos
    Then se muestra el label "Retenido"
    And se indica que el resultado depende de la confirmación de asistencia de ambas partes

  Scenario: Notificación de finalización de sesión con opción de reclamo
    Given la sesión asociada a "R" finalizó
    When llega la notificación de finalización
    Then se muestra un botón/enlace "Hacer un reclamo" visible tanto para tutor como para alumno
    And el botón navega al flujo de creación de reclamo (US-46/US-47) con "R" preseleccionada

  Scenario: Notificación de transferencia ejecutada
    Given se ejecutó una transferencia sobre "R"
    When llega la notificación correspondiente
    Then el mensaje indica el monto y el concepto de la operación, en español
    And al hacer click en la notificación se navega al detalle de "R"

  Scenario: Admin reintenta la resolución tras resolver una disputa
    Given estoy en el panel de administración de disputas
    And una reserva "R" tiene fundsStatus "SUSPENDED_BY_CLAIM" y la disputa ya fue resuelta
    When hago click en "Reintentar liberación de fondos"
    Then se dispara `POST /api/admin/bookings/{id}/funds/retry`
    And mientras la petición está en curso el botón muestra estado de carga y queda deshabilitado
    And al finalizar con éxito se refresca el estado de fondos de "R" sin recargar la página
    And si falla, se muestra un mensaje de error en español y el botón vuelve a estar disponible

  Scenario: Estado de fondos es de solo lectura para tutor y alumno
    Given estoy logueado como tutor o como alumno
    When veo el detalle de una reserva con transferencia ya procesada
    Then no existe ningún control de edición sobre el estado de fondos ni sobre el estado de la reserva
```

---

## Stack confirmado

- React + TypeScript
- MUI (componentes de UI: `Chip`, `Alert`, `Card`, `Button`, `CircularProgress`)
- React Query para el fetch de `GET /api/bookings/{id}/funds` y la mutation de `POST /api/admin/bookings/{id}/funds/retry`
- Reutilizar el sistema de notificaciones ya existente en el frontend (mismo componente/hook que otras notificaciones del proyecto); no crear un nuevo canal

---

## Modelo de datos en frontend

### Tipos (código en inglés)

```typescript
type FundsStatus =
  | "HELD"
  | "SUSPENDED_BY_CLAIM"
  | "RELEASED_TO_TUTOR"
  | "REFUNDED_TO_STUDENT";

type FundsRecipient = "TUTOR" | "STUDENT";

interface FundsTransfer {
  bookingId: number;
  originalAmount: number;
  systemRetentionPercentage: number;
  transferredAmount: number;
  recipient: FundsRecipient;
  concept: string; // viene del backend, ya en español
  fundsStatus: FundsStatus;
  processedAt: string | null; // ISO date
  blockingClaimId: number | null;
}
```

### Mapa de labels (español), separado del tipo de código

```typescript
const fundsStatusLabel: Record<FundsStatus, string> = {
  HELD: "Retenido",
  SUSPENDED_BY_CLAIM: "Suspendido por reclamo",
  RELEASED_TO_TUTOR: "Liberado al tutor",
  REFUNDED_TO_STUDENT: "Devuelto al alumno",
};
```

No hardcodear estos labels sueltos en cada componente: centralizarlos en este mapa único para evitar inconsistencias de texto entre vistas.

---

## Ubicación de archivos / componentes

```
src/features/payments
 ├── api
 │    └── useFundsTransfer.ts        // React Query hook: GET /api/bookings/{id}/funds
 ├── admin
 │    └── useRetryFundsResolution.ts // React Query mutation: POST /api/admin/bookings/{id}/funds/retry
 ├── components
 │    ├── FundsStatusSection.tsx     // sección de solo lectura en el detalle de reserva
 │    ├── FundsStatusChip.tsx        // chip visual con color según FundsStatus
 │    └── RetryFundsResolutionButton.tsx // botón exclusivo del panel admin
 ├── constants
 │    └── fundsStatusLabel.ts
 └── types
      └── funds.ts
```

Notificaciones:
```
src/features/notifications
 └── handlers
      ├── sessionCompletedNotification.ts   // extiende el manejador existente, agrega CTA de reclamo
      └── fundsTransferNotification.ts      // extiende el manejador existente, agrega monto + concepto
```

No crear una feature `notifications` nueva si ya existe una en el proyecto: extender los handlers existentes con estos dos casos.

---

## Componentes clave

### `FundsStatusSection`
- Recibe `bookingId`, usa `useFundsTransfer(bookingId)`.
- Estados a manejar explícitamente: loading, error, y los 4 valores de `FundsStatus`.
- Para `SUSPENDED_BY_CLAIM`: usar `Alert severity="warning"` con el texto explicativo, sin ningún botón.
- Para `RELEASED_TO_TUTOR` / `REFUNDED_TO_STUDENT`: mostrar monto (`transferredAmount`), `concept` y fecha (`processedAt`) formateada en `es-AR`.
- Componente puramente de presentación: no debe tener ninguna mutation ni botón de acción, salvo que el panel admin lo componga junto con `RetryFundsResolutionButton`.

### `RetryFundsResolutionButton`
- Solo se renderiza dentro del panel de administración, condicionado a `fundsStatus === "SUSPENDED_BY_CLAIM"` y a que la disputa ya esté marcada como resuelta (dato que viene del módulo de disputas, no de este).
- Usa `useRetryFundsResolution` (mutation), deshabilita el botón durante `isPending`, invalida la query de `useFundsTransfer` al tener éxito.
- Mensaje de error en un `Alert` o `Snackbar` en español: `"No se pudo reintentar la liberación de fondos. Intentá nuevamente."`

---

## No hacer

- No construir ningún formulario ni botón para que tutor o alumno disparen manualmente una liberación o devolución de fondos: la resolución es siempre automática en el backend.
- No exponer el botón de reintento (`RetryFundsResolutionButton`) fuera del panel de administración.
- No hardcodear los labels de `FundsStatus` en más de un lugar; usar siempre `fundsStatusLabel`.
- No crear un componente de notificaciones nuevo: extender los handlers existentes.
- No mostrar montos ni conceptos cuando `fundsStatus` es `HELD` o `SUSPENDED_BY_CLAIM` (todavía no hay transferencia real que mostrar).
- No mezclar idiomas en los identificadores de código (evitar `estadoFondosChip`, `retryLiberacionButton`).
- No hacer polling agresivo sobre `useFundsTransfer`: refrescar solo al invalidar la query tras un reintento exitoso o al re-entrar a la vista.

---

## Definition of Done

- [ ] Tipos `FundsStatus`, `FundsRecipient`, `FundsTransfer` definidos en `types/funds.ts`
- [ ] `useFundsTransfer` implementado con React Query, con manejo de loading/error
- [ ] `FundsStatusSection` renderiza correctamente los 4 estados de `FundsStatus` (incluyendo el caso "sin transferencia procesada aún")
- [ ] `fundsStatusLabel` centralizado y usado en todos los puntos donde se muestra el estado
- [ ] Notificación de finalización de sesión extendida con CTA de reclamo, visible para tutor y alumno
- [ ] Notificación de transferencia ejecutada extendida con monto y concepto, en español
- [ ] `RetryFundsResolutionButton` y `useRetryFundsResolution` implementados en el panel admin, con estado de carga y manejo de error
- [ ] Verificado que ningún control de edición de estado de fondos es visible para tutor o alumno
- [ ] Tests de componente (RTL) para los 4 estados de `FundsStatusSection` + estado de carga/error
- [ ] Test de componente para `RetryFundsResolutionButton` (éxito, error, estado deshabilitado durante la petición)
- [ ] Revisión visual de los labels/colores de `FundsStatusChip` contra el sistema de diseño del proyecto
