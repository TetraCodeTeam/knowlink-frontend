# US-20b — Calificación obligatoria post-sesión (Frontend)

> Extensión de US-20. Pasar este archivo completo a OpenCode (DeepSeek V4 Flash) parado en `TetraCodeTeam/knowlink-frontend`. Si el equipo prefiere otra numeración, renombrar el archivo y el ID.

## Metadata

| Campo | Valor |
|---|---|
| ID Historia | US-20b (extiende US-20; reemplaza su CA 4) |
| Épica | — |
| Story Points | 3 frontend + 3 backend (estimación) |
| Prioridad | A confirmar con el PO |
| Módulo | class-history (calificación) con notifications y shared |
| Historias relacionadas | US-20 (prompt post-sesión), US-18 (calificar), US-35 (notificaciones), US-41 (confirmación con token), US-14 (logout) |
| Repo / rama base | `TetraCodeTeam/knowlink-frontend` — `feat/best-ui-changes` |
| Depende de | `us-20b-calificacion-obligatoria-backend.spec.md` (`GET /api/v1/ratings/pending`, 423 `RATING_REQUIRED`, fin del 422 por plazo) |
| Verificado contra | `knowlink-frontend@fde1c4d` |

**Convención de idioma:** identificadores (componentes, hooks, tipos, props, archivos) en **inglés**. Todo texto visible en **español** (voseo). Prettier: doble comilla, `;`, 100 columnas, 2 espacios. Imports con alias `@/`.

## Historia de usuario

Como alumno o tutor, quiero que al terminar la clase la plataforma me pida calificar la sesión antes de seguir, para que ninguna sesión realizada quede sin calificación.

## Contexto: esto es un spec de cambios sobre US-20

El front ya implementa US-20 (verificado en el código):

- `RatingPopupHost` (montado en `StudentLayout` y `TutorLayout`) abre `RateBookingDialog` cuando el usuario toca la notificación `RATING_ENABLED`; **el diálogo se puede cancelar**.
- `RateBookingFlow` muestra el botón "Calificar" en la tarjeta de la clase.
- Ambos manejan un estado `expired` (timers contra `ratingDeadline`, 422 `RATING_WINDOW_EXPIRED`, `RateBookingExpiredDialog`) que **deja de existir**.
- Hay precedentes de popups automáticos por horario (`useAutoShowStudentToken`, `useAutoOpenSessionConfirmation`) y de store global (`useRatingPopupStore`).
- Dato clave: `queryClient` tiene un `QueryCache.onError` que muestra **snackbar por cualquier error de query** y `retry: 1`. El 423 hay que silenciarlo ahí **y** en el interceptor de `httpClient`.

### Qué cambia

| # | Cambio | Decisión del PO |
|---|---|---|
| 1 | Nuevo popup bloqueante `MandatoryRatingGate`: único botón **"Calificar"**, sin cancelar ni cerrar | Alumno **y** tutor; único botón; sin otra salida (tampoco "Cerrar sesión") |
| 2 | El bloqueo viene del backend (`GET /api/v1/ratings/pending`), no del cliente: reaparece solo al volver a iniciar sesión | Persiste hasta calificar |
| 3 | Manejo del **423 `RATING_REQUIRED`**: sin snackbar, sin reintento, abre el popup | Refuerzo por API |
| 4 | Se elimina todo lo relacionado con el vencimiento de 24 h | Persiste hasta calificar |
| 5 | La notificación `RATING_ENABLED` se mantiene | Se mantiene |

## Criterios de aceptación (Gherkin)

```gherkin
Feature: Calificación obligatoria post-sesión (UI)

  Background:
    Given estoy autenticado como alumno o tutor

  Scenario: Se bloquea al terminar la clase
    Given mi sesión fue confirmada y terminó el horario de la clase
    When el backend informa la sesión en "blocking"
    Then se abre un popup sobre toda la app
    And veo "Calificá tu sesión para continuar"
    And veo "Para seguir usando KnowLink, tenés que calificar esta sesión."
    And veo la materia, la otra parte y la fecha
    And veo 5 estrellas y un comentario opcional
    And veo un único botón "Calificar"

  Scenario: No hay forma de cerrarlo
    Given el popup está abierto
    Then no hay botón "Cancelar" ni ícono de cerrar
    And Escape no lo cierra
    And hacer clic fuera del popup no lo cierra

  Scenario: Sin puntaje no se puede enviar
    Given el popup está abierto y no elegí estrellas
    Then el botón "Calificar" está deshabilitado
    When elijo un puntaje
    Then el botón se habilita

  Scenario: Calificación exitosa
    Given elegí un puntaje
    When toco "Calificar" y el envío es exitoso
    Then veo la confirmación de calificación registrada (diálogo de éxito existente)
    When cierro la confirmación
    Then el popup desaparece
    And la app vuelve a cargar sus datos
    And la notificación de esa sesión pasa a "Ya calificaste"

  Scenario: Varias sesiones pendientes
    Given tengo 2 sesiones sin calificar
    Then veo la más antigua primero y "Tenés 2 sesiones por calificar"
    When califico la primera y cierro la confirmación
    Then aparece la segunda
    And al calificarla se desbloquea la app

  Scenario: Cierro la página y vuelvo
    Given tengo una sesión sin calificar
    When cierro la pestaña y vuelvo a abrir KnowLink
    Then el popup aparece de nuevo apenas carga la app

  Scenario: Mi sesión de usuario venció
    Given tengo una sesión sin calificar
    And el token venció y la app me llevó al login
    When inicio sesión de nuevo
    Then el popup aparece de nuevo
    And la app sigue bloqueada hasta que califique

  Scenario: Rol dual
    Given fui alumno en la sesión pendiente y hoy estoy en modo tutor
    Then el popup aparece igual
    And los textos del formulario corresponden al rol con el que debo calificar (alumno califica al tutor)

  Scenario: El backend bloquea en medio del uso
    Given estoy usando la app y la clase termina
    When cualquier request recibe 423 con detail "RATING_REQUIRED"
    Then no veo ningún mensaje de error ni se reintenta el request
    And el popup se abre sin esperar al próximo polling

  Scenario: Falla el envío
    Given toqué "Calificar" y el envío falla por red o error de servidor
    Then veo un mensaje de error dentro del popup
    And el popup sigue abierto y puedo reintentar

  Scenario: Ya había calificado desde otro dispositivo
    Given califiqué esta sesión en otro navegador
    When envío la calificación y el backend responde 409
    Then el popup se cierra como si hubiera calificado
    And no veo error

  Scenario: Calificó en otra pestaña
    Given el popup está abierto en dos pestañas
    When califico en una
    Then la otra se desbloquea en 30 segundos o menos (polling o 409 al enviar)

  Scenario: Falla la consulta de pendientes
    Given GET /api/v1/ratings/pending falla o devuelve 404
    Then no se muestra el popup ni ningún error
    And la app se usa normalmente

  Scenario: La notificación ya no vence
    Given tengo una notificación RATING_ENABLED
    Then nunca veo "Venció el plazo"
    And mientras no califiqué muestra "Calificar →"

  Scenario: Administrador
    Given estoy autenticado como administrador
    Then nunca veo el popup ni se consulta /ratings/pending

  Scenario: Accesibilidad
    Then el popup se anuncia como diálogo con su título
    And el foco queda dentro del popup
    And los errores se anuncian con role="alert"
    And todo se opera con teclado
```

## Stack confirmado

React 19 + TypeScript, MUI 7, TanStack Query 5, Zustand 5, react-hook-form + Zod, axios vía `httpClient`, `lucide-react`, `react-router-dom` 7, Vitest + Testing Library. **Sin dependencias nuevas.**

## Advertencias de dependencias (verificadas en el código)

1. **Depende del backend.** Mientras el backend no tenga `GET /ratings/pending`, la consulta falla o devuelve 404 y el front hace **fail-open** (sin popup, sin error). Por eso se puede desplegar antes o después del backend sin romper nada. **Orden de despliegue:** backend con `RATING_GATE_ENFORCED_FROM` vacía → frontend → recién ahí el PO activa la variable.
2. **Snackbars globales.** Hay dos lugares que muestran errores solos: el interceptor de `httpClient` y `queryClient.queryCache.onError`. Ambos deben ignorar el 423 `RATING_REQUIRED`, y la consulta de pendientes debe ser silenciosa ante cualquier error (`meta: { silent: true }`).
3. **`retry: 1` global** haría que cada query bloqueada se repita una vez más: cortar el reintento ante 423.
4. **Con el popup abierto, los toasts quedan detrás del fondo del diálogo** (el `Snackbar` de MUI usa z-index 1400). Por eso los errores del envío se muestran **dentro** del popup.
5. **z-index.** Los widgets de asistencia (`StudentTokenWidget`, `TutorSessionConfirmationWidget`) usan `zIndex: 1300`, `BookingValidationMessage` usa 1500 y un `Dialog` de MUI usa 1300. El popup bloqueante debe estar por encima de todo: `RATING_GATE_Z_INDEX = 1550`.
6. **Rol dual.** El rol del usuario cambia con el token (`useRoleSwitch`), pero el bloqueo es por usuario. El diálogo debe usar `raterRole` del item, **no** el rol de `useAuthStore`.
7. **Login limpia el caché.** `useAuthStore.login` hace `queryClient.clear()`; como `StudentLayout`/`TutorLayout` se montan después del login, la consulta de pendientes corre sola al volver a ingresar. No hace falta `localStorage` ni estado persistido.
8. **Las notificaciones están separadas por rol** (`NOTIFICATION_QUERY_KEYS.list(role)`). `useResolveRatingNotification` actualiza todas las listas pero solo el contador del rol actual; el resto lo reconcilia el polling de 30 s. No cambiarlo.
9. **`BookingHistoryDetail` y `makeDetail`** se construyen a mano en los tests: al quitar `ratingDeadline` hay que actualizar esos helpers.
10. **No tocar los `EXPIRED` que no son de calificación:** `booking-status.type.ts` (estado de reserva) y `claimReasonsConstants.ts` / `ClaimPopupHost.test.tsx` (reclamos).

## Decisiones de diseño

| Decisión | Elegido | Alternativa descartada | Motivo |
|---|---|---|---|
| Fuente del bloqueo | Consulta al backend (`/ratings/pending`) | Estado local / `localStorage` | Debe reaparecer al re-loguear y no depender del navegador |
| Estado del popup | React Query (estado de servidor) | Store de Zustand | Es estado de servidor; la convención del repo lo exige |
| Cuándo consultar | Al montar el layout, cada 30 s, al volver a la pestaña, y ante un 423 | Solo polling | El 423 abre el popup al instante |
| Aviso de "pronto bloquea" | Timer hasta `nextBlockAt` que solo dispara un refetch | Calcular el bloqueo en el cliente | La decisión es del servidor, no del reloj del dispositivo |
| Forma del popup | `RateBookingDialog` con prop `mandatory` | Diálogo nuevo | Reutiliza formulario, validación y estrellas |
| Qué pasa si falla la consulta | Fail-open, sin error | Bloquear / mostrar error | Un bug no puede dejar la app inutilizable |
| Confirmación tras calificar | Se reutiliza `RateBookingSuccessDialog` | Cerrar directo | Explica la regla de revelado de calificaciones |
| Pollers mientras hay bloqueo | Se dejan correr; el 423 es silencioso | Pausar cada poller | Menos invasivo; el ruido es solo de red |

## Modelo de datos en frontend

```ts
// class-history/interfaces/responses/pending-ratings.interface.ts
import type { BookingRole } from "@/modules/class-history/types/booking-role.type";

export interface PendingRatingItem {
  bookingId: string;
  raterRole: BookingRole;          // rol con el que el usuario debe calificar
  subjectName: string;
  otherPartyFullName: string;
  sessionDate: string;             // "yyyy-MM-dd"
  startTime: string;               // "HH:mm:ss"
  endTime: string;
}

export interface PendingRatingsResponse {
  blocking: PendingRatingItem[];   // de la más antigua a la más reciente
  nextBlockAt: string | null;      // LocalDateTime ISO sin zona; NO agregar "Z"
}
```

Los tipos reflejan **exactamente** el contrato del backend. `nextBlockAt` solo se usa para programar un refetch.

## Ubicación de archivos / componentes

```
src/modules/class-history/
├── api/ratingGate.api.ts                                    // NUEVO  getPendingRatings
├── constants/ratingGate.constants.ts                        // NUEVO  keys, intervalo, código de error, z-index
├── interfaces/responses/pending-ratings.interface.ts        // NUEVO
├── hooks/usePendingRatings.ts                               // NUEVO
├── components/MandatoryRatingGate.tsx                       // NUEVO
├── components/RateBookingDialog.tsx                         // MODIFICA (mandatory, errorMessage, pendingCount)
├── components/RatingPopupHost.tsx                           // MODIFICA (quitar vencimiento)
├── components/RateBookingFlow.tsx                           // MODIFICA (quitar vencimiento)
├── components/RateBookingExpiredDialog.tsx                  // ELIMINAR
├── types/rating-status.type.ts                              // MODIFICA (quitar EXPIRED)
└── interfaces/responses/booking-history-detail.interface.ts // MODIFICA (quitar ratingDeadline)

src/modules/notifications/
├── constants/notification-type-config.ts                    // MODIFICA (quitar rating-expired)
└── components/NotificationItem.tsx                          // MODIFICA (quitar rating-expired)

src/shared/
├── lib/httpClient.ts                                        // MODIFICA (423 silencioso)
├── lib/queryClient.ts                                       // MODIFICA (423 silencioso, sin reintento, meta.silent)
└── utils/errors.ts                                          // MODIFICA (isRatingRequiredError)

src/modules/student/layouts/StudentLayout.tsx                // MODIFICA (montar el gate)
src/modules/tutor/layouts/TutorLayout.tsx                    // MODIFICA (montar el gate)
```

## Cambios en detalle

### 1. Constantes y capa de datos

```ts
// class-history/constants/ratingGate.constants.ts
export const RATING_GATE_QUERY_KEYS = {
  all: ["ratingGate"] as const,
  pending: ["ratingGate", "pending"] as const,
};
export const RATING_GATE_POLL_INTERVAL = 30_000;
export const RATING_REQUIRED_CODE = "RATING_REQUIRED";
export const RATING_GATE_Z_INDEX = 1550;
```

```ts
// class-history/api/ratingGate.api.ts  (solo HTTP, con httpClient)
export async function getPendingRatings(): Promise<PendingRatingsResponse> {
  const response = await httpClient.get<PendingRatingsResponse>("/api/v1/ratings/pending");
  return response.data;
}
```

```ts
// shared/utils/errors.ts  (agregar)
export function isRatingRequiredError(error: unknown): boolean {
  return (
    axios.isAxiosError<ErrorResponse>(error) &&
    error.response?.status === 423 &&
    error.response.data?.detail === "RATING_REQUIRED"
  );
}
```

Importar la constante `RATING_REQUIRED_CODE` en lugar de repetir el literal si no genera un import circular; si lo genera, dejar el literal y un comentario.

### 2. `usePendingRatings`

```ts
export function usePendingRatings() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const role = useAuthStore((s) => s.authResponse?.role);
  const enabled = isAuthenticated && (role === "STUDENT" || role === "TUTOR");

  const { data, refetch } = useQuery({
    queryKey: RATING_GATE_QUERY_KEYS.pending,
    queryFn: getPendingRatings,
    enabled,
    staleTime: 0,
    refetchInterval: RATING_GATE_POLL_INTERVAL,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    retry: false,
    meta: { silent: true },
  });
  // ...
}
```

- Devuelve `{ blocking, current, total, nextBlockAt }` con `blocking = data?.blocking ?? []`, `current = blocking[0] ?? null`, `total = blocking.length`.
- **Fail-open:** si la consulta falla y no hay datos previos, `blocking` es `[]`. Si ya había datos, React Query los conserva y el popup sigue (no se desbloquea por un error de red).
- **Timer de `nextBlockAt`:** si `current` es `null` y `nextBlockAt` existe, `setTimeout` hasta `new Date(nextBlockAt).getTime() - Date.now() + 1000` (mínimo 1000 ms) que solo llama a `refetch()`. Limpiar en el cleanup. No usar este valor para decidir si se bloquea.
- **Desbloqueo:** si `total` pasa de mayor que 0 a 0, ejecutar `queryClient.invalidateQueries({ predicate: (q) => q.queryKey[0] !== RATING_GATE_QUERY_KEYS.all[0] })` para recargar todo lo que respondió 423 mientras duró el bloqueo.

### 3. `MandatoryRatingGate`

Se monta una sola vez en `StudentLayout` y `TutorLayout` (junto a `RatingPopupHost`).

```tsx
export default function MandatoryRatingGate() {
  const { current, total } = usePendingRatings();
  const [successFor, setSuccessFor] = useState<PendingRatingItem | null>(null);
  const { resolve } = useResolveRatingNotification();
  const queryClient = useQueryClient();
  // ...
}
```

- Si hay `successFor`: mostrar **solo** `RateBookingSuccessDialog` (con `role={successFor.raterRole}`). Al cerrarlo: `setSuccessFor(null)`, `resolve(bookingId)`, invalidar `["bookingDetail", bookingId]`, `["bookingHistory"]` y `RATING_GATE_QUERY_KEYS.pending`. Mientras haya `successFor` **no** se renderiza el popup de la siguiente sesión (aunque un polling ya la haya traído).
- Si hay `current` y no `successFor`: renderizar `<MandatoryRatingForm key={current.bookingId} item={current} total={total} onRated={setSuccessFor} />`.
- `MandatoryRatingForm` (componente interno o archivo aparte) usa `useRateBooking(item.bookingId)` y arma un `RateBookingDialog` con:
  - `open`, `mandatory`, `role={item.raterRole}`, `pendingCount={total}`, `isPending`, `errorMessage`
  - `detail` armado desde el item: `{ subjectName, otherPartyFullName, sessionDate }` (si `RateBookingDialog` exige `BookingHistoryDetail` completo, cambiar su prop a un tipo mínimo `RateBookingSummary` con esos tres campos y adaptar a los dos usos existentes).
- Manejo del envío (`handleConfirm`):
  - éxito → `onRated(item)`
  - `409` → tratar como calificada: invalidar `RATING_GATE_QUERY_KEYS.pending`, `resolve(item.bookingId)` y no mostrar error
  - cualquier otro error → `errorMessage = "No pudimos registrar tu calificación. Revisá tu conexión e intentá de nuevo."` y el popup sigue abierto
  - limpiar `errorMessage` al volver a enviar.
- Si `current` es `null` y no hay `successFor`: devolver `null`.

### 4. `RateBookingDialog` — modo obligatorio

Props nuevas, todas opcionales (el comportamiento actual no cambia si no se pasan):

```ts
mandatory?: boolean;           // sin "Cancelar", no se cierra con Escape ni clic afuera
errorMessage?: string | null;  // error dentro del popup, role="alert"
pendingCount?: number;         // si es mayor que 1, muestra "Tenés N sesiones por calificar"
```

Cuando `mandatory` es `true`:

- Título: **"Calificá tu sesión para continuar"**; debajo: **"Para seguir usando KnowLink, tenés que calificar esta sesión."**
- Sin botón "Cancelar". Un único `AppButton` `fullWidth` con el texto **"Calificar"** (`type="submit"`, `disabled={score === 0}`, `loading={isPending}`).
- `Dialog` sin `onClose`, con `disableEscapeKeyDown`, `sx={{ zIndex: RATING_GATE_Z_INDEX }}` y `aria-labelledby` apuntando al título (usar `useId`).
- `errorMessage` se muestra con `Typography`/`Alert` y `role="alert"` debajo del formulario.
- Se mantiene el aviso "No vas a poder modificarla una vez enviada", el comentario opcional (máx. 2000) y el resto del formulario.

Cuando `mandatory` es `false` o no se pasa: sin cambios (título "Calificá tu sesión", "Cancelar" + "Enviar").

### 5. Manejo del 423 (sin ruido)

```ts
// httpClient.ts — response interceptor
if (isRatingRequiredError(error)) {
  void queryClient.invalidateQueries({ queryKey: RATING_GATE_QUERY_KEYS.pending });
  return Promise.reject(error);   // sin snackbar
}
// ...resto igual (snackbar + logout en 401)
```

```ts
// queryClient.ts
queryCache: new QueryCache({
  onError: (error, query) => {
    if (query.meta?.silent || isRatingRequiredError(error)) return;
    // ...snackbar como hoy
  },
}),
defaultOptions: {
  queries: {
    retry: (failureCount, error) => !isRatingRequiredError(error) && failureCount < 1,
    staleTime: 1000 * 60 * 5,
  },
},
```

- Importar `queryClient` en `httpClient.ts` desde `@/shared/lib/queryClient` (no genera ciclo: `queryClient` no importa `httpClient`).
- `rawHttpClient` no cambia: sus llamadores ya manejan errores a mano y el polling de 30 s cubre la apertura del popup.

### 6. Quitar el vencimiento (reemplaza US-20 CA 4)

- `RatingPopupHost`: eliminar el paso `"expired"`, el `useEffect` del timer contra `ratingDeadline`, el `case "EXPIRED"`, la rama `422 RATING_WINDOW_EXPIRED` y los imports no usados (`ErrorResponse`, `RateBookingExpiredDialog`). Queda: `PENDING` → formulario (cancelable); `SUBMITTED` → "ya calificaste"; `NOT_AVAILABLE` → cierra. Mantener 409.
- `RateBookingFlow`: eliminar `deadlinePassed`, `forceRerender`, ambos `useEffect` de plazo, el paso `"expired"` y `RateBookingExpiredDialog`. `canRate = detail.ratingStatus === "PENDING"`.
- Eliminar `RateBookingExpiredDialog.tsx` y sus tests.
- `rating-status.type.ts`: quitar `"EXPIRED"`. `booking-history-detail.interface.ts`: quitar `ratingDeadline` (el backend lo sigue enviando como `null`; JSON extra se ignora).
- `notification-type-config.ts`: eliminar la variante `rating-expired` de `NotificationAction`. En `getNotificationAction`, `COMPLETED` → `rating-done`; **`PENDING`, `NONE` y `EXPIRED` → `rating`** (defensivo: si quedara una fila vieja con `EXPIRED`, igual se puede calificar). Mantener `"EXPIRED"` en `NOTIFICATION_ACTION_STATUS_VALUES` por compatibilidad con el contrato.
- `NotificationItem`: quitar `rating-expired` de `isSettledRating` y de `ariaSuffix` (queda solo `rating-done` → "Ya calificaste").

### 7. Montaje

```tsx
// StudentLayout.tsx y TutorLayout.tsx
<RatingPopupHost />
<ClaimPopupHost />
<MandatoryRatingGate />
```

No agregar el gate a `AdminLayout`. `usePendingRatings` ya se deshabilita fuera de `STUDENT`/`TUTOR`.

## Capa de datos

| Endpoint | Cambio |
|---|---|
| `GET /api/v1/ratings/pending` | **Nuevo**, consumido por `usePendingRatings` |
| `POST /api/v1/bookings/{id}/ratings` | Ya no hay 422 por plazo; 409 se mantiene |
| `GET /api/v1/bookings/{id}` | `ratingStatus` nunca `EXPIRED`; `ratingDeadline` siempre `null` |
| Cualquier otro endpoint | Puede responder 423 `RATING_REQUIRED` |

El polling de notificaciones (30 s), la lista infinita y el marcado optimista de lectura (US-35) **no cambian**.

## No hacer

- No guardar en `localStorage`, `sessionStorage` ni Zustand si hay bloqueo: la verdad es la consulta al backend.
- No calcular en el cliente si corresponde bloquear; el `Date.now()` solo programa un refetch.
- No agregar botón "Cancelar", ícono de cerrar, ni cierre por Escape o clic afuera al popup obligatorio, ni un "Cerrar sesión" dentro de él.
- No usar el rol de `useAuthStore` para los textos del popup: usar `raterRole` del item.
- No mostrar snackbar ni reintentar ante un 423 `RATING_REQUIRED`.
- No mostrar errores de la consulta de pendientes (fail-open).
- No usar `axios` directo ni agregar funciones HTTP fuera de `api/`.
- No escribir query keys sueltas: usar `RATING_GATE_QUERY_KEYS`, `NOTIFICATION_QUERY_KEYS` y las existentes (`["bookingDetail", id]`, `["bookingHistory"]`).
- No tocar el texto de `RateBookingSuccessDialog` ni la lógica de revelado de calificaciones (US-18).
- No tocar los `EXPIRED` de estados de reserva ni de reclamos.
- No pausar ni modificar los demás pollers.
- No montar el gate en `AdminLayout`.
- No agregar dependencias; no usar `any`; no importar con rutas relativas largas.

## Casos de prueba (tabla de la historia)

| # | Caso de prueba | Resultado esperado | ¿Pasó? / Notas |
|---|---|---|---|
| 1 | Alumno y tutor con una sesión confirmada; termina la clase. | A ambos se les abre el popup con materia, otra parte y fecha, 5 estrellas, comentario opcional y un único botón "Calificar" (deshabilitado hasta elegir puntaje). No se puede cerrar con Escape ni clic afuera. | Sí / No |
| 2 | El usuario cierra la pestaña sin calificar y vuelve a abrir KnowLink (o su sesión venció y vuelve a iniciar sesión). | El popup aparece de nuevo apenas carga la app. | Sí / No |
| 3 | El usuario califica con puntaje 4. | Ve la confirmación; al cerrarla el popup desaparece, la app recarga sus datos y la notificación pasa a "Ya calificaste". Con dos pendientes aparece la segunda. | Sí / No |
| 4 | El backend responde 423 `RATING_REQUIRED` a un request cualquiera. | Sin mensaje de error ni reintento; el popup se abre solo. | Sí / No |
| 5 | Falla `GET /ratings/pending` (404 o caída). | No hay popup ni error; la app funciona normal. | Sí / No |
| 6 | Pasan más de 24 h sin calificar. | El popup sigue; la notificación sigue mostrando "Calificar →", nunca "Venció el plazo". | Sí / No |

## Definition of Done

- [ ] `usePendingRatings` con polling de 30 s, refetch al volver a la pestaña, timer de `nextBlockAt` y fail-open; deshabilitado fuera de `STUDENT`/`TUTOR`
- [ ] `MandatoryRatingGate` montado en `StudentLayout` y `TutorLayout`; no en `AdminLayout`
- [ ] `RateBookingDialog` con `mandatory`, `errorMessage` y `pendingCount`; sin cambios cuando no se pasan; `z-index` 1550; accesible (título asociado, `role="alert"`)
- [ ] Popup obligatorio sin Cancelar, sin ícono de cerrar, sin Escape ni clic afuera; botón único "Calificar" deshabilitado sin puntaje
- [ ] Rol dual: textos según `raterRole`
- [ ] Éxito → `RateBookingSuccessDialog` → cierre → invalida pendientes, detalle e historial y llama a `resolve`; la siguiente pendiente solo aparece después de cerrar la confirmación
- [ ] 409 se trata como calificada; otros errores muestran el mensaje dentro del popup y permiten reintentar
- [ ] 423 `RATING_REQUIRED`: sin snackbar (en `httpClient` y en `queryCache.onError`), sin reintento, y fuerza el refetch de pendientes
- [ ] Al desbloquearse se invalidan las demás queries
- [ ] Vencimiento eliminado: sin `expired` en `RatingPopupHost` ni `RateBookingFlow`, `RateBookingExpiredDialog` borrado, `EXPIRED` fuera de `RatingStatus`, `ratingDeadline` fuera de `BookingHistoryDetail`, `rating-expired` fuera de notificaciones; `grep` confirma que no quedan referencias
- [ ] Tests actualizados: `RatingPopupHost.test.tsx`, `RateBookingFlow.test.tsx`, `NotificationItem.test.tsx`, `NotificationsList.test.tsx`; `makeDetail` sin `ratingDeadline`. `RateBookingFlow.refetch.test.tsx` cubre el refetch al vencer el plazo: eliminarlo si todos sus casos dependen de `ratingDeadline`, o conservar solo los que no
- [ ] Tests nuevos: `usePendingRatings` (fail-open, polling, timer de `nextBlockAt`, desbloqueo invalida queries), `MandatoryRatingGate` (aparece, no se cierra, deshabilitado sin puntaje, éxito, 409, error inline, varias pendientes, rol dual), `RateBookingDialog` en modo obligatorio, interceptor de `httpClient` y `queryClient` ante 423, `isRatingRequiredError`
- [ ] `npm run lint`, `npm run type-check` y `npm test` en verde
- [ ] Verificado a mano con el backend: bloqueo al fin de clase, 423 sin ruido, cerrar y reabrir, sesión vencida y re-login, rol dual, desbloqueo al calificar
- [ ] Commits en español con prefijo convencional (`feat:`, `fix:`, `test:`, `docs:`)

## Decisiones pendientes

1. **Textos del popup:** los de este spec son propuesta ("Calificá tu sesión para continuar", "Para seguir usando KnowLink, tenés que calificar esta sesión.", botón "Calificar"). Confirmar con el equipo/PO.
2. **Confirmación tras calificar:** se reutiliza `RateBookingSuccessDialog` (explica el revelado de calificaciones). Alternativa: cerrar directo y pasar a la siguiente pendiente.
3. **Contador "Tenés N sesiones por calificar":** incluido; se puede quitar si se prefiere un popup más simple.
