# US-40 — Reactivar cuenta desactivada (Frontend Spec)

> **Lee primero:** `AGENTS.md` y `docs/base-standards.md`. Requiere el backend de US-40 (`docs/us-40-reactivar-cuenta-backend.spec.md` en `knowlink-backend`) ya mergeado o corriendo localmente.

## 0. Metadata

| Campo | Valor |
|---|---|
| ID Historia | US-40 |
| Story Points | 5 (total; el grueso está en backend) |
| Prioridad | Baja |
| Módulo | `auth` |
| Relacionadas | US-04 (desactivación temporal), US-02 (inicio de sesión) |
| Repo | `knowlink-frontend` |

**Historia:** Como usuario que desactivó temporalmente su cuenta, quiero poder reactivarla fácilmente para retomar mi actividad con todos mis datos intactos.

---

## 1. Estado actual del repo (verificado en `main`)

- `useLogin` (`src/modules/auth/hooks/useLogin.ts`) llama `loginUser` (usa `rawHttpClient`), en `onSuccess` hace `login(authResponse)` y navega según `ROLE_REDIRECT`; en `onError` muestra `toast.error(message ?? "Credenciales incorrectas")`.
- `useAuthStore` (zustand + `persist`, key `knowlink-auth`) guarda `authResponse`.
- Rutas de auth en `src/routes/AuthRoutes.tsx` (`login`, `check-email`, `activate`, …). Páginas con `AuthLayout` (ver `CheckEmailPage.tsx` como modelo de estilo).
- `EXCLUDED_BEARER_ROUTES` en `src/shared/lib/constants.ts` lista las rutas que no llevan Bearer (incluye `/api/v1/auth/login`).
- `ErrorResponse = { status, message, detail? }`.
- **No existe** pantalla de "Desactivar cuenta" (US-04 sin implementar). Esta historia **no** la construye.

---

## 2. Criterios de aceptación → UI

| # | Criterio | Implementación |
|---|---|---|
| 1 | Login con cuenta desactivada → pantalla intermedia | `useLogin.onError`: si `status === 403` y `detail === "ACCOUNT_DEACTIVATED"` → guarda credenciales en memoria y `navigate("/auth/reactivate")`. Página `ReactivateAccountPage` con el texto **"Tu cuenta está desactivada. ¿Querés reactivarla?"** y botones **"Reactivar cuenta"** y **"Cancelar"**. **No** mostrar el toast de error en este caso |
| 2 | Confirmar → reactiva y redirige al dashboard como login normal | "Reactivar cuenta" → `POST /api/v1/auth/reactivate` → `login(authResponse)` + `navigate(ROLE_REDIRECT[role], { replace: true })` (misma lógica que login) |
| 3 | Mensaje de confirmación | Tras el `200`: `toast.success("¡Tu cuenta fue reactivada correctamente. ¡Bienvenido de nuevo!")` (texto literal del criterio, incluida la puntuación) |
| 4 | Cancelar → sigue desactivada y vuelve al login | "Cancelar": limpia credenciales en memoria y `navigate("/auth/login", { replace: true })`. **No se llama a ningún endpoint** |
| 5 | Datos intactos | Lo garantiza el backend. El frontend solo hace `queryClient.clear()` (ya lo hace `login()` del store), así no quedan datos cacheados de otra sesión |

---

## 3. Contrato con el backend

| Método | Ruta | Body | Respuesta |
|---|---|---|---|
| POST | `/api/v1/auth/login` | `{email, password, targetRole?}` | `200 AuthResponse` · `401` inválidas · **`403` `{status:403, message:"Tu cuenta está desactivada.", detail:"ACCOUNT_DEACTIVATED"}`** |
| POST | `/api/v1/auth/reactivate` | `{email, password, targetRole?}` | `200 AuthResponse` · `401` credenciales inválidas / cuenta sin confirmar / eliminada · `400` validación |

El `403 ACCOUNT_DEACTIVATED` solo se devuelve si la contraseña es correcta; con contraseña incorrecta el login responde el `401` habitual (no cambia nada en la UI).

---

## 4. Implementación paso a paso

Flujo de capas: `api → hooks → components/pages`. Imports con `@/`. Prettier: comillas dobles, `;`, trailing comma ES5, 100 cols, 2 espacios. Sin `any`. Sin axios en componentes. Si algo no coincide con el código real, detenete y marcalo en el PR.

### 4.1 Constantes — `src/modules/auth/constants.ts` (agregar)

```ts
export const AUTH_REACTIVATE_KEY = "auth-reactivate";
export const ACCOUNT_DEACTIVATED_CODE = "ACCOUNT_DEACTIVATED";
export const ACCOUNT_REACTIVATED_MESSAGE =
  "¡Tu cuenta fue reactivada correctamente. ¡Bienvenido de nuevo!";
export const REACTIVATE_ROUTE = "/auth/reactivate";
```

### 4.2 Rutas sin Bearer — `src/shared/lib/constants.ts`

Agregar `"/api/v1/auth/reactivate"` a `EXCLUDED_BEARER_ROUTES`.

### 4.3 Tipos — `src/modules/auth/interfaces/requests/reactivate-request.interface.ts`

Mismo shape que `LoginRequest`. Si `LoginRequest` es `{email, password, targetRole?}`, definí `export type ReactivateRequest = LoginRequest;` en vez de duplicar campos. Respuesta: reutilizar `AuthResponse`.

### 4.4 API — `src/modules/auth/api/auth.api.ts` (agregar)

```ts
export async function reactivateAccount(data: ReactivateRequest): Promise<AuthResponse> {
  const response = await rawHttpClient.post<AuthResponse>("/api/v1/auth/reactivate", data);
  return response.data;
}
```

`rawHttpClient` a propósito (igual que `loginUser`): no muestra snackbar ni hace logout automático en `401`.

### 4.5 Store en memoria — `src/modules/auth/hooks/useReactivationStore.ts`

Guarda las credenciales **solo mientras dura el paso intermedio**. **NO** usar `persist`, `localStorage`, `sessionStorage`, query string ni `location.state` (queda en `history.state`).

```ts
import { create } from "zustand";
import type { LoginFormValues } from "@/modules/auth/schemas/login.schema";

interface ReactivationStore {
  pendingCredentials?: LoginFormValues;
  setPendingCredentials: (credentials: LoginFormValues) => void;
  clear: () => void;
}

export const useReactivationStore = create<ReactivationStore>()((set) => ({
  pendingCredentials: undefined,
  setPendingCredentials: (pendingCredentials) => set({ pendingCredentials }),
  clear: () => set({ pendingCredentials: undefined }),
}));
```

(Si `LoginFormValues` no incluye `targetRole`, pasalo igual que hoy lo pasa `useLogin`; no agregues selector de rol.)

### 4.6 Utilidad compartida — `src/modules/auth/utils/role-redirect.ts`

Mover `ROLE_REDIRECT` y el cálculo del destino de `useLogin.ts` a una función exportada, sin cambiar valores:

```ts
export function getRoleDestination(role: AuthRole): string {
  return ROLE_REDIRECT[role] ?? "/student/home";
}
```

`useLogin` pasa a usarla (el test existente `test/modules/auth/useLogin.test.tsx` debe seguir en verde sin modificarse, salvo imports).

### 4.7 Modificar `useLogin.ts`

En `onError(error, variables)`:

```ts
const response = (error as { response?: { status?: number; data?: ErrorResponse } }).response;
if (response?.status === 403 && response.data?.detail === ACCOUNT_DEACTIVATED_CODE) {
  setPendingCredentials(variables);
  navigate(REACTIVATE_ROUTE);
  return; // no error toast
}
// ...resto igual que hoy
```

Cualquier otro error conserva exactamente el comportamiento actual.

### 4.8 Hook `useReactivateAccount.ts` — `src/modules/auth/hooks/`

`useMutation` con `mutationKey: [AUTH_REACTIVATE_KEY]`, `mutationFn: reactivateAccount`.

- `onSuccess(authResponse)`: `login(authResponse)`; `clear()` del store de reactivación; `navigate(getRoleDestination(authResponse.role), { replace: true })`; `toast.success(ACCOUNT_REACTIVATED_MESSAGE)`.
- `onError`: `toast.error(message ?? "No pudimos reactivar tu cuenta. Intentá nuevamente")`; si `status === 401` → `clear()` y `navigate("/auth/login", { replace: true })`.

Expone `{ mutate, isPending }`.

### 4.9 Página — `src/modules/auth/pages/ReactivateAccountPage.tsx`

- Envolver en `AuthLayout`; imitar estructura/estilo de `CheckEmailPage` (icono lucide, título, texto, botones MUI). Sin `style={{}}`; usar `sx`.
- Guard: si `pendingCredentials` es `undefined` (p. ej. recarga de página) → `<Navigate to="/auth/login" replace />`.
- Título: **"Tu cuenta está desactivada"**; texto: **"¿Querés reactivarla?"** (juntos deben leerse como *"Tu cuenta está desactivada. ¿Querés reactivarla?"*).
- Botón primario **"Reactivar cuenta"** (`disabled` + texto "Reactivando..." mientras `isPending`) → `mutate(pendingCredentials)`.
- Botón secundario **"Cancelar"** (`disabled` mientras `isPending`) → `clear()` + `navigate("/auth/login", { replace: true })`.
- `useEffect` de cleanup: al desmontar sin éxito, `clear()` para no dejar credenciales en memoria.

### 4.10 Ruta — `src/routes/AuthRoutes.tsx`

```tsx
<Route path="reactivate" element={<ReactivateAccountPage />} />
```

Ruta pública (cuelga de `/auth/*`); no requiere cambios en `RoutesProvider`.

---

## 5. Tests (Vitest + Testing Library, en `test/modules/auth/`)

Seguir el estilo de `useLogin.test.tsx` y `ResetPasswordPage.test.tsx`.

| # | Caso | Esperado |
|---|---|---|
| 1 | `useLogin`: `403` + `ACCOUNT_DEACTIVATED` | guarda credenciales, navega a `/auth/reactivate`, **no** `toast.error` |
| 2 | `useLogin`: `401` / otros errores | igual que antes (toast, sin navegación) |
| 3 | `ReactivateAccountPage` sin credenciales | redirige a `/auth/login` |
| 4 | Render con credenciales | muestra título/texto y los botones "Reactivar cuenta" y "Cancelar" |
| 5 | Click "Cancelar" | **no** llama a `reactivateAccount`; limpia store; navega a `/auth/login` |
| 6 | Click "Reactivar cuenta" OK | llama `reactivateAccount` con las credenciales; `login` del store; navega a `getRoleDestination(role)`; `toast.success` con el texto exacto |
| 7 | Reactivar → `401` | `toast.error`, limpia store, vuelve a login |
| 8 | Mientras `isPending` | ambos botones deshabilitados |
| 9 | `getRoleDestination` | STUDENT→`/student/profile`, TUTOR→`/tutor/profile`, ADMIN→`/admin/home` |

---

## 6. Checklist de entrega

- [ ] `pnpm lint`, `pnpm test` y build (`tsc`) en verde (usar el package manager que indique `AGENTS.md`/`package.json`).
- [ ] Manual (con backend local y un usuario puesto en `DEACTIVATED` por SQL): login → pantalla intermedia → Cancelar vuelve al login y el usuario sigue `DEACTIVATED`; login → Reactivar → dashboard + toast; contraseña incorrecta → toast de credenciales, sin pantalla intermedia.
- [ ] Recargar `/auth/reactivate` directamente → redirige a login.
- [ ] No hay credenciales en `localStorage`/`sessionStorage` (revisar DevTools).
- [ ] Commit: `feat: reactivar cuenta desactivada (US-40)`.
