# FIX — El popup de token del tutor no reaparece tras cerrar sesión (Frontend Spec)

> **Lee primero:** `AGENTS.md` y `docs/base-standards.md`.
> Verificada contra la rama `dev` de `TetraCodeTeam/knowlink-frontend` (14/11/2026). Si algo no coincide con el código real, detenete y anotalo en el PR en vez de inventar.

## 0. Metadata

| Campo | Valor |
|---|---|
| ID | FIX (observación de QA sobre US-41, confirmación de sesión con token) |
| Tipo | Bug |
| Prioridad | MEDIA (el tutor no puede confirmar la clase y queda sin token) |
| Módulo | `attendance` (hooks y stores) + `auth` (`useAuthStore`) |
| Relacionadas | US-41 (confirmación de asistencia), US-51 (reclamos), US-20b (calificación obligatoria) |
| Repo | `knowlink-frontend` — rama base `dev` |

**Observación original (QA):** la tester tenía una sesión a las 15:30 como tutor. Cerró sesión para ir al perfil del alumno a ver el token. Al volver al tutor no le apareció más el popup para ingresarlo; recién apareció cerca de las 16:03. Dudó si fue por cerrar sesión o porque tenía otra clase que terminaba a las 15:30.

> **Estado de la causa:** es una hipótesis hecha leyendo el código, todavía **no reproducida**. Antes de implementar, ejecutá la reproducción de la sección 2. Si no se reproduce, detenete y anotalo en el PR.

---

## 1. Estado actual del repo (verificado en `dev`)

Archivos involucrados, todos en `src/modules/attendance/hooks/` salvo `useAuthStore`:

- `useSessionConfirmationStore.ts` — store global de Zustand, en memoria (no persistido). Estado: `pending` y `resolvedBookingIds: Map<string, number>` con TTL `RESOLVED_BOOKING_TTL_MS = 6 min`. Acciones: `openConfirmation`, `clearConfirmation`, `isResolved`.
  - `clearConfirmation()` hace dos cosas a la vez: pone `pending = null` **y** agrega `pending.sessionId` a `resolvedBookingIds`.
- `useEligibleConfirmationBooking.ts` — `useQuery(["attendance-upcoming-bookings", role])`. Devuelve **una sola** reserva: la primera de la lista (orden por inicio ASC) cuya ventana está abierta (`now >= windowStart && now < confirmationTokenExpiresAt`). No conoce el store de reservas resueltas.
- `useAutoOpenSessionConfirmation.ts` — montado en `TutorLayout`. Su efecto hace:
  ```ts
  if (!eligibleBooking) { if (pending) clearConfirmation(); return; }
  if (isResolved(eligibleBooking.bookingId)) return;
  ```
- `src/modules/auth/hooks/useAuthStore.ts` — `login()` y `logout()` hacen `queryClient.clear()` pero **no tocan** los stores de `attendance`.
- `src/modules/attendance/hooks/useStudentTokenStore.ts` — store del lado alumno (`active`, `showToken`, `hideToken`). Tampoco se resetea en login/logout.

### Causa probable

1. El usuario cierra sesión con el popup abierto (`pending` seteado).
2. `logout()` ejecuta `queryClient.clear()` y la query queda sin datos, así que `eligibleBooking` pasa a `null`.
3. El efecto de `useAutoOpenSessionConfirmation` ve `!eligibleBooking && pending` y llama a `clearConfirmation()`.
4. `clearConfirmation()` marca la reserva como "resuelta" durante 6 minutos, aunque nadie ingresó el token.
5. Al volver a entrar como tutor, `isResolved(...)` es `true` y el popup no se abre hasta que vence el TTL.

### Problemas secundarios

- Los stores de `attendance` no se limpian entre sesiones de usuario, así que `pending` y `resolvedBookingIds` de un usuario pueden filtrarse al siguiente en la misma pestaña.
- `useEligibleConfirmationBooking` devuelve solo la primera reserva en ventana. Si esa está resuelta, `useAutoOpenSessionConfirmation` retorna sin considerar la siguiente (relevante con clases pegadas).

---

## 2. Reproducción previa (obligatoria)

1. Loguearse como tutor con una reserva `BOOKED` en curso (la ventana del tutor abre en `sessionStart`) y esperar el popup "Ingresá tu token".
2. Cerrar sesión **sin** ingresar el token.
3. Volver a loguearse como tutor, dentro de los 6 minutos siguientes.
4. **Resultado actual esperado del bug:** el popup no aparece hasta pasados ~6 minutos desde el logout.
5. Repetir sin cerrar sesión (solo navegar entre pantallas) para confirmar que ahí el popup se mantiene.

---

## 3. Criterios de aceptación (Gherkin)

```gherkin
Escenario 1: Cerrar sesión con el popup abierto no resuelve la clase
  Dado que soy tutor y tengo el popup de token abierto para la reserva B
  Cuando cierro sesión sin ingresar el token
  Y vuelvo a iniciar sesión como tutor
  Entonces el popup de la reserva B vuelve a aparecer en cuanto se carga la lista de reservas
  Y no tengo que esperar ningún TTL

Escenario 2: Confirmar sigue marcando la reserva como resuelta
  Dado que el popup está abierto para la reserva B
  Cuando ingreso el token correcto y se confirma la sesión
  Entonces el popup se cierra
  Y la reserva B queda marcada como resuelta
  Y si el layout se remonta antes del próximo poll el popup NO se reabre

Escenario 3: Vencer el plazo sigue marcando la reserva como resuelta
  Dado que el popup está abierto
  Cuando el contador llega a cero
  Entonces el popup se cierra y la reserva queda marcada como resuelta

Escenario 4: Sin filtración entre sesiones de usuario
  Dado que hay un popup abierto o reservas marcadas como resueltas
  Cuando se ejecuta login o logout
  Entonces `pending` queda en null y `resolvedBookingIds` queda vacío
  Y el token del alumno activo (`useStudentTokenStore.active`) queda en null

Escenario 5: Una reserva resuelta no tapa a la siguiente
  Dado dos reservas A y B del tutor con la ventana abierta, con A marcada como resuelta
  Cuando se evalúa cuál mostrar
  Entonces se muestra B, no se queda esperando a que A salga de la lista
```

---

## 4. Cambios requeridos

### 4.1 `useSessionConfirmationStore.ts`

- **Agregar** `closeConfirmation: () => void`: pone `pending = null` y **no** toca `resolvedBookingIds`. Si `pending` ya es `null`, devuelve el mismo estado (sin re-render).
- **Agregar** `reset: () => void`: `pending = null` y `resolvedBookingIds = new Map()`.
- **No modificar** `clearConfirmation`. Su semántica ("la reserva quedó resuelta") se mantiene: la usan `TutorSessionconfirmationwidget.tsx` (al confirmar, al bloquearse por reclamo y en `onExpire` del contador).
- Actualizar el docblock de `clearConfirmation` para dejar explícita la diferencia con `closeConfirmation`.

### 4.2 `useAutoOpenSessionConfirmation.ts`

- Cuando `!eligibleBooking && pending`, llamar a `closeConfirmation()` (no a `clearConfirmation()`).
- Pasar a `useEligibleConfirmationBooking` el criterio para saltear reservas resueltas (ver 4.3).
- Mantener el chequeo `isResolved(eligibleBooking.bookingId)` como defensa (cubre el caso de datos stale entre el filtrado y el efecto).

### 4.3 `useEligibleConfirmationBooking.ts`

- Cambiar la firma a `useEligibleConfirmationBooking(role: Role, options?: { skip?: (bookingId: string) => boolean })`.
- Dentro del `for`, saltear (`continue`) las reservas para las que `options?.skip?.(booking.bookingId)` sea `true`.
- La opción es **opcional**: los demás llamadores (por ejemplo el lado alumno) no cambian de comportamiento.
- Incluir `options?.skip` en las dependencias del `useMemo` (o leerlo con una ref) sin provocar recomputaciones extra: la función `isResolved` del store es estable.

### 4.4 `useAuthStore.ts`

- En `login` y en `logout`, además de `queryClient.clear()`, llamar a `useSessionConfirmationStore.getState().reset()` y `useStudentTokenStore.getState().hideToken()`.
- Imports con alias `@/`. Los dos stores solo importan `zustand`, así que no se introduce ciclo de dependencias; verificalo igual al compilar.

---

## 5. Ubicación de archivos

| Archivo | Acción |
|---|---|
| `src/modules/attendance/hooks/useSessionConfirmationStore.ts` | Modificar (agregar `closeConfirmation` y `reset`) |
| `src/modules/attendance/hooks/useAutoOpenSessionConfirmation.ts` | Modificar |
| `src/modules/attendance/hooks/useEligibleConfirmationBooking.ts` | Modificar (opción `skip`) |
| `src/modules/auth/hooks/useAuthStore.ts` | Modificar (reset en login/logout) |
| `test/modules/attendance/useSessionConfirmationStore.test.ts` | Ampliar |
| `test/modules/attendance/useAutoOpenSessionConfirmation.test.tsx` | Ampliar |

---

## 6. Tests (Vitest + Testing Library)

Reutilizar el helper `makeBooking` y los mocks de `getUpcomingConfirmableBookings` que ya existen en `useAutoOpenSessionConfirmation.test.tsx`.

**`useSessionConfirmationStore.test.ts`**
- `closeConfirmation` deja `pending = null` y `isResolved(id)` en `false`.
- `closeConfirmation` con `pending = null` no cambia el estado.
- `clearConfirmation` sigue marcando `isResolved(id)` en `true` (regresión).
- `reset` deja `pending = null` y el Map vacío.

**`useAutoOpenSessionConfirmation.test.tsx`**
- *Logout con popup abierto:* abrir el popup, simular `useAuthStore.getState().logout()`, volver a autenticar, y verificar que el popup se reabre sin esperar el TTL (Escenario 1).
- *Remount tras confirmar:* el test existente debe seguir pasando sin cambios (Escenario 2).
- *Resuelta no tapa a la siguiente:* con dos reservas en ventana y la primera resuelta, `pending` termina siendo la segunda (Escenario 5).

**`useAuthStore`** (en `test/modules/auth/`): `login` y `logout` resetean `pending`, `resolvedBookingIds` y `useStudentTokenStore.active` (Escenario 4).

---

## 7. No hacer

- **No** cambiar la semántica de `clearConfirmation`; solo agregar `closeConfirmation` al lado.
- **No** persistir `resolvedBookingIds` en `localStorage` ni `sessionStorage`.
- **No** tocar el backend en este spec (ver sección 8).
- **No** agregar `useEffect` + `axios`/`fetch` en componentes; el data fetching sigue en `useQuery`.
- **No** usar `any` en TypeScript.
- **No** importar `sonner` directo; si hace falta un toast, `@/shared/lib/toast`.
- **No** cambiar los intervalos de polling (`FAST_POLL_MS`, `SLOW_POLL_MS`) ni el `RESOLVED_BOOKING_TTL_MS`.

---

## 8. Fuera de alcance (pendiente de decisión)

**Ventana de gracia del tutor (backend).** El token vence en `fin de la clase + 10 min` (`BookingConstants.CONFIRMATION_WINDOW_GRACE_PERIOD`), pero `GET /api/v1/bookings/mine?category=RESERVED` deja de devolver la reserva apenas pasa `endTime` (`upcomingOnly` filtra `b.endTime > :currentTime`). En la práctica, el tutor que no confirma antes de que termine la clase pierde el popup aunque el backend todavía aceptaría el token. Arreglarlo requiere un spec de backend aparte (por ejemplo, un endpoint o filtro dedicado a reservas confirmables).

**Revisar:** `modules/app-shell/hooks/useRoleSwitch.ts` también maneja tokens y no fue analizado; verificar si el cambio de rol sin cerrar sesión afecta estos stores.

---

## 9. Definition of Done

- [ ] Reproducción de la sección 2 ejecutada antes del cambio y anotada en el PR (se reproduce / no se reproduce).
- [ ] Los 5 escenarios Gherkin cubiertos por tests.
- [ ] El test existente "remount tras confirmar" sigue pasando sin modificarlo.
- [ ] `pnpm test`, `pnpm lint` y el build (`tsc`) pasan sin errores ni warnings nuevos.
- [ ] Sin `any`, imports con alias `@/`, Prettier (comillas dobles, `printWidth` 100).
- [ ] Prueba manual: con el popup abierto, cerrar sesión, volver a entrar como tutor y ver el popup de inmediato.
- [ ] Prueba manual: confirmar con token correcto y comprobar que el popup no se reabre al navegar.
- [ ] PR hacia `dev` describiendo la causa, el cambio y la sección 8 como pendiente.
