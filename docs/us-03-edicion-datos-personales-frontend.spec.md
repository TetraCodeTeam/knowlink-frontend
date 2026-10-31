# US-03 — Edición de datos personales (Frontend)

> Spec generado a partir de la exploración real de `TetraCodeTeam/knowlink-frontend`, rama `dev` (commit `9268ce3`). Pensado para ejecutarse con **OpenCode + DeepSeek V4 Flash**: pasos literales, rutas exactas y verificación por paso. No improvises fuera de lo que dice este documento.

## Antes de empezar (obligatorio)

1. Leer `AGENTS.md` y `docs/base-standards.md` del repo (flujo `api/ → hooks/ → components/`, alias `@/`, react-hook-form + zodResolver, sonner, Prettier).
2. Crear la rama desde `dev`: `git checkout dev && git pull && git checkout -b feat/edit-personal-data`.
3. `npm ci` y correr la línea base **antes de tocar nada**: `npm run type-check && npm run lint && npm run test`. Si algo ya falla, anotarlo y NO arreglarlo en esta historia.
4. Trabajar en este orden exacto: **interfaces → api → hooks → schema → componente del formulario → páginas → rutas → botones de entrada → tests**.

## Metadata

| Campo | Valor |
|---|---|
| ID Historia | US-03 |
| Épica | — |
| Story Points | 5 |
| Prioridad | Baja |
| Módulo | usuarios |
| Tags | #RN-01 |
| Repo / rama | `knowlink-frontend`, rama `feat/edit-personal-data` (base = `dev`) |
| Relacionadas | US-37 (perfil alumno), US-38 (perfil tutor), US-39 (perfil administrador) |
| Spec hermano | `us-03-edicion-datos-personales-backend.spec.md` (repo `knowlink-backend`) |
| Dependencia | Endpoints `PUT /api/v1/students/me/profile` y `PUT /api/v1/tutors/me/profile` (spec backend). Mientras no estén desplegados, los tests mockean la capa `api/` |

## Historia de usuario

Como usuario registrado, quiero poder modificar mis datos personales, para mantener mi perfil actualizado.

Descripción adicional: edición de perfil para todos los roles. **En esta historia se implementa para ALUMNO y TUTOR**; el administrador no tiene pantalla de perfil y se cubre en US-39.

## Alcance frontend

| CA | Qué implementa el frontend |
|---|---|
| 1 | Pantalla "Editar perfil" (una por rol) con todos los campos del registro editables **menos el correo**, que se muestra deshabilitado |
| 2 | Al guardar se actualiza el cache del perfil (`setQueryData`) con la respuesta del backend → el perfil muestra los datos nuevos al instante, sin recargar |
| 3 | Leyenda **siempre visible** junto al campo de correo deshabilitado: "El correo electrónico no puede modificarse." |
| 4 | Campo obligatorio vacío resaltado en rojo con mensaje "… es obligatorio"; botón "Guardar cambios" deshabilitado hasta que todos los obligatorios estén completos |

Campos por rol:

| Campo | Alumno | Tutor | Obligatorio |
|---|---|---|---|
| Nombre (`firstName`) | ✔ | ✔ | Sí |
| Apellido (`lastName`) | ✔ | ✔ | Sí |
| Correo (`email`) | deshabilitado | deshabilitado | — (no se envía) |
| DNI (`dni`) | ✔ | ✔ | Sí (7 u 8 dígitos) |
| Teléfono celular (`phoneNumber`) | ✔ | ✔ | Sí |
| Carrera (`career`) | ✔ | ✔ | Sí |
| Legajo institucional (`institutionalId`) | ✔ | ✔ | No |
| Biografía (`biography`, ≤ 300) | — | ✔ | No |
| Dirección clases presenciales (`address`) | — | ✔ | Solo si el tutor tiene alguna materia IN_PERSON o BOTH |

## Criterios de aceptación (Gherkin)

```gherkin
Feature: Edición de datos personales

  Background:
    Given el usuario está autenticado como ALUMNO (o TUTOR) y está en su perfil

  Scenario: Abrir "Editar perfil"
    When hace clic en "Editar perfil"
    Then se abre la pantalla "Editar perfil" con todos los campos precargados con sus datos actuales
    And el campo "Correo electrónico" aparece deshabilitado
    And junto a ese campo se ve la leyenda "El correo electrónico no puede modificarse."

  Scenario: Guardar cambios
    Given modificó el teléfono y la carrera con valores válidos
    When presiona "Guardar cambios"
    Then se envía PUT sin el campo email
    And se muestra el toast "Datos personales actualizados correctamente."
    And vuelve al perfil, que ya muestra los datos nuevos sin recargar la página

  Scenario: Campo obligatorio vacío
    Given borra el contenido del campo "Nombre"
    Then el campo se resalta en rojo con el mensaje "El nombre es obligatorio"
    And el botón "Guardar cambios" queda deshabilitado
    When vuelve a completar el campo
    Then el resaltado desaparece y el botón se habilita (si hubo algún cambio)

  Scenario: DNI ya registrado por otro usuario
    When guarda un DNI que pertenece a otro usuario y el backend responde 409 DUPLICATE_DNI
    Then el campo DNI queda resaltado con el mensaje del backend
    And se permanece en la pantalla con los datos ingresados

  Scenario: Cancelar
    When presiona "Cancelar"
    Then vuelve al perfil sin enviar nada

  Scenario: Tutor con clases presenciales
    Given el tutor tiene una materia con modalidad Presencial o Ambas
    When deja vacía la dirección
    Then el campo se resalta con "La dirección es obligatoria para clases presenciales" y no puede guardar
```

## Hechos verificados en el código (no re-investigar)

- **Perfil del alumno**: `src/modules/student/profile/pages/OwnProfilePage.tsx` (ruta `/student/profile`), usa `useMyStudentProfile` (query key `["myStudentProfile"]`, `src/modules/student/profile/hooks/useMyStudentProfile.ts`) y renderiza `ProfileHeader` (nombre + avatar) y `PersonalDataCard` (`src/modules/student/profile/components/PersonalDataCard.tsx`, solo lectura: correo, celular, carrera). La cabecera de `PersonalDataCard` tiene un `Stack` con `justifyContent="space-between"` que hoy solo contiene el título "Datos Personales" → ahí va el botón "Editar perfil".
- **Perfil del tutor**: `src/modules/tutor/profile/components/TutorProfilePage.tsx` (ruta `/tutor/profile`), usa `useMyTutorProfile` (query key `["myTutorProfile"]`, `src/modules/tutor/profile/hooks/useMyTutorProfile.ts`). La pestaña 0 "Información personal" muestra `<Typography sx={{ ...SECTION_LABEL_SX, mb: "26px" }}>Datos personales</Typography>` y debajo `DataItem` de correo, celular y dirección.
- **Interfaces de respuesta actuales**: `StudentSelfProfileResponse` en `src/modules/student/profile/interfaces/ownProfileInterface.ts`; `TutorOwnProfileResponse` en `src/modules/tutor/profile/interfaces/tutor-own-profile.interface.ts` (la usa `getMyTutorProfile`); y existe **otra** `TutorSelfProfileResponse` en `src/modules/tutor/interfaces/TutorSelfProfileResponse.ts`. El backend de esta historia **agrega** `firstName`, `lastName`, `dni`, `institutionalId` a ambas respuestas.
- **API existente**: `src/modules/student/profile/api/student-profile.api.ts` (`getMyStudentProfile`) y `src/modules/tutor/profile/api/getMyTutorProfile.ts` (`getMyTutorProfile`), ambas con `httpClient`.
- **Rutas**: `src/routes/StudentRoutes.tsx` y `src/routes/TutorRoutes.tsx` (rutas hijas relativas dentro de `/student/*` y `/tutor/*`, con su `Layout`). `src/routes/paths.ts` exporta `studentPaths` y `adminPaths` (no hay `tutorPaths`).
- **Carreras**: `useCareers()` en `@/modules/tutors/hooks/useCareers` (query `["careers"]`) devuelve `CareerOption[] = { careerId, name }[]`; el backend recibe el **nombre** de la carrera. Ya lo usa `StudentAccountForm` con un `Select` de MUI + `Controller` (copiar ese patrón visual: etiqueta `Typography variant="body2" fontWeight={500}` arriba de cada input, `borderRadius: 2`, asterisco `*` en obligatorios).
- **Reglas del registro** (copiar los mensajes): `studentAccountSchema`/`step1Schema` en `src/modules/auth/schemas/` — nombre "El nombre es obligatorio", apellido "El apellido es obligatorio", carrera "La carrera es obligatoria", teléfono "El teléfono es obligatorio", DNI "El DNI es obligatorio" + `/^\d{7,8}$/` "El DNI debe tener 7 u 8 dígitos". Biografía `max(300)` "La biografía no puede superar los 300 caracteres". Dirección obligatoria si hay modalidad presencial: "La dirección es obligatoria para clases presenciales".
- **Errores**: `httpClient` (`src/shared/lib/httpClient.ts`) ya muestra un toast de error con el `message` del backend en **cada** respuesta fallida (y hace logout en 401). Por eso los hooks nuevos **NO agregan `onError` con toast** (se duplicaría). El cuerpo de error es `{ status, message, detail }` (`src/shared/interfaces/error-response.interface.ts`). `getErrorMessage` está en `src/shared/utils/errors.ts`.
- **Toasts**: `sonner` (`<Toaster>` montado en `SnackbarProvider`). Para éxito: `toast.success("…")`.
- **Componentes compartidos**: `AppButton` (`@/shared/components/AppButton`, `appVariant="primary"|"outline"|…`, prop `loading`). Íconos: `lucide-react`.
- **Estado de sesión**: las sidebars usan `authResponse.email`, no el nombre; `useAuthStore` NO necesita actualizarse al editar el perfil (el email no cambia y el JWT sigue siendo válido).
- **Zod 4** (`^4.1.12`), `react-hook-form ^7.63`, `@hookform/resolvers ^5.2`.
- **Tests**: Vitest + Testing Library con globals; viven en `test/modules/<modulo>/` en la **raíz** del repo (no junto al código). Setup en `test/setup.ts`. Ejemplo de estilo: `test/modules/admin/material-reports/RemoveMaterialDialog.test.tsx` (`vi.mock` de la capa `api/`, `vi.mock("sonner")`, `QueryClientProvider`).
- **`src/modules/users/`** hoy solo tiene `api/`, `constants.ts` e `interfaces/` y **no se usa en ningún lado** (`updateUser`/`deleteUser` en `users.api.ts` están sin consumidores y apuntan a un endpoint que el backend de esta historia elimina). **No tocar `users.api.ts`** en esta historia. El módulo `users` se usa para lo que es común a alumno y tutor (schema y formulario).

## Contrato con el backend

```
PUT /api/v1/students/me/profile
Body: { firstName, lastName, dni, phoneNumber, career, institutionalId }   // strings; institutionalId opcional
200 → StudentSelfProfileResponse (ampliada)

PUT /api/v1/tutors/me/profile
Body: { firstName, lastName, dni, phoneNumber, career, institutionalId, biography, address }
200 → TutorSelfProfileResponse (ampliada)

400/403/404/409 → { status, message, detail }     // 409 → detail === "DUPLICATE_DNI"
```

El body **NO incluye `email`**. Las respuestas ampliadas agregan: `firstName`, `lastName`, `dni`, `institutionalId`.

## Archivos a crear / modificar

| # | Acción | Archivo |
|---|---|---|
| 1 | MODIFICAR | `src/modules/student/profile/interfaces/ownProfileInterface.ts` |
| 2 | MODIFICAR | `src/modules/tutor/profile/interfaces/tutor-own-profile.interface.ts` y `src/modules/tutor/interfaces/TutorSelfProfileResponse.ts` |
| 3 | CREAR | `src/modules/users/interfaces/requests/edit-profile.interface.ts` |
| 4 | MODIFICAR | `src/modules/student/profile/api/student-profile.api.ts` |
| 5 | CREAR | `src/modules/tutor/profile/api/updateMyTutorProfile.ts` |
| 6 | CREAR | `src/modules/student/profile/hooks/useUpdateStudentProfile.ts` |
| 7 | CREAR | `src/modules/tutor/profile/hooks/useUpdateTutorProfile.ts` |
| 8 | CREAR | `src/modules/users/schemas/editProfile.schema.ts` |
| 9 | CREAR | `src/modules/users/components/EditProfileForm.tsx` |
| 10 | CREAR | `src/modules/student/profile/pages/StudentEditProfilePage.tsx` |
| 11 | CREAR | `src/modules/tutor/profile/pages/TutorEditProfilePage.tsx` |
| 12 | MODIFICAR | `src/routes/paths.ts`, `src/routes/StudentRoutes.tsx`, `src/routes/TutorRoutes.tsx` |
| 13 | MODIFICAR | `src/modules/student/profile/components/PersonalDataCard.tsx` y `src/modules/student/profile/pages/OwnProfilePage.tsx` |
| 14 | MODIFICAR | `src/modules/tutor/profile/components/TutorProfilePage.tsx` |
| 15 | CREAR | tests bajo `test/modules/users/` y `test/modules/student/` (ver sección Tests) |

### 1-2. Interfaces de respuesta (MODIFICAR)

Agregar los 4 campos nuevos (no quitar ni renombrar nada):

```ts
// StudentSelfProfileResponse
firstName: string;
lastName: string;
dni: string | null;
institutionalId: string | null;

// TutorOwnProfileResponse y TutorSelfProfileResponse: los mismos 4 campos
```

### 3. Interfaces de request (CREAR)

```ts
export interface UpdateStudentProfileRequest {
  firstName: string;
  lastName: string;
  dni: string;
  phoneNumber: string;
  career: string;
  institutionalId?: string;
}

export interface UpdateTutorProfileRequest extends UpdateStudentProfileRequest {
  biography?: string;
  address?: string;
}
```

(Sin `email`.)

### 4-5. Funciones API (MODIFICAR / CREAR)

En `student-profile.api.ts` agregar (con `httpClient`, mismo estilo que `getMyStudentProfile`):

```ts
export async function updateMyStudentProfile(
  data: UpdateStudentProfileRequest
): Promise<StudentSelfProfileResponse> {
  const response = await httpClient.put<StudentSelfProfileResponse>(
    "/api/v1/students/me/profile",
    data
  );
  return response.data;
}
```

`src/modules/tutor/profile/api/updateMyTutorProfile.ts`:

```ts
export const updateMyTutorProfile = async (
  data: UpdateTutorProfileRequest
): Promise<TutorOwnProfileResponse> => {
  const { data: response } = await httpClient.put<TutorOwnProfileResponse>(
    "/api/v1/tutors/me/profile",
    data
  );
  return response;
};
```

### 6-7. Hooks de mutación (CREAR)

`useUpdateStudentProfile` (el del tutor es idéntico con `["myTutorProfile"]`, `updateMyTutorProfile` y su mutationKey):

```ts
export function useUpdateStudentProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-student-profile"],
    mutationFn: (data: UpdateStudentProfileRequest) => updateMyStudentProfile(data),
    onSuccess: (profile) => {
      queryClient.setQueryData(["myStudentProfile"], profile);
      toast.success("Datos personales actualizados correctamente.");
    },
  });
}
```

- `setQueryData` con la respuesta del `PUT` es lo que da el "reflejo inmediato" (CA 2) sin esperar un refetch.
- **No agregar `onError`** (lo muestra el interceptor de `httpClient`).
- La navegación de vuelta al perfil la hace la página con `mutate(data, { onSuccess })`, no el hook.

### 8. Schema (CREAR)

`src/modules/users/schemas/editProfile.schema.ts`: una **fábrica** porque la dirección es obligatoria solo para tutores con materias presenciales.

```ts
import { z } from "zod";

export function createEditProfileSchema(requiresAddress: boolean) {
  return z
    .object({
      firstName: z.string().trim().min(1, "El nombre es obligatorio"),
      lastName: z.string().trim().min(1, "El apellido es obligatorio"),
      dni: z
        .string()
        .trim()
        .min(1, "El DNI es obligatorio")
        .regex(/^\d{7,8}$/, "El DNI debe tener 7 u 8 dígitos"),
      phoneNumber: z.string().trim().min(1, "El teléfono es obligatorio"),
      career: z.string().min(1, "La carrera es obligatoria"),
      institutionalId: z.string().trim().optional(),
      biography: z.string().max(300, "La biografía no puede superar los 300 caracteres").optional(),
      address: z.string().optional(),
    })
    .refine((data) => !requiresAddress || (data.address ?? "").trim().length > 0, {
      message: "La dirección es obligatoria para clases presenciales",
      path: ["address"],
    });
}

export type EditProfileFormValues = z.infer<ReturnType<typeof createEditProfileSchema>>;
```

Nota: `.trim()` hace que un campo con solo espacios cuente como vacío (CA 4).

### 9. `EditProfileForm` (CREAR)

`src/modules/users/components/EditProfileForm.tsx` — componente **único** para alumno y tutor, con react-hook-form + `zodResolver`.

Props:

```ts
interface EditProfileFormProps {
  variant: "student" | "tutor";
  email: string;
  defaultValues: EditProfileFormValues;
  requiresAddress?: boolean;            // solo tutor; default false
  isPending: boolean;
  onSubmit: (
    values: EditProfileFormValues,
    setFieldError: UseFormSetError<EditProfileFormValues>
  ) => void;
  onCancel: () => void;
}
```

Comportamiento (todo literal):

1. `useForm<EditProfileFormValues>({ resolver: zodResolver(createEditProfileSchema(requiresAddress ?? false)), defaultValues, mode: "all" })`. Crear el schema con `useMemo` para no recrearlo en cada render. **Sin `useEffect` para precargar**: los datos entran por `defaultValues` (el formulario solo se monta cuando el perfil ya cargó; ver páginas).
2. Si algún campo obligatorio ya viene vacío desde el backend (usuarios previos con datos incompletos), debe verse resaltado desde el inicio: llamar `trigger()` **una sola vez al montar** (`useEffect(() => { void trigger(); }, [trigger])`; es el único `useEffect` permitido y no carga datos).
3. Campos, en este orden, con etiqueta `Typography variant="body2" fontWeight={500}` arriba (copiar el estilo de `StudentAccountForm`) y `*` en los obligatorios:
   - Nombre* · Apellido* · **Correo electrónico** · Teléfono celular* · DNI* · Carrera* (`Select` con `Controller` y `useCareers()`) · Legajo institucional
   - solo `variant="tutor"`: Dirección para clases presenciales (`*` y obligatoria si `requiresAddress`) · Biografía (`multiline`, `minRows={3}`, con contador `n/300` en el `helperText`).
4. **Correo (CA 1 y 3)**: `TextField` con `value={email}`, `disabled`, **sin** `register` (no es parte del form ni del payload), `type="email"` y `helperText="El correo electrónico no puede modificarse."`. La leyenda es el `helperText` fijo del propio campo (siempre visible, no un tooltip ni algo que aparezca al pasar el mouse). `data-testid="email-field"` en el `TextField`.
5. **Resaltado (CA 4)**: cada `TextField` con `error={!!errors.campo}` y `helperText={errors.campo?.message}`. Para el `Select` de carrera usar `FormControl error` + `FormHelperText`. Si la carrera actual del perfil no está en la lista de `useCareers()`, agregarla como opción para que el `Select` no quede vacío.
6. **Botón "Guardar cambios"** (`AppButton appVariant="primary" type="submit"`): `disabled={!isValid || !isDirty}` y `loading={isPending}`. Es decir: deshabilitado mientras falte algún obligatorio (o haya algún error) **o** no se haya modificado nada. Botón "Cancelar" (`appVariant="outline"`, `type="button"`, `onClick={onCancel}`, `disabled={isPending}`).
7. `onSubmit` del form: `handleSubmit((values) => onSubmit(values, setError))`. El form NO arma el payload ni llama a la API: eso es de la página.
8. Estilos: MUI `Box component="form" noValidate`, `maxWidth: 560`, `display: flex; flexDirection: column; gap: 2.5`. Sin `style={{}}`.

### 10-11. Páginas (CREAR)

`StudentEditProfilePage` (el tutor es análogo):

```tsx
export function StudentEditProfilePage() {
  const navigate = useNavigate();
  const { data: profile, isLoading, isError } = useMyStudentProfile();
  const { mutate, isPending } = useUpdateStudentProfile();

  // 1) isLoading → <CircularProgress/> centrado; isError || !profile → mensaje de error
  //    (copiar el bloque de OwnProfilePage).
  // 2) Con perfil: <EditProfileForm variant="student" email={profile.email} defaultValues={...} ... />
}
```

- `defaultValues` desde el perfil: `firstName`, `lastName`, `dni ?? ""`, `phoneNumber ?? ""`, `career`, `institutionalId ?? ""` (y en tutor `biography ?? ""`, `address ?? ""`).
- Montar el formulario con `key={profile.userId}` para que no haya que resetear con efectos.
- `onSubmit(values, setFieldError)` arma el request **sin `email`**, aplicando `trim()` a todos los strings. `institutionalId`, `biography` y `address` vacíos se envían como `""` (no omitirlos): el backend los guarda como `null` y así se borra un valor anterior.
- `mutate(request, { onSuccess: () => navigate("/student/profile"), onError: (error) => { /* 409 */ } })`. En `onError`: si `axios.isAxiosError<ErrorResponse>(error) && error.response?.data?.detail === "DUPLICATE_DNI"` → `setFieldError("dni", { type: "server", message: error.response.data.message })`. **No** mostrar toast (ya lo hace el interceptor).
- `onCancel={() => navigate("/student/profile")}`.
- Encabezado de la página: título `h1` "Editar perfil" y subtítulo "Actualizá tus datos personales. Tu correo electrónico no puede modificarse." Layout: `Stack spacing={3} sx={{ mx: "auto", pr: 5, pl: 5, pt: 3, pb: 3 }}` dentro de un `Paper elevation={0}` con borde `0.2px solid #e0e0fa` y `borderRadius: 3` (mismo look que `PersonalDataCard`).
- Tutor: `requiresAddress = profile.subjects.some((s) => s.modality === "IN_PERSON" || s.modality === "BOTH")`; navega a `/tutor/profile`; usa `useMyTutorProfile` y `useUpdateTutorProfile`.

### 12. Rutas (MODIFICAR)

`src/routes/paths.ts` agregar sin tocar lo existente:

```ts
export const studentPaths = {
  bookingWithTutor: ...,            // ya existe
  profile: "/student/profile",
  editProfile: "/student/profile/edit",
};

export const tutorPaths = {
  profile: "/tutor/profile",
  editProfile: "/tutor/profile/edit",
};
```

`StudentRoutes.tsx`: agregar `<Route path="profile/edit" element={<StudentEditProfilePage />} />` junto a `profile`. `TutorRoutes.tsx`: `<Route path="profile/edit" element={<TutorEditProfilePage />} />`. Usar `studentPaths`/`tutorPaths` en los `navigate(...)` y botones (no hardcodear strings en las páginas).

### 13. Botón de entrada del alumno (MODIFICAR)

`PersonalDataCard`: agregar prop `onEdit?: () => void`; si viene, renderizar en el lado derecho de la cabecera (`Stack ... justifyContent="space-between"`) un `AppButton appVariant="outline"` con ícono `Pencil` (`lucide-react`, `size={16}`) y texto "Editar perfil". En `OwnProfilePage` pasar `onEdit={() => navigate(studentPaths.editProfile)}` (usar `useNavigate`). No tocar el resto de la página (el bloque comentado de `AccountManagementCard` se deja como está).

### 14. Botón de entrada del tutor (MODIFICAR)

En `TutorProfilePage`, pestaña 0, reemplazar solo el `Typography` "Datos personales" por un `Box` flex con `justifyContent: "space-between"`, `alignItems: "center"` que contenga ese mismo `Typography` y un `AppButton appVariant="outline"` "Editar perfil" (ícono `Pencil`) con `onClick={() => navigate(tutorPaths.editProfile)}` (agregar `useNavigate`). No tocar tabs, materias, disponibilidad ni recursos.

## Tests (CREAR)

Seguir el estilo de `test/modules/admin/material-reports/*.test.tsx`: `import { describe, it, expect, vi } from "vitest"`, imports con `@/`, textos de `it(...)` en español.

1. **`test/modules/users/editProfile.schema.test.ts`** (puro):
   - datos completos válidos → válido
   - nombre/apellido/teléfono `""` y `"   "` → inválido, error en cada campo con su mensaje
   - DNI `"123"`, `"123456789"`, `"12a45678"` → inválido; `"40123456"` → válido
   - `career: ""` → inválido
   - `institutionalId` vacío → válido (opcional)
   - biografía de 301 caracteres → inválido; de 300 → válido
   - `createEditProfileSchema(true)` con `address: ""` → inválido en `address` con "La dirección es obligatoria para clases presenciales"; con `createEditProfileSchema(false)` → válido
2. **`test/modules/users/EditProfileForm.test.tsx`** (Testing Library + `userEvent`): `vi.mock("@/modules/tutors/hooks/useCareers")` devolviendo 2 carreras; envolver en `QueryClientProvider` si hace falta.
   - muestra los valores precargados
   - el campo de correo está deshabilitado (`data-testid="email-field"` → input `disabled`) y la leyenda "El correo electrónico no puede modificarse." está visible (CA 3)
   - "Guardar cambios" arranca deshabilitado (sin cambios) y se habilita al editar un campo con valor válido
   - borrar "Nombre" → aparece "El nombre es obligatorio" y el botón queda deshabilitado; volver a escribir → desaparece el mensaje y el botón se habilita (CA 4)
   - `variant="student"` no muestra Biografía ni Dirección; `variant="tutor"` sí
   - `variant="tutor"` con `requiresAddress` y dirección vacía → botón deshabilitado y mensaje de dirección
   - al enviar válido, `onSubmit` recibe los valores **sin** clave `email` (`expect(values).not.toHaveProperty("email")`)
   - "Cancelar" llama a `onCancel`
3. **`test/modules/student/StudentEditProfilePage.test.tsx`**: `vi.mock` de `@/modules/student/profile/api/student-profile.api` (`getMyStudentProfile`, `updateMyStudentProfile`), `vi.mock("sonner")`, `MemoryRouter` + `QueryClientProvider`:
   - carga el perfil y muestra el formulario precargado
   - al guardar llama a `updateMyStudentProfile` con el payload esperado **sin `email`**, muestra `toast.success("Datos personales actualizados correctamente.")` y el cache `["myStudentProfile"]` queda con la respuesta (verificar con `queryClient.getQueryData`)
   - respuesta de error 409 con `detail: "DUPLICATE_DNI"` → el campo DNI muestra el `message` del backend y NO navega
4. **(opcional, si queda tiempo)** `TutorEditProfilePage.test.tsx` análogo: con una materia `IN_PERSON` el campo Dirección es obligatorio.

## No hacer

- No enviar `email` en el request ni hacerlo editable; no registrarlo en react-hook-form.
- No editar contraseña, foto de perfil ni materias en esta pantalla.
- No implementar edición del administrador (US-39); no tocar `src/modules/admin/`.
- No llamar `axios`/`httpClient` desde componentes o páginas: todo por `api/ → hooks/ → components/pages`.
- No usar `useEffect` + `useState` para cargar o precargar datos (se resuelve con `useQuery` + `defaultValues` + `key`). El único `useEffect` permitido es el `trigger()` inicial del formulario.
- No agregar `onError` con toast en los hooks (duplicaría el interceptor).
- No usar `any`, ni `style={{}}`, ni rutas relativas largas (usar `@/`).
- No usar `users.api.ts` (`updateUser`/`deleteUser`) ni modificarlo.
- No actualizar `useAuthStore` al guardar (el email y el token no cambian).
- No crear nada en `shared/` (lo común va en `modules/users/`).
- No agregar dependencias nuevas. No tocar `AddSubjectModal`/`EditSubjectModal` ni la pestaña de materias.

## Limitación conocida (informar, no resolver)

- Los datos editados se reflejan al instante en el perfil propio. Los demás usuarios (p. ej. un alumno que mira el perfil público del tutor, o resultados de búsqueda ya cargados) verán el cambio en su próxima carga, según el `staleTime` de sus queries; no se invalidan queries de otros módulos desde este módulo.
- El campo **DNI** es editable porque el criterio habla de "todos los campos que ingresó al registrarse"; el PO debe confirmarlo (ver spec backend, "Puntos a confirmar").

## Verificación (correr y pegar el resultado)

```bash
npx prettier --write <archivos creados/modificados>   # respetar .prettierrc.json
npm run format:check
npm run lint
npm run type-check
npm run test
npm run build
```

Chequeo manual (con el backend de US-03 corriendo): como alumno → Perfil → "Editar perfil" → correo deshabilitado con leyenda → borrar "Nombre" (campo en rojo, "Guardar" deshabilitado) → completarlo, cambiar el celular → "Guardar cambios" → vuelve al perfil con el dato nuevo, sin recargar. Repetir como tutor (incluida la dirección obligatoria con una materia presencial) y probar un DNI de otro usuario (error en el campo DNI).

## Commits (convención del repo, descripción en español)

```
feat: agrega pantalla de edición de datos personales del alumno
feat: agrega pantalla de edición de datos personales del tutor
test: agrega tests de edición de datos personales
```

## Definition of Done

- [ ] Botón "Editar perfil" en el perfil del alumno y del tutor que lleva a la pantalla de edición
- [ ] Formulario con todos los campos del registro precargados; correo deshabilitado
- [ ] Leyenda "El correo electrónico no puede modificarse." siempre visible junto al correo
- [ ] Campo obligatorio vacío resaltado con mensaje y "Guardar cambios" deshabilitado hasta completar todos los obligatorios
- [ ] Tutor: dirección obligatoria si tiene materias presenciales; biografía ≤ 300 con contador
- [ ] Al guardar: PUT sin `email`, toast de éxito, vuelta al perfil con los datos nuevos sin recargar (`setQueryData`)
- [ ] 409 `DUPLICATE_DNI` resaltado en el campo DNI; resto de errores por el toast del interceptor
- [ ] react-hook-form + zodResolver (schema en `schemas/`), sin `any`, sin `useEffect` para datos
- [ ] Tests nuevos en verde; `lint`, `type-check`, `format:check`, `test` y `build` sin regresiones
- [ ] Code review aprobado
