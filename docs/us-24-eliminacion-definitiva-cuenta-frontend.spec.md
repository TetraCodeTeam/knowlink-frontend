# US-24 — Eliminación definitiva de cuenta (Frontend Spec)

> **Lee primero:** `AGENTS.md` y `docs/base-standards.md`. Requiere el backend de US-24 (`docs/us-24-eliminacion-definitiva-cuenta-backend.spec.md` en `knowlink-backend`) ya mergeado o corriendo localmente.

## 0. Metadata

| Campo | Valor |
|---|---|
| ID Historia | US-24 |
| Story Points | 1 (tablero) |
| Prioridad | Baja |
| Módulo | `users` |
| Relacionadas | US-04 (desactivación), US-37 (perfil alumno), US-38 (perfil tutor), US-10/US-11 (reservas) |
| Repo | `knowlink-frontend` |

**Historia:** Como usuario registrado, quiero eliminar definitivamente mi cuenta para dejar de usar la plataforma y que mis datos personales sean borrados.

---

## 1. Estado actual del repo (verificado en `main`)

- Existe `src/modules/student/profile/components/AccountManagementCard.tsx` con los botones "Desactivar cuenta" y "Eliminar cuenta" (props `onDeactivateAccount`, `onDeleteAccount`). **Hoy no se renderiza**: en `OwnProfilePage.tsx` está dentro de un bloque comentado, con `console.log` como handler.
- El perfil del tutor (`src/modules/tutor/profile/components/TutorProfilePage.tsx`) **no** tiene tarjeta de gestión de cuenta.
- `src/shared/components/AppConfirmDialog.tsx` ya soporta `severity="danger"`, `requireCheckbox`, `content` (nodo extra, ej. un campo de texto), `isPending`, `onConfirm`, `onCancel`.
- `rawHttpClient` no muestra toast ni hace logout en `401`; `httpClient` **sí** hace logout automático en `401`.
- `modules/users/` tiene `api/`, `components/`, `constants.ts`, `interfaces/`, `schemas/` (sin `hooks/` todavía).
- `modules/auth/logout/` es el modelo de estructura (`api/`, `hooks/`, `components/`).
- US-04 (desactivar cuenta) **no** está implementada: el botón "Desactivar cuenta" no debe hacer nada nuevo en esta historia.

---

## 2. Criterios de aceptación → UI

| # | Criterio | Implementación |
|---|---|---|
| 1 | Diálogo de confirmación explícita | `DeleteAccountDialog` (sobre `AppConfirmDialog`, `severity="danger"`, `requireCheckbox`) con campo de contraseña. El request **no** se envía hasta confirmar |
| 2 | Cuenta eliminada invisible para otros | Backend. En el frontend, tras eliminar, se cierra la sesión y se limpia el estado |
| 3 | Cancelar no cambia nada | "Cancelar"/cerrar el diálogo **no dispara la mutación**; se limpia el campo de contraseña |
| 4 | Reservas activas pendientes → mensaje exacto | Ante `409` con `detail === "ACCOUNT_HAS_ACTIVE_BOOKINGS"` se muestra un `Alert` dentro del diálogo con el texto literal **"No podés dar de baja tu cuenta con reservas activas pendientes"** (usar `message` del backend; la constante local es respaldo) |
| 5 | Datos borrados de forma permanente | Texto del diálogo lo advierte; sin "deshacer" |

---

## 3. Contrato con el backend

`POST /api/v1/users/me/delete-account`, JWT requerido (Bearer lo agrega el interceptor), body `{ "password": string }`.

| Status | `detail` | Qué hacer en UI |
|---|---|---|
| 204 | — | Éxito: ver 4.5 |
| 401 | — | Contraseña incorrecta: error **en el campo** ("La contraseña es incorrecta"). **No** cerrar sesión |
| 403 | — | Toast "Esta cuenta no puede eliminarse desde acá." |
| 409 | `ACCOUNT_HAS_ACTIVE_BOOKINGS` | `Alert` en el diálogo (AC #4); el diálogo sigue abierto, no se limpia nada |
| 409 | `ACCOUNT_HAS_PENDING_OBLIGATIONS` | `Alert` con `message` del backend (solo si el backend lo implementó; ver spec backend §2.3.2) |
| 400 | — | Error de validación en el campo |

Se usa **`rawHttpClient`** a propósito: con `httpClient` un `401` por contraseña incorrecta ejecutaría un logout automático y mostraría un toast genérico.

---

## 4. Implementación paso a paso

Flujo de capas: `api → hooks → components/pages`. Imports con `@/`. Prettier: comillas dobles, `;`, trailing comma ES5, 100 cols, 2 espacios. Sin `any`. Sin axios en componentes. Formularios con `react-hook-form` + `zodResolver` (schema en `schemas/`). Si algo no coincide con el código real, detenete y marcalo en el PR.

### 4.1 Constantes — `src/modules/users/constants.ts` (agregar)

```ts
export const USERS_DELETE_ACCOUNT_KEY = "users-delete-account";
export const ACCOUNT_HAS_ACTIVE_BOOKINGS = "ACCOUNT_HAS_ACTIVE_BOOKINGS";
export const ACCOUNT_HAS_PENDING_OBLIGATIONS = "ACCOUNT_HAS_PENDING_OBLIGATIONS";
export const ACTIVE_BOOKINGS_BLOCK_MESSAGE =
  "No podés dar de baja tu cuenta con reservas activas pendientes";
export const ACCOUNT_DELETED_MESSAGE = "Tu cuenta fue eliminada definitivamente.";
```

### 4.2 Schema — `src/modules/users/schemas/delete-account.schema.ts`

`z.object({ password: z.string().min(1, "La contraseña es requerida") })` y `DeleteAccountFormValues`.

### 4.3 API — `src/modules/users/api/users.api.ts` (agregar)

```ts
export async function deleteMyAccount(password: string): Promise<void> {
  await rawHttpClient.post("/api/v1/users/me/delete-account", { password });
}
```

### 4.4 Hook — `src/modules/users/hooks/useDeleteAccount.ts`

`useMutation` (`mutationKey: [USERS_DELETE_ACCOUNT_KEY]`, `mutationFn: deleteMyAccount`). Devuelve `{ mutate, isPending, blockedMessage, passwordError, reset }`, donde el hook interpreta el error:

- `onSuccess`: `useAuthStore.getState().logout()` (ya hace `queryClient.clear()`); `queryClient.removeQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all })` igual que `useLogout`; `navigate("/auth/login", { replace: true })`; `toast.success(ACCOUNT_DELETED_MESSAGE)`. **No** llamar a `logoutUser()`: el token ya no es válido.
- `onError`: según la tabla del §3. `409` + `ACCOUNT_HAS_ACTIVE_BOOKINGS` → `blockedMessage = data.message ?? ACTIVE_BOOKINGS_BLOCK_MESSAGE`; `401` → `passwordError`; `403` → `toast.error`; otros → `toast.error(data?.message ?? "No pudimos eliminar tu cuenta. Intentá nuevamente")`.

### 4.5 Componente — `src/modules/users/components/DeleteAccountDialog.tsx`

Props: `{ open: boolean; onClose: () => void }`. Usa `AppConfirmDialog`:

- `severity="danger"`, `title="¿Eliminar tu cuenta definitivamente?"`.
- `message`: "Esta acción es permanente. Vamos a borrar tus datos personales y no vas a poder recuperarlos. Tu historial de clases que otras personas ya vivieron conservará solo el nombre «Usuario eliminado»."
- `requireCheckbox` con el texto por defecto del componente.
- `content`: campo de contraseña (reutilizar `PasswordField` de `@/modules/auth/components/PasswordField`) con `react-hook-form` + `zodResolver(deleteAccountSchema)`, `autoComplete="current-password"`, y debajo, si hay `blockedMessage`, un `Alert severity="warning"` con ese texto.
- `confirmLabel="Eliminar definitivamente"`, `cancelLabel="Cancelar"`, `isPending` del hook.
- `onConfirm`: `handleSubmit(({ password }) => mutate(password))()`.
- `onCancel`/cierre: `reset()` del form y del hook, y `onClose()`. **No** llamar a la API.
- Al cerrar o reabrir, no debe quedar la contraseña ni el mensaje de bloqueo anterior.

### 4.6 Integración en los perfiles

1. **Mover** `AccountManagementCard` a `src/shared/components/AccountManagementCard.tsx` (es genérico; lo usan ambos perfiles) y actualizar el import. Hacer `onDeactivateAccount` **opcional** y renderizar el botón "Desactivar cuenta" solo si se pasa el handler (US-04 aún no existe; no mostrar un botón muerto).
2. `OwnProfilePage.tsx` (alumno): reemplazar el bloque comentado por la tarjeta activa, con `onDeleteAccount={() => setDeleteOpen(true)}` y `<DeleteAccountDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} />`. Si el layout del bloque comentado (`Grid`) no encaja con el actual (`Stack`), colocar la tarjeta al final del `Stack`; no rediseñar la página.
3. `TutorProfilePage.tsx` (tutor): agregar la misma tarjeta al final del contenido, sin cambiar el resto del layout. Un usuario con ambos roles ve la tarjeta en las dos páginas y elimina **toda** la cuenta.
4. No agregar rutas nuevas.

---

## 5. Tests (Vitest + Testing Library, en `test/modules/users/`)

Seguir el estilo de `test/modules/auth/*.test.tsx`.

| # | Caso | Esperado |
|---|---|---|
| 1 | Click "Eliminar cuenta" en la tarjeta | abre el diálogo; **no** hay request |
| 2 | Cancelar | no llama a `deleteMyAccount`; diálogo cerrado; al reabrir, campo vacío y sin alertas |
| 3 | Confirmar sin tildar el checkbox | botón deshabilitado |
| 4 | Confirmar con contraseña vacía | error de validación; sin request |
| 5 | Confirmar OK (`204`) | llama `deleteMyAccount(password)`; `logout()` del store; navega a `/auth/login`; `toast.success` |
| 6 | `409 ACCOUNT_HAS_ACTIVE_BOOKINGS` | muestra "No podés dar de baja tu cuenta con reservas activas pendientes"; **no** hay logout; el diálogo sigue abierto |
| 7 | `401` | error en el campo; **no** hay logout |
| 8 | `isPending` | botones deshabilitados |
| 9 | `AccountManagementCard` sin `onDeactivateAccount` | no renderiza "Desactivar cuenta" |

---

## 6. Checklist de entrega

- [ ] `pnpm lint`, `pnpm test` y `tsc` en verde (package manager según `AGENTS.md`/`package.json`).
- [ ] Manual (con backend local): usuario con reserva `BOOKED` → mensaje exacto, sigue logueado; usuario sin reservas + contraseña incorrecta → error en el campo; contraseña correcta → vuelve a login y ya no puede iniciar sesión con ese email.
- [ ] Cancelar en el diálogo no genera ningún request (Network en DevTools).
- [ ] El tutor y el alumno ven la tarjeta en su perfil.
- [ ] Commit: `feat: eliminación definitiva de cuenta (US-24)`.
