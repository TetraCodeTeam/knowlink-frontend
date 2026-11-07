# Mejoras UX — Notificaciones, Mis reclamos y Agenda del tutor (Frontend)

## Metadata

| Campo | Valor |
|---|---|
| ID Historia | — (mejoras sobre US-35, US-51 y US-52) |
| Módulos | `notifications`, `class-history`, `support`, `student/support`, `tutor/weekly-schedule` |
| Repo / rama | `TetraCodeTeam/knowlink-frontend`, rama `feat/frankie-mascota` |
| Spec par | `knowlink-backend/docs/mejoras-notificaciones-reclamos-agenda-backend.spec.md` |
| Depende de (backend) | `GET /notifications?status=READ` incluye vencidas (B1), `reviewProgress.queueTotal` (B3), `summary.freeBlocksCount` en horas (B4). `PATCH /notifications/read-all` **ya existe** |
| Verificado contra | `knowlink-frontend@feat/frankie-mascota` (2026-11-07) |

**Convención de idioma:** identificadores (componentes, hooks, tipos, props, archivos) en **inglés**; todo texto visible en **español**. Interfaces/props en archivos separados, nunca dentro del componente. Prettier: doble comilla, `;`, trailing comma ES5, 100 columnas, 2 espacios. Imports con alias `@/`. Detalle en `docs/base-standards.md`.

---

## Resumen

| # | Pedido | Sección |
|---|---|---|
| N1 | Botón "Marcar todo como leído" | F1 |
| N2 | Mensajes largos: poder leerlos completos | F2 |
| N3 | Recordatorio de token sin "Ver más" | F3 |
| N4 | Llegan avisos de reclamar pero no de calificar | Backend B1 (+ F3.1 por la etiqueta de vencidas) |
| N5 | Redirección más personalizada | F4 |
| R1 | "Antes de reclamar" lleve a "No confirmadas" | F5 |
| R2 | "Turno" del detalle asociado a la cola de pendientes | F6 |
| A1 | Resumen de agenda con bloques de 1 hora | F7 |

Archivos de referencia (todos bajo `src/modules/`): `notifications/components/NotificationItem.tsx`, `NotificationsPanel.tsx`, `notifications/constants/notification-type-config.ts`, `notifications/hooks/useMarkNotificationAsRead.ts`, `class-history/components/ClassHistoryPage.tsx`, `support/hooks/useSupportSelection.ts`, `student/support/components/StudentClaimsSidebar.tsx`, `tutor/weekly-schedule/components/AgendaSummaryCards.tsx`.

---

## F1 — Botón "Marcar todo como leído" (N1)

El backend ya expone `PATCH /api/v1/notifications/read-all` (marca todas las del **rol activo**). Falta API, hook y botón.

**API** (`notifications/api/notifications.api.ts`):

```ts
export async function markAllNotificationsAsRead(): Promise<void> {
  await rawHttpClient.patch("/api/v1/notifications/read-all");
}
```

**Hook** `notifications/hooks/useMarkAllNotificationsAsRead.ts`, mismo patrón optimista que `useMarkNotificationAsRead`:

- `onMutate`: cancelar queries de `NOTIFICATION_QUERY_KEYS.listBase` y `unreadCountBase`; guardar snapshot de ambas; en cada lista cacheada poner `read: true` en todos los ítems; en `unreadCount(role)` dejar `count: 0` **preservando** `otherRoleCount`.
- `onError`: restaurar los snapshots.
- `onSettled`: invalidar `listBase`, `unreadCountBase` y `SUPPORT_UNREAD_COUNT_QUERY_KEY` (de `student/support/hooks/useSupportUnreadCount.ts`), porque las novedades de soporte también pasan a leídas y el badge de "Mis reclamos" debe bajar.

**UI** (`NotificationsPanel.tsx`): fila de acciones entre `OtherRoleBanner` y las pestañas, alineada a la derecha:

```tsx
{unreadCount > 0 && (
  <Box sx={{ display: "flex", justifyContent: "flex-end", px: 2, py: 0.5 }}>
    <Button
      size="small"
      startIcon={<CheckCheck size={16} aria-hidden />}
      disabled={markAll.isPending}
      onClick={() => markAll.mutate()}
      sx={{ textTransform: "none", fontSize: "12px", fontWeight: 600, color: "#3F4CAE" }}
    >
      Marcar todo como leído
    </Button>
  </Box>
)}
```

- Se oculta con `unreadCount === 0` (no hay nada que marcar). No pide confirmación.
- No cierra el panel ni cambia la pestaña; la lista de "No Leído" se vacía y muestra el estado vacío de Frankie.

---

## F2 — Mensajes largos: ver todo el contenido (N2)

**Problema actual:** en `NotificationItem` el mensaje secundario tiene `WebkitLineClamp: 2` y no hay forma de expandirlo. Hacer click en la fila navega o abre un popup, así que el texto completo nunca se puede leer. (Los mensajes llegan a 500 caracteres.)

**Solución:** el contenedor se adapta al contenido con un control "Ver más" / "Ver menos" que **no** navega.

1. Nueva constante en `notifications/constants/notification-display.ts`:
   ```ts
   export const NOTIFICATION_MESSAGE_PREVIEW_CHARS = 100;
   ```
2. En `NotificationItem`: `const [expanded, setExpanded] = useState(false);`
   - `const hasSecondaryMessage = notification.title != null;` (si no hay título, el mensaje ya se muestra completo como título).
   - `const isLongMessage = hasSecondaryMessage && notification.message.length > NOTIFICATION_MESSAGE_PREVIEW_CHARS;` (criterio por longitud: determinista y testeable en jsdom).
3. Mensaje secundario: colapsado conserva el recorte de 2 líneas; expandido quita `display: -webkit-box`, `WebkitLineClamp` y `overflow`, y usa `whiteSpace: "pre-wrap"` y `wordBreak: "break-word"`. Darle un `id={`notification-message-${notification.notificationId}`}`.
4. Botón de texto debajo del mensaje, visible solo si `isLongMessage`:
   ```tsx
   <Button
     size="small"
     aria-expanded={expanded}
     aria-controls={`notification-message-${notification.notificationId}`}
     onClick={handleToggleExpanded}
     sx={{ textTransform: "none", fontSize: "12px", fontWeight: 600, color: "#3F4CAE", p: 0, minWidth: 0 }}
   >
     {expanded ? "Ver menos" : "Ver más"}
   </Button>
   ```
5. **Estructura para accesibilidad:** hoy toda la fila es `role="button"`; un botón anidado dentro de otro es inválido. Reestructurar: contenedor externo `Box` (fondo, borde inferior, hover, `opacity`) → dentro, el área clickable actual (`role="button"`, tile + textos + fecha + acción) y, **como hermano**, el botón "Ver más" alineado con el texto (`pl` = 16 + 40 + 12 = 68px).
6. `handleToggleExpanded`: `event.stopPropagation()`; alternar `expanded`; si la notificación no estaba leída, llamar `onMarkAsRead(notification.notificationId)` (leerla completa cuenta como leída). **No** ejecuta la acción de la notificación ni llama a `onClose()`.
7. El panel ya tiene `overflowY: auto` en la lista, por lo que el ítem crece sin romper el layout.

---

## F3 — Recordatorio de token sin "Ver más" (N3)

El recordatorio (`SESSION_CONFIRMATION_REMINDER`, título "Recordatorio de token. Clase en curso") es informativo: no tiene sentido llevar al usuario a otra sección.

1. `notification-type-config.ts`: ampliar `type NotificationActionKind = "navigate" | "rating" | "claim" | "none"` y configurar:
   ```ts
   SESSION_CONFIRMATION_REMINDER: {
     icon: Timer,
     tileColor: YELLOW_TILE,
     iconColor: YELLOW_ICON,
     action: { kind: "none", label: "" },
     routes: { STUDENT: null, TUTOR: null },
   },
   ```
2. `getNotificationAction`: si `config.action.kind === "none"` devolver `{ kind: "none" }` (antes de resolver ruta). `NotificationItem` ya oculta la etiqueta cuando `action.kind === "none"`.
3. `NotificationItem.handleClick`: cuando `action.kind === "none"` solo marca como leída y **no llama a `onClose()`** (hoy cierra siempre el panel; para una notificación sin destino cerrar el panel confunde). Actualizar el test "Notificación sin acción para mi rol" en consecuencia.

### F3.1 — Vencidas como leídas (apoyo a N4)

Con el backend B1, una `RATING_ENABLED` vencida y sin leer llega en la pestaña "Leído" con `read: true` y `actionStatus: "EXPIRED"`. El frontend ya la renderiza como "Venció el plazo" (opacidad 0.7, `rating-expired`) y ya abre el popup de "plazo vencido". **No requiere cambios de UI**; agregar un test en `NotificationsList.test.tsx` con ese caso.

---

## F4 — Redirección personalizada desde notificaciones (N5)

### Cambios de modelo

En `notification-type-config.ts`, `routes` pasa de `string | null` a un destino con parámetros:

```ts
export interface NotificationTarget {
  path: string;
  search?: Record<string, string>;
}
// en NotificationTypeConfig:
routes: Record<Role, NotificationTarget | null>;
```

Helper interno `buildRoute(target)` → `path` + `?${new URLSearchParams(search)}` si hay `search`. `getNotificationAction` devuelve `route: string` ya armada y `getNotificationRoute` también (actualizar `test/modules/notifications/getNotificationRoute.test.ts`). `appendReference` (solo `COMMUNITY_REPLY`) sigue concatenando `/${referenceId}` a rutas **sin** `search`.

### Tabla de destinos

Categorías del historial: `RESERVED`, `IN_PROGRESS`, `COMPLETED`, `NOT_CONFIRMED`, `CANCELLED`. Rutas: `studentPaths.classes` (`/student/classes`) y `tutorPaths.classes` (`/tutor/classes`) de `routes/paths.ts`.

| Tipo | Alumno | Tutor |
|---|---|---|
| `BOOKING_CONFIRMED` | clases `?category=RESERVED` | clases `?category=RESERVED` |
| `BOOKING_CANCELLED` | clases `?category=CANCELLED` | clases `?category=CANCELLED` |
| `SESSION_CONFIRMATION_TOKEN_AVAILABLE` | clases `?category=RESERVED` | sin destino (igual que hoy) |
| `SESSION_CONFIRMED` | clases `?category=COMPLETED` | clases `?category=COMPLETED` |
| `SESSION_NOT_CONFIRMED` | clases `?category=NOT_CONFIRMED` | clases `?category=NOT_CONFIRMED` |
| `FUNDS_TRANSFERRED` | clases `?category=COMPLETED` | clases `?category=COMPLETED` |
| `FUNDS_SUSPENDED` | `/student/complaints?tab=claims` | `/tutor/requests?tab=claims` |
| `SESSION_CLAIM_UPDATE` / `SESSION_CLAIM_COMMENT` | `/student/complaints?tab=claims&claim=<referenceId>` | `/tutor/requests?tab=claims&claim=<referenceId>` |
| `MATERIAL_REPORT_UPDATE` | `/student/complaints?tab=materials` | `/tutor/requests?tab=materials` |
| `MATERIAL_REPORT_PROCESSED` | `/student/complaints?tab=materials` | `/tutor/content` (sin cambios) |
| `SESSION_COMPLETED` | popup de reclamo (sin cambios) | popup de reclamo (sin cambios) |
| `RATING_ENABLED` | popup de calificación (sin cambios) | popup de calificación (sin cambios) |
| `FUNDS_RELEASED`, `SUBJECT_VALIDATION_UPDATED`, `COMMUNITY_REPLY`, tipos admin | sin cambios | sin cambios |

Verificado en el backend: para reclamos, `referenceId` es el `claimId` (`SessionClaimNotificationListener` y los servicios de comentarios). Para `BOOKING_*`, `SESSION_*` y `FUNDS_*` es el `bookingId`.

Nota: la categoría se decide por **tipo** (aproximación). Una mejora futura es resolver la categoría por el estado real de la reserva (`useBookingDetail(referenceId)`), fuera de alcance acá.

### Páginas que reciben los parámetros

**1. Historial de clases** — `class-history/components/ClassHistoryPage.tsx` (la usan alumno y tutor). Derivar la categoría de la URL en vez de `useState`, así también funciona al navegar desde una notificación estando ya en la página:

```tsx
const [searchParams, setSearchParams] = useSearchParams();
const category = parseHistoryCategory(searchParams.get("category")) ?? "RESERVED";
const handleCategoryChange = (next: BookingHistoryCategory) =>
  setSearchParams({ category: next }, { replace: true });
// <CategoryTabs activeCategory={category} onChange={handleCategoryChange} />
```

`parseHistoryCategory(value: string | null)` en `class-history/utils/classHistory.utils.ts`: devuelve la categoría si coincide con alguna de `CATEGORY_TABS`, o `null` (parámetro inválido → pestaña por defecto `RESERVED`). Agregar también:

```ts
export function buildClassHistoryRoute(role: BookingRole, category: BookingHistoryCategory): string {
  const base = role === "STUDENT" ? studentPaths.classes : tutorPaths.classes;
  return `${base}?category=${category}`;
}
```

**2. Reclamos / soporte** — `support/hooks/useSupportSelection.ts` (lo usan `StudentSupportPage` y `SupportPage` del tutor). Leer `tab`, `claim` y `material` de `useSearchParams`:

- `tab` válido (`"claims" | "materials"`, de `SUPPORT_TABS`) → `activeTab`.
- `claim=<id>` → `selectedDetail = { type: "claim", id }` (abre el panel de detalle directamente).
- Aplicar con un `useEffect` que depende de los valores de los parámetros, de modo que funcione si ya se está en la página.
- Al cambiar de pestaña o cerrar el detalle manualmente, limpiar los parámetros con `setSearchParams({}, { replace: true })` para que la URL no quede desactualizada.
- Si el `claim` no existe o no pertenece al usuario, el panel de detalle ya muestra su estado de error; no agregar manejo nuevo.

---

## F5 — "Antes de reclamar" lleva a "No confirmadas" (R1)

Los reclamos solo se pueden iniciar sobre sesiones no confirmadas con token (`ClaimDeadlineCalculator`: `BOOKED`/`IN_PROGRESS`/`NOT_CONFIRMED` ya finalizadas), que son las que aparecen en la pestaña **No confirmadas**.

- `student/support/components/StudentClaimsSidebar.tsx`: `navigate(buildClassHistoryRoute("STUDENT", "NOT_CONFIRMED"))`.
- Tutor: `support/pages/SupportPage.tsx` → `handleGoToClassHistory` pasa a `navigate(buildClassHistoryRoute("TUTOR", "NOT_CONFIRMED"))` (el `ClaimsSidebar` del tutor ya recibe `onGoToClassHistory`).
- Texto de la tarjeta "Antes de reclamar" (ambos sidebars): *"Solo podés abrir un reclamo activo por sesión. Los reclamos se inician desde las clases no confirmadas de tu historial."*
- Etiqueta del botón: **"Ir a clases no confirmadas"**.

---

## F6 — "Turno" del reclamo asociado a la cola de pendientes (R2)

El backend (B3) pasa a calcular el turno sobre **disputas pendientes** (lo que ve el admin) y agrega `queueTotal`.

1. Interfaces: agregar `queueTotal: number | null` junto a `queuePosition` en `student/support/interfaces/responses/student-claim-detail.response.ts` (`ClaimReviewProgress`) y en `support/interfaces/responses/tutor-claim-detail.response.ts` (`reviewProgress`). Actualizar mocks y `test/fixtures` que construyan `reviewProgress`.
2. Helper en `support/utils/supportDetail.utils.ts`:
   ```ts
   export function formatQueuePosition(position: number, total: number | null): string {
     return total != null
       ? `Lugar ${position} de ${total} en la cola de casos pendientes`
       : `Turno #${position}`;
   }
   ```
3. En `student/support/components/support-detail/StudentClaimDetailContent.tsx` (línea ~131) y `support/components/support-detail/ClaimDetailContent.tsx` (línea ~127) reemplazar `Turno #{...}` por `formatQueuePosition(...)` y debajo, en texto atenuado: *"Baja cuando el equipo académico toma un caso."*
4. Solo se muestra con `queuePosition != null` (estado `OPEN`). Con `IN_REVIEW` se mantiene la fase "Revisión en curso" sin turno (el backend devuelve `null`).
5. Textos: el número es una **posición estimada** (los admins pueden tomar casos en cualquier orden); no prometer plazos con el turno.

---

## F7 — Resumen de la agenda: bloques de 1 hora (A1)

`summary.freeBlocksCount` ahora llega como **cantidad de horas libres** (cada una un bloque reservable de 1 hora) y es la única fuente de verdad de la tarjeta: **no recalcular en el cliente**.

- `AgendaSummaryCards.tsx`: etiqueta con singular/plural y aclaración de duración.
  ```tsx
  <Typography fontSize={15} color="text.secondary">
    {freeBlocks === 1 ? "Bloque libre" : "Bloques libres"}
  </Typography>
  <Typography fontSize={12} color="text.secondary">de 1 hora</Typography>
  ```
- `weekly-agenda.interface.ts`: actualizar el comentario de `freeBlocksCount` ("cantidad de bloques libres de 1 hora").
- El calendario no cambia: sigue mostrando un evento "Libre" por tramo continuo (un tramo de 3 h es un evento y cuenta 3 en la tarjeta). Si el equipo prefiere partir el calendario en celdas de 1 h, es una mejora aparte.

---

## Tests (Vitest + Testing Library, ya configurados en `test/`)

| Archivo | Casos |
|---|---|
| `test/modules/notifications/NotificationsPanel.test.tsx` | el botón "Marcar todo como leído" aparece con `count > 0` y no con 0; click llama `PATCH /read-all`; deshabilitado mientras está pendiente |
| `test/modules/notifications/useMarkAllNotificationsAsRead.test.tsx` (nuevo) | actualización optimista deja `read: true` y `count: 0` preservando `otherRoleCount`; rollback ante error; invalida la query de soporte |
| `test/modules/notifications/NotificationItem.test.tsx` | mensaje > 100 caracteres muestra "Ver más"; click expande, cambia a "Ver menos", **no navega ni cierra el panel** y marca como leída; mensaje corto y notificación sin título no muestran el botón; recordatorio de token no muestra etiqueta de acción y no cierra el panel |
| `test/modules/notifications/NotificationsList.test.tsx` | `RATING_ENABLED` vencida (`read: true`, `EXPIRED`) se renderiza con "Venció el plazo" |
| `test/modules/notifications/getNotificationRoute.test.ts` | rutas con `?category=` y `?tab=` según la tabla de F4, por rol |
| `test/modules/class-history/ClassHistoryCategory.test.tsx` | `?category=CANCELLED` abre esa pestaña; parámetro inválido cae en `RESERVED`; click en una pestaña actualiza la URL |
| `test/modules/support/` (nuevo o existente) | `useSupportSelection` aplica `tab` y `claim` de la URL y los limpia al cambiar de pestaña |
| `test/modules/student/` (sidebar de reclamos) | el botón navega a `/student/classes?category=NOT_CONFIRMED` |
| `test/modules/tutor/weekly-schedule/` | tarjeta muestra "Bloque libre" con 1 y "Bloques libres" con 0 o más de 1 |

Verificación final: `pnpm lint`, `pnpm test` y `pnpm build` en verde (usar los scripts de `package.json`).

---

## Orden de implementación sugerido

1. F7 y F5 (cambios chicos y aislados).
2. F4: modelo `NotificationTarget` + `ClassHistoryPage` por URL + `useSupportSelection` por URL.
3. F3 y F2 (`NotificationItem`).
4. F1 (botón y hook).
5. F6 cuando el backend B3 esté desplegado (el frontend tolera `queueTotal` ausente y cae a `Turno #N`).

## Preguntas abiertas

1. **Recordatorio de token para el tutor:** el texto del tutor dice "Ingresá el código para confirmar la sesión". Se aplicó "sin acción" para ambos roles según el pedido; si el tutor necesita un atajo para ingresar el código, mantener `Ver` solo para `TUTOR`.
2. **`FUNDS_RELEASED`:** no se cambió su destino porque no se verificó en qué casos se emite; revisar si debe ir a "Mis reclamos" como `FUNDS_SUSPENDED`.
