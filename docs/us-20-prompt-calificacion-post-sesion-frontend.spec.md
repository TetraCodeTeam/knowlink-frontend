# US-20 — Recibir prompt de calificación post-sesión (Frontend)

## Metadata

| Campo | Valor |
|---|---|
| ID Historia | US-20 |
| Épica | — |
| Story Points | 3 (backend + frontend combinados) |
| Prioridad | BAJA |
| Módulo | class-history (calificación) + notifications |
| Historias relacionadas | US-18 (calificar sesión), US-35 (centro de notificaciones), US-41 (confirmación de sesión) |
| Repo / rama | `TetraCodeTeam/knowlink-frontend` — `feature/notifications-center` |
| Depende de | `us-20-prompt-calificacion-post-sesion-backend.spec.md` (campos nuevos `actionStatus`, `expiresAt`, `ratingStatus`, `ratingDeadline` y error 422 `RATING_WINDOW_EXPIRED`) |
| Verificado contra | `knowlink-frontend@463db2d` (`feature/notifications-center`) |

**Convención de idioma:** identificadores (componentes, hooks, tipos, props, archivos) en **inglés**. Todo texto visible en la UI en **español**. Las interfaces/props van en archivos separados cuando el componente ya sigue ese patrón. Prettier: doble comilla, `;`, trailing comma ES5, 100 columnas, 2 espacios.

---

## Contexto: esto es un spec de brechas

El front **ya implementa casi todo el recorrido**. Este spec fija lo que ya cumple, corrige lo que contradice los criterios y define qué cambia cuando el backend informe el estado de la calificación.

### Lo que ya existe (verificado en el código)

- `NOTIFICATION_TYPE_CONFIG.RATING_ENABLED` (`notifications/constants/notification-type-config.ts`): ícono `Star`, acción `{ kind: "rating", label: "Calificar" }`.
- `NotificationItem`: al hacer click marca como leída y, si la acción es `rating` y hay `referenceId`, abre el formulario con `useRatingPopupStore.open(referenceId)`.
- `RatingPopupHost` (montado en `StudentLayout` y `TutorLayout`, por lo que funciona desde cualquier pantalla): trae el detalle de la reserva (`useBookingDetail`), muestra `RateBookingDialog` y maneja éxito (`RateBookingSuccessDialog`) y 409 (`RateBookingAlreadyRatedDialog`).
- `RateBookingDialog`: título "Calificá tu sesión", materia + otra parte + fecha, 5 estrellas (`StarRatingInput`), comentario opcional (máx. 2000), botón **Enviar deshabilitado** con `score === 0`, y `rateBookingSchema` (`score` 1–5, mensaje "Seleccioná una calificación").
- `RateBookingFlow` (en la tarjeta de la clase, pestaña "Realizadas"): botón "Calificar" con el mismo diálogo.

### Brechas contra los criterios

| CA | Estado | Brecha |
|---|---|---|
| 1 — Notificación a ambas partes "Calificá tu sesión de [Materia]" | Back | Lo corrige el backend (cambio de disparador). El front ya muestra `title` y `message` tal cual llegan. |
| 3 — Si ya calificó, no aparece como pendiente | **Parcial** | La notificación sigue mostrando "Calificar →" aunque el usuario ya calificó. El diálogo detecta "ya calificó" con `localStorage` (`ratedBookings.storage.ts`): es por navegador, así que en otro dispositivo se ofrece calificar y recién falla con 409. |
| 4 — Vence a las 24 h | **Parcial** | El plazo se calcula en el cliente (`getRatingDeadline(sessionDate, endTime, 24)`, desde el fin de la clase) y depende del reloj del dispositivo. Al vencer, `RatingPopupHost` **cierra el diálogo sin explicar nada**; la notificación sigue diciendo "Calificar →". |
| 5 — Enlace directo al formulario | Cumple | Click en la notificación → formulario en un diálogo, desde cualquier pantalla. |
| 6 — Datos de la sesión, puntaje 1–5, comentario opcional, sin puntaje no se envía | Cumple | Sin cambios. |
| 7 — Confirmación y formulario bloqueado | **Parcial** | Confirmación ✓. El bloqueo depende de `localStorage` (ver CA 3). |

**Decisión:** el front pasa a depender del **estado que informa el backend** (`ratingStatus` en el detalle de la reserva y `actionStatus` en la notificación) y deja de calcular plazos o recordar calificaciones en el navegador.

---

## Criterios de aceptación (Gherkin)

```gherkin
Feature: Prompt de calificación post-sesión (UI)

  Background:
    Given estoy autenticado como alumno o tutor

  Scenario: Recibo el prompt (CA 1, CA 5)
    Given mi sesión fue confirmada como realizada
    When abro el centro de notificaciones
    Then veo "Calificá tu sesión de {materia}" con la acción "Calificar →"
    When hago click en la notificación
    Then se marca como leída
    And se abre el formulario de calificación sin cambiar de pantalla

  Scenario: Formulario con datos de la sesión (CA 6)
    When se abre el formulario
    Then veo la materia, la otra parte (tutor si soy alumno, alumno si soy tutor) y la fecha
    And veo 5 estrellas y un comentario opcional
    And el botón "Enviar" está deshabilitado hasta elegir un puntaje

  Scenario: Envío exitoso (CA 7)
    Given elegí un puntaje
    When envío la calificación
    Then veo la confirmación de que fue registrada
    And la notificación de esa sesión pasa a mostrarse como "Ya calificaste" sin acción
    And el contador de no leídas baja si todavía estaba sin leer

  Scenario: Ya califiqué desde otro dispositivo (CA 3, CA 7)
    Given califiqué esta sesión en otro navegador
    When hago click en la notificación o abro la clase
    Then veo "Ya calificaste esta sesión"
    And no puedo volver a enviar el formulario

  Scenario: Notificación de una sesión ya calificada (CA 3)
    Given califiqué la sesión
    When abro el centro de notificaciones
    Then la notificación no se muestra como pendiente
    And no ofrece la acción "Calificar"

  Scenario: El plazo venció (CA 4)
    Given pasaron más de 24 horas y no califiqué
    When abro el centro de notificaciones
    Then la notificación muestra "Venció el plazo" y no ofrece "Calificar"
    And no cuenta en el contador de no leídas
    When hago click en ella
    Then veo un aviso de que el plazo para calificar esta sesión venció
    And no se abre el formulario

  Scenario: El plazo vence con el formulario abierto (CA 4)
    Given el formulario está abierto
    When el plazo termina antes de que envíe
    Then el formulario se cierra y veo el aviso de plazo vencido

  Scenario: El servidor rechaza por plazo vencido (CA 4)
    Given el reloj de mi dispositivo está atrasado y envío la calificación
    When el backend responde 422 "RATING_WINDOW_EXPIRED"
    Then veo el aviso de plazo vencido
    And no se muestra ningún otro error

  Scenario: Botón en la tarjeta de la clase
    Given la reserva está en "Realizadas"
    Then el botón "Calificar" solo aparece si ratingStatus es PENDING
    And con SUBMITTED, EXPIRED o NOT_AVAILABLE no aparece

  Scenario: Accesibilidad
    Then la notificación sigue siendo operable con teclado y anuncia su estado: sin leer, leída, calificada o vencida
```

---

## Stack confirmado

React 19 + TypeScript, MUI 7, TanStack Query 5, Zustand 5, react-hook-form + Zod, axios vía `httpClient`, `lucide-react`, `react-router-dom` 7, Vitest + Testing Library. **Sin dependencias nuevas.**

---

## Advertencias de dependencias (verificadas en el código)

1. **Depende del backend.** Sin los campos `ratingStatus` / `ratingDeadline` / `actionStatus` este spec no se puede implementar. Mientras el backend no los entregue, el front sigue funcionando como hoy (no hay que mergear primero).
2. **`createdAt`, `expiresAt` y `ratingDeadline` llegan sin zona** (`LocalDateTime`, hora de Argentina). `new Date("2026-10-20T15:14:00")` se interpreta como hora local: **no agregar `Z`**. Solo se usan para programar el cierre del formulario; los estados los decide el backend.
3. **Carrera entre el POST y el listener del backend.** El backend cierra la notificación en un listener `AFTER_COMMIT` asíncrono. Si el front invalidara la lista justo después de calificar, podría traer todavía el estado viejo (`PENDING`) y pisar la actualización optimista. Por eso **no se invalida inmediatamente**: el estado se reconcilia con el polling de 30 s y al abrir el panel (ver "Capa de datos").
4. **`ClassHistoryCard` renderiza `RateBookingFlow` en dos lugares** (con y sin `VirtualLinkBox`, líneas ~119 y ~146); el cambio de visibilidad del botón vive dentro de `RateBookingFlow`, no hay que tocar la tarjeta.
5. **`BookingHistoryDetail` se construye a mano en los tests** (`makeDetail` en `RatingPopupHost.test.tsx` y otros). Al agregar campos obligatorios hay que actualizar esos helpers.
6. **Texto del diálogo de éxito:** `RateBookingSuccessDialog` ya explica que la calificación recibida se ve cuando la otra parte califique o pasen 24 h. Es la regla de visibilidad de US-18, no del plazo para calificar; **no se modifica**.
7. **Rutas:** la notificación no navega, abre un diálogo; las rutas de `routes` de `RATING_ENABLED` (`/student/classes`, `/tutor/classes`) quedan sin uso para esta acción. No tocarlas (US-35).
8. **`httpClient` muestra toast de error y hace logout en 401 ante cualquier fallo.** El 409 y el 422 de la calificación se atrapan en el componente para mostrar un diálogo; el toast del interceptor puede aparecer igual. Verificar el comportamiento actual con 409 antes de agregar el 422 y, si el toast molesta, evaluar `rawHttpClient` para `rateBooking` (decisión del equipo; hoy se usa `httpClient`).

---

## Decisiones de diseño

| Decisión | Elegido | Alternativa descartada | Motivo |
|---|---|---|---|
| Fuente de verdad del plazo | `ratingStatus` / `ratingDeadline` del backend | Seguir calculando con `sessionDate + endTime + 24 h` | Reloj del dispositivo ≠ reloj del servidor; y el plazo ahora depende también de `confirmedAt`, que el front no tiene. |
| "Ya calificó" | `ratingStatus === "SUBMITTED"` | `localStorage` por usuario | Funciona entre dispositivos y no se desincroniza. |
| Estado visual de la notificación | `actionStatus` de la propia notificación | Cruzar con el detalle de cada reserva | Evita un request por notificación. |
| Notificación vencida | Se muestra atenuada con "Venció el plazo" | Ocultarla | Coherente con el backend (queda en el historial). |
| Click en notificación vencida o calificada | Marca como leída y abre un aviso informativo | No hacer nada | El usuario entiende por qué ya no puede calificar. |
| Reconciliar tras calificar | Actualización optimista del caché, sin invalidar | `invalidateQueries` inmediato | Ver advertencia 3. |
| Cierre automático al vencer | Un `setTimeout` hasta `ratingDeadline` (como hoy), pero mostrando el aviso | Cerrar en silencio | CA 4 pide que la opción "expire", no que desaparezca sin explicación. |

---

## Modelo de datos en frontend

```ts
// notifications/types/notification-action-status.type.ts
export const NOTIFICATION_ACTION_STATUS_VALUES = ["NONE", "PENDING", "COMPLETED", "EXPIRED"] as const;
export type NotificationActionStatus = (typeof NOTIFICATION_ACTION_STATUS_VALUES)[number];

// class-history/types/rating-status.type.ts
export const RATING_STATUS_VALUES = ["NOT_AVAILABLE", "PENDING", "SUBMITTED", "EXPIRED"] as const;
export type RatingStatus = (typeof RATING_STATUS_VALUES)[number];
```

```ts
// notifications/interfaces/responses/notification.interface.ts  (agregar al final)
expiresAt: string | null;                 // LocalDateTime ISO sin zona
actionStatus: NotificationActionStatus;   // NONE para todo lo que no sea RATING_ENABLED

// class-history/interfaces/responses/booking-history-detail.interface.ts  (agregar al final)
ratingStatus: RatingStatus;
ratingDeadline: string | null;            // LocalDateTime ISO sin zona; null si NOT_AVAILABLE
```

Los tipos reflejan **exactamente** el contrato del backend (`NotificationResponse`, `BookingHistoryDetailResponse`). El front hoy no declara `readAt`; no se agrega porque esta historia no lo usa.

---

## Ubicación de archivos / componentes

```
src/modules/notifications/
├── types/notification-action-status.type.ts          // NUEVO
├── interfaces/responses/notification.interface.ts    // MODIFICA
├── constants/notification-type-config.ts             // MODIFICA (getNotificationAction recibe actionStatus)
├── components/NotificationItem.tsx                   // MODIFICA
└── hooks/useResolveRatingNotification.ts             // NUEVO (actualización optimista del caché)

src/modules/class-history/
├── types/rating-status.type.ts                       // NUEVO
├── interfaces/responses/booking-history-detail.interface.ts // MODIFICA
├── components/
│   ├── RatingPopupHost.tsx                           // MODIFICA
│   ├── RateBookingFlow.tsx                           // MODIFICA
│   └── RateBookingExpiredDialog.tsx                  // NUEVO
├── hooks/useRateBooking.ts                           // MODIFICA
├── utils/classHistory.utils.ts                       // MODIFICA (quitar helpers de plazo si queda sin uso)
├── utils/ratedBookings.storage.ts                    // ELIMINAR
└── constants/classHistory.constants.ts               // MODIFICA (quitar RATING_WINDOW_HOURS)
```

---

## Cambios en detalle

### 1. `NotificationItem` y configuración por tipo (CA 3, CA 4)

`getNotificationAction(type, role, actionStatus)` pasa a recibir el estado y devuelve una variante nueva para los tipos con acción de calificación:

```ts
export type NotificationAction =
  | { kind: "none" }
  | { kind: "rating"; label: string }                       // PENDING
  | { kind: "rating-done"; label: string }                  // COMPLETED  -> "Ya calificaste"
  | { kind: "rating-expired"; label: string }               // EXPIRED    -> "Venció el plazo"
  | { kind: "claim"; label: string }
  | { kind: "navigate"; label: string; route: string };
```

Reglas (solo cuando `config.action.kind === "rating"`; el resto de los tipos no cambia):

| `actionStatus` | Acción | Texto del enlace | Estilo |
|---|---|---|---|
| `PENDING` o `NONE` (notificaciones viejas sin campo) | `rating` | `Calificar →` | color actual (#3F4CAE) |
| `COMPLETED` | `rating-done` | `Ya calificaste` (sin flecha) | gris `#6B6B80`, sin cursor de acción |
| `EXPIRED` | `rating-expired` | `Venció el plazo` (sin flecha) | gris `#6B6B80` |

`NotificationItem`:

- `rating` → comportamiento actual (marca leída y `openRatingPopup(referenceId)`).
- `rating-done` / `rating-expired` → marca leída (si no lo estaba) y abre `openRatingPopup(referenceId)` igual. El host decide qué diálogo mostrar según `ratingStatus` (ver punto 2). Así hay **una sola lógica** de "qué le digo al usuario".
- La fila de `EXPIRED` y `COMPLETED` se muestra atenuada (`opacity: 0.7`) para no competir con lo pendiente.
- `aria-label`: `"{Sin leer|Leída}: {mensaje}"` y, si corresponde, sufijo `". Ya calificaste."` o `". Venció el plazo para calificar."`.
- Una notificación con `actionStatus === "PENDING"` sigue usando `title` como encabezado ("Calificá tu sesión de {materia}") sin cambios.

### 2. `RatingPopupHost` (CA 3, CA 4, CA 7)

Reemplazar la lógica local por el estado del backend:

| `detail.ratingStatus` | Qué muestra |
|---|---|
| `PENDING` | `RateBookingDialog` |
| `SUBMITTED` | `RateBookingAlreadyRatedDialog` |
| `EXPIRED` | `RateBookingExpiredDialog` (nuevo) |
| `NOT_AVAILABLE` | cierra el host sin mostrar nada |

- **Quitar** `hasRatedBooking`, `markBookingAsRated`, `isWithinRatingWindow`, `getRatingDeadline` y `RATING_WINDOW_HOURS`.
- Timer de vencimiento: si `ratingStatus === "PENDING"` y hay `ratingDeadline`, `setTimeout` hasta `new Date(ratingDeadline).getTime() - Date.now()`; al dispararse pasa el paso a `"expired"` (no `close()`). Limpiar el timer en el cleanup. Si el delay es ≤ 0, ir directo a `"expired"`.
- Errores al enviar (`handleConfirm`):
  - `409` → `"already-rated"` + invalidar el detalle (como hoy, **sin** `markBookingAsRated`).
  - `422` con `response.data.detail === "RATING_WINDOW_EXPIRED"` → `"expired"` + invalidar el detalle.
  - cualquier otro → se deja el diálogo abierto para reintentar (como hoy).
- Éxito: paso `"success"`; al cerrar, invalidar el detalle y el historial (como hoy) **y** llamar a `useResolveRatingNotification` (punto 4).

### 3. `RateBookingFlow` (CA 4, CA 7)

- Mostrar `RateBookingButton` **solo si** `detail.ratingStatus === "PENDING"`; en cualquier otro estado devolver `null`.
- Quitar `forceRerender` por timer basado en `sessionDate/endTime`; usar `ratingDeadline` (mismo mecanismo que el host): al llegar el plazo, forzar un re-render o invalidar el detalle para que el backend responda `EXPIRED` y el botón desaparezca.
- Mismo manejo de 409 y 422 que el host. Reutilizar la lógica en un hook (`useRatingSubmission`) si el duplicado entre `RateBookingFlow` y `RatingPopupHost` crece; si no, se deja duplicado como hoy.
- Quitar `hasRatedBooking` / `markBookingAsRated`.

### 4. Cierre optimista de la notificación (CA 3)

`useResolveRatingNotification()` devuelve `resolve(bookingId)` que, con `useQueryClient`:

1. En todas las queries de `NOTIFICATION_QUERY_KEYS.list`, para los items con `type === "RATING_ENABLED"` y `referenceId === bookingId`: `read: true`, `actionStatus: "COMPLETED"`.
2. En `NOTIFICATION_QUERY_KEYS.unreadCount`: restar 1 **solo si** había al menos un item de esa reserva con `read === false` en el caché (mínimo 0). Si no se puede determinar, no tocar el conteo y dejar que el polling lo corrija.
3. **No** llamar a `invalidateQueries` (advertencia 3).

Usar siempre `NOTIFICATION_QUERY_KEYS` (única fuente de query keys; ya hubo un desalineamiento en US-06).

### 5. `RateBookingExpiredDialog` (nuevo)

Mismo patrón visual que `RateBookingAlreadyRatedDialog` (`Dialog` MUI, ícono en `cancelDialogIconWrapperSx`, un botón "Volver"):

- Ícono: `TimerOff` de `lucide-react`, mismo color de énfasis amarillo (`#B8860B` sobre `#FBF3DE`).
- Título: **"El plazo para calificar venció"**
- Texto: **"Pasaron más de 24 horas desde que finalizó la sesión, por lo que ya no se puede calificar."**
- Props: `{ open: boolean; onClose: () => void }`.

### 6. Limpieza

- Eliminar `utils/ratedBookings.storage.ts` y cualquier test que lo cubra. Las claves ya guardadas en `localStorage` (`knowlink:ratedBookingIds:{userId}`) quedan huérfanas e inofensivas; no hace falta migrarlas ni borrarlas.
- Quitar de `classHistory.utils.ts` `getRatingDeadline` / `isWithinRatingWindow`, y de `classHistory.constants.ts` `RATING_WINDOW_HOURS`, **solo si** `grep` confirma que no quedan usos (hoy solo los usan `RatingPopupHost` y `RateBookingFlow`).

---

## Capa de datos

Sin endpoints nuevos y sin funciones nuevas en `*.api.ts`.

| Endpoint | Cambio |
|---|---|
| `GET /api/v1/notifications` | la respuesta suma `expiresAt` y `actionStatus` |
| `GET /api/v1/notifications/unread-count` | el backend deja de contar las `RATING_ENABLED` vencidas; el front no cambia |
| `GET /api/v1/bookings/{id}` | la respuesta suma `ratingStatus` y `ratingDeadline` |
| `POST /api/v1/bookings/{id}/ratings` | nuevo `422 RATING_WINDOW_EXPIRED` |

El polling de notificaciones (30 s), la lista infinita y el marcado optimista de lectura de US-35 **no cambian**.

---

## No hacer

- No calcular plazos de calificación en el cliente ni comparar con `Date.now()` para decidir **si** se puede calificar (solo para programar el cierre del diálogo).
- No guardar en `localStorage`, `sessionStorage` ni en Zustand si una sesión fue calificada.
- No invalidar `NOTIFICATION_QUERY_KEYS` inmediatamente después de calificar (ver advertencia 3).
- No escribir arrays de query key sueltos; usar `NOTIFICATION_QUERY_KEYS` y las keys existentes de `class-history` (`["bookingDetail", id]`, `["bookingHistory"]`).
- No llamar a `axios` directamente ni agregar funciones a `*.api.ts` para esto.
- No navegar a otra ruta al hacer click en `RATING_ENABLED`; la acción es abrir el diálogo.
- No construir rutas ni URLs con texto del servidor (`message`, `title`).
- No ocultar ni borrar las notificaciones vencidas o calificadas de la lista.
- No tocar el texto de `RateBookingSuccessDialog` ni la lógica de visibilidad de calificaciones (US-18).
- No modificar el comportamiento de otros tipos de notificación (`claim`, `navigate`).
- No agregar dependencias.
- No usar `any`; no importar con rutas relativas largas (usar el alias `@/`).

---

## Casos de prueba (tabla de la historia)

| # | Caso de prueba | Resultado esperado | ¿Pasó? / Notas |
|---|---|---|---|
| 1 | Alumno y tutor con una sesión confirmada abren el centro de notificaciones y tocan "Calificá tu sesión de {materia}". | Cada uno ve la notificación con "Calificar →"; al tocarla se marca leída y se abre el formulario con materia, otra parte y fecha, 5 estrellas y comentario opcional. "Enviar" está deshabilitado hasta elegir puntaje. No aparece nada para sesiones canceladas. | Sí / No |
| 2 | El usuario envía puntaje 4 con comentario. Después abre la misma notificación y la clase desde otro navegador. | Ve la confirmación de calificación registrada; la notificación pasa a "Ya calificaste" sin acción y el contador baja. En el otro navegador ve "Ya calificaste esta sesión" y no puede reenviar; el botón de la tarjeta no aparece. | Sí / No |
| 3 | Pasan más de 24 h sin calificar; el usuario abre el centro de notificaciones, toca la notificación y, aparte, intenta enviar desde un diálogo que quedó abierto. | La notificación figura "Venció el plazo", sin "Calificar" y sin sumar al contador. Al tocarla ve "El plazo para calificar venció" y no se abre el formulario. El envío tardío recibe 422 `RATING_WINDOW_EXPIRED` y muestra el mismo aviso; la sesión queda sin calificación. | Sí / No |

---

## Definition of Done

- [ ] Tipos nuevos (`NotificationActionStatus`, `RatingStatus`) y campos agregados a `NotificationResponse` y `BookingHistoryDetail`, idénticos al contrato del backend
- [ ] `getNotificationAction` recibe `actionStatus` y devuelve `rating` / `rating-done` / `rating-expired`; los demás tipos sin cambios
- [ ] `NotificationItem`: texto "Ya calificaste" / "Venció el plazo", fila atenuada, `aria-label` con el estado, operable con teclado
- [ ] `RatingPopupHost` decide el diálogo por `ratingStatus`; sin `localStorage`, sin cálculo local de plazo; al vencer con el formulario abierto muestra `RateBookingExpiredDialog`; maneja 409 y 422 `RATING_WINDOW_EXPIRED`
- [ ] `RateBookingFlow` muestra el botón solo con `ratingStatus === "PENDING"`
- [ ] `RateBookingExpiredDialog` creado con el texto definido
- [ ] `useResolveRatingNotification` actualiza el caché de forma optimista (lista y contador) sin invalidar
- [ ] Eliminado `ratedBookings.storage.ts` y helpers de plazo sin uso; `grep` confirma que no quedan referencias
- [ ] Tests actualizados: `makeDetail` con los campos nuevos; `RatingPopupHost.test.tsx` cubre PENDING, SUBMITTED, EXPIRED, NOT_AVAILABLE, 409, 422 y vencimiento con el diálogo abierto (`vi.useFakeTimers`)
- [ ] Tests nuevos: `NotificationItem` con `actionStatus` PENDING / COMPLETED / EXPIRED (texto, atenuado, aria-label, click abre el host); `getNotificationAction`; `RateBookingFlow` (botón solo en PENDING); `useResolveRatingNotification` (marca leída, conteo, sin invalidar)
- [ ] `RateBookingDialog`: test de que "Enviar" está deshabilitado sin puntaje y el comentario es opcional (hoy sin cobertura propia)
- [ ] `npm run lint`, `tsc` y la suite de Vitest en verde
- [ ] Verificado a mano con el backend: confirmar sesión → ambas partes ven el prompt → calificar → la notificación se cierra; esperar >24 h (o avanzar el `Clock`) → "Venció el plazo"
- [ ] Commits en español con prefijo convencional (`feat:`, `fix:`, `test:`, `docs:`)

---

## Decisiones pendientes

1. **Toast del interceptor ante 409 / 422** (advertencia 8): decidir si `rateBooking` pasa a `rawHttpClient` para no mostrar un toast además del diálogo.
2. **Texto del aviso de plazo vencido**: el definido arriba es una propuesta; confirmar con el equipo/PO.
3. **Botón de la tarjeta con `SUBMITTED`**: este spec lo oculta. Alternativa: mostrar un texto "Ya calificaste" en lugar del botón.
