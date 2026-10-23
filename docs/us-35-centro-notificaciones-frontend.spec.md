# US-35 — Centro de notificaciones (Frontend)

## Metadata

| Campo | Valor |
|---|---|
| ID Historia | US-35 |
| Épica | — |
| Story Points | 8 (backend + frontend combinados) |
| Prioridad | BAJA |
| Módulo | notifications (navegación) |
| Historias relacionadas | US-28 / US-29 / US-30 (navbar por rol), US-10, US-11, US-15, US-18, US-22, US-24 / US-27, US-41 |
| Repo / branch | `TetraCodeTeam/knowlink-frontend` (`julian-salvucci`) |
| Depende de | `us-35-centro-notificaciones-backend.spec.md` — `GET /api/v1/notifications`, `GET /api/v1/notifications/unread-count`, `PATCH /api/v1/notifications/{id}/read` |
| Verificado contra | `knowlink-frontend@7f29caf` (main) |

**Convención de idioma:** identificadores (componentes, hooks, tipos, props, archivos) en **inglés**. Todo texto visible en la UI en **español**. Las interfaces/props van en archivos separados, nunca dentro del componente. Prettier: doble comilla, `;`, trailing comma ES5, 100 columnas, 2 espacios.

---

## Contexto de UX y estado actual del front

Verificado en el código:

- **No hay navbar superior para todos los roles.** Alumno tiene `StudentSidebar` + `StudentTopbar`; tutor solo `TutorSidebar`. Ambos sidebars **ya tienen** un ítem "Notificaciones" (ícono `Bell`) con un `Badge` MUI.
- Ese badge hoy se alimenta de `useStudentBadgesStore.notificationsCount` / `useTutorBadgesStore.notificationsCount`, que **nunca se setean** (siempre 0).
- Ese ítem navega a `/student/notifications` y `/tutor/notifications`, ambas rutas apuntan a `UnderConstructionPage`.
- **No existe layout, rutas ni login redirect para ADMIN** (`RoleRoute` solo conoce STUDENT y TUTOR; `RoleRedirect` manda a todo lo que no es TUTOR a `/student/home`).
- `useLogout` **no limpia la caché de React Query**.
- `httpClient` muestra un toast de error y hace logout en 401 ante cualquier fallo; `rawHttpClient` no.
- Las pantallas destino de la mayoría de las notificaciones (`/student/classes`, `/tutor/classes`, etc.) hoy son `UnderConstructionPage`.

**Decisión de diseño (CA 1 y 2):** el "ícono de notificaciones del navbar" es el **ítem "Notificaciones" que ya existe en cada sidebar**. En lugar de navegar a una página, **abre un panel (Popover MUI) anclado al ítem**. Se reemplaza la fuente del badge por el conteo real del backend.

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

  Scenario: Abrir el panel (CA 2)
    When hago click en el ítem "Notificaciones"
    Then se despliega un panel anclado al ítem
    And no se navega a otra ruta
    And las notificaciones se listan de más reciente a más antigua

  Scenario: Contenido de cada notificación (CA 3)
    When se renderiza una notificación
    Then muestra un ícono según su tipo, el texto, la fecha y hora (es-AR) y su estado leída / no leída
    And las no leídas se distinguen visualmente de las leídas

  Scenario: Enlace directo (CA 4)
    Given una notificación cuyo tipo tiene ruta para mi rol
    When hago click en ella
    Then navego a la sección relacionada
    And el panel se cierra

  Scenario: Marcar como leída al hacer click (CA 5)
    Given una notificación sin leer
    When hago click en ella
    Then se marca como leída sin esperar la respuesta del servidor
    And el badge baja en 1 de inmediato
    And si el servidor falla, el estado vuelve atrás

  Scenario: Click en notificación ya leída
    When hago click en una notificación leída
    Then se navega igual
    And no se envía ningún PATCH

  Scenario: Notificación sin ruta para mi rol
    Given una notificación cuyo tipo no tiene ruta para mi rol
    When hago click en ella
    Then se marca como leída
    And no se navega

  Scenario: Cargar más
    Given hay más notificaciones que las de la primera página
    When hago click en "Cargar más"
    Then se agregan las siguientes al final de la lista sin perder las anteriores

  Scenario: Estados del panel
    Then mientras carga se muestran skeletons
    And si falla la carga se muestra un mensaje de error en español con botón "Reintentar"
    And si no hay notificaciones se muestra "No tenés notificaciones"

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
```

---

## Stack confirmado

React 19 + TypeScript, MUI 7 (`Popover`, `Badge`, `List`, `Skeleton`, `Alert`, `Button`), TanStack Query 5, Zustand 5, axios vía `httpClient` / `rawHttpClient`, `lucide-react` para íconos de tipo, `react-router-dom` 7. **Sin dependencias nuevas.**

---

## Modelo de datos en frontend

Los tipos reflejan **exactamente** el contrato del backend (`NotificationResponse`, `UnreadCountResponse`, `PagedResponse`). Confirmar contra el DTO si el backend cambia.

```ts
// types/notification-type.type.ts  (mismo patrón que shared/types/role.type.ts)
export const NOTIFICATION_TYPE_VALUES = [
  "BOOKING_CONFIRMED",
  "BOOKING_CANCELLED",
  "SESSION_CONFIRMATION_REMINDER",
  "SESSION_NOT_CONFIRMED",
  "SESSION_COMPLETED",
  "FUNDS_TRANSFERRED",
  "SUBJECT_VALIDATION_UPDATED",
  "MATERIAL_REPORT_PROCESSED",
  "RATING_ENABLED",
  "ADMIN_VALIDATION_REQUEST_PENDING",
  "ADMIN_MATERIAL_REPORT_RECEIVED",
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPE_VALUES)[number];
```

```ts
// interfaces/responses/notification.interface.ts
export interface NotificationResponse {
  notificationId: string;
  type: NotificationType;
  message: string;            // ya viene en español
  referenceId: string | null; // id de la entidad relacionada (booking, etc.)
  read: boolean;
  createdAt: string;          // LocalDateTime ISO SIN zona: "2026-10-20T15:14:00"
}

// interfaces/responses/unread-count.interface.ts
export interface UnreadCountResponse {
  count: number;
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
```

> `createdAt` llega **sin zona** y ya en hora de Argentina. `new Date("2026-10-20T15:14:00")` lo interpreta como hora local y muestra la misma hora: **no agregar `Z`**.

### Configuración por tipo (ícono + ruta) — un único lugar

```ts
// constants/notification-type-config.ts
// Ruta por rol. null = el tipo no tiene pantalla para ese rol (solo marca como leída).
```

| Tipo | Ícono (lucide) | Ruta STUDENT | Ruta TUTOR |
|---|---|---|---|
| `BOOKING_CONFIRMED` | `CalendarCheck` | `/student/classes` | `/tutor/classes` |
| `BOOKING_CANCELLED` | `CalendarX` | `/student/classes` | `/tutor/classes` |
| `SESSION_CONFIRMATION_REMINDER` | `BellRing` | `/student/classes` | `/tutor/classes` |
| `SESSION_NOT_CONFIRMED` | `TimerOff` | `/student/classes` | `/tutor/classes` |
| `SESSION_COMPLETED` | `CircleCheck` | `/student/classes` | `/tutor/classes` |
| `FUNDS_TRANSFERRED` | `Wallet` | `/student/classes` | `/tutor/classes` |
| `SUBJECT_VALIDATION_UPDATED` | `BadgeCheck` | `null` | `/tutor/profile` * |
| `MATERIAL_REPORT_PROCESSED` | `FileExclamationPoint` | `/student/complaints` * | `/tutor/content` * |
| `RATING_ENABLED` | `Star` | `/student/classes` | `/tutor/classes` |
| `ADMIN_VALIDATION_REQUEST_PENDING` | `ClipboardList` | `null` | `null` |
| `ADMIN_MATERIAL_REPORT_RECEIVED` | `FileExclamationPoint` | `null` | `null` |

\* Provisorio: confirmar al implementar US-22 / US-24 / US-27.

Reglas:
- La función `getNotificationRoute(type, role)` devuelve `string | null`. Si el rol no es STUDENT ni TUTOR (ej. ADMIN) devuelve `null`.
- **Hoy los destinos son `UnderConstructionPage`.** El enlace igual debe funcionar; cuando se construyan las pantallas de detalle, se cambia solo este archivo (por ejemplo a `/student/classes/{referenceId}`).
- Las rutas son **internas** (empiezan con `/`); nunca construir una ruta con texto que venga del servidor (`message`) ni navegar a una URL externa.
- Nombres de ícono verificados contra `lucide-react@0.577.0` (se usan los nombres canónicos, no los alias deprecados).

---

## Ubicación de archivos / componentes

```
src/modules/notifications/
├── api/
│   └── notifications.api.ts            // getNotifications, getUnreadCount, markNotificationAsRead
├── components/
│   ├── NotificationsPopover.tsx        // el panel
│   ├── NotificationsPopover.types.ts
│   ├── NotificationItem.tsx            // una fila
│   ├── NotificationItem.types.ts
│   ├── NotificationsList.tsx           // lista + estados (loading / error / vacío / cargar más)
│   └── NotificationsList.types.ts
├── constants/
│   ├── notification-query-keys.ts      // ÚNICA fuente de query keys
│   ├── notification-type-config.ts     // ícono + ruta por tipo y rol
│   └── notification-polling.ts         // 30_000, PAGE_SIZE = 20
├── hooks/
│   ├── use-notifications.ts            // useInfiniteQuery
│   ├── use-unread-notifications-count.ts
│   └── use-mark-notification-as-read.ts// optimista
├── interfaces/responses/
│   ├── notification.interface.ts
│   ├── unread-count.interface.ts
│   └── paged-notifications.interface.ts
├── types/
│   └── notification-type.type.ts
└── utils/
    └── format-notification-date.ts     // Intl es-AR
```

Archivos existentes a modificar:

| Archivo | Cambio |
|---|---|
| `modules/student/components/StudentSidebar.tsx` | El ítem con `badge: "notifications"` abre el popover (no `navigate`); el conteo sale de `useUnreadNotificationsCount()`; se mantiene el estado activo mientras el panel está abierto. |
| `modules/tutor/components/TutorSidebar.tsx` | Idem. |
| `modules/student/hooks/useStudentBadgesStore.ts` | Quitar `notificationsCount` y `setNotificationsCount` (dejar `complaintsCount`). |
| `modules/tutor/hooks/useTutorBadgesStore.ts` | Quitar `notificationsCount` y su setter (dejar `requestsCount`). |
| `routes/StudentRoutes.tsx` | Quitar la ruta `notifications` (`UnderConstructionPage`). |
| `routes/TutorRoutes.tsx` | Quitar la ruta `notifications`. |
| `modules/auth/logout/hooks/useLogout.ts` | En `onSettled`, antes de `logout()`: `queryClient.removeQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all })` (usar `useQueryClient`). |

---

## Capa de datos

### Query keys (un solo archivo)
```ts
export const NOTIFICATION_QUERY_KEYS = {
  all: ["notifications"] as const,
  list: ["notifications", "list"] as const,
  unreadCount: ["notifications", "unread-count"] as const,
};
```
Toda lectura, escritura, `setQueryData` e `invalidateQueries` usa estas constantes. No escribir arrays de key sueltos en hooks ni componentes (ya hubo un desalineamiento de keys en US-06).

### API (`notifications.api.ts`)

| Función | Cliente | Motivo |
|---|---|---|
| `getNotifications({ page, size })` → `GET /api/v1/notifications` | `httpClient` | Acción del usuario; si falla, el toast de error es válido. |
| `getUnreadCount()` → `GET /api/v1/notifications/unread-count` | **`rawHttpClient`** | Polling: no debe tirar un toast cada 30 s si el backend está dormido (Render free). |
| `markNotificationAsRead(id)` → `PATCH /api/v1/notifications/{id}/read` | **`rawHttpClient`** | El click ya navegó; el rollback visual alcanza, sin toast. |

Importar el cliente desde `@/shared/lib/httpClient`. Nunca `axios` directo.

### Hooks

**`useUnreadNotificationsCount()`**
- `useQuery` con `NOTIFICATION_QUERY_KEYS.unreadCount`.
- `refetchInterval: 30_000`, `refetchIntervalInBackground: false`, `refetchOnWindowFocus: true`.
- `enabled` solo si `useAuthStore((s) => s.isAuthenticated)`.
- `select: (d) => d.count`; el consumidor usa `data ?? 0`.
- `retry: 1`. Con error conserva el último valor (comportamiento por defecto de React Query).

**`useNotifications(enabled: boolean)`**
- `useInfiniteQuery` con `NOTIFICATION_QUERY_KEYS.list`, `PAGE_SIZE = 20`, `initialPageParam: 0`, `getNextPageParam: (last) => (last.hasNext ? last.page + 1 : undefined)`.
- `enabled` = panel abierto; `refetchInterval: 30_000` solo mientras está abierto.
- Los items del panel son `data.pages.flatMap((p) => p.content)`. **No reordenar en el cliente**: el orden lo define el backend.

**`useMarkNotificationAsRead()`** — `useMutation` con actualización optimista:
1. `onMutate`: `cancelQueries` de `list` y `unreadCount`; guardar snapshot de ambos; en `list` marcar `read: true` el item; en `unreadCount` restar 1 (mínimo 0).
2. `onError`: restaurar ambos snapshots.
3. `onSettled`: `invalidateQueries` de `unreadCount` y `list` (reconcilia con el servidor).
- Solo se invoca si el item está **sin leer**.

---

## Componentes clave

### Integración en los sidebars
- El ítem de notificaciones deja de llamar `navigate(path)`: en `onClick` / `onKeyDown` (Enter, Espacio) guarda `event.currentTarget` en `anchorEl` y abre el popover. Los demás ítems siguen igual.
- `aria-label` del ítem: `"Notificaciones, N sin leer"` (o `"Notificaciones"` si es 0); `aria-haspopup="dialog"` y `aria-expanded`.
- El `Badge` usa `badgeContent={count}`, `max={99}` (muestra "99+") y **no** `showZero` (MUI lo oculta en 0, que es el CA 1). Conservar el `badgeSx` existente.
- Renderizar `<NotificationsPopover anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={...} />` dentro del sidebar.

### `NotificationsPopover`
- MUI `Popover`, `anchorOrigin: { vertical: "top", horizontal: "right" }`, `transformOrigin: { vertical: "top", horizontal: "left" }` (el sidebar está a la izquierda y el panel se abre hacia el contenido).
- Ancho 380 px (en pantallas chicas `min(380px, 100vw - 32px)`), alto máximo 70 vh con scroll interno; encabezado "Notificaciones" fijo.
- Cierra con Esc, click afuera y al navegar. Foco inicial en el encabezado.
- Estilos con `sx`; si crecen, extraer a `styles/notificationsPopoverSx.ts`. **Sin `style={{}}`**.

### `NotificationsList`
- `isLoading` → 4 `Skeleton` de fila.
- `isError` → `Alert severity="error"` con texto "No pudimos cargar tus notificaciones." y botón "Reintentar" que llama `refetch`.
- Sin items → reutilizar `EmptyState` de `shared/components` con el mensaje "No tenés notificaciones" (verificar su interfaz `EmptyStateProps`).
- `hasNextPage` → botón "Cargar más" (deshabilitado con `isFetchingNextPage`, texto "Cargando…").

### `NotificationItem`
- Layout: ícono del tipo (círculo, color de la paleta del proyecto) · texto (`message`) · fecha-hora debajo en tamaño chico.
- No leída: texto en peso 600, fondo `#F4F3FB`-tint y punto indicador; leída: peso normal, fondo blanco. Además del color, el estado se comunica con texto accesible (`aria-label="No leída: {message}"` / `"Leída: {message}"`) para no depender solo del color.
- Elemento operable (`role="button"`, `tabIndex={0}`, Enter / Espacio) como los ítems de sidebar.
- `onClick`:
  1. Si `!read` → `markAsRead(notificationId)`. **No** esperar la respuesta.
  2. `route = getNotificationRoute(type, authResponse.role)`.
  3. Si `route` → `navigate(route)`.
  4. `onClose()`.
- Fecha: `format-notification-date.ts` con `new Intl.DateTimeFormat("es-AR", { dateStyle: "short", timeStyle: "short" })`.
- Desconocer tipos nuevos: si llega un `type` fuera de `NOTIFICATION_TYPE_VALUES`, usar ícono `Bell` y ruta `null` (no romper el render).

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

---

## Fuera de alcance / decisiones pendientes

1. **ADMIN (CA 7).** El backend ya genera las notificaciones para administradores, pero el front no tiene shell de admin. Los componentes de esta historia (`NotificationsPopover`, hooks) **no dependen del rol** salvo por `getNotificationRoute`, así que cuando exista el layout de admin se monta el mismo ítem y se agregan las rutas `ADMIN_*` en `notification-type-config.ts`.
2. **Destinos de los enlaces.** Hoy son `UnderConstructionPage`. Al construir las pantallas de detalle (clases, material, etc.) hay que actualizar solo la config de rutas.
3. **Ver todas / página completa:** no incluida; si el panel con "Cargar más" resulta corto, se evalúa una historia aparte.
4. **Marcar todas como leídas:** no está en los criterios; sumarlo es un botón en el encabezado + endpoint `PATCH /read-all` en backend.

---

## Tests

Vitest + Testing Library (config en `vitest.config.ts`, setup en `test/setup.ts`), carpeta `test/modules/notifications/`. Mockear `@/shared/lib/httpClient` (los dos clientes) y envolver con `QueryClientProvider` y `MemoryRouter`. Si se agregan casos al directorio de QA (`docs/testing/cases`), seguir el modelo dual Markdown/YAML ya definido en `qa-spec-test-automation.md`.

---

## Definition of Done

- [ ] Módulo `src/modules/notifications` con la estructura indicada; tipos/props en archivos separados
- [ ] Tipos de `interfaces/responses` alineados 1:1 con los DTO del backend
- [ ] `NOTIFICATION_QUERY_KEYS` como única fuente de keys; ningún array de key suelto
- [ ] `getUnreadCount` y `markNotificationAsRead` usan `rawHttpClient`; `getNotifications` usa `httpClient`
- [ ] Badge en ambos sidebars con conteo real, oculto en 0, "99+" como máximo
- [ ] Click en el ítem abre el `Popover` sin navegar; accesible por teclado y con `aria-label` con cantidad
- [ ] Lista con orden del backend, ícono por tipo, texto, fecha-hora `es-AR` y estado leída / no leída (con texto accesible, no solo color)
- [ ] Click: marca como leída de forma optimista (badge baja al instante), rollback ante error, navega si hay ruta, cierra el panel
- [ ] Click en una ya leída no dispara PATCH
- [ ] Estados de loading (skeleton), error con "Reintentar", vacío y "Cargar más" resueltos
- [ ] Polling cada 30 s y refetch al volver el foco; sin toasts en fallos del polling
- [ ] `useLogout` descarta la caché de notificaciones
- [ ] `notificationsCount` eliminado de ambos badge stores; rutas `notifications` placeholder eliminadas
- [ ] Config de tipo → ícono / ruta en un único archivo; tipos desconocidos no rompen el render
- [ ] Tests: `getNotificationRoute` (todos los tipos × STUDENT / TUTOR / ADMIN); `NotificationItem` (leída, no leída, sin ruta, click); hook optimista (éxito y rollback); badge (0, 3, 100 → "99+"); lista (loading, error, vacío, cargar más)
- [ ] `npm run lint`, `npm run type-check`, `npm run format:check` y `npm test` en verde
- [ ] Verificado a mano con dos usuarios en el mismo navegador: cerrar sesión no deja notificaciones del anterior
- [ ] Commits en español con prefijo convencional (`feat:`, `refactor:`, `test:`)
