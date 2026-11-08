# Spec Frontend — Catálogo multi-institución (Institución → Carrera → Materia)

## Metadata

- **Feature ID:** FEAT-CATALOGO-INSTITUCIONAL (v2, reescrita sobre el código real)
- **Historias:** US-01, US-42, US-43, US-06 (+ edición de perfil, rol dual y comunidad por arrastre)
- **Repo / rama base:** `knowlink-frontend` · `feat/frankie-mascota` (commit `777039b`, ya incluye `dev`)
- **Rama sugerida:** `feat/catalogo-institucional`
- **Depende de:** backend `FEAT-CATALOGO-INSTITUCIONAL` (`spec-backend-catalogo-institucional.md`, sección 6 = contrato). **No integrar hasta que esos endpoints existan.**

## 0. Qué cambió respecto de la v1 de este spec (y por qué)

La v1 proponía un módulo `catalog` nuevo y selects consumiendo `/api/catalogo/*`. El código real es otro:

| Hallazgo en el código | Consecuencia |
|---|---|
| El catálogo ya tiene su lugar: `src/modules/tutors/{api/catalog.api.ts, hooks/useCareers.ts, useBasicSubjects.ts, useCareerSubjects.ts}` | **No se crea módulo nuevo**; se extienden esos archivos |
| La carrera viaja como **nombre** (`career: string`) en registro, edición de perfil, estado de navegación del rol dual y respuestas de perfil | Se mantiene `career` por nombre y se **agrega** `institutionId`; la carrera propia deja de buscarse por nombre normalizado |
| `useAvailableSubjects` y `useMySubjectsWithCatalogId` resuelven la carrera propia comparando nombres normalizados contra *todas* las carreras | Con dos instituciones con la misma carrera esa búsqueda es ambigua → usar `profile.careerId` / `profile.institutionId` (campos nuevos del backend) |
| El wizard de tutor ya tiene el switch **"Básica"** por materia (`isBasic`) y `SubjectOption.isBasic` | **Se conserva tal cual**: el backend deriva `isBasic` de la carrera compartida. Cero cambios de UX en ese switch |
| `FeedFiltersPanel` (comunidad) usa `useCareers()` sin parámetros | `useCareers` pasa a exigir institución → comunidad usa un endpoint propio (`/community/careers`) acotado al usuario |
| `getCareerIcon` ya contempla "Materias básicas" pero ningún dato se llama así | Agregar "Materias compartidas" al mapa de íconos |
| Ya existe un sistema Frankie (`docs/frankie.md`) | Estados vacíos, errores y avisos usan **Frankie** (ver 6) |

## 1. Stack y convenciones (de `docs/base-standards.md` y `CLAUDE.md`)

React 19 + TypeScript + Vite 6 · TanStack Query v5 · Zustand v5 · MUI v7 + Tailwind v4 · react-hook-form + zod 4 · Axios · Vitest + Testing Library.

- Alias `@/`; flujo `api/ → hooks/ → components|pages/`; HTTP solo en `api/` vía `@/shared/lib/httpClient`.
- Prettier: doble comilla, `;`, `printWidth: 100`, 2 espacios, `trailingComma: "es5"`. Sin `any`.
- Tipos de request/response en archivos individuales (`interfaces/requests|responses`), **sin barrels**, reflejando el contrato del backend.
- Toasts: `import { toast } from "@/shared/lib/toast"` (nunca `sonner` directo). Voseo, sin culpar.
- Schemas zod en `schemas/`, mensajes en español.

## 2. Contrato consumido (resumen; fuente: spec backend sección 6)

| Endpoint | Auth | Respuesta |
|---|---|---|
| `GET /api/v1/institutions` | pública | `[{ institutionId, name }]` |
| `GET /api/v1/careers?institutionId=` | pública | `[{ careerId, name }]` (nunca incluye la carrera compartida) |
| `GET /api/v1/subjects/basic?institutionId=` | pública | `[{ subjectId, name, isBasic: true }]` |
| `GET /api/v1/subjects?careerId=` | pública | `[{ subjectId, name, isBasic: false }]` (sin cambios) |
| `GET /api/v1/community/careers` | autenticada | `[{ careerId, name }]` de la institución del usuario |
| `POST /api/v1/auth/register/student`, `/register/tutor` | pública | request con `institutionId` nuevo (UUID, obligatorio); `career` sigue siendo el nombre |
| Respuestas de perfil propio (alumno y tutor) | autenticada | campos nuevos: `careerId`, `institutionId`, `institution` (nombre); se conserva `career` (nombre) |

Errores esperables: `404 CAREER_NOT_FOUND`, `404 INSTITUTION_NOT_FOUND`, `400` si falta `institutionId`. `GET /tutors/search/{query}` **no cambia**: el backend acota por la institución del usuario autenticado.

## 3. Capa de datos (`src/modules/tutors`)

### `api/catalog.api.ts`
```ts
export interface InstitutionOption { institutionId: string; name: string; }
// CareerOption y SubjectOption se mantienen (SubjectOption conserva isBasic)

export async function getInstitutions(): Promise<InstitutionOption[]>          // GET /api/v1/institutions
export async function getCareers(institutionId: string): Promise<CareerOption[]>       // params: { institutionId }
export async function getBasicSubjects(institutionId: string): Promise<SubjectOption[]> // params: { institutionId }
// getSubjectsByCareer(careerId) sin cambios
```

### `hooks/`
| Hook | Cambio |
|---|---|
| `useInstitutions.ts` (**nuevo**) | `queryKey: ["institutions"]`, `staleTime: 30 min` |
| `useCareers(institutionId?: string)` | `queryKey: ["careers", institutionId]`, `enabled: !!institutionId` |
| `useBasicSubjects(institutionId?: string)` | `queryKey: ["subjects", "basic", institutionId]`, `enabled: !!institutionId` |
| `useCareerSubjects(careerId?)` | sin cambios (ya tiene `enabled`) |

> Las query keys **deben** incluir `institutionId`: sin eso, al cambiar de institución en el registro se serviría la lista cacheada de la anterior.

## 4. Registro — tipos y schemas

| Archivo | Cambio |
|---|---|
| `auth/interfaces/requests/student-register.interface.ts` | `+ institutionId: string` |
| `auth/interfaces/requests/tutor-register.interface.ts` | `+ institutionId: string` (en `TutorRegisterRequest`) |
| `auth/schemas/user-register.schema.ts` → `studentAccountSchema` | `+ institutionId: z.string().min(1, "La institución es obligatoria")` |
| `auth/schemas/tutor-register.schema.ts` → `step1Schema` | ídem |

`StudentRegisterPage.handleSubmit` arma el request con `...data` (spread de `StudentAccountData`), así que `institutionId` viaja sin tocar esa página; solo hay que agregar el campo al tipo y al schema.

## 5. Componentes a modificar

### 5.1 Registro de alumno — `auth/components/student-register/StudentAccountForm.tsx`
- Nuevo `Select` **Institución\*** *antes* de Carrera (usa `useInstitutions()`), con `Controller name="institutionId"`.
- `const institutionId = watch("institutionId")`; `useCareers(institutionId)` (hoy en línea 62 `useCareers()` sin parámetros).
- Al cambiar la institución: `field.onChange(value)` + `setValue("career", "")` + `clearErrors("career")`.
- Select de carrera: `disabled={!institutionId || careersLoading}`; con institución sin elegir mostrar texto de ayuda **"Elegí tu institución primero"**.
- `MenuItem value={c.name}` de carrera se mantiene (valor = nombre).

### 5.2 Registro de tutor — Paso 1 — `auth/components/tutor-register/steps/Step1Account.tsx`
Idéntico a 5.1 (carrera en línea ~160, `useCareers()` en línea 37). `defaultValues.institutionId` debe rehidratarse al volver desde el paso 2.

### 5.3 Registro de tutor — Paso 2 — `steps/Step2AcademicProfile.tsx`
- Props: agregar `institutionId: string` (se conserva `career: string`).
- Eliminar `useCareers()` + `careers?.find(c => c.name === career)` (líneas ~67–68). Reemplazar por:
  - `const { data: careers } = useCareers(institutionId); const selectedCareer = careers?.find((c) => c.name === career);` (la búsqueda por nombre ahora es **dentro de una institución**, donde el nombre es único)
  - `useBasicSubjects(institutionId)`
- El switch "Básica" y la lógica por `isBasic` **no cambian**.

### 5.4 Wizard — `auth/components/tutor-register/TutorRegisterWizard.tsx`
- Pasar `institutionId={isDualRole ? dualRoleInstitutionId : step1Data.institutionId || ""}` a `Step2AcademicProfile`.
- Nueva prop `dualRoleInstitutionId?: string` (junto a `dualRoleCareer`).
- `handleConfirm`: incluir `institutionId: s1.institutionId` en el `registerTutor({...})`.
- El camino de rol dual (`activateTutorRole`) **no envía** institución: el backend la hereda de la carrera del perfil de alumno.

### 5.5 Rol dual
- `student/profile/pages/OwnProfilePage.tsx` (línea 55): `<TutorRoleCard ... career={profile.career} institutionId={profile.institutionId} />`.
- `student/dual-role/components/TutorRoleCard.tsx`: prop `institutionId?: string`; el `navigate("/auth/register/tutor", { state: { startAtStep: 2, career, institutionId } })`.
- `auth/pages/TutorRegisterPage.tsx` (línea 13): leer también `institutionId` de `location.state` y pasarlo como `dualRoleInstitutionId` al wizard.

### 5.6 Confirmación — `steps/Step4Confirmation.tsx` (línea ~65)
Agregar la línea **"Institución: {nombre}"** antes de "Carrera". El paso 1 guarda solo el id, así que resolver el nombre con `useInstitutions()` (`find` por id; si todavía no cargó, no mostrar la línea).

### 5.7 Materias del tutor con la carrera propia
- `tutor/availability/hooks/useAvailableSubjects.ts` (usado por `AddSubjectModal`, `AddSubjectButton`, `TutorProfilePage`): eliminar `useCareers()` y el cálculo de `ownCareer` por nombre normalizado. Usar:
  - `useBasicSubjects(profile?.institutionId)`
  - `useCareerSubjects(profile?.careerId)`
  - `normalizeName` se conserva **solo** para detectar materias ya cargadas (`existingSubjectIds`).
  - `isLoading`: sacar `careersLoading`.
- `tutor/materials/hooks/useMySubjectsWithCatalogId.ts`: mismo cambio (hoy líneas 27–34).
- Tipos del perfil propio de tutor: agregar `careerId: string; institutionId: string; institution: string` en `tutor/interfaces/TutorSelfProfileResponse.ts` y en `tutor/profile/interfaces/tutor-own-profile.interface.ts` (hay dos tipos; actualizar los que reflejen la respuesta de `useMyTutorProfile`, y notar que ese hook existe con dos rutas de import: `@/modules/tutor/hooks/useMyTutorProfile` y `@/modules/tutor/profile/hooks/useMyTutorProfile`).

### 5.8 Edición de perfil — `users/components/EditProfileForm.tsx`
- Props nuevas: `institutionId: string`, `institutionName: string` (**no** forman parte de `EditProfileFormValues` ni del request: la institución es inmutable en el MVP).
- `useCareers(institutionId)` (línea 78). La lógica de `careerOptions` que agrega la carrera actual si no está en la lista se conserva.
- Mostrar un campo **"Institución"** de solo lectura (`TextField disabled`) encima de Carrera.
- Pasar las props desde `student/profile/pages/StudentEditProfilePage.tsx` y `tutor/profile/pages/TutorEditProfilePage.tsx` (`profile.institutionId`, `profile.institution`).
- `UpdateStudentProfileRequest` / `UpdateTutorProfileRequest` **no cambian**.
- Tipo de perfil de alumno: `student/profile/interfaces/ownProfileInterface.ts` + `careerId`, `institutionId`, `institution`.

### 5.9 Comunidad
- `community/api/community.api.ts`: `getCommunityCareers(): Promise<CareerOption[]>` → `GET /api/v1/community/careers`.
- `community/constants/community-query-keys.ts`: agregar `careers: ["community", "careers"] as const`.
- `community/hooks/useCommunityCareers.ts` (**nuevo**): `useQuery` con esa key.
- `community/components/FeedFiltersPanel.tsx` (línea 132): reemplazar `useCareers()` por `useCommunityCareers()`. El resto del panel y `useCommunitySubjects` no cambian (el backend ya acota las materias por institución).

### 5.10 Íconos — `student/icons/career-icon.ts`
Agregar `["Materias compartidas", Sigma]` a `RAW_CAREER_ICONS`. Motivo: `MateriaResultCard` y `SearchResultsPanel` muestran `materia.career` e ícono por nombre de carrera; las materias compartidas pasan a informar "Materias compartidas" (antes mostraban el nombre de una carrera placeholder arbitraria).

### 5.11 Búsqueda (US-06 / US-49)
**Sin cambios de UI ni de API.** No agregar selector de institución al buscador ni enviar parámetro alguno: el alcance lo resuelve el backend con el usuario autenticado. `SearchResultsPanel` y `MateriaResultCard` solo *muestran* `materia.career` (no filtran), por lo que las materias compartidas no se ocultan.

## 6. UX con Frankie (`docs/frankie.md`)

- Estados de carga/vacío del selector de carreras y de materias: `FrankieEmptyState` (no texto suelto) cuando una institución no tenga carreras.
- Fallo al cargar instituciones: `FrankieErrorState` con botón de reintentar (el registro no puede continuar sin ese dato).
- Avisos por `toast` (voseo, sin culpar), p. ej. `404 CAREER_NOT_FOUND` → *"Esa carrera no pertenece a la institución elegida. Elegí otra."*
- **Un Frankie por situación**: no sumar uno donde ya hay otro en pantalla.

## 7. Tests (Vitest + Testing Library)

**Mocks existentes a actualizar** (mockean `useCareers` sin parámetros y rompen o dejan de ser fieles):
- `test/modules/student/StudentEditProfilePage.test.tsx`
- `test/modules/tutor/TutorEditProfilePage.test.tsx`
- `test/modules/users/EditProfileForm.test.tsx`
- `test/modules/tutor/TutorProfilePage.test.tsx` (mockea `useAvailableSubjects`; revisar que siga válido)

Agregar `institutionId`/`institutionName` a los perfiles *fixture* y a las props de `EditProfileForm`.

**Tests nuevos**
- `useCareers` / `useBasicSubjects`: no consultan sin `institutionId`; la query key cambia al cambiar de institución.
- Registro (alumno y tutor paso 1): carrera deshabilitada sin institución; cambiar la institución limpia la carrera; se envía `institutionId` en el request.
- `Step2AcademicProfile`: carga carreras y materias con la institución recibida; el switch "Básica" sigue usando las materias compartidas.
- `useAvailableSubjects` y `useMySubjectsWithCatalogId`: resuelven por `careerId` aun con dos carreras de igual nombre en instituciones distintas.
- `EditProfileForm`: muestra la institución en solo lectura y filtra carreras por ella.
- `FeedFiltersPanel`: usa `useCommunityCareers`.
- `getCareerIcon("Materias compartidas")` devuelve el ícono de materias básicas (Sigma), no el de respaldo.
- Rol dual: `TutorRoleCard` navega con `institutionId` en el state y `TutorRegisterPage` lo propaga.

## 8. Gherkin de aceptación

```gherkin
Feature: Institución en el registro y en el catálogo

  Scenario: La carrera depende de la institución
    Given el visitante abre el registro de alumno
    Then el select de carrera está deshabilitado
    And se lee "Elegí tu institución primero"

  Scenario: Elegir institución habilita sus carreras
    When el visitante elige "UNVM"
    Then el select de carrera muestra solo las carreras de "UNVM"

  Scenario: Cambiar de institución limpia la carrera
    Given eligió "UTN FRVM" y "Ingeniería Civil"
    When cambia la institución a "UNVM"
    Then la carrera queda vacía y se recargan las carreras de "UNVM"

  Scenario: La carrera compartida nunca se ofrece como carrera
    When el visitante abre el select de carrera de cualquier institución
    Then no aparece "Materias Compartidas"

  Scenario: El tutor ve materias de su carrera y las compartidas de su institución
    Given un tutor de "UTN FRVM" en "Ingeniería en Sistemas"
    When abre "Agregar materia"
    Then puede elegir materias de su carrera
    And, activando el switch "Básica", las compartidas de "UTN FRVM"
    And ninguna materia de otra institución

  Scenario: Dos instituciones con la misma carrera no se confunden
    Given "Ingeniería en Sistemas" existe en "UTN FRVM" y en "UNVM"
    When un tutor de "UNVM" abre "Agregar materia"
    Then solo ve materias de la carrera de "UNVM"

  Scenario: Rol dual conserva la institución
    Given un alumno de "UNVM"
    When activa el rol de tutor desde su perfil
    Then el flujo de tutor usa las carreras y materias de "UNVM"

  Scenario: Editar perfil no permite cambiar la institución
    When el usuario abre "Editar perfil"
    Then ve su institución en un campo de solo lectura
    And las carreras ofrecidas son solo las de esa institución

  Scenario: La búsqueda no tiene filtro de institución
    When un alumno abre el buscador
    Then no hay control de institución
    And los resultados corresponden a su institución
```

## 9. Advertencias de dependencia

1. **Orden de merge:** backend primero (migración SQL ejecutada y desplegado). Con el frontend nuevo contra el backend viejo, el registro falla (`/institutions` inexistente) y `useCareers(institutionId)` recibe una lista global.
2. **Rama base:** esta rama ya fusionó `dev`; el trabajo de Frankie (toasts, estados vacíos) está disponible y es el estándar a usar.
3. **`career` por nombre:** sigue siendo la clave de formularios y de estado de navegación; solo es único *dentro* de una institución. Nunca buscar una carrera por nombre en el conjunto global.
4. **Doble ruta de `useMyTutorProfile`:** existen imports a `@/modules/tutor/hooks/` y `@/modules/tutor/profile/hooks/`. No unificarlos en este PR.

## 10. No hacer

- No crear un módulo `catalog` nuevo ni mover los hooks de `modules/tutors`.
- No agregar selector ni parámetro de institución al buscador (US-06/US-49).
- No permitir elegir "Materias Compartidas" como carrera en ningún formulario.
- No hacer editable la institución en "Editar perfil" ni agregarla a los requests de actualización.
- No componer en el cliente carrera + compartidas con dos llamadas para el feed de comunidad: el backend ya acota.
- No buscar la carrera propia por nombre normalizado contra el catálogo global (usar `careerId`/`institutionId`).
- No mostrar el valor del enum ni ids al usuario.
- No importar `sonner` directo ni agregar un segundo Frankie en una pantalla que ya tiene uno.
- No tocar la lógica de reservas, materiales, reclamos ni pagos.

## 11. Fuera de alcance — decisiones abiertas

- Persistir la institución elegida entre sesiones del formulario (hoy solo vive en el estado del wizard).
- Pre-seleccionar la institución según el dominio del correo (fuera del MVP).
- Mostrar el nombre de la institución en el navbar/perfil público.
- Visibilidad de publicaciones de comunidad entre instituciones (decisión de producto pendiente, ver spec backend sección 13).

## 12. Definition of Done

- [ ] `getInstitutions`, `useInstitutions`; `getCareers`/`getBasicSubjects` y sus hooks parametrizados por `institutionId` con query keys correctas
- [ ] `institutionId` en interfaces y schemas de registro (alumno y tutor)
- [ ] `StudentAccountForm`, `Step1Account`: institución → carrera en cascada con reseteo
- [ ] `Step2AcademicProfile`, `TutorRegisterWizard`, `TutorRegisterPage`, `TutorRoleCard`, `OwnProfilePage`: institución propagada (incluye rol dual)
- [ ] `Step4Confirmation` muestra la institución
- [ ] `useAvailableSubjects` y `useMySubjectsWithCatalogId` usan `careerId`/`institutionId` del perfil
- [ ] `EditProfileForm` con institución de solo lectura y carreras acotadas
- [ ] Comunidad: `useCommunityCareers` + `FeedFiltersPanel`
- [ ] `career-icon.ts` con "Materias compartidas"
- [ ] Interfaces de perfil propio (alumno y tutor) con los campos nuevos
- [ ] Mocks de tests existentes actualizados + tests nuevos de la sección 7
- [ ] `npm run type-check`, `npm run lint`, `npm run format:check` y `npm run test` sin errores
- [ ] Verificación manual: registro de alumno y tutor con las dos instituciones; rol dual; edición de perfil; buscador sin control de institución
