# US-12 — Desactivar / Reactivar materia ofrecida (Frontend Spec)

> **Lee primero:** `AGENTS.md` y `docs/base-standards.md`. Requiere el backend de US-12 (`docs/us-12-desactivar-reactivar-materia-backend.spec.md` en `knowlink-backend`) ya mergeado o corriendo localmente.

## 0. Metadata

| Campo | Valor |
|---|---|
| ID Historia | US-12 |
| Story Points | 3 (total; el grueso está en backend) |
| Prioridad | Baja |
| Módulo | `tutors` (nuevo en este repo) |
| Relacionadas | US-48 (registrar materia), US-25 (validación), US-38 (perfil tutor) |
| Repo | `knowlink-frontend` |

**Historia:** Como tutor, quiero desactivar temporalmente una materia y reactivarla luego, sin perder su información ni eliminarla.

---

## 1. Estado actual del repo (verificado en `main`)

- Solo existen los módulos `auth` y `users`. **No existe** módulo `tutors`, ni página de perfil del tutor, ni pestaña "Materias", ni "Mis reservas". `RoutesProvider` solo tiene `/auth/*` y un `/` placeholder.
- `httpClient` (axios) ya muestra un toast de error con `data.message` en cualquier respuesta de error. `rawHttpClient` no muestra toast ni hace logout (pensado para manejo manual de errores).
- `useSnackbarStore.showMessage(msg, severity)` envuelve `sonner`.

**Consecuencia:** esta historia entrega los **bloques reutilizables** (api, hooks, tipos, `SubjectCard` con acciones y diálogos) y los integra en la pestaña "Materias" **si ya existe** al momento de implementar (US-38, hay PRs abiertos). Si la pestaña no existe todavía, **no la construyas**: dejá los componentes listos y exportados, con un test, y anotalo en el PR. No inventes rutas de perfil.

---

## 2. Criterios de aceptación → UI

| # | Criterio | Implementación |
|---|---|---|
| 1 | Desactivar individualmente | Botón "Desactivar" por tarjeta; la mutación recibe un solo `tutorSubjectId` |
| 2 | Diálogo de confirmación | `DeactivateSubjectDialog` (MUI `Dialog`) con el texto del punto 4.4 |
| 3 | Cancelar no cambia nada | "Cancelar"/cerrar el diálogo **no dispara la mutación** |
| 4 | Bloqueo por reservas activas + link a "Mis reservas" | Ante `409` + `detail === "SUBJECT_HAS_ACTIVE_BOOKINGS"` se muestra `ActiveBookingsBlockedDialog` con botón "Ir a Mis reservas" |
| 5 | Se conserva insignia/calificaciones | No se hace nada especial: el badge de verificación y el rating siguen visibles en la tarjeta desactivada |
| 6 | Reactivar en cualquier momento | Botón "Reactivar" en tarjetas con `active === false` (sin diálogo) |
| 7 | No visible para alumnos | Lo resuelve el backend; en la vista del tutor la tarjeta desactivada muestra un chip "Desactivada" |

---

## 3. Contrato con el backend

Base `/api/v1/tutors`, JWT de rol TUTOR, sin body.

| Método | Ruta | Respuesta |
|---|---|---|
| PATCH | `/subjects/{tutorSubjectId}/deactivate` | `200` → `TutorSubjectResponse` |
| PATCH | `/subjects/{tutorSubjectId}/reactivate` | `200` → `TutorSubjectResponse` |

```ts
export interface TutorSubjectResponse {
  tutorSubjectId: string;
  subjectName: string;
  modality: "VIRTUAL" | "IN_PERSON" | "BOTH";
  compensationType: "FREE" | "PAID";
  pricePerHour: number | null;
  verificationStatus: "PENDING" | "ACTIVE" | "REJECTED"; // estado de validación (US-25), NO es "activa/desactivada"
  averageRating: number | null;
  reviewCount: number | null;
  active: boolean; // true = ofrecida; false = desactivada
}
```

Errores (`ErrorResponse`: `{status, message, detail}`):

| Status | `detail` | Qué hacer en UI |
|---|---|---|
| 409 | `SUBJECT_HAS_ACTIVE_BOOKINGS` | Mostrar `ActiveBookingsBlockedDialog` |
| 404 | `TUTOR_SUBJECT_NOT_FOUND` | Toast (el interceptor ya lo muestra) + invalidar la query de materias |
| 401/403 | — | Lo maneja el interceptor |

> `verificationStatus` y `active` son ejes distintos. **Nunca** uses `verificationStatus === "ACTIVE"` para decidir si la materia está desactivada; usá `active`.

---

## 4. Implementación paso a paso

Respetar el flujo de capas: `api → hooks → components/pages`. Imports con `@/`. Prettier: comillas dobles, `;`, trailing comma ES5, 100 cols, 2 espacios. Sin `any`. Sin `style={{}}`. Sin axios en componentes.

### 4.1 Tipos — `src/modules/tutors/interfaces/responses/tutor-subject.interface.ts`

Contiene `TutorSubjectResponse` (arriba). Si ya existe un tipo equivalente (por US-38/US-48), **extendelo agregando `active`** en vez de duplicarlo.

### 4.2 Constantes — `src/modules/tutors/constants.ts`

```ts
export const TUTOR_SUBJECT_DEACTIVATE_KEY = "tutor-subject-deactivate";
export const TUTOR_SUBJECT_REACTIVATE_KEY = "tutor-subject-reactivate";
export const TUTOR_SELF_PROFILE_KEY = "tutor-self-profile"; // reutilizar si ya existe
export const SUBJECT_HAS_ACTIVE_BOOKINGS = "SUBJECT_HAS_ACTIVE_BOOKINGS";
export const MY_BOOKINGS_ROUTE = "/bookings"; // TODO: confirmar ruta real de "Mis reservas"
```

### 4.3 API — `src/modules/tutors/api/tutor-subjects.api.ts`

```ts
import { rawHttpClient } from "@/shared/lib/httpClient";
import type { TutorSubjectResponse } from "@/modules/tutors/interfaces/responses/tutor-subject.interface";

export async function deactivateTutorSubject(tutorSubjectId: string): Promise<TutorSubjectResponse> {
  const response = await rawHttpClient.patch<TutorSubjectResponse>(
    `/api/v1/tutors/subjects/${tutorSubjectId}/deactivate`
  );
  return response.data;
}

export async function reactivateTutorSubject(tutorSubjectId: string): Promise<TutorSubjectResponse> {
  const response = await rawHttpClient.patch<TutorSubjectResponse>(
    `/api/v1/tutors/subjects/${tutorSubjectId}/reactivate`
  );
  return response.data;
}
```

Se usa `rawHttpClient` **a propósito**: el `httpClient` mostraría un toast de error genérico en el 409 además del diálogo propio. Por eso los hooks manejan los errores a mano (4.4).

### 4.4 Hooks — `src/modules/tutors/hooks/`

`useDeactivateTutorSubject.ts`:

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { deactivateTutorSubject } from "@/modules/tutors/api/tutor-subjects.api";
import {
  SUBJECT_HAS_ACTIVE_BOOKINGS,
  TUTOR_SELF_PROFILE_KEY,
  TUTOR_SUBJECT_DEACTIVATE_KEY,
} from "@/modules/tutors/constants";
import type { ErrorResponse } from "@/shared/interfaces/error-response.interface";
import { useSnackbarStore } from "@/shared/hooks/useSnackbarStore";

interface Options {
  onBlockedByBookings: () => void;
}

export function useDeactivateTutorSubject({ onBlockedByBookings }: Options) {
  const queryClient = useQueryClient();
  const showMessage = useSnackbarStore((s) => s.showMessage);

  const { isPending, mutate } = useMutation({
    mutationKey: [TUTOR_SUBJECT_DEACTIVATE_KEY],
    mutationFn: deactivateTutorSubject,
    onSuccess: () => {
      showMessage("La materia fue desactivada.", "success");
      queryClient.invalidateQueries({ queryKey: [TUTOR_SELF_PROFILE_KEY] });
    },
    onError: (error) => {
      if (
        axios.isAxiosError<ErrorResponse>(error) &&
        error.response?.data?.detail === SUBJECT_HAS_ACTIVE_BOOKINGS
      ) {
        onBlockedByBookings();
        return;
      }
      const message = axios.isAxiosError<ErrorResponse>(error)
        ? error.response?.data?.message
        : undefined;
      showMessage(message ?? "Ocurrió un error inesperado.", "error");
    },
  });

  return { isPending, mutate };
}
```

`useReactivateTutorSubject.ts`: mismo patrón con `reactivateTutorSubject`, mensaje de éxito "La materia fue reactivada.", mismo manejo genérico de error (sin caso especial) e invalidación de `TUTOR_SELF_PROFILE_KEY`.

> Si la query del perfil propio del tutor ya existe con otra key, usá **esa** key en `invalidateQueries` (no crees una segunda).

### 4.5 Componentes — `src/modules/tutors/components/`

**`DeactivateSubjectDialog.tsx`** — props: `open: boolean`, `subjectName: string`, `isPending: boolean`, `onConfirm: () => void`, `onCancel: () => void`. MUI `Dialog`:
- Título: `Desactivar materia`
- Texto: `La materia "{subjectName}" dejará de aparecer en el buscador y no podrá recibir nuevas reservas. Podés reactivarla cuando quieras desde la sección Materias de tu perfil.`
- Botones: `Cancelar` (llama `onCancel`; cierre por backdrop/Esc también llama `onCancel`) y `Desactivar` (llama `onConfirm`, `disabled` mientras `isPending`).
- **Cancelar/cerrar nunca llama a la API** (AC #3).

**`ActiveBookingsBlockedDialog.tsx`** — props: `open`, `onClose`. Texto: `No podés desactivar esta materia porque tiene reservas activas. Cancelalas o esperá a que se completen para poder desactivarla.` Botones: `Cerrar` y `Ir a Mis reservas` (usa `useNavigate()` a `MY_BOOKINGS_ROUTE`, y cierra el diálogo).

**`SubjectActiveToggle.tsx`** (o integrado en la tarjeta de materia existente) — props: `subject: TutorSubjectResponse`. Estado local `confirmOpen` y `blockedOpen`.
- Si `subject.active`: botón "Desactivar" → abre `DeactivateSubjectDialog`; al confirmar → `mutate(subject.tutorSubjectId)` y cerrar el diálogo de confirmación; si el hook invoca `onBlockedByBookings` → `blockedOpen = true`.
- Si `!subject.active`: chip "Desactivada" (MUI `Chip`) y botón "Reactivar" que llama directo a `useReactivateTutorSubject` (sin diálogo).
- Mientras `isPending` el botón queda deshabilitado (evita doble click).
- La tarjeta desactivada se muestra atenuada (variante visual con `sx`/prop de MUI, **no** `style={{}}`) pero conserva visibles badge de verificación, calificación y datos.

### 4.6 Integración en la pestaña "Materias"

Si la pestaña ya existe en `main` al implementar: renderizar `SubjectActiveToggle` por cada materia de `GET /api/v1/tutors/me/profile` (`subjects[]`, que incluye las desactivadas con `active: false`). Si no existe: ver sección 1.

---

## 5. Tests (Vitest + Testing Library, estilo de `useAuthStore.test.ts`)

- `DeactivateSubjectDialog`: muestra el texto de confirmación; "Cancelar" llama `onCancel` y **no** `onConfirm`; "Desactivar" llama `onConfirm`.
- `SubjectActiveToggle`: materia activa muestra "Desactivar"; materia inactiva muestra chip "Desactivada" y "Reactivar"; cancelar el diálogo no llama a la API (mock de `deactivateTutorSubject` con `expect(...).not.toHaveBeenCalled()`).
- `useDeactivateTutorSubject`: éxito invalida la query y muestra snackbar; error 409 con `detail: "SUBJECT_HAS_ACTIVE_BOOKINGS"` invoca `onBlockedByBookings` y **no** muestra snackbar de error; otro error muestra el `message`.
- `ActiveBookingsBlockedDialog`: "Ir a Mis reservas" navega a `MY_BOOKINGS_ROUTE`.

Comandos: `npm run test`, `npm run lint`, `npm run build` deben pasar.

---

## 6. No hacer

- No usar `verificationStatus` para representar activa/desactivada.
- No llamar axios desde componentes; no usar `useEffect + axios`.
- No usar `any` ni `style={{}}`.
- No crear en `shared/` nada que solo use el módulo `tutors`.
- No construir la pestaña "Materias", el perfil del tutor ni "Mis reservas" si no existen (otras historias).
- No mostrar el toast genérico del interceptor en el 409 (por eso `rawHttpClient`).
- No ocultar ni borrar del estado local la materia desactivada: el tutor debe seguir viéndola para reactivarla.
- No hacer updates optimistas: esperar la respuesta del backend (puede responder 409).

## 7. Definition of Done

- [ ] Tipos, constantes, api, 2 hooks y 3 componentes creados en `src/modules/tutors/`
- [ ] Diálogo de confirmación con el texto de AC #2; cancelar no llama a la API
- [ ] 409 `SUBJECT_HAS_ACTIVE_BOOKINGS` muestra el diálogo con acceso a "Mis reservas"
- [ ] Reactivar sin diálogo; tarjeta desactivada con chip y datos/insignia intactos
- [ ] Tras éxito se invalida la query del perfil propio del tutor
- [ ] Ruta de "Mis reservas" confirmada con el equipo (hoy es un TODO en `constants.ts`)
- [ ] `npm run test`, `npm run lint` y `npm run build` en verde
- [ ] Code review aprobado
