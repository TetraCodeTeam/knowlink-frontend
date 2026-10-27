# US-35 — Centro de notificaciones (Frontend)

## Metadata

| Campo                  | Valor                                                                                                                                                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ID Historia            | US-35                                                                                                                                                                                                                          |
| Épica                  | —                                                                                                                                                                                                                              |
| Story Points           | 8 (backend + frontend combinados)                                                                                                                                                                                              |
| Prioridad              | BAJA                                                                                                                                                                                                                           |
| Módulo                 | notifications (navegación)                                                                                                                                                                                                     |
| Historias relacionadas | US-28 / US-29 / US-30 (navbar por rol), US-10, US-11, US-15, US-18, US-22, US-24 / US-27, US-41                                                                                                                                |
| Repo / branch          | `TetraCodeTeam/knowlink-frontend` (`julian-salvucci`) — PR #47 en `feature/notifications-center`                                                                                                                               |
| Depende de             | `us-35-centro-notificaciones-backend.spec.md` — `GET /api/v1/notifications?status=`, `GET /api/v1/notifications/unread-count`, `PATCH /api/v1/notifications/{id}/read`; tipos de claim/funds emitidos por el backend (PR #111) |
| Verificado contra      | `knowlink-frontend@feature/notifications-center` (2026-10-24)                                                                                                                                                                  |

**Convención de idioma:** identificadores (componentes, hooks, tipos, props, archivos) en **inglés**. Todo texto visible en la UI en **español**. Las interfaces/props van en archivos separados, nunca dentro del componente. Prettier: doble comilla, `;`, trailing comma ES5, 100 columnas, 2 espacios.

---

## Contexto de UX y estado actual del front

Estado implementado en el PR #47 (verificado en el código):

- Los sidebars `StudentSidebar` y `TutorSidebar` tienen un ítem "Notificaciones" (ícono `Bell`) que **abre un panel lateral** (drawer fijo, no navega). El estado `isNotificationsOpen` vive en cada sidebar.
- El `Badge` del ítem se alimenta de `useUnreadNotificationsCount()` (query real del backend); oculto en 0, `max={99}` → "99+". `useStudentBadgesStore` / `useTutorBadgesStore` ya no tienen `notificationsCount`.
- Las rutas placeholder `/student/notifications` y `/tutor/notifications` fueron eliminadas de `StudentRoutes` / `TutorRoutes`; ambas rutas hoy apuntan a `UnderConstructionPage` en sus destinos de detalle (ver fuera de alcance 2).
- `useLogout` descarta la caché de notificaciones (`removeQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all })`).
- `httpClient` muestra un toast de error y hace logout en 401 ante cualquier fallo; `rawHttpClient` no (se usa para polling y PATCH).
- No existe layout, rutas ni login redirect para ADMIN (`RoleRoute` solo conoce STUDENT y TUTOR).

**Decisión de diseño (CA 1 y 2):** el "ícono de notificaciones del navbar" es el **ítem "Notificaciones" que ya existe en cada sidebar**. En lugar de navegar a una página, **abre un panel lateral** (`NotificationsPanel`, un `Box` fijo de ancho `min(380px, 100vw - sidebarWidth)`) que entra por el borde izquierdo junto al sidebar. Se reemplaza la fuente del badge por el conteo real del backend.

## Actualización 2026-10-24 — notificaciones separadas por rol

El backend ahora persiste `recipient_role` y separa el feed por rol activo. El front acompaña el contrato:

- `UnreadCountResponse` es `{ count, otherRoleCount }`: `count` alimenta el badge y el chip; `otherRoleCount` son las no leídas del otro rol STUDENT/TUTOR (0 para ADMIN).
- `useUnreadNotificationsCount()` devuelve el objeto completo. Los sidebars y el panel usan `data?.count`; `useMarkNotificationAsRead` resta 1 a `count` y **preserva** `otherRoleCount`.
- El panel renderiza `OtherRoleBanner` sobre las pestañas cuando `otherRoleCount > 0` y el rol activo es STUDENT o TUTOR. El banner muestra "Tenés novedades en modo {Alumno|Tutor}" y ofrece cambiar de rol reutilizando `RoleRedirectDialog` y los hooks `useSwitchTo{Student,Tutor}Role`.
- Al cambiar de rol se invalida el perfil destino, se actualiza el token con `login` y se navega a `/student/home` o `/tutor/home`.
- Las query keys siguen incluyendo el rol: al cambiar, cada rol tiene su propio `count` y `otherRoleCount`.

---

## Criterios de aceptación (Gherkin)

```gherkin
Feature: Centro de notificaciones (UI)

  Background:
    Given estoy autenticado como alumno o tutor

  Scenario: Badge con no leídas (CA 1)
    Given tengo 3 notificaciones sin leer
    When se renderiza el sidebar
    Then el ítem "Notificaciones" muestra un badge con "3"

  Scenario: Badge oculto sin no leídas (CA 1)
    Given no tengo notificaciones sin leer
    When se renderiza el sidebar
    Then el badge no se muestra

  Scenario: Badge acotado
    Given tengo más de 99 notificaciones sin leer
    Then el badge muestra "99+"

  Scenario: Banner de novedades en el otro rol
    Given tengo una cuenta dual STUDENT/TUTOR con el rol activo STUDENT
    And el backend informa otherRoleCount > 0
    When abro el panel de notificaciones
    Then veo el banner "Tenés novedades en modo Tutor"
    And puedo cambiar de rol y navegar a /tutor/home

  Scenario: Sin novedades en el otro rol
    Given el backend informa otherRoleCount = 0
    When abro el panel de notificaciones
    Then el banner del otro rol no se renderiza

  Scenario: Abrir el panel (CA 2)
    When hago click en el ítem "Notificaciones"
    Then se despliega el panel lateral junto al sidebar
    And no se navega a otra ruta
    And el ítem queda resaltado como activo mientras el panel está abierto
    And las notificaciones se listan en el orden que devuelve el backend (más reciente primero)

  Scenario: Pestañas del panel
    Given el panel está abierto
    Then la pestaña "No Leído" está seleccionada por defecto y consulta status=UNREAD
    When cambio a la pestaña "Leído"
    Then la lista se recarga con status=READ

  Scenario: Contenido de cada notificación (CA 3)
    When se renderiza una notificación
    Then muestra el ícono de su tipo en un tile de color, el título (o el mensaje si no hay título), el mensaje secundario y la fecha y hora (es-AR)
    And las no leídas se distinguen visualmente de las leídas: fondo `#F4F3FB`, título en peso 600 y un punto indicador azul; las leídas van en fondo blanco y peso 400
    And el estado se anuncia con texto accesible: "No leída: {message}" / "Leída: {message}"

  Scenario: Acción visible del item
    When el tipo de la notificación tiene acción para mi rol
    Then la fila muestra el texto de la acción alineado a la derecha ("Ver ›", "Calificar ›" o "Reclamar ›")

  Scenario: Enlace directo - Ver (CA 4)
    Given una notificación con acción navigate y ruta para mi rol
    When hago click en ella
    Then navego a la sección relacionada
    And el panel se cierra

  Scenario: Acción Calificar
    Given una notificación RATING_ENABLED con referenceId
    When hago click en ella
    Then se abre el popup de rating con ese referenceId sin navegar
    And el panel se cierra

  Scenario: Acción Reclamar
    Given una notificación SESSION_COMPLETED con referenceId
    When hago click en ella
    Then se abre el popup de reclamo con ese referenceId sin navegar
    And el panel se cierra

  Scenario: Marcar como leída al hacer click (CA 5)
    Given una notificación sin leer
    When hago click en ella
    Then se marca como leída sin esperar la respuesta del servidor
    And el badge baja en 1 de inmediato
    And si el servidor falla, el estado vuelve atrás

  Scenario: Click en notificación ya leída
    When hago click en una notificación leída
    Then se ejecuta su acción igual
    And no se envía ningún PATCH

  Scenario: Notificación sin acción para mi rol
    Given una notificación cuyo tipo no tiene ruta para mi rol
    When hago click en ella
    Then se marca como leída
    And no se navega

  Scenario: Cargar más
    Given hay más notificaciones que las de la primera página
    When hago click en "Cargar más"
    Then se agregan las siguientes al final de la lista sin perder las anteriores

  Scenario: Estados del panel
    Then mientras carga se muestran 4 skeletons
    And si falla la carga se muestra "No pudimos cargar tus notificaciones." con botón "Reintentar"
    And sin items en "No Leído" o "Todas" se muestra "Estás al día" / "No tienes notificaciones pendientes por ahora"
    And sin items en "Leído" se muestra "Sin notificaciones leídas" / "Las notificaciones que marques como leídas aparecerán acá"

  Scenario: Chip de no leídas en el encabezado
    Then el encabezado del panel muestra el conteo de no leídas en un chip circular
    And con más de 99 el chip muestra "99+"
    And el aria-label del chip conserva el total real ("150 notificaciones sin leer")

  Scenario: Cierre del panel
    When presiono Escape
    Then el panel se cierra
    When hago click fuera del panel (fondo transparente)
    Then el panel se cierra
    When hago click en el botón "Colapsar panel"
    Then el panel se cierra
    And al cerrarse el foco del teclado vuelve al ítem "Notificaciones" (la campana)

  Scenario: Actualización automática
    Given estoy en la app con la pestaña visible
    Then el conteo de no leídas se refresca cada 30 segundos y al volver el foco a la pestaña
    And con el panel abierto la lista también se refresca

  Scenario: Cierre de sesión
    When cierro sesión
    Then se descarta la caché de notificaciones
    And otro usuario que inicie sesión en el mismo navegador no ve las mías

  Scenario: Falla silenciosa del conteo
    Given el backend no responde (ej. arranque en frío)
    Then el polling del badge no muestra toasts de error
    And el badge conserva el último valor conocido

  Scenario: Accesibilidad
    Then el ítem es operable con teclado (Enter / Espacio) y anuncia la cantidad de no leídas
    And cada notificación es operable con teclado y anuncia si está leída
    And las pestañas del panel son operables con teclado y anuncian aria-selected
```

---

## Stack confirmado

React 19 + TypeScript, MUI 7 (`Box`, `Badge`, `Skeleton`, `Alert`, `Button`, `IconButton`, `Typography`), TanStack Query 5, Zustand 5, axios vía `httpClient` / `rawHttpClient`, `lucide-react` para íconos de tipo, `react-router-dom` 7. **Sin dependencias nuevas.** El panel NO usa `Popover` de MUI: es un `Box` fijo con `role="dialog"` + backdrop.

---

## Modelo de datos en frontend

Los tipos reflejan **exactamente** el contrato del backend (`NotificationResponse`, `UnreadCountResponse`, `PagedResponse`). Confirmar contra el DTO si el backend cambia.

```ts
// types/notification-type.type.ts  (mismo patrón que shared/types/role.type.ts)
export const NOTIFICATION_TYPE_VALUES = [
  "BOOKING_CONFIRMED",
  "BOOKING_CANCELLED",
  "SESSION_CONFIRMATION_REMINDER",
  "SESSION_CONFIRMED",
  "SESSION_NOT_CONFIRMED",
  "SESSION_COMPLETED",
  "FUNDS_TRANSFERRED",
  "FUNDS_SUSPENDED",
  "FUNDS_RELEASED",
  "SUBJECT_VALIDATION_UPDATED",
  "MATERIAL_REPORT_PROCESSED",
  "RATING_ENABLED",
  "ADMIN_VALIDATION_REQUEST_PENDING",
  "ADMIN_MATERIAL_REPORT_RECEIVED",
  "SESSION_CLAIM_UPDATE",
  "SESSION_CLAIM_COMMENT",
  "MATERIAL_REPORT_UPDATE",
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPE_VALUES)[number];
```

```ts
// interfaces/responses/notification.interface.ts
export interface NotificationResponse {
  notificationId: string;
  type: NotificationType;
  title: string | null; // título corto; si es null el ítem muestra solo message
  message: string; // ya viene en español
  referenceId: string | null; // id de la entidad relacionada (booking, claim, etc.)
  read: boolean;
  createdAt: string; // LocalDateTime ISO SIN zona: "2026-10-20T15:14:00"
}

// interfaces/responses/unread-count.interface.ts
export interface UnreadCountResponse {
  count: number;
  otherRoleCount: number;
}

// interfaces/responses/paged-notifications.interface.ts
export interface PagedNotificationsResponse {
  content: NotificationResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

// types/notification-read-filter.type.ts
export const NOTIFICATION_READ_FILTER_VALUES = ["ALL", "UNREAD", "READ"] as const;
export type NotificationReadFilter = (typeof NOTIFICATION_READ_FILTER_VALUES)[number];
```

> `createdAt` llega **sin zona** y ya en hora de Argentina. `new Date("2026-10-20T15:14:00")` lo interpreta como hora local y muestra la misma hora: **no agregar `Z`**.

### Configuración por tipo (ícono + colores + acción + ruta) — un único lugar

```ts
// constants/notification-type-config.ts
// Cada entrada: icon (lucide), tileColor, iconColor, action { kind, label } y routes por rol.
// action.kind: "navigate" | "rating" | "claim"; label es el texto visible ("Ver" / "Calificar" / "Reclamar").
// routes: null = el tipo no tiene pantalla para ese rol (solo marca como leída).
```

Paletas de tile: GREEN `#DDF5E6` / icono `#2F9E5F` · RED `#FBDEDE` / `#D64545` · YELLOW `#FCEFCA` / `#D9A13B` · LAVENDER `#EDEBFA` / `#5865C8`.

| Tipo                               | Ícono (lucide)         | Paleta   | Acción        | Ruta STUDENT             | Ruta TUTOR          |
| ---------------------------------- | ---------------------- | -------- | ------------- | ------------------------ | ------------------- |
| `BOOKING_CONFIRMED`                | `CalendarCheck`        | GREEN    | Ver           | `/student/classes`       | `/tutor/classes`    |
| `BOOKING_CANCELLED`                | `CalendarX`            | RED      | Ver           | `/student/classes`       | `/tutor/classes`    |
| `SESSION_CONFIRMATION_REMINDER`    | `Timer`                | YELLOW   | Ver           | `/student/classes`       | `/tutor/classes`    |
| `SESSION_CONFIRMED`                | `BellRing`             | GREEN    | Ver           | `/student/classes`       | `/tutor/classes`    |
| `SESSION_NOT_CONFIRMED`            | `TimerOff`             | RED      | Ver           | `/student/classes`       | `/tutor/classes`    |
| `SESSION_COMPLETED`                | `CircleCheck`          | YELLOW   | **Reclamar**  | `/student/classes`       | `/tutor/classes`    |
| `FUNDS_TRANSFERRED`                | `Wallet`               | GREEN    | Ver           | `/student/classes`       | `/tutor/classes`    |
| `FUNDS_SUSPENDED`                  | `Wallet`               | YELLOW   | Ver           | `/student/classes`       | `/tutor/requests`   |
| `FUNDS_RELEASED`                   | `Wallet`               | GREEN    | Ver           | `/student/classes`       | `/tutor/requests`   |
| `SUBJECT_VALIDATION_UPDATED`       | `BadgeCheck`           | LAVENDER | Ver           | `null`                   | `/tutor/profile` \* |
| `MATERIAL_REPORT_PROCESSED`        | `FileExclamationPoint` | LAVENDER | Ver           | `/student/complaints` \* | `/tutor/content` \* |
| `RATING_ENABLED`                   | `Star`                 | GREEN    | **Calificar** | `/student/classes`       | `/tutor/classes`    |
| `ADMIN_VALIDATION_REQUEST_PENDING` | `ClipboardList`        | LAVENDER | Ver           | `null`                   | `null`              |
| `ADMIN_MATERIAL_REPORT_RECEIVED`   | `FileExclamationPoint` | LAVENDER | Ver           | `null`                   | `null`              |
| `SESSION_CLAIM_UPDATE`             | `ClipboardList`        | LAVENDER | Ver           | `/student/complaints`    | `/tutor/requests`   |
| `SESSION_CLAIM_COMMENT`            | `MessageSquare`        | LAVENDER | Ver           | `/student/complaints`    | `/tutor/requests`   |
| `MATERIAL_REPORT_UPDATE`           | `FileExclamationPoint` | LAVENDER | Ver           | `/student/complaints`    | `/tutor/requests`   |

\* Provisorio: confirmar al implementar US-22 / US-24 / US-27.

Reglas:

- `getNotificationRoute(type, role)` → `string | null`. Si el rol no es STUDENT ni TUTOR (ej. ADMIN) devuelve `null`.
- `getNotificationAction(type, role)` → `{ kind: "none" }` | `{ kind: "rating", label }` | `{ kind: "claim", label }` | `{ kind: "navigate", label, route }`. Los tipos `rating`/`claim` **no navegan**: abren el popup (`useRatingPopupStore.open(referenceId)` / `useClaimPopupStore.open(referenceId)`) solo si hay `referenceId`.
- **Hoy los destinos de navegación son `UnderConstructionPage`.** El enlace igual debe funcionar; cuando se construyan las pantallas de detalle, se cambia solo este archivo (por ejemplo a `/student/classes/{referenceId}`).
- Las rutas son **internas** (empiezan con `/`); nunca construir una ruta con texto que venga del servidor (`message`) ni navegar a una URL externa.
- Tipo desconocido (fuera de `NOTIFICATION_TYPE_VALUES`): `getNotificationConfig` cae en `UNKNOWN_TYPE_CONFIG` (ícono `Bell`, tile LAVENDER, `routes` null/null) y la acción queda `none`; **no rompe el render**.
- Nombres de ícono verificados contra `lucide-react@0.577.0` (nombres canónicos, no alias deprecados).

---

## Ubicación de archivos / componentes

```
src/modules/notifications/
├── api/
│   └── notifications.api.ts            // getNotifications, getUnreadCount, markNotificationAsRead
├── components/
│   ├── NotificationsPanel.tsx          // el panel lateral (drawer)
│   ├── NotificationsPanel.types.ts
│   ├── NotificationItem.tsx            // una fila
│   ├── NotificationItem.types.ts
│   ├── NotificationsList.tsx           // lista + estados (loading / error / vacío / cargar más)
│   └── NotificationsList.types.ts
├── constants/
│   ├── notification-query-keys.ts      // ÚNICA fuente de query keys (con rol)
│   ├── notification-type-config.ts     // ícono + colores + acción + ruta por tipo y rol
│   └── notification-polling.ts         // 30_000, PAGE_SIZE = 20
├── hooks/
│   ├── useNotifications.ts             // useInfiniteQuery
│   ├── useUnreadNotificationsCount.ts
│   └── useMarkNotificationAsRead.ts    // optimista
├── interfaces/responses/
│   ├── notification.interface.ts
│   ├── unread-count.interface.ts
│   └── paged-notifications.interface.ts
├── types/
│   ├── notification-type.type.ts
│   └── notification-read-filter.type.ts
└── utils/
    └── format-notification-date.ts     // Intl es-AR
```

Archivos existentes modificados por esta historia:

| Archivo                                          | Cambio                                                                                                                                                                                                                                                   |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `modules/student/components/StudentSidebar.tsx`  | El ítem con `badge: "notifications"` abre el panel (`isNotificationsOpen` en vez de `navigate`); conteo de `useUnreadNotificationsCount()`; activo mientras el panel está abierto; `ref` en el ítem para devolver el foco al cerrar (click fuera / Esc). |
| `modules/tutor/components/TutorSidebar.tsx`      | Idem.                                                                                                                                                                                                                                                    |
| `modules/student/hooks/useStudentBadgesStore.ts` | `notificationsCount` y su setter eliminados (queda `complaintsCount`).                                                                                                                                                                                   |
| `modules/tutor/hooks/useTutorBadgesStore.ts`     | `notificationsCount` y su setter eliminados (queda `requestsCount`).                                                                                                                                                                                     |
| `routes/StudentRoutes.tsx`                       | Ruta `notifications` (`UnderConstructionPage`) eliminada.                                                                                                                                                                                                |
| `routes/TutorRoutes.tsx`                         | Ruta `notifications` eliminada.                                                                                                                                                                                                                          |
| `modules/auth/logout/hooks/useLogout.ts`         | `queryClient.removeQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all })` antes del `logout()`.                                                                                                                                                             |

---

## Capa de datos

### Query keys (un solo archivo, con rol)

```ts
export const NOTIFICATION_QUERY_KEYS = {
  all: ["notifications"] as const,
  listBase: ["notifications", "list"] as const,
  list: (role: string) => ["notifications", "list", role],
  unreadCountBase: ["notifications", "unread-count"] as const,
  unreadCount: (role: string) => ["notifications", "unread-count", role],
};
```

- Las operaciones por prefijo (cancel / getQueriesData / setQueriesData / invalidate / removeQueries) usan `all`, `listBase` o `unreadCountBase`.
- Las operaciones exactas (setQueryData / getQueryData del contador) usan `list(role)` / `unreadCount(role)`; el rol sale de `useAuthStore((s) => s.authResponse?.role) ?? "ANONYMOUS"` — el mismo cálculo en `useUnreadNotificationsCount`, `useNotifications` y `useMarkNotificationAsRead` para que las keys coincidan.
- Toda lectura, escritura e invalidación usa estas constantes. No escribir arrays de key sueltos en hooks ni componentes (ya hubo un desalineamiento de keys en US-06).

### API (`notifications.api.ts`)

| Función                                                                  | Cliente             | Motivo                                                                                                          |
| ------------------------------------------------------------------------ | ------------------- | --------------------------------------------------------------------------------------------------------------- |
| `getNotifications({ page, size, status })` → `GET /api/v1/notifications` | `httpClient`        | Acción del usuario; si falla, el toast de error es válido. `status` es `ALL` / `UNREAD` / `READ` (query param). |
| `getUnreadCount()` → `GET /api/v1/notifications/unread-count`            | **`rawHttpClient`** | Polling: no debe tirar un toast cada 30 s si el backend está dormido (Render free).                             |
| `markNotificationAsRead(id)` → `PATCH /api/v1/notifications/{id}/read`   | **`rawHttpClient`** | El click ya navegó; el rollback visual alcanza, sin toast.                                                      |

Importar el cliente desde `@/shared/lib/httpClient`. Nunca `axios` directo.

### Hooks

**`useUnreadNotificationsCount()`**

- `useQuery` con `NOTIFICATION_QUERY_KEYS.unreadCount(role)`.
- `refetchInterval: 30_000`, `refetchIntervalInBackground: false`, `refetchOnWindowFocus: true`.
- `enabled` solo si `useAuthStore((s) => s.isAuthenticated)`.
- Devuelve el objeto completo (`{ count, otherRoleCount }`); los consumidores usan `data?.count` o `data?.otherRoleCount`. Sin `select`, para no perder el otro rol en la caché.
- `retry: 1`. Con error conserva el último valor (comportamiento por defecto de React Query).

**`useNotifications(status: NotificationReadFilter, enabled: boolean)`**

- `useInfiniteQuery` con `NOTIFICATION_QUERY_KEYS.list(role)` + `status`, `PAGE_SIZE = 20`, `initialPageParam: 0`, `getNextPageParam: (last) => (last.hasNext ? last.page + 1 : undefined)`.
- `refetchInterval: 30_000` solo cuando `enabled`.
- Los items del panel son `data.pages.flatMap((p) => p.content)`. **No reordenar en el cliente**: el orden lo define el backend.

**`useMarkNotificationAsRead()`** — `useMutation` con actualización optimista:

1. `onMutate`: `cancelQueries` de `listBase` y `unreadCountBase`; guardar snapshot de ambos (`previousLists` por prefijo y `previousUnreadCount` por key exacta con rol); en la lista marcar `read: true` el item; en el contador restar 1 (mínimo 0) con `unreadCount(role)` **preservando `otherRoleCount`** (`{ ...old, count: Math.max(0, old.count - 1) }`).
2. `onError`: restaurar ambos snapshots.
3. `onSettled`: `invalidateQueries` de `unreadCountBase` y `listBase` (reconcilia con el servidor).

- Solo se invoca si el item está **sin leer**.

---

## Componentes clave

### Integración en los sidebars

- El ítem de notificaciones deja de llamar `navigate(path)`: en `onClick` / `onKeyDown` (Enter, Espacio) alterna `isNotificationsOpen`. Los demás ítems siguen igual.
- `aria-label` del ítem: `"Notificaciones, N sin leer"` (o `"Notificaciones"` si es 0); `aria-haspopup="dialog"` y `aria-expanded={isNotificationsOpen}`.
- El `Badge` usa `badgeContent={count}`, `max={99}` (muestra "99+") y **no** `showZero` (MUI lo oculta en 0, que es el CA 1). Conservar el `badgeSx` existente.
- Ref del ítem (`notificationsRef`) + efecto: al pasar de abierto a cerrado, `notificationsRef.current?.focus()` — el foco del teclado vuelve a la campana (también con Esc o click fuera).
- Renderizar `<NotificationsPanel open={isNotificationsOpen} onClose={...} sidebarWidth={...} />` dentro del sidebar.

### `NotificationsPanel`

- `Box` fijo (`position: fixed`, `role="dialog"`, `aria-label="Notificaciones"`, `zIndex: 100`) a la derecha del sidebar: `left: sidebarWidth`, ancho `min(380px, 100vw - sidebarWidth)`, alto 100 vh, borde derecho `#E8E8F0`, sombra. Devuelve `null` cuando está cerrado.
- Backdrop `Box` (`aria-hidden`, `data-testid="notifications-backdrop"`, `zIndex: 99`, transparente, `inset: 0`): click fuera cierra el panel (el sidebar queda por encima con `zIndex: 100`, así que el ítem sigue clickeable para alternar).
- Esc cierra (listener en `window` mientras `open`).
- Encabezado: título "Notificaciones" · chip con el conteo de no leídas (aria-label `"{N} notificaciones sin leer"`, muestra `"99+"` con `minWidth: 26` y padding cuando supera 99) · `IconButton` "Colapsar panel" (`ArrowLeftToLine`) que llama `onClose`.
- Sobre las pestañas, `<OtherRoleBanner otherRoleCount={data?.otherRoleCount ?? 0} />`; el banner se oculta solo si el contador es 0, no hay sesión o el rol activo no es STUDENT/TUTOR.
- Pestañas (`role="tablist"`): "No Leído" (`UNREAD`, seleccionada por defecto) y "Leído" (`READ`), con `role="tab"`, `aria-selected` y Enter / Espacio.
- Contenido: `<NotificationsList status={status} onClose={onClose} />`.
- Sin `Popover` de MUI ni `anchorEl`: el estado vive en el sidebar. Estilos con `sx`; **sin `style={{}}`**.

### `NotificationsList`

- `isLoading` → 4 `Skeleton` de fila (`variant="rectangular"`, alto 64).
- `isError` → `Alert severity="error"` con "No pudimos cargar tus notificaciones." y botón "Reintentar" que llama `refetch`.
- Sin items → bloque propio (ícono `Bell` en círculo LAVENDER 88 px + título + subtítulo), variando según la pestaña (`EMPTY_STATE`):
  - `ALL` / `UNREAD`: **"Estás al día"** / "No tienes notificaciones pendientes por ahora".
  - `READ`: "Sin notificaciones leídas" / "Las notificaciones que marques como leídas aparecerán acá".
- `hasNextPage` → botón "Cargar más" (deshabilitado con `isFetchingNextPage`, texto "Cargando…").

### `NotificationItem`

- Layout: tile de color del tipo (40×40, radio 10, `tileColor`) con el ícono (20 px, `iconColor`) · columna con **título** (`title ?? message`, peso 600 si no leída / 400 si leída) · punto indicador `#3F4CAE` de 8 px solo si no leída · mensaje secundario (12 px, 2 líneas con `line-clamp`, solo si `title != null`) · fecha-hora (11 px) · acción (12 px, 600, `#3F4CAE`, alineada a la derecha, `"{label} ›"`) si `action.kind !== "none"`.
- No leída: fondo `#F4F3FB`, hover `#EDECF9`. Leída: fondo blanco, hover `#F8F7FE`. Además del color, el estado se comunica con `aria-label="No leída: {message}"` / `"Leída: {message}"` para no depender solo del color.
- Elemento operable (`role="button"`, `tabIndex={0}`, Enter / Espacio) como los ítems de sidebar.
- `onClick`:
  1. Si `!read` → `markAsRead(notificationId)`. **No** esperar la respuesta.
  2. `action = getNotificationAction(type, authResponse.role)`.
  3. `rating` → `openRatingPopup(referenceId)`; `claim` → `openClaimPopup(referenceId)`; `navigate` → `navigate(action.route)`; `none` → nada.
  4. `onClose()`.
- Fecha: `format-notification-date.ts` con `new Intl.DateTimeFormat("es-AR", { dateStyle: "short", timeStyle: "short" })`.

---

## No hacer

- No llamar axios/`httpClient` desde componentes: siempre `api/` → `hooks/` → componente.
- No usar `useEffect` + `fetch` ni `setInterval` propio para el polling: usar `refetchInterval` de React Query.
- No usar el store de Zustand (`notificationsCount`) como fuente del badge; una sola fuente de verdad: el query del backend.
- No usar `httpClient` para el polling del conteo ni para marcar como leída (provocaría toasts cada 30 s con el backend dormido y logout inesperado).
- No reordenar ni filtrar notificaciones en el cliente.
- No usar `any`, `style={{}}` ni declarar interfaces/props dentro del archivo del componente.
- No hardcodear rutas ni íconos fuera de `notification-type-config.ts`.
- No navegar a rutas construidas con datos del servidor ni a URLs externas.
- No agregar `Z` al parsear `createdAt`.
- No crear layout, rutas ni pantallas de ADMIN: la historia no las incluye (ver abajo).
- No construir la página `/…/notifications` ni "Ver todas": el panel es la única superficie.
- No agregar "marcar todas como leídas", borrado ni preferencias de notificación.
- No agregar librerías (toasts, websockets, date-fns): `Intl` + MUI + lo que ya hay.
- No usar `shared/` para esto: lo usan varios módulos, pero tiene su propio módulo `notifications`.
- No usar `Popover` de MUI ni `anchorEl`: el panel es un drawer fijo con backdrop (decisión del PR #47).
- No escribir query keys sueltas fuera de `notification-query-keys.ts` ni olvidar el parámetro de rol en las keys exactas.

---

## Fuera de alcance / decisiones pendientes

1. **ADMIN (CA 7).** El backend ya genera las notificaciones para administradores, pero el front no tiene shell de admin. `NotificationsPanel`, `NotificationsList` y los hooks **no dependen del rol** salvo por `getNotificationRoute` / `getNotificationAction` (ya reciben el rol como parámetro), así que cuando exista el layout de admin se monta el mismo ítem y se agregan las rutas `ADMIN_*` en `notification-type-config.ts`.
2. **Destinos de los enlaces.** Hoy son `UnderConstructionPage`. Al construir las pantallas de detalle (clases, material, etc.) hay que actualizar solo la config de rutas.
3. **Ver todas / página completa:** no incluida; si el panel con "Cargar más" resulta corto, se evalúa una historia aparte.
4. **Marcar todas como leídas:** no está en los criterios; sumarlo es un botón en el encabezado + endpoint `PATCH /read-all` en backend.
5. **Banner "Tenés novedades en el otro rol": implementado.** Se muestra dentro del panel cuando `otherRoleCount > 0`; reutiliza el flujo de cambio de rol (`RoleRedirectDialog` + `useSwitchTo{Student,Tutor}Role`). No hay banner fuera del panel.
6. **Acciones "Calificar" y "Reclamar" dependen del backend.** El front ya las tiene configuradas (`RATING_ENABLED` → popup de rating, `SESSION_COMPLETED` → popup de reclamo), pero solo son clickeables útiles cuando el backend emite esos tipos (emisión de `RATING_ENABLED` al confirmar y `SESSION_COMPLETED` al completar: PR #111, item 10).
7. **`SESSION_CLAIM_UPDATE` / `SESSION_CLAIM_COMMENT` / `MATERIAL_REPORT_UPDATE`** llegan cuando el backend del PR #111 emita eventos de claim y de reporte de material; las rutas de soporte (`/student/complaints`, `/tutor/requests`) ya existen.

---

## Tests

Vitest + Testing Library (config en `vitest.config.ts`, setup en `test/setup.ts`), carpeta `test/modules/notifications/` más `test/modules/student/StudentSidebar.test.tsx` (foco de vuelta a la campana). Mockear `@/modules/notifications/api/notifications.api` en los tests de UI (o `@/shared/lib/httpClient`, los dos clientes) y envolver con `QueryClientProvider` y `MemoryRouter`. Si se agregan casos al directorio de QA (`docs/testing/cases`), seguir el modelo dual Markdown/YAML ya definido en `qa-spec-test-automation.md`.

Cobertura actual (suite de notificaciones en verde): `getNotificationRoute.test.ts` (rutas por tipo - STUDENT / TUTOR / ADMIN + desconocido, y `getNotificationAction`: navigate / rating / claim / none), `NotificationItem.test.tsx` (leída, no leída, fecha, visual), `NotificationsList.test.tsx` (loading, error, vacíos por pestaña, cargar más), `NotificationsPanel.test.tsx` (header, chip 99+, pestañas, backdrop, colapsar, banner del otro rol oculto/visible), `badge.test.tsx`, `useMarkNotificationAsRead.test.tsx` (optimismo, rollback y preservación de `otherRoleCount`) y `StudentSidebar.test.tsx`.

> Ojo con Testing Library: `matches()` normaliza solo el lado DOM y compara el esperado **en crudo**; `formatNotificationDate` produce un NBSP (U+00A0) en "p. m." → en los tests de fecha usar `.replace(/\s+/g, " ")` sobre el esperado.

---

## Definition of Done

- [x] `UnreadCountResponse` incluye `otherRoleCount`; el badge/chip usa `count` y el banner usa `otherRoleCount`
- [x] `useUnreadNotificationsCount` devuelve el objeto completo y el PATCH optimista preserva `otherRoleCount`
- [x] `OtherRoleBanner` dentro del panel, visible con `otherRoleCount > 0`, con cambio de rol vía `RoleRedirectDialog`
- [x] Tests del banner (oculto/visible) y de la preservación de `otherRoleCount` en el hook optimista
- [x] Módulo `src/modules/notifications` con la estructura indicada; tipos/props en archivos separados
- [x] Tipos de `interfaces/responses` alineados 1:1 con los DTO del backend (17 tipos de notificación)
- [x] `NOTIFICATION_QUERY_KEYS` como única fuente de keys, con rol; ningún array de key suelto
- [x] `getUnreadCount` y `markNotificationAsRead` usan `rawHttpClient`; `getNotifications` usa `httpClient`
- [x] Badge en ambos sidebars con conteo real, oculto en 0, "99+" como máximo
- [x] Click en el ítem abre el panel sin navegar; accesible por teclado y con `aria-label` con cantidad
- [x] Lista con orden del backend, ícono por tipo, texto, fecha-hora `es-AR` y estado leída / no leída (con texto accesible, no solo color)
- [x] Pestañas "No Leído" / "Leído" con filtro `status` en la query
- [x] Click: marca como leída de forma optimista (badge baja al instante), rollback ante error, ejecuta la acción (navegar / popup de rating / popup de reclamo), cierra el panel
- [x] Click en una ya leída no dispara PATCH
- [x] Estados de loading (skeleton), error con "Reintentar", vacío por pestaña y "Cargar más" resueltos
- [x] Chip del encabezado con no leídas, acotado a "99+" y aria-label con el total real
- [x] Cierre con Esc, click fuera (backdrop) y botón colapsar; el foco vuelve a la campana
- [x] Polling cada 30 s y refetch al volver el foco; sin toasts en fallos del polling
- [x] `useLogout` descarta la caché de notificaciones
- [x] `notificationsCount` eliminado de ambos badge stores; rutas `notifications` placeholder eliminadas
- [x] Config de tipo → ícono / colores / acción / ruta en un único archivo; tipos desconocidos no rompen el render
- [x] Tests: `getNotificationRoute` y `getNotificationAction` (todos los tipos × STUDENT / TUTOR / ADMIN); `NotificationItem` (leída, no leída, fecha, visual); hook optimista (éxito y rollback); badge (0, 3, 100 → "99+"); lista (loading, error, vacíos, cargar más); panel (pestañas, backdrop, chip 99+); sidebar (foco a la campana)
- [ ] `npm run lint` en verde — hoy falla por un error **preexistente** en `src/routes/RoutesProvider.tsx:21` (hook condicional, ajeno a esta historia)
- [ ] `npm run type-check`, `npm test` y `npx prettier --check` en verde en CI
- [ ] Verificado a mano con dos usuarios en el mismo navegador: cerrar sesión no deja notificaciones del anterior
- [ ] Commits en español con prefijo convencional (`feat:`, `fix:`, `refactor:`, `test:`)
