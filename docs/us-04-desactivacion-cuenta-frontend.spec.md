# US-04 — Desactivación temporal de la cuenta (Frontend Spec)

> **Lee primero:** `AGENTS.md` y `docs/base-standards.md`. Requiere el backend de US-04 (`docs/us-04-desactivacion-cuenta-backend.spec.md` en `knowlink-backend`) mergeado en `dev` o corriendo local.
> Verificada contra la rama `dev` de `TetraCodeTeam/knowlink-frontend` (02/11/2026). Si algo no coincide con el código real, detenete y anotalo en el PR en vez de inventar.

## 0. Metadata

| Campo | Valor |
|---|---|
| ID Historia | US-04 |
| Story Points | 2 (total; el grueso de la lógica está en backend) |
| Prioridad | BAJA |
| Módulo | `users` (hook/api/diálogos) + integración en `student/profile` y `tutor/profile` |
| Tags | #RN-04 |
| Relacionadas | US-04b (eliminación definitiva), US-40 (reactivar), US-37 (perfil alumno), US-38 (perfil tutor), US-10/US-11 (reservas) |
| Repo | `knowlink-frontend` — rama base `dev` |

**Historia:** Como usuario registrado, quiero poder desactivar temporalmente mi cuenta, para dejar de usar la plataforma por un tiempo manteniendo mi información para cuando quiera volver.

---

## 1. Estado actual del repo (verificado en `dev`)

- **Ya existe** `src/modules/student/profile/components/AccountManagementCard.tsx` ("Gestión de Cuenta") con los botones *Desactivar cuenta* y *Eliminar cuenta* (props `onDeactivateAccount`, `onDeleteAccount`). **Está comentado** dentro de `modules/student/profile/pages/OwnProfilePage.tsx` (con `console.log` de placeholder). Esta historia lo reactiva y lo reutiliza.
- **Ya existe** `src/shared/components/AppConfirmDialog.tsx` (props: `open, title, message, severity ("warning"|"danger"), confirmLabel, cancelLabel, requireCheckbox, checkboxLabel, content, onConfirm, onCancel, isPending`). **Usarlo** para el diálogo de confirmación; no crear un diálogo propio de confirmación.
- `useFeedbackDialog` / `FeedbackDialog` (`shared/hooks`, `shared/components`) sirven para el diálogo informativo de bloqueo.
- El perfil del tutor es `src/modules/tutor/profile/components/TutorProfilePage.tsx` (pestañas; la pestaña 0 termina con `<StudentRoleCard … />`). **No** tiene tarjeta de gestión de cuenta.
- `httpClient` muestra un toast de error genérico en cualquier error y **hace `logout()` ante `401`**. `rawHttpClient` no muestra toast ni hace logout (manejo manual). Los hooks de auth usan `rawHttpClient`.
- `useAuthStore` (Zustand, persistido en `knowlink-auth`): `logout()` limpia el `queryClient` y la sesión. `useLogout` llama a `POST /api/v1/auth/logout` y luego `logout()` + `navigate("/auth/login")`.
- Rutas en `src/routes/paths.ts`: `studentPaths` y `tutorPaths` (no tienen "clases"). Las páginas de reservas existen: `/student/classes` y `/tutor/classes` (ver `StudentSidebar` y `TutorSidebar`).
- `ErrorResponse` = `{ status, message, detail? }` (`@/shared/interfaces/error-response.interface`).
- Existe un módulo `modules/tutors/` (de US-12) además de `modules/tutor/`. **No mezclar**: esta historia va en `modules/users/` y toca `modules/student/profile/` y `modules/tutor/profile/`.

---

## 2. Criterios de aceptación (Gherkin) → UI

```gherkin
Escenario 1: Confirmación explícita
  Dado que estoy en mi perfil
  Cuando hago clic en "Desactivar cuenta"
  Entonces se abre un diálogo de confirmación con la explicación de qué implica
  Y la cuenta NO se desactiva hasta que confirme

Escenario 2: Invisibilidad para el resto
  # Lo resuelve el backend. En UI: tras confirmar, cierro sesión de inmediato.
  # Verificar que ningún componente asuma que el autor/tutor existe (ver sección 6).

Escenario 3: Cancelar no cambia nada
  Dado que se muestra el diálogo
  Cuando presiono "Cancelar", cierro con Esc o hago clic fuera
  Entonces no se envía ningún request y la cuenta sigue activa sin cambios

Escenario 4: Reservas activas pendientes
  Dado que tengo reservas activas pendientes
  Cuando confirmo la desactivación
  Entonces veo el mensaje "No podés dar de baja tu cuenta con reservas activas pendientes"
  Y puedo ir a mis clases para resolverlas
  Y la sesión sigue abierta y la cuenta activa
```

| # | Criterio | Implementación |
|---|---|---|
| 1 | Diálogo de confirmación | `AppConfirmDialog` (severidad `warning`) con el texto de la sección 4.4 |
| 2 | Invisible para el resto | Backend; en UI: logout inmediato + verificación de la sección 6 |
| 3 | Cancelar no cambia nada | `onCancel` solo cierra el diálogo; **nunca** llama a la mutación |
| 4 | Bloqueo por reservas activas | Error `409` con `detail === "ACCOUNT_HAS_ACTIVE_BOOKINGS"` → diálogo informativo con el mensaje exacto y botón "Ir a mis clases" |

---

## 3. Contrato con el backend

`PATCH /api/v1/users/me/deactivate` — JWT del propio usuario (rol STUDENT o TUTOR), sin body.

| Status | `detail` | Qué hacer en UI |
|---|---|---|
| `204` | — | Éxito: limpiar sesión, ir a login, toast de éxito |
| `409` | `ACCOUNT_HAS_ACTIVE_BOOKINGS` | Cerrar confirmación, mostrar diálogo de bloqueo con `message` del backend |
| `409` | `ACCOUNT_NOT_ACTIVE` | Toast con `message`; cerrar sesión (la cuenta ya no está activa) |
| `401` | — | Sesión inválida: limpiar sesión y redirigir a login |
| `403` | — | Toast con `message` |

`message` del 409 de reservas (debe mostrarse **tal cual**): `No podés dar de baja tu cuenta con reservas activas pendientes`.

Cambio en login (`POST /api/v1/auth/login`): una cuenta desactivada con contraseña correcta responde `403` con `detail = "ACCOUNT_DEACTIVATED"` y `message = "Tu cuenta está desactivada. Podés reactivarla para volver a usar KnowLink."`. US-40 reemplaza ese toast por la pantalla intermedia `/auth/reactivate`: `useLogin` guarda las credenciales en memoria y navega allí. Ver `docs/us-40-reactivar-cuenta-frontend.spec.md`.

---

## 4. Implementación paso a paso

Flujo de capas obligatorio: `api → hooks → components/pages`. Imports con `@/`. Prettier: comillas dobles, `;`, trailing comma ES5, 100 cols, 2 espacios, LF. Sin `any`. Sin `style={{}}` (usar `sx`). Sin axios en componentes. Formularios: no aplica (no hay form). Toasts: `sonner` vía `useSnackbarStore` o `toast`, como el resto del módulo.

### 4.1 Constantes — `src/modules/users/constants.ts` (ya existe; **agregar**, no pisar)

```ts
export const DEACTIVATE_ACCOUNT_KEY = "deactivate-account";
export const ACCOUNT_HAS_ACTIVE_BOOKINGS = "ACCOUNT_HAS_ACTIVE_BOOKINGS";
export const ACCOUNT_NOT_ACTIVE = "ACCOUNT_NOT_ACTIVE";
export const ACCOUNT_DEACTIVATED = "ACCOUNT_DEACTIVATED"; // login: lo usará US-40
export const ACTIVE_BOOKINGS_BLOCK_MESSAGE =
  "No podés dar de baja tu cuenta con reservas activas pendientes";
```

> El mensaje de bloqueo se muestra desde `error.response.data.message`; la constante es **fallback** si el backend no lo envía. No lo dupliques en otros archivos.

### 4.2 Rutas — `src/routes/paths.ts` (**agregar** claves, sin tocar las existentes)

```ts
export const studentPaths = {
  // ...existing
  classes: "/student/classes",
};

export const tutorPaths = {
  // ...existing
  classes: "/tutor/classes",
};
```

Verificar en `routes/StudentRoutes.tsx` y `routes/TutorRoutes.tsx` que esas rutas existen; si el path real difiere, usar el real.

### 4.3 API + hook

`src/modules/users/api/users.api.ts` (ya existe; **agregar**):

```ts
import { rawHttpClient } from "@/shared/lib/httpClient";

export async function deactivateMyAccount(): Promise<void> {
  await rawHttpClient.patch("/api/v1/users/me/deactivate");
}
```

`rawHttpClient` **a propósito**: el `httpClient` mostraría un toast genérico en el 409 además del diálogo propio, y haría `logout()` automático ante un `401`.

`src/modules/users/hooks/useDeactivateAccount.ts` (**nuevo**):

```ts
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { deactivateMyAccount } from "@/modules/users/api/users.api";
import {
  ACCOUNT_HAS_ACTIVE_BOOKINGS,
  ACCOUNT_NOT_ACTIVE,
  ACTIVE_BOOKINGS_BLOCK_MESSAGE,
  DEACTIVATE_ACCOUNT_KEY,
} from "@/modules/users/constants";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import type { ErrorResponse } from "@/shared/interfaces/error-response.interface";

interface Options {
  onBlockedByBookings: (message: string) => void;
}

export function useDeactivateAccount({ onBlockedByBookings }: Options) {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const { isPending, mutate } = useMutation({
    mutationKey: [DEACTIVATE_ACCOUNT_KEY],
    mutationFn: deactivateMyAccount,
    onSuccess: () => {
      // The JWT is already rejected by the backend after deactivation: do NOT call POST /auth/logout.
      logout();
      navigate("/auth/login", { replace: true });
      toast.success("Tu cuenta fue desactivada. Podés volver cuando quieras.");
    },
    onError: (error) => {
      if (!axios.isAxiosError<ErrorResponse>(error)) {
        toast.error("Ocurrió un error inesperado.");
        return;
      }
      const { detail, message } = error.response?.data ?? {};
      if (detail === ACCOUNT_HAS_ACTIVE_BOOKINGS) {
        onBlockedByBookings(message ?? ACTIVE_BOOKINGS_BLOCK_MESSAGE);
        return;
      }
      if (error.response?.status === 401 || detail === ACCOUNT_NOT_ACTIVE) {
        logout();
        navigate("/auth/login", { replace: true });
        return;
      }
      toast.error(message ?? "Ocurrió un error inesperado.");
    },
  });

  return { isPending, mutate };
}
```

Puntos obligatorios:
- **No** invocar `useLogout`/`logoutUser` al éxito (el backend ya invalida el token → daría `401`).
- `logout()` del store limpia el `queryClient` (no hace falta `removeQueries` extra).
- El toast de éxito se dispara **después** de navegar (sonner es global, sobrevive a la navegación).

### 4.4 Componentes — `src/modules/users/components/`

**`DeactivateAccountDialog.tsx`** — wrapper fino sobre `AppConfirmDialog`. Props: `open`, `isPending`, `onConfirm`, `onCancel`.

```tsx
<AppConfirmDialog
  open={open}
  severity="warning"
  title="Desactivar cuenta"
  message="Tu cuenta dejará de ser visible para el resto de los usuarios y no podrás iniciar sesión hasta reactivarla. Tu información se conserva para cuando quieras volver."
  confirmLabel="Desactivar cuenta"
  cancelLabel="Cancelar"
  isPending={isPending}
  onConfirm={onConfirm}
  onCancel={onCancel}
/>
```

- `requireCheckbox` **no** se usa (la acción es reversible; el checkbox es para acciones permanentes como US-04b).
- Cancelar / Esc / clic en backdrop llaman `onCancel` (ya lo hace `AppConfirmDialog`) y **nunca** la mutación.

**`ActiveBookingsBlockedDialog.tsx`** — props: `open`, `message`, `onClose`, `onGoToClasses`. Usar `Dialog` de MUI con el mismo estilo de `LogoutDialog` (`PaperProps.sx` `borderRadius: 4`, `textAlign: "center"`) o `FeedbackDialog` si encaja:
- Título: `No se puede desactivar la cuenta`.
- Texto: el `message` recibido (por defecto `ACTIVE_BOOKINGS_BLOCK_MESSAGE`) + línea secundaria: `Cancelá tus reservas pendientes o esperá a que se completen para poder desactivar tu cuenta.`
- Botones: `Cerrar` (`appVariant="outline"`) y `Ir a mis clases` (`appVariant="primary"`, llama `onGoToClasses`).

**`DeactivateAccountSection.tsx`** — orquesta todo; **un solo componente reutilizable** para alumno y tutor. Props: `classesPath: string`. Estado local `confirmOpen: boolean`, `blockedMessage: string | null`.

```tsx
const { isPending, mutate } = useDeactivateAccount({
  onBlockedByBookings: (message) => {
    setConfirmOpen(false);
    setBlockedMessage(message);
  },
});

<AccountManagementCard
  onDeactivateAccount={() => setConfirmOpen(true)}
/>
<DeactivateAccountDialog
  open={confirmOpen}
  isPending={isPending}
  onConfirm={() => mutate()}
  onCancel={() => setConfirmOpen(false)}
/>
<ActiveBookingsBlockedDialog
  open={blockedMessage !== null}
  message={blockedMessage ?? ACTIVE_BOOKINGS_BLOCK_MESSAGE}
  onClose={() => setBlockedMessage(null)}
  onGoToClasses={() => { setBlockedMessage(null); navigate(classesPath); }}
/>
```

Mientras `isPending`, el diálogo de confirmación no se puede cerrar con Cancelar ni confirmar dos veces (`AppConfirmDialog` ya deshabilita ambos botones con `isPending`).

### 4.5 Ajuste a `AccountManagementCard` (US-04b queda fuera)

`modules/student/profile/components/AccountManagementCard.tsx`:
- Hacer **opcional** `onDeleteAccount?: () => void` y renderizar el botón **"Eliminar cuenta" solo si la prop viene definida**. Hasta que se implemente US-04b no se pasa → el botón no se muestra (no dejar un botón muerto).
- Mover el componente a `src/modules/users/components/AccountManagementCard.tsx` **solo si** al hacerlo no rompe imports; si el cambio es grande, dejarlo donde está y exportarlo/importarlo con el alias `@/`. (Criterio de `AGENTS.md`: no crear en `shared/` algo que usa un módulo; este lo usan dos módulos de rol → `modules/users/` es el lugar correcto.)
- Texto del subtítulo: `Estas acciones pueden afectar permanentemente tu cuenta en KnowLink.` → cambiar a `Podés desactivar tu cuenta temporalmente y volver cuando quieras.` (mientras US-04b no exista, el texto "permanentemente" sería engañoso).

### 4.6 Integración en las páginas de perfil

**Alumno** — `modules/student/profile/pages/OwnProfilePage.tsx`: reemplazar el bloque comentado `{/* <Grid ...> <AccountManagementCard ... /> */}` por:

```tsx
<DeactivateAccountSection classesPath={studentPaths.classes} />
```

colocado al final del `Stack` (debajo de `TutorRoleCard`). Borrar el código comentado y el `console.log`.

**Tutor** — `modules/tutor/profile/components/TutorProfilePage.tsx`: en la pestaña 0, **debajo** del `<Box sx={{ mt: 2 }}><StudentRoleCard … /></Box>` (línea ~299), agregar:

```tsx
<Box sx={{ mt: 2 }}>
  <DeactivateAccountSection classesPath={tutorPaths.classes} />
</Box>
```

> Usuario con doble rol: la desactivación es de la **cuenta completa**. Si el bloqueo se debe a reservas del **otro** rol, el botón "Ir a mis clases" lleva a las clases del rol actual; es una limitación aceptada (el backend no informa en cuál rol está la reserva). Anotarlo en el PR; no inventar un selector de rol.

---

## 5. Login con cuenta desactivada (flujo de reactivación)

- Implementado por US-40: `useLogin.onError` detecta `403 ACCOUNT_DEACTIVATED`, guarda las credenciales en memoria y navega a `/auth/reactivate` sin mostrar toast. Ver `docs/us-40-reactivar-cuenta-frontend.spec.md`.

---

## 6. Verificación de "invisibilidad" en la UI (criterio 2)

El backend enmascara a los usuarios desactivados en contenido de terceros (`fullName = "Usuario desactivado"`, `profilePictureUrl`, `careerName` y `averageRating` nulos, `verified = false`, `canBookClass = false`) y devuelve `404` en perfil/calendario/materiales de un tutor desactivado. Revisar que el frontend no se rompa:

1. `modules/community/components/AuthorHeader.tsx`, `ReplyCard.tsx`, `FeaturedReplyPreview.tsx`, `PostBadges.tsx`: deben tolerar `profilePictureUrl = null`, `careerName = null`, `averageRating = null`, `verified = false` (usar fallbacks/iniciales; **sin** romper con `.toFixed()` sobre `null`).
2. Ningún componente de comunidad debe **navegar al perfil/reserva** de un autor con `canBookClass === false`. El campo **ya existe** en `community-author.interface.ts` (`CommunityAuthor.canBookClass`) y `FeaturedReplyPreview.tsx` ya lo usa (`author.canBookClass && paths.booking && ...`). Revisar `BookingCtaCard.tsx`, `AuthorHeader.tsx`, `PostCard.tsx` y `ReplyCard.tsx`: donde haya un link/CTA hacia el perfil o la reserva del autor y **no** esté condicionado por `canBookClass`, condicionarlo. No agregar campos nuevos a la interfaz.
3. Perfil público del tutor / búsqueda: si el backend devuelve `404 TUTOR_PROFILE_NOT_FOUND`, la página debe mostrar su estado de "no encontrado" existente (no pantalla en blanco ni loop de reintentos). Verificar el comportamiento de `useTutorProfile`/`buildTutorProfileRoute` ante `404` y ajustar **solo** si falla.
4. Historial de calificaciones del tutor (`RatingAuthorResponse`): el autor puede venir como `"Usuario desactivado"` con avatar `null` → usar iniciales/placeholder.

No implementar nada más: el resto es responsabilidad del backend.

---

## 7. Tests (Vitest + Testing Library; estilo de los tests existentes en `test/modules/**`)

- `DeactivateAccountDialog`: muestra el texto de confirmación; "Cancelar" llama `onCancel` y **no** `onConfirm`; "Desactivar cuenta" llama `onConfirm`; con `isPending` ambos botones quedan deshabilitados.
- `DeactivateAccountSection`:
  - clic en "Desactivar cuenta" abre el diálogo **sin** llamar a `deactivateMyAccount` (mock: `expect(...).not.toHaveBeenCalled()`);
  - Cancelar cierra y **no** llama a la API (criterio 3);
  - Confirmar llama a la API una vez;
  - con `409` + `detail: "ACCOUNT_HAS_ACTIVE_BOOKINGS"` se cierra la confirmación, se ve el texto exacto `No podés dar de baja tu cuenta con reservas activas pendientes` y el botón "Ir a mis clases" navega a `classesPath`; **no** se llama `logout()` ni se muestra toast de error genérico.
- `useDeactivateAccount`: éxito → `logout()` del store, `navigate("/auth/login")` y toast de éxito, **sin** llamar a `logoutUser`; `401`/`ACCOUNT_NOT_ACTIVE` → logout y redirect; otro error → toast con `message`.
- `AccountManagementCard`: sin `onDeleteAccount` no renderiza "Eliminar cuenta".
- `OwnProfilePage` (alumno) y `TutorProfilePage`: renderizan la sección de gestión de cuenta con el botón "Desactivar cuenta".
- `useLogin`: error `403` con `detail: "ACCOUNT_DEACTIVATED"` navega a `/auth/reactivate` sin toast (US-40).
- Comunidad: un autor `{ fullName: "Usuario desactivado", profilePictureUrl: null, careerName: null, averageRating: null, canBookClass: false }` se renderiza sin errores y sin CTA de reserva.

Seguir las convenciones de `docs/testing/` (identificadores de casos y fixtures compartidos por funcionalidad). Si ya existe una carpeta de casos para usuarios/perfil, agregar ahí los casos de US-04; si no, crear `docs/testing/cases/US-04/`.

---

## 8. "No hacer"

- ❌ No implementar reactivación (US-40) ni eliminación definitiva (US-04b). No mostrar el botón "Eliminar cuenta".
- ❌ No llamar a `POST /api/v1/auth/logout` después de desactivar (token ya inválido).
- ❌ No usar `httpClient` para esta mutación (usar `rawHttpClient`, manejo manual de errores).
- ❌ No `useEffect` + axios/fetch; no axios directo en componentes.
- ❌ No `any`, no `style={{}}`.
- ❌ No crear un diálogo de confirmación propio (usar `AppConfirmDialog`) ni un nuevo store.
- ❌ No usar `requireCheckbox` (la acción es reversible).
- ❌ No duplicar el mensaje del 409 en varios archivos (constante única en `modules/users/constants.ts`).
- ❌ No agregar rutas ni páginas nuevas.
- ❌ No crear en `shared/` algo que usan solo `users`/perfiles.
- ❌ No tocar el comportamiento de `httpClient`/`useAuthStore`.

---

## 9. Definition of Done

- [ ] "Desactivar cuenta" visible y funcional en el perfil del **alumno** y del **tutor**.
- [ ] Diálogo de confirmación (`AppConfirmDialog`) antes de ejecutar; Cancelar/Esc/backdrop no envían request (criterios 1 y 3).
- [ ] Con reservas activas: se ve el mensaje exacto del criterio 4 y "Ir a mis clases"; sesión y cuenta intactas.
- [ ] Éxito: sesión limpiada, redirección a `/auth/login` y toast; sin llamar al endpoint de logout.
- [ ] Botón "Eliminar cuenta" oculto (US-04b pendiente); código comentado y `console.log` de `OwnProfilePage` eliminados.
- [ ] Login con cuenta desactivada muestra el mensaje del backend.
- [ ] Componentes de comunidad toleran autores enmascarados; sin link/CTA de perfil ni reserva si `canBookClass === false`.
- [ ] Tests nuevos verdes: `pnpm test` (Vitest); `pnpm lint` y `pnpm build` (`tsc`) sin errores.
- [ ] Prettier (doble comilla, `;`, trailing comma ES5, 100 cols) y alias `@/` respetados.
- [ ] Commits `feat: ...` en español; PR a `dev`.
