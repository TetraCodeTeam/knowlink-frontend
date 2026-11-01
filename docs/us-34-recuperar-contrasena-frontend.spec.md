# US-34 — Recuperar contraseña (Frontend)

> Spec generado a partir de la exploración real de `TetraCodeTeam/knowlink-frontend`, rama `dev` (commit `07565a7`). El código de este documento fue **aplicado y verificado sobre una copia de `dev`**: `npm run type-check`, `npm run lint`, `npm run format:check`, `npm run test` (391 tests en verde, 21 de ellos de esta historia) y `npm run build` pasan. Pensado para ejecutarse con **OpenCode + DeepSeek V4 Flash**: pasos literales, rutas exactas y verificación por paso. No improvises fuera de lo que dice este documento.

## Antes de empezar (obligatorio)

1. Leer `AGENTS.md` y `docs/base-standards.md` del repo (flujo `api/ → hooks/ → components/pages/`, alias `@/`, react-hook-form + zodResolver, sonner, Prettier: doble comilla, `;`, trailing comma ES5, printWidth 100).
2. Crear la rama desde `dev`: `git checkout dev && git pull && git checkout -b feat/password-recovery`.
3. `npm ci` y correr la línea base **antes de tocar nada**: `npm run type-check && npm run lint && npm run test`. Si algo ya falla, anotarlo y NO arreglarlo en esta historia.
4. Trabajar en este orden exacto: **interfaces → constantes → api → schemas → utils → hooks → páginas → rutas → enlace en el login → exclusión de Bearer → tests**.

## Metadata

| Campo | Valor |
|---|---|
| ID Historia | US-34 |
| Épica | — |
| Story Points | 3 |
| Prioridad | Baja |
| Módulo | usuarios (código en `src/modules/auth`) |
| Repo / rama | `knowlink-frontend`, rama `feat/password-recovery` (base = `dev`) |
| Relacionadas | US-02 (inicio de sesión), US-01 y US-42 (requisitos de contraseña) |
| Spec hermano | `us-34-recuperar-contrasena-backend.spec.md` (repo `knowlink-backend`) |
| Dependencia | Endpoints `POST /api/v1/users/reset-password/email` y `POST /api/v1/users/reset-password` (spec backend). Los tests mockean la capa `api/`, así que no bloquea el desarrollo. Hasta que el backend de esta historia esté desplegado, el 422 `RESET_LINK_INVALID` no existe y un enlace vencido mostraría un toast genérico |

## Historia de usuario

Como usuario registrado, quiero poder restablecer mi contraseña desde la pantalla de login en caso de olvidarla, para recuperar el acceso a mi cuenta sin necesitar intervención del equipo de soporte.

Descripción adicional: flujo de recuperación de contraseña por email.

## Alcance frontend

**Hoy no existe nada de este flujo en el frontend** (no hay enlace en el login, ni páginas, ni funciones `api/`). El backend ya envía por mail el link `${FRONTEND_URL}/auth/reset-password?token=<uuid>`: la ruta debe llamarse **exactamente** `/auth/reset-password` y leer el parámetro `token`.

| CA | Qué implementa el frontend |
|---|---|
| 1 | Enlace **"Olvidé mi contraseña"** en el login (pantalla pública) que lleva a `/auth/forgot-password` |
| 2 | Página `ForgotPasswordPage`: formulario de email; al recibir 204 muestra **siempre** "Si el correo existe, recibirás un enlace de recuperación" (el front no distingue si la cuenta existe) |
| 3 | Informa en pantalla y el mail que el enlace dura 30 minutos (la vigencia la impone el backend) |
| 4 | Página `ResetPasswordPage`: nueva contraseña + confirmación con las mismas reglas del registro (mínimo 8, mayúscula, minúscula, carácter especial) |
| 5 | Al restablecer con éxito: toast de confirmación y redirección a `/auth/login` |
| 6 | Si el backend responde 422 `RESET_LINK_INVALID` (enlace usado o vencido), o la URL no trae `token`, la página muestra **"Este enlace ya no es válido. Solicitá uno nuevo"** con botón "Solicitar nuevo enlace" → `/auth/forgot-password` |

## Criterios de aceptación (Gherkin)

```gherkin
Feature: Recuperar contraseña (frontend)

  # CA 1
  Scenario: Acceso desde el login sin estar autenticado
    Given estoy en /auth/login sin sesión
    Then veo el enlace "Olvidé mi contraseña"
    When hago clic
    Then navego a /auth/forgot-password

  # CA 2
  Scenario: Email con formato inválido
    Given estoy en /auth/forgot-password
    When ingreso "abc" y envío
    Then veo "El email no es válido" y NO se llama a la API

  Scenario: Solicitud enviada
    When ingreso "ana@test.com" y envío
    Then se llama POST /api/v1/users/reset-password/email con {"email":"ana@test.com"}
    And veo "Si el correo existe, recibirás un enlace de recuperación"
    And veo el enlace "Volver al login"

  Scenario: Error de red o del servidor al solicitar
    When la API falla
    Then veo un toast de error y NO veo el mensaje de éxito

  # CA 4
  Scenario Outline: Contraseña inválida
    Given abrí /auth/reset-password?token=abc
    When ingreso "<valor>" como nueva contraseña y la confirmo igual
    Then veo "<mensaje>" y NO se llama a la API
    Examples:
      | valor     | mensaje                                         |
      | Ab#1      | La contraseña debe tener al menos 8 caracteres  |
      | nueva#123 | Usá mayúsculas, minúsculas y un carácter especial |
      | NUEVA#123 | Usá mayúsculas, minúsculas y un carácter especial |
      | Nueva1234 | Usá mayúsculas, minúsculas y un carácter especial |

  Scenario: Las contraseñas no coinciden
    When ingreso "Nueva#123" y confirmo "Nueva#124"
    Then veo "Las contraseñas no coinciden" y NO se llama a la API

  # CA 5
  Scenario: Restablecimiento exitoso
    Given abrí /auth/reset-password?token=abc-123
    When ingreso y confirmo "Nueva#123"
    Then se llama POST /api/v1/users/reset-password con {"token":"abc-123","newPassword":"Nueva#123","confirmNewPassword":"Nueva#123"}
    And veo un toast de éxito y navego a /auth/login

  # CA 6
  Scenario: Enlace usado o vencido
    When la API responde 422 con detail "RESET_LINK_INVALID"
    Then el formulario se reemplaza por "Este enlace ya no es válido. Solicitá uno nuevo"
    And no aparece ningún toast de error
    When hago clic en "Solicitar nuevo enlace"
    Then navego a /auth/forgot-password

  Scenario: URL sin token
    When abro /auth/reset-password sin parámetro token
    Then veo "Este enlace ya no es válido. Solicitá uno nuevo" sin formulario
```

## Hechos verificados en el código (no re-investigar)

- **Rutas de auth**: `src/routes/AuthRoutes.tsx` define `login`, `register`, `register/tutor`, `register/student`, `check-email`, `activate`; está montado en `src/providers/RoutesProvider.tsx` como `<Route path="/auth/*" element={<AuthRoutes />} />`, **fuera** de `ProtectedRoute` → todo lo que se agregue ahí es público.
- **Login**: `src/modules/auth/pages/LoginPage.tsx` renderiza `LoginForm` (`src/modules/auth/components/LoginForm.tsx`: `react-hook-form` + `zodResolver(loginSchema)`, campos email y `PasswordField`, botón "Iniciar Sesión") y debajo el enlace "¿No tienes cuenta? Regístrate" con `Link` de `react-router-dom` y estilo inline `color: "#3F4CAE", fontWeight: 600, textDecoration: "none"`.
- **API**: `src/modules/auth/api/auth.api.ts` usa `rawHttpClient` (de `@/shared/lib/httpClient`): **no muestra snackbar ni hace logout automático** → es el cliente correcto para endpoints públicos donde el manejo de errores es manual. `httpClient` (el otro) hace `logout()` ante cualquier 401: **no usarlo acá**.
- **Backend → mensajes**: los errores llegan como `ErrorResponse { status, message, detail? }` (`src/shared/interfaces/error-response.interface.ts`). El 422 de enlace inválido trae `message = "Este enlace ya no es válido. Solicitá uno nuevo"` y `detail = "RESET_LINK_INVALID"`. Un 400 de validación trae `detail = "VALIDATION_ERROR"` o `"PASSWORDS_MISMATCH"`.
- **Bearer**: `httpClient.ts` → `attachToken` cancela con `Cancel("Token expirado")` toda request (incluso con `rawHttpClient`) si el store tiene un JWT vencido, salvo que la URL esté en `EXCLUDED_BEARER_ROUTES` (`src/shared/lib/constants.ts`, hoy `["/api/v1/auth/login", "/api/v1/auth/register"]`; el match es por **igualdad exacta** de la URL sin query). Un usuario con sesión vencida en el store que olvidó su contraseña es justo el caso de esta historia → hay que excluir los dos endpoints nuevos.
- **Reglas de contraseña del registro** (`src/modules/auth/schemas/user-register.schema.ts`): `min(8, "La contraseña debe tener al menos 8 caracteres")` + `regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])/, "Usá mayúsculas, minúsculas y un carácter especial")` + confirmación con `refine` "Las contraseñas no coinciden". **No se exige dígito.**
- **Componentes reutilizables**: `AuthLayout` (`@/modules/auth/layouts/AuthLayout`, tarjeta centrada sobre fondo oscuro; `ActivateAccountPage` y `CheckEmailPage` lo usan sin ilustración), `PasswordField` (`@/modules/auth/components/PasswordField`, `TextField` con ojo mostrar/ocultar; recibe las mismas props que `TextField` salvo `type`), `AppButton` (`@/shared/components/AppButton`, props `loading`, `fullWidth`, y el resto de `ButtonProps`, incluido `type="submit"`).
- **Accesibilidad en MUI**: en `TextField`, el prop `aria-label` va al `div` raíz, **no al `<input>`**. Para que `getByLabelText` y los lectores de pantalla funcionen, hay que pasar el label al input con `slotProps={{ htmlInput: { "aria-label": "..." } }}` (así está en el código de abajo). No "arreglar" el `LoginForm` existente por esto.
- **Tests**: `vitest` + `@testing-library/react` + `@testing-library/user-event` (jsdom, `globals: true`, setup en `test/setup.ts`). Los tests viven en `test/modules/<módulo>/` (ya existe `test/modules/auth/useLogin.test.tsx`; su estilo de wrapper con `QueryClientProvider` + `MemoryRouter` es el modelo). Se mockean la capa `api/` con `vi.mock("@/modules/auth/api/auth.api", ...)` y `sonner` con `vi.mock("sonner", ...)`.
- **Convención de textos**: todo texto visible al usuario en español rioplatense (voseo: "Iniciá", "Solicitá"); identificadores de código en inglés.

## Contrato con el backend

| Acción | Request | Respuestas |
|---|---|---|
| Pedir enlace | `POST /api/v1/users/reset-password/email` `{ "email": string }` | `204` siempre (exista o no la cuenta); `400` si el email está vacío o es inválido |
| Restablecer | `POST /api/v1/users/reset-password` `{ "token": string, "newPassword": string, "confirmNewPassword": string }` | `204` OK; `400` contraseña inválida / no coinciden; `422` `RESET_LINK_INVALID` (enlace usado, vencido, inexistente o malformado) |

El `token` se envía tal cual vino en la URL (string, sin parsear como UUID).

## Archivos a crear / modificar

Todos los paths son relativos a la raíz del repo. Los bloques de código están **verificados**: copiarlos tal cual.

### 1. Interfaces de request (CREAR)

`src/modules/auth/interfaces/requests/forgot-password-request.interface.ts`

```ts
export interface ForgotPasswordRequest {
  email: string;
}
```

`src/modules/auth/interfaces/requests/reset-password-request.interface.ts`

```ts
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmNewPassword: string;
}
```

### 2. Constantes (MODIFICAR `src/modules/auth/constants.ts`)

Agregar **al final** (conservar las 4 constantes existentes):

```ts
export const AUTH_FORGOT_PASSWORD_KEY = "api/users/reset-password/email";
export const AUTH_RESET_PASSWORD_KEY = "api/users/reset-password";

export const FORGOT_PASSWORD_SUCCESS_MESSAGE =
  "Si el correo existe, recibirás un enlace de recuperación";
export const RESET_LINK_INVALID_MESSAGE = "Este enlace ya no es válido. Solicitá uno nuevo";
export const RESET_LINK_INVALID_CODE = "RESET_LINK_INVALID";
```

### 3. Funciones API (MODIFICAR `src/modules/auth/api/auth.api.ts`)

Agregar el import junto a los demás `import type` del archivo:

```ts
import type { ResetPasswordRequest } from "@/modules/auth/interfaces/requests/reset-password-request.interface";
```

Y las dos funciones **al final** del archivo:

```ts
export async function requestPasswordReset(email: string): Promise<void> {
  await rawHttpClient.post("/api/v1/users/reset-password/email", { email });
}

export async function resetPassword(data: ResetPasswordRequest): Promise<void> {
  await rawHttpClient.post("/api/v1/users/reset-password", data);
}
```

### 4. Schemas (CREAR)

`src/modules/auth/schemas/forgot-password.schema.ts`

```ts
import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "El email es obligatorio").email("El email no es válido"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
```

`src/modules/auth/schemas/reset-password.schema.ts`

```ts
import { z } from "zod";

// Mismas reglas que el registro (user-register.schema.ts): mínimo 8, mayúscula, minúscula
// y un carácter especial. No importar desde ese archivo: lo modifica US-42.
export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])/,
        "Usá mayúsculas, minúsculas y un carácter especial"
      ),
    confirmNewPassword: z.string().min(1, "Debés confirmar la contraseña"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmNewPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
```

No importar ni modificar `user-register.schema.ts` (lo toca US-42): las reglas se duplican a propósito, con el comentario que lo explica.

### 5. Util para detectar el enlace inválido (CREAR)

`src/modules/auth/utils/resetLink.utils.ts` (la carpeta `utils/` no existe en `auth`: crearla)

```ts
import type { AxiosError } from "axios";
import type { ErrorResponse } from "@/shared/interfaces/error-response.interface";
import { RESET_LINK_INVALID_CODE } from "@/modules/auth/constants";

/** El backend responde 422 con detail RESET_LINK_INVALID si el enlace fue usado, venció o no existe. */
export function isInvalidResetLinkError(error: unknown): boolean {
  const axiosError = error as AxiosError<ErrorResponse> | null | undefined;
  return (
    axiosError?.response?.status === 422 &&
    axiosError.response.data?.detail === RESET_LINK_INVALID_CODE
  );
}
```

### 6. Hooks (CREAR)

`src/modules/auth/hooks/useForgotPassword.ts`

```ts
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { requestPasswordReset } from "@/modules/auth/api/auth.api";
import { AUTH_FORGOT_PASSWORD_KEY } from "@/modules/auth/constants";

export function useForgotPassword() {
  return useMutation({
    mutationKey: [AUTH_FORGOT_PASSWORD_KEY],
    mutationFn: (email: string) => requestPasswordReset(email),
    // El éxito (204) NO distingue si el correo existe: la página muestra siempre el mismo mensaje.
    onError: () => {
      toast.error("No pudimos procesar la solicitud. Intentá de nuevo en unos minutos.");
    },
  });
}
```

`src/modules/auth/hooks/useResetPassword.ts`

```ts
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { resetPassword } from "@/modules/auth/api/auth.api";
import { AUTH_RESET_PASSWORD_KEY } from "@/modules/auth/constants";
import type { ResetPasswordRequest } from "@/modules/auth/interfaces/requests/reset-password-request.interface";
import { isInvalidResetLinkError } from "@/modules/auth/utils/resetLink.utils";

export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: [AUTH_RESET_PASSWORD_KEY],
    mutationFn: (data: ResetPasswordRequest) => resetPassword(data),
    onSuccess: () => {
      toast.success("Contraseña actualizada. Iniciá sesión con tu nueva contraseña.");
      navigate("/auth/login", { replace: true });
    },
    onError: (error: unknown) => {
      // Enlace usado/vencido: la página muestra el panel "Este enlace ya no es válido".
      if (isInvalidResetLinkError(error)) return;

      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "No pudimos restablecer tu contraseña. Intentá de nuevo.";
      toast.error(message);
    },
  });
}
```

### 7. `ForgotPasswordPage` (CREAR)

`src/modules/auth/pages/ForgotPasswordPage.tsx` — usa `AuthLayout` sin ilustración (igual que `ActivateAccountPage`). Muestra el formulario o, tras el éxito (`isSuccess`), el mensaje genérico.

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import { KeyRound, Mail, MailCheck } from "lucide-react";
import AuthLayout from "@/modules/auth/layouts/AuthLayout";
import AppButton from "@/shared/components/AppButton";
import { useForgotPassword } from "@/modules/auth/hooks/useForgotPassword";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/modules/auth/schemas/forgot-password.schema";
import { FORGOT_PASSWORD_SUCCESS_MESSAGE } from "@/modules/auth/constants";

export default function ForgotPasswordPage() {
  const { mutate, isPending, isSuccess } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  return (
    <AuthLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 3,
          maxWidth: 400,
          width: "100%",
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            bgcolor: "#eef2ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isSuccess ? (
            <MailCheck size={36} color="#5B6ED9" />
          ) : (
            <KeyRound size={36} color="#5B6ED9" />
          )}
        </Box>

        {isSuccess ? (
          <>
            <Typography variant="h4" fontWeight={700}>
              Revisá tu correo
            </Typography>
            <Typography role="status" variant="body1" color="text.secondary" lineHeight={1.7}>
              {FORGOT_PASSWORD_SUCCESS_MESSAGE}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              El enlace es válido por 30 minutos y solo puede usarse una vez.
            </Typography>
          </>
        ) : (
          <>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="h4" fontWeight={700}>
                ¿Olvidaste tu contraseña?
              </Typography>
              <Typography variant="body1" color="text.secondary" lineHeight={1.7}>
                Ingresá tu correo electrónico y te enviaremos un enlace para restablecerla.
              </Typography>
            </Box>

            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit((data) => mutate(data.email))}
              sx={{ display: "flex", flexDirection: "column", gap: 2.5, width: "100%" }}
            >
              <TextField
                type="email"
                placeholder="correo@ejemplo.com"
                fullWidth
                autoComplete="email"
                slotProps={{ htmlInput: { "aria-label": "Correo electrónico" } }}
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={17} color="#AAAAAA" />
                    </InputAdornment>
                  ),
                }}
              />
              <AppButton type="submit" fullWidth loading={isPending}>
                Enviar enlace
              </AppButton>
            </Box>
          </>
        )}

        <Link
          to="/auth/login"
          style={{ color: "#3F4CAE", fontWeight: 600, textDecoration: "none" }}
        >
          Volver al login
        </Link>
      </Box>
    </AuthLayout>
  );
}
```

### 8. `ResetPasswordPage` (CREAR)

`src/modules/auth/pages/ResetPasswordPage.tsx` — lee `token` de la query string. Muestra el panel de enlace inválido si no hay token **o** si el backend respondió 422 `RESET_LINK_INVALID`; si no, el formulario.

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Box, InputAdornment, Typography } from "@mui/material";
import { Lock, LinkIcon, ShieldCheck } from "lucide-react";
import AuthLayout from "@/modules/auth/layouts/AuthLayout";
import PasswordField from "@/modules/auth/components/PasswordField";
import AppButton from "@/shared/components/AppButton";
import { useResetPassword } from "@/modules/auth/hooks/useResetPassword";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/modules/auth/schemas/reset-password.schema";
import { isInvalidResetLinkError } from "@/modules/auth/utils/resetLink.utils";
import { RESET_LINK_INVALID_MESSAGE } from "@/modules/auth/constants";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const { mutate, isPending, isError, error } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const isLinkInvalid = !token || (isError && isInvalidResetLinkError(error));

  const onSubmit = (data: ResetPasswordFormValues) => {
    if (!token) return;
    mutate({ token, newPassword: data.newPassword, confirmNewPassword: data.confirmNewPassword });
  };

  return (
    <AuthLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 3,
          maxWidth: 400,
          width: "100%",
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            bgcolor: isLinkInvalid ? "#fef2f2" : "#eef2ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isLinkInvalid ? (
            <LinkIcon size={36} color="#dc2626" />
          ) : (
            <ShieldCheck size={36} color="#5B6ED9" />
          )}
        </Box>

        {isLinkInvalid ? (
          <>
            <Typography role="alert" variant="h5" fontWeight={700}>
              {RESET_LINK_INVALID_MESSAGE}
            </Typography>
            <AppButton fullWidth onClick={() => navigate("/auth/forgot-password")}>
              Solicitar nuevo enlace
            </AppButton>
          </>
        ) : (
          <>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="h4" fontWeight={700}>
                Nueva contraseña
              </Typography>
              <Typography variant="body1" color="text.secondary" lineHeight={1.7}>
                Mínimo 8 caracteres, una mayúscula, una minúscula y un carácter especial.
              </Typography>
            </Box>

            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              sx={{ display: "flex", flexDirection: "column", gap: 2.5, width: "100%" }}
            >
              <PasswordField
                placeholder="Nueva contraseña"
                fullWidth
                autoComplete="new-password"
                slotProps={{ htmlInput: { "aria-label": "Nueva contraseña" } }}
                {...register("newPassword")}
                error={!!errors.newPassword}
                helperText={errors.newPassword?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={17} color="#AAAAAA" />
                    </InputAdornment>
                  ),
                }}
              />
              <PasswordField
                placeholder="Confirmá la nueva contraseña"
                fullWidth
                autoComplete="new-password"
                slotProps={{ htmlInput: { "aria-label": "Confirmar nueva contraseña" } }}
                {...register("confirmNewPassword")}
                error={!!errors.confirmNewPassword}
                helperText={errors.confirmNewPassword?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={17} color="#AAAAAA" />
                    </InputAdornment>
                  ),
                }}
              />
              <AppButton type="submit" fullWidth loading={isPending}>
                Restablecer contraseña
              </AppButton>
            </Box>
          </>
        )}

        <Link
          to="/auth/login"
          style={{ color: "#3F4CAE", fontWeight: 600, textDecoration: "none" }}
        >
          Volver al login
        </Link>
      </Box>
    </AuthLayout>
  );
}
```

### 9. Rutas (MODIFICAR `src/routes/AuthRoutes.tsx`)

Agregar los dos imports debajo de los existentes:

```tsx
import ForgotPasswordPage from "@/modules/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/modules/auth/pages/ResetPasswordPage";
```

Y las dos rutas al final del `<Routes>` (después de `activate`):

```tsx
      <Route path="forgot-password" element={<ForgotPasswordPage />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />
```

### 10. Enlace en el login (MODIFICAR `src/modules/auth/components/LoginForm.tsx`)

Agregar el import (debajo del de `zodResolver`):

```tsx
import { Link } from "react-router-dom";
```

Insertar este bloque **entre** el `</Box>` que cierra el campo "Contraseña" y el comentario `{/* ─── Botón Iniciar Sesión ─── */}`:

```tsx
          {/* ─── Olvidé mi contraseña ─── */}
          <Box sx={{ textAlign: "right", mt: "-8px" }}>
            <Link
              to="/auth/forgot-password"
              style={{
                color: "#3F4CAE",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Olvidé mi contraseña
            </Link>
          </Box>
```

### 11. Excluir los endpoints del Bearer (MODIFICAR `src/shared/lib/constants.ts`)

```ts
export const EXCLUDED_BEARER_ROUTES: string[] = [
  "/api/v1/auth/login",
  "/api/v1/auth/register",
  "/api/v1/users/reset-password/email",
  "/api/v1/users/reset-password",
];
```

## Tests (CREAR)

Todos en `test/modules/auth/`, prefijo `CP-034.F<N>` en el nombre de cada `it`. Código verificado (21 tests, todos pasan):

### `test/modules/auth/passwordRecoverySchemas.test.ts` (CP-034.F1 – F6)

```ts
import { describe, expect, it } from "vitest";
import { forgotPasswordSchema } from "@/modules/auth/schemas/forgot-password.schema";
import { resetPasswordSchema } from "@/modules/auth/schemas/reset-password.schema";

function issues(newPassword: string, confirmNewPassword = newPassword) {
  const result = resetPasswordSchema.safeParse({ newPassword, confirmNewPassword });
  return result.success ? [] : result.error.issues.map((issue) => issue.message);
}

describe("forgotPasswordSchema", () => {
  it("CP-034.F1 - rechaza email vacío e inválido", () => {
    expect(forgotPasswordSchema.safeParse({ email: "" }).success).toBe(false);
    expect(forgotPasswordSchema.safeParse({ email: "abc" }).success).toBe(false);
  });

  it("CP-034.F2 - acepta un email válido", () => {
    expect(forgotPasswordSchema.safeParse({ email: "ana@test.com" }).success).toBe(true);
  });
});

describe("resetPasswordSchema (mismas reglas que el registro)", () => {
  it("CP-034.F3 - rechaza menos de 8 caracteres", () => {
    expect(issues("Ab#1")).toContain("La contraseña debe tener al menos 8 caracteres");
  });

  it.each([
    ["sin mayúscula", "nueva#123"],
    ["sin minúscula", "NUEVA#123"],
    ["sin carácter especial", "Nueva1234"],
  ])("CP-034.F4 - rechaza contraseña %s", (_motivo, password) => {
    expect(issues(password)).toContain("Usá mayúsculas, minúsculas y un carácter especial");
  });

  it("CP-034.F5 - rechaza confirmación distinta", () => {
    expect(issues("Nueva#123", "Nueva#124")).toContain("Las contraseñas no coinciden");
  });

  it("CP-034.F6 - acepta una contraseña válida confirmada", () => {
    expect(issues("Nueva#123")).toEqual([]);
  });
});
```

### `test/modules/auth/useResetPassword.test.tsx` (CP-034.F7 – F9)

```tsx
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useResetPassword } from "@/modules/auth/hooks/useResetPassword";
import { resetPassword } from "@/modules/auth/api/auth.api";

vi.mock("@/modules/auth/api/auth.api", () => ({
  resetPassword: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

function LocationDisplay() {
  const location = useLocation();
  return <span data-testid="location">{location.pathname}</span>;
}

function Wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/auth/reset-password"]}>
        {children}
        <LocationDisplay />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

const payload = { token: "t-1", newPassword: "Nueva#123", confirmNewPassword: "Nueva#123" };

function axiosError(status: number, data: { message: string; detail?: string }) {
  return { response: { status, data: { status, ...data } } };
}

describe("useResetPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("CP-034.F7 - éxito: avisa y redirige al login", async () => {
    vi.mocked(resetPassword).mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useResetPassword(), { wrapper: Wrapper });

    await act(async () => {
      result.current.mutate(payload);
    });

    await waitFor(() => expect(screen.getByTestId("location")).toHaveTextContent("/auth/login"));
    expect(resetPassword).toHaveBeenCalledWith(payload);
    expect(toast.success).toHaveBeenCalledTimes(1);
  });

  it("CP-034.F8 - 422 RESET_LINK_INVALID: no muestra toast (la página muestra el panel) y no redirige", async () => {
    vi.mocked(resetPassword).mockRejectedValueOnce(
      axiosError(422, {
        message: "Este enlace ya no es válido. Solicitá uno nuevo",
        detail: "RESET_LINK_INVALID",
      })
    );
    const { result } = renderHook(() => useResetPassword(), { wrapper: Wrapper });

    await act(async () => {
      result.current.mutate(payload);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).not.toHaveBeenCalled();
    expect(screen.getByTestId("location")).toHaveTextContent("/auth/reset-password");
  });

  it("CP-034.F9 - otro error: muestra el mensaje del backend en un toast", async () => {
    vi.mocked(resetPassword).mockRejectedValueOnce(
      axiosError(400, { message: "Las contraseñas no coinciden", detail: "PASSWORDS_MISMATCH" })
    );
    const { result } = renderHook(() => useResetPassword(), { wrapper: Wrapper });

    await act(async () => {
      result.current.mutate(payload);
    });

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Las contraseñas no coinciden"));
  });
});
```

### `test/modules/auth/ForgotPasswordPage.test.tsx` (CP-034.F10 – F12)

```tsx
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { toast } from "sonner";
import ForgotPasswordPage from "@/modules/auth/pages/ForgotPasswordPage";
import { requestPasswordReset } from "@/modules/auth/api/auth.api";

vi.mock("@/modules/auth/api/auth.api", () => ({
  requestPasswordReset: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/auth/forgot-password"]}>
        <ForgotPasswordPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("ForgotPasswordPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("CP-034.F10 - email inválido: muestra error y no llama a la API", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText("Correo electrónico"), "abc");
    await user.click(screen.getByRole("button", { name: "Enviar enlace" }));

    expect(await screen.findByText("El email no es válido")).toBeInTheDocument();
    expect(requestPasswordReset).not.toHaveBeenCalled();
  });

  it("CP-034.F11 - éxito: muestra el mensaje genérico exacto del CA 2", async () => {
    vi.mocked(requestPasswordReset).mockResolvedValueOnce(undefined);
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText("Correo electrónico"), "ana@test.com");
    await user.click(screen.getByRole("button", { name: "Enviar enlace" }));

    expect(
      await screen.findByText("Si el correo existe, recibirás un enlace de recuperación")
    ).toBeInTheDocument();
    expect(requestPasswordReset).toHaveBeenCalledWith("ana@test.com");
    expect(screen.getByRole("link", { name: "Volver al login" })).toHaveAttribute(
      "href",
      "/auth/login"
    );
  });

  it("CP-034.F12 - error de red: toast de error y NO muestra el mensaje de éxito", async () => {
    vi.mocked(requestPasswordReset).mockRejectedValueOnce(new Error("network"));
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText("Correo electrónico"), "ana@test.com");
    await user.click(screen.getByRole("button", { name: "Enviar enlace" }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(1));
    expect(
      screen.queryByText("Si el correo existe, recibirás un enlace de recuperación")
    ).not.toBeInTheDocument();
  });
});
```

### `test/modules/auth/ResetPasswordPage.test.tsx` (CP-034.F13 – F17)

```tsx
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import ResetPasswordPage from "@/modules/auth/pages/ResetPasswordPage";
import { resetPassword } from "@/modules/auth/api/auth.api";

vi.mock("@/modules/auth/api/auth.api", () => ({
  resetPassword: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const INVALID_LINK_MESSAGE = "Este enlace ya no es válido. Solicitá uno nuevo";

function LocationDisplay() {
  const location = useLocation();
  return <span data-testid="location">{location.pathname}</span>;
}

function renderPage(initialEntry: string) {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
          <Route path="/auth/login" element={<div>login</div>} />
          <Route path="/auth/forgot-password" element={<div>forgot</div>} />
        </Routes>
        <LocationDisplay />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

async function fillAndSubmit(newPassword: string, confirm: string) {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Nueva contraseña"), newPassword);
  await user.type(screen.getByLabelText("Confirmar nueva contraseña"), confirm);
  await user.click(screen.getByRole("button", { name: "Restablecer contraseña" }));
}

describe("ResetPasswordPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("CP-034.F13 - sin token en la URL: muestra el mensaje de enlace inválido y el botón para pedir otro", async () => {
    const user = userEvent.setup();
    renderPage("/auth/reset-password");

    expect(screen.getByText(INVALID_LINK_MESSAGE)).toBeInTheDocument();
    expect(screen.queryByLabelText("Nueva contraseña")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Solicitar nuevo enlace" }));
    expect(screen.getByTestId("location")).toHaveTextContent("/auth/forgot-password");
  });

  it("CP-034.F14 - contraseña débil: muestra el error y no llama a la API", async () => {
    renderPage("/auth/reset-password?token=abc");

    await fillAndSubmit("nueva#123", "nueva#123");

    expect(
      await screen.findByText("Usá mayúsculas, minúsculas y un carácter especial")
    ).toBeInTheDocument();
    expect(resetPassword).not.toHaveBeenCalled();
  });

  it("CP-034.F15 - contraseñas distintas: muestra el error y no llama a la API", async () => {
    renderPage("/auth/reset-password?token=abc");

    await fillAndSubmit("Nueva#123", "Nueva#124");

    expect(await screen.findByText("Las contraseñas no coinciden")).toBeInTheDocument();
    expect(resetPassword).not.toHaveBeenCalled();
  });

  it("CP-034.F16 - éxito: envía token + contraseñas y redirige al login (CA 5)", async () => {
    vi.mocked(resetPassword).mockResolvedValueOnce(undefined);
    renderPage("/auth/reset-password?token=abc-123");

    await fillAndSubmit("Nueva#123", "Nueva#123");

    await waitFor(() => expect(screen.getByTestId("location")).toHaveTextContent("/auth/login"));
    expect(resetPassword).toHaveBeenCalledWith({
      token: "abc-123",
      newPassword: "Nueva#123",
      confirmNewPassword: "Nueva#123",
    });
  });

  it("CP-034.F17 - 422 RESET_LINK_INVALID: reemplaza el formulario por el mensaje del CA 6", async () => {
    vi.mocked(resetPassword).mockRejectedValueOnce({
      response: {
        status: 422,
        data: { status: 422, message: INVALID_LINK_MESSAGE, detail: "RESET_LINK_INVALID" },
      },
    });
    renderPage("/auth/reset-password?token=usado");

    await fillAndSubmit("Nueva#123", "Nueva#123");

    expect(await screen.findByText(INVALID_LINK_MESSAGE)).toBeInTheDocument();
    expect(screen.queryByLabelText("Nueva contraseña")).not.toBeInTheDocument();
  });
});
```

### `test/modules/auth/LoginForgotPasswordLink.test.tsx` (CP-034.F18 – F19)

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import LoginForm from "@/modules/auth/components/LoginForm";
import { EXCLUDED_BEARER_ROUTES } from "@/shared/lib/constants";

describe("Login - Olvidé mi contraseña", () => {
  it("CP-034.F18 - el login muestra el enlace hacia /auth/forgot-password sin estar autenticado (CA 1)", () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={["/auth/login"]}>
          <LoginForm />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByRole("link", { name: "Olvidé mi contraseña" })).toHaveAttribute(
      "href",
      "/auth/forgot-password"
    );
  });

  it("CP-034.F19 - los endpoints de recuperación no llevan Bearer (token viejo en el store no los cancela)", () => {
    expect(EXCLUDED_BEARER_ROUTES).toEqual(
      expect.arrayContaining(["/api/v1/users/reset-password/email", "/api/v1/users/reset-password"])
    );
  });
});
```

## No hacer

- No usar `httpClient` en `auth.api.ts` para estos endpoints: usar `rawHttpClient` (el otro cierra sesión ante cualquier 401 y muestra snackbars globales).
- No distinguir en el frontend si el correo existe: ante `204` mostrar **siempre** el mismo mensaje; ante error, toast genérico **sin** mensaje de éxito. No mostrar el email tipeado en la pantalla de éxito.
- No mostrar toast de error ante `RESET_LINK_INVALID` (lo muestra la página como panel).
- No importar ni modificar `user-register.schema.ts` ni `login.schema.ts`.
- No agregar validación previa del enlace (no existe endpoint en el backend): el usuario se entera al enviar el formulario.
- No cambiar el path `/auth/reset-password` ni el nombre del parámetro `token` (el mail del backend los usa).
- No tocar `LoginPage.tsx`, `RoutesProvider.tsx` ni `httpClient.ts`.
- No "arreglar" el `aria-label` del `LoginForm` existente ni otros estilos del login.
- No `any`, no `style={{}}` fuera del `Link` (el repo ya usa ese patrón para enlaces), no `useEffect` + axios, no llamar axios desde componentes.
- No crear en `shared/` nada que use solo auth.
- No guardar el token ni las contraseñas en stores ni en `localStorage`.

## Verificación (correr y pegar el resultado)

```bash
npm run type-check
npm run lint
npm run format:check
npm run test        # los 21 tests nuevos de test/modules/auth/ + ninguna regresión
npm run build
```

Chequeo manual (con el backend de esta historia corriendo):

1. `/auth/login` → aparece "Olvidé mi contraseña" → lleva a `/auth/forgot-password`.
2. Pedir el enlace con un correo registrado y con uno inexistente → **la pantalla es idéntica**.
3. Abrir el link del mail → formulario; probar contraseña débil, no coincidentes y válida → redirige a `/auth/login` con toast.
4. Volver a abrir el mismo link → "Este enlace ya no es válido. Solicitá uno nuevo" + botón "Solicitar nuevo enlace".
5. Con un JWT vencido en el `localStorage`, repetir el paso 2: la request **sale** (no queda cancelada).

## Limitaciones conocidas (informar, no resolver)

- El enlace se valida recién al enviar el formulario (no hay endpoint de validación previa).
- Los JWT ya emitidos siguen vigentes tras cambiar la contraseña (decisión pendiente del PO, ver spec backend).
- `LoginForm` usa `aria-label` en el `TextField` raíz (preexistente): los campos del login no tienen label accesible en el `<input>`.

## Commits (convención del repo, descripción en español)

```
feat: agrega enlace "Olvidé mi contraseña" en el login
feat: agrega pantalla para solicitar enlace de recuperación de contraseña
feat: agrega pantalla para restablecer la contraseña con el enlace del mail
test: agrega tests de recuperación de contraseña
```

## Definition of Done

- [ ] Login muestra "Olvidé mi contraseña" → `/auth/forgot-password`, sin necesidad de sesión (CA 1)
- [ ] `ForgotPasswordPage` valida email y muestra siempre "Si el correo existe, recibirás un enlace de recuperación" ante 204 (CA 2)
- [ ] `ResetPasswordPage` exige 8+ caracteres, mayúscula, minúscula, carácter especial y confirmación igual (CA 4)
- [ ] Éxito → toast + redirección a `/auth/login` (CA 5)
- [ ] 422 `RESET_LINK_INVALID` o URL sin `token` → "Este enlace ya no es válido. Solicitá uno nuevo" + botón para pedir otro, sin toast de error (CA 6)
- [ ] Rutas `/auth/forgot-password` y `/auth/reset-password` públicas en `AuthRoutes`
- [ ] Endpoints agregados a `EXCLUDED_BEARER_ROUTES`
- [ ] Se usa `rawHttpClient` (sin logout automático ni snackbar global)
- [ ] `npm run type-check`, `lint`, `format:check`, `test` y `build` en verde
- [ ] Probado a mano el flujo completo contra el backend de esta historia
- [ ] Code review aprobado
