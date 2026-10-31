# US-53 — Editar materia ofrecida (Frontend)

> Spec generado a partir de la exploración real de `TetraCodeTeam/knowlink-frontend`, rama `dev` (commit `2503308`). Pensado para ejecutarse con **OpenCode + DeepSeek V4 Flash**: pasos literales, rutas exactas y verificación por paso. No improvises fuera de lo que dice este documento.

## Antes de empezar (obligatorio)

1. Leer `AGENTS.md` y `docs/base-standards.md` del repo (flujo `api/ → hooks/ → components/`, alias `@/`, react-hook-form + zodResolver, sonner, Prettier).
2. Crear la rama desde `dev`: `git checkout dev && git pull && git checkout -b feat/edit-tutor-subject`.
3. `npm ci` y correr la línea base **antes de tocar nada**: `npm run type-check && npm run lint && npm run test`. Si algo ya falla, anotarlo y NO arreglarlo en esta historia.
4. Trabajar en este orden exacto: **interfaz → api → hook → schema/utils → componente → integración en la página → tests**.

## Metadata

| Campo | Valor |
|---|---|
| ID Historia | US-53 |
| Épica | — |
| Story Points | 3 |
| Prioridad | Baja |
| Repo / rama | `knowlink-frontend`, rama `feat/edit-tutor-subject` (base = `dev`) |
| Relacionadas | US-48 (registrar materia), US-25 (validación — el estado se conserva), US-38 (perfil tutor) |
| Spec hermano | `us-53-editar-materia-backend.spec.md` (repo `knowlink-backend`) |
| Dependencia | Endpoint `PUT /api/v1/tutors/subjects/{tutorSubjectId}` (spec backend). Mientras no esté desplegado, los tests mockean la capa `api/` |

## Historia de usuario

Como tutor, quiero poder modificar el precio y la modalidad de una materia que ya registré, para ajustar mi oferta cuando cambian mis condiciones de disponibilidad o mis tarifas.

## Alcance frontend

| CA | Qué implementa el frontend |
|---|---|
| 1 | Ícono de editar en cada materia de la pestaña "Materias" del perfil del tutor, que abre el modal de edición |
| 2 | Switch "Gratis" + campo de precio (numérico, > 0 si es pago) |
| 3 | Chips Virtual / Presencial seleccionables (una o ambas, mínimo una) |
| 4 | El nombre de la materia se muestra **deshabilitado** (no editable) |
| 5 | Tras guardar se invalida la query `["myTutorProfile"]` → el perfil se refresca al instante |
| 6 | Campo inválido resaltado en rojo con mensaje + botón "Guardar" deshabilitado hasta corregir |
| 7 | Sin lógica en el front: las reservas confirmadas las resguarda el backend. Mostrar un aviso informativo en el modal |

## Criterios de aceptación (Gherkin)

```gherkin
Feature: Editar materia ofrecida

  Background:
    Given el tutor está autenticado y está en su perfil, pestaña "Materias"

  Scenario: Abrir la edición
    When hace clic en el ícono de editar de una materia
    Then se abre un modal "Editar materia" con los valores actuales precargados
    And el nombre de la materia aparece deshabilitado

  Scenario: Modificar precio y modalidad
    Given el modal está abierto con una materia paga de modalidad Virtual
    When cambia el precio a 8000 y selecciona también Presencial y presiona "Guardar cambios"
    Then se envía PUT con { modality: "BOTH", compensationType: "PAID", pricePerHour: 8000 }
    And el modal se cierra, se muestra el toast "Materia actualizada correctamente."
    And la tarjeta de la materia muestra el nuevo precio y ambas modalidades sin recargar la página

  Scenario: Pasar a gratuito
    When activa el switch "Gratis"
    Then el campo de precio se deshabilita
    And "Guardar cambios" queda habilitado
    And se envía { compensationType: "FREE", pricePerHour: null }

  Scenario: Precio inválido
    Given la materia es paga
    When deja el precio vacío, en 0, negativo o no numérico
    Then el campo de precio se resalta en rojo con su mensaje
    And "Guardar cambios" queda deshabilitado hasta corregirlo

  Scenario: Sin modalidad
    When desselecciona Virtual y Presencial
    Then se muestra el mensaje "Seleccioná al menos una modalidad" y los chips se resaltan en error
    And "Guardar cambios" queda deshabilitado

  Scenario: Error del servidor
    When el backend responde 4xx/5xx
    Then el modal permanece abierto con los datos ingresados
    And se muestra el mensaje de error que devuelve el backend (lo muestra el interceptor de httpClient)

  Scenario: Cancelar
    When presiona "Cancelar" o la X
    Then el modal se cierra sin enviar nada
```

## Hechos verificados en el código (no re-investigar)

- **Módulo existente**: `src/modules/tutor/`. La pestaña "Materias" está en `src/modules/tutor/profile/components/TutorProfilePage.tsx` (tab índice `1`), que renderiza un `SubjectCard` por materia en una grilla y un bloque "+ Agregar materia".
- **`SubjectCard`** (`src/modules/tutor/profile/components/SubjectCard.tsx`): solo lectura, recibe `{ subject: TutorOwnSubject }`. Hoy NO tiene ícono de editar. Solo se usa en `TutorProfilePage`.
- **`TutorOwnSubject`** (`src/modules/tutor/profile/interfaces/tutor-own-profile.interface.ts`): `{ tutorSubjectId, subjectName, averageRating, reviewCount, modality: "VIRTUAL"|"IN_PERSON"|"BOTH", compensationType: "FREE"|"PAID", pricePerHour: number|null, verificationStatus }`. **Ya trae `tutorSubjectId`**, no hace falta cambiar el backend de lectura.
- **Modal de alta** como referencia visual: `src/modules/tutor/components/AddSubjectModal.tsx` (MUI `Dialog` `maxWidth="xs"`, `ModalityChip` como selector con `selected`/`onClick`, `Switch` "Gratis", `AppButton` Cancelar/Agregar, aviso de Mercado Pago). **Copiar su estructura visual, NO su implementación**: usa `useState` sueltos y sin Zod, lo cual va contra los estándares. El modal nuevo usa react-hook-form + Zod.
- **Tipos de request reutilizables**: `ModalityRequest` y `CompensationTypeRequest` en `src/modules/tutor/interfaces/TutorSubjectRequest.ts`.
- **API existente**: `src/modules/tutor/api/Tutorsubject.api.ts` (funciones `getMyTutorProfile`, `createTutorSubject`, con `httpClient`). Ahí se agrega la nueva función.
- **Hook de alta como referencia de estilo**: `src/modules/tutor/hooks/Usecreatetutorsubject.ts` (`useMutation` + `invalidateQueries({ queryKey: ["myTutorProfile"] })` + `toast` de `sonner`).
- **Query key del perfil propio**: `["myTutorProfile"]`, compartida por las dos `useMyTutorProfile` (`tutor/hooks/` y `tutor/profile/hooks/`). Invalidar esa key refresca la página.
- **Errores**: `httpClient` (`src/shared/lib/httpClient.ts`) ya muestra un toast de error con el `message` del backend en cada respuesta fallida. Por eso el hook nuevo **NO agrega `onError` con toast** (se duplicaría el mensaje; el hook de alta sí lo duplica, no lo copies).
- **Componentes compartidos disponibles**: `AppButton` (`@/shared/components/AppButton`, props `appVariant="primary"|"outline"`, `loading`), `ModalityChip` (`@/modules/tutor/profile/components/ModalityChip`, tipo `Modality = "VIRTUAL" | "IN_PERSON"`).
- **Íconos**: preferir `lucide-react` (ya usado en `ModalityChip` y en `TutorProfilePage`).
- **Zod 4** (`^4.1.12`), `react-hook-form ^7.63`, `@hookform/resolvers ^5.2`.
- **Tests**: Vitest + Testing Library con globals; los tests viven en `test/modules/<modulo>/` en la **raíz** del repo (no junto al código), p. ej. `test/modules/attendance/…`. Setup en `test/setup.ts`.
- **Ejemplo de schema**: `src/modules/support/schemas/claimComment.schema.ts` (`z.object(...)` + `export type XFormValues = z.infer<typeof xSchema>`). Los archivos de schema del repo se nombran `<nombre>.schema.ts`; por eso el nuevo se llama `editSubject.schema.ts`.

## Contrato con el backend

```
PUT /api/v1/tutors/subjects/{tutorSubjectId}
Body: { "modality": "VIRTUAL"|"IN_PERSON"|"BOTH",
        "compensationType": "FREE"|"PAID",
        "pricePerHour": number | null }
200 → TutorSubjectResponse (misma forma que la del alta)
400/404/403 → { status, message, detail }
```

El body **no incluye** `subjectName`.

## Archivos a crear / modificar

| # | Acción | Archivo |
|---|---|---|
| 1 | CREAR | `src/modules/tutor/interfaces/UpdateTutorSubjectRequest.ts` |
| 2 | MODIFICAR | `src/modules/tutor/api/Tutorsubject.api.ts` |
| 3 | CREAR | `src/modules/tutor/hooks/useUpdateTutorSubject.ts` |
| 4 | CREAR | `src/modules/tutor/schemas/editSubject.schema.ts` |
| 5 | CREAR | `src/modules/tutor/utils/editSubject.utils.ts` |
| 6 | CREAR | `src/modules/tutor/components/EditSubjectModal.tsx` |
| 7 | MODIFICAR | `src/modules/tutor/profile/components/SubjectCard.tsx` |
| 8 | MODIFICAR | `src/modules/tutor/profile/components/TutorProfilePage.tsx` |
| 9 | CREAR | tests bajo `test/modules/tutor/` (ver sección Tests) |

### 1. Interfaz del request (CREAR)

```ts
import type {
  CompensationTypeRequest,
  ModalityRequest,
} from "@/modules/tutor/interfaces/TutorSubjectRequest";

export interface UpdateTutorSubjectRequest {
  modality: ModalityRequest;
  compensationType: CompensationTypeRequest;
  pricePerHour: number | null;
}
```

### 2. API (MODIFICAR `Tutorsubject.api.ts`)

Agregar (y el import del tipo nuevo) sin tocar las funciones existentes:

```ts
export async function updateTutorSubject(
  tutorSubjectId: string,
  request: UpdateTutorSubjectRequest
): Promise<TutorSubjectResponse> {
  const response = await httpClient.put<TutorSubjectResponse>(
    `/api/v1/tutors/subjects/${tutorSubjectId}`,
    request
  );
  return response.data;
}
```

### 3. Hook (CREAR `useUpdateTutorSubject.ts`)

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateTutorSubject } from "@/modules/tutor/api/Tutorsubject.api";
import type { UpdateTutorSubjectRequest } from "@/modules/tutor/interfaces/UpdateTutorSubjectRequest";

interface UpdateTutorSubjectVariables {
  tutorSubjectId: string;
  request: UpdateTutorSubjectRequest;
}

export function useUpdateTutorSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-tutor-subject"],
    mutationFn: ({ tutorSubjectId, request }: UpdateTutorSubjectVariables) =>
      updateTutorSubject(tutorSubjectId, request),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["myTutorProfile"] });
      toast.success("Materia actualizada correctamente.");
    },
    // Sin onError: el interceptor de httpClient ya muestra el mensaje del backend.
  });
}
```

### 4. Schema Zod (CREAR `schemas/editSubject.schema.ts`)

Valores del formulario: `isFree`, `pricePerHour` (string, porque viene de un `<input type="number">`), `virtualSelected`, `inPersonSelected`. Validación cruzada con `superRefine`:

```ts
import { z } from "zod";

const PRICE_FORMAT = /^\d{1,8}(\.\d{1,2})?$/;

export const editSubjectSchema = z
  .object({
    isFree: z.boolean(),
    pricePerHour: z.string(),
    virtualSelected: z.boolean(),
    inPersonSelected: z.boolean(),
  })
  .superRefine((values, ctx) => {
    if (!values.isFree) {
      const raw = values.pricePerHour.trim();
      const parsed = Number(raw);

      if (raw === "") {
        ctx.addIssue({ code: "custom", path: ["pricePerHour"], message: "Ingresá el precio por hora" });
      } else if (!Number.isFinite(parsed)) {
        ctx.addIssue({ code: "custom", path: ["pricePerHour"], message: "Ingresá un valor numérico válido" });
      } else if (parsed <= 0) {
        ctx.addIssue({ code: "custom", path: ["pricePerHour"], message: "El precio debe ser mayor a cero" });
      } else if (!PRICE_FORMAT.test(raw)) {
        ctx.addIssue({
          code: "custom",
          path: ["pricePerHour"],
          message: "Usá hasta 8 dígitos enteros y 2 decimales",
        });
      }
    }

    if (!values.virtualSelected && !values.inPersonSelected) {
      // Se cuelga de "virtualSelected" para que errors.virtualSelected quede tipado.
      ctx.addIssue({
        code: "custom",
        path: ["virtualSelected"],
        message: "Seleccioná al menos una modalidad",
      });
    }
  });

export type EditSubjectFormValues = z.infer<typeof editSubjectSchema>;
```

(Respetar Prettier: líneas ≤ 100 caracteres; reformatear los `addIssue` largos en varias líneas.)

### 5. Utils (CREAR `utils/editSubject.utils.ts`)

Funciones puras:

- `toEditSubjectFormValues(subject: TutorOwnSubject): EditSubjectFormValues`
  - `isFree = subject.compensationType === "FREE"`
  - `pricePerHour = isFree || subject.pricePerHour == null ? "" : String(subject.pricePerHour)`
  - `virtualSelected = subject.modality === "VIRTUAL" || subject.modality === "BOTH"`
  - `inPersonSelected = subject.modality === "IN_PERSON" || subject.modality === "BOTH"`
- `toUpdateTutorSubjectRequest(values: EditSubjectFormValues): UpdateTutorSubjectRequest`
  - `modality`: ambos → `"BOTH"`, solo virtual → `"VIRTUAL"`, solo presencial → `"IN_PERSON"` (el schema garantiza al menos uno; si ninguno, lanzar `Error`).
  - `compensationType = isFree ? "FREE" : "PAID"`
  - `pricePerHour = isFree ? null : Number(values.pricePerHour.trim())`

Importar `TutorOwnSubject` desde `@/modules/tutor/profile/interfaces/tutor-own-profile.interface`.

### 6. Componente `EditSubjectModal` (CREAR)

Props: `{ subject: TutorOwnSubject; onClose: () => void }`. El `Dialog` va siempre `open` (el padre lo monta/desmonta, ver paso 8) para no necesitar `useEffect` de reseteo.

Estructura (mismo look que `AddSubjectModal`: `Dialog fullWidth maxWidth="xs"`, `DialogTitle` con X, `Divider`, `DialogContent`, `DialogActions`):

1. **Título**: "Editar materia" + `IconButton` con `CloseIcon` (`aria-label="Cerrar"`).
2. **Materia** (CA 4): `TextField` con `value={subject.subjectName}`, `disabled`, `fullWidth`, label "Materia" y `helperText="El nombre de la materia no se puede modificar."`.
3. **Precio por hora** (CA 2): `FormControlLabel` + `Switch` "Gratis" (`isFree`) y `TextField type="number"` (`pricePerHour`), `disabled={isFree}`, `error={!!errors.pricePerHour}`, `helperText={errors.pricePerHour?.message}`, `inputProps={{ min: 0, step: "0.01" }}`, `aria-label="Precio por hora"`.
4. **Modalidad** (CA 3): dos `ModalityChip` (`modality="VIRTUAL"` y `"IN_PERSON"`) con `selected` y `onClick` que alternan `virtualSelected` / `inPersonSelected`. Debajo, si `errors.virtualSelected` existe, un `Typography` con `color="error"` y el mensaje. Cuando hay error, envolver los chips en un `Box` con borde rojo (`border: "1px solid"`, `borderColor: "error.main"`) para resaltarlos.
5. **Aviso CA 7**: `Typography` secundario: "Los cambios no afectan las reservas ya confirmadas: se mantienen con las condiciones anteriores."
6. **Acciones**: `AppButton appVariant="outline"` "Cancelar" (`disabled={isPending}`) y `AppButton appVariant="primary"` "Guardar cambios" con `loading={isPending}` y **`disabled={!isValid || isPending}`** (CA 6).

Formulario:

```ts
const {
  handleSubmit,
  register,
  setValue,
  watch,
  trigger,
  formState: { errors, isValid },
} = useForm<EditSubjectFormValues>({
  resolver: zodResolver(editSubjectSchema),
  mode: "onChange",
  defaultValues: toEditSubjectFormValues(subject),
});
```

- Importar `useForm` de `react-hook-form` y `zodResolver` de `@hookform/resolvers/zod`.
- `const [isFree, virtualSelected, inPersonSelected] = watch(["isFree", "virtualSelected", "inPersonSelected"]);`
- El `TextField` de precio usa `{...register("pricePerHour")}`.
- Al cambiar el Switch o un chip: `setValue("<campo>", nuevoValor, { shouldDirty: true })` y luego `void trigger()` (la regla es cruzada entre campos, hay que revalidar todo el formulario).
- Submit: `handleSubmit((values) => mutate({ tutorSubjectId: subject.tutorSubjectId, request: toUpdateTutorSubjectRequest(values) }, { onSuccess: onClose }))`.
- `handleClose`: no cierra si `isPending`.
- Hook: `const { mutate, isPending } = useUpdateTutorSubject();`

Reglas de estilo: `sx` de MUI (no `style={{}}`), sin `any`, imports con `@/`, doble comilla, punto y coma, 2 espacios, `printWidth` 100.

### 7. `SubjectCard` (MODIFICAR)

- Agregar prop opcional `onEdit?: (subject: TutorOwnSubject) => void`.
- Si `onEdit` está definido, mostrar a la derecha del título un `IconButton` con el ícono `Pencil` de `lucide-react` (`size={20}`), `aria-label={`Editar materia ${subject.subjectName}`}` y `onClick={() => onEdit(subject)}`.
- Para ubicarlo: envolver el `Typography` del título en un `Box` `display: "flex"`, `justifyContent: "space-between"`, `alignItems: "flex-start"`. Conservar el `mb` y estilos actuales del título; no cambiar nada más de la tarjeta.

### 8. `TutorProfilePage` (MODIFICAR)

- Importar `EditSubjectModal` y `type TutorOwnSubject`.
- Estado: `const [editingSubject, setEditingSubject] = useState<TutorOwnSubject | null>(null);` (junto a los otros `useState`, **antes** de los `return` condicionales de loading/error para respetar las reglas de hooks).
- En el `.map` de la pestaña "Materias": `<SubjectCard key={subject.tutorSubjectId} subject={subject} onEdit={setEditingSubject} />`.
- Al final del JSX, junto a `AddSubjectModal`:

```tsx
{editingSubject && (
  <EditSubjectModal
    key={editingSubject.tutorSubjectId}
    subject={editingSubject}
    onClose={() => setEditingSubject(null)}
  />
)}
```

- No modificar el resto de la página ni `AddSubjectModal`.

## Tests (CREAR en `test/modules/tutor/`)

Seguir el estilo de `test/modules/attendance/*.test.ts(x)`: `import { describe, it, expect, vi } from "vitest"`, imports con `@/`, textos de `it(...)` en español.

1. **`editSubject.schema.test.ts`** (puro):
   - paga + precio `"8000"` → válido
   - paga + `""`, `"0"`, `"-5"`, `"abc"`, `"10.999"`, `"123456789"` → inválido, error en `pricePerHour`
   - gratis + `""` → válido
   - ninguna modalidad → inválido, error en `virtualSelected` con "Seleccioná al menos una modalidad"
2. **`editSubject.utils.test.ts`** (puro): `toEditSubjectFormValues` para `VIRTUAL`, `IN_PERSON`, `BOTH`, `FREE` (precio vacío); `toUpdateTutorSubjectRequest` para los 4 caminos (`BOTH`, `VIRTUAL`, `IN_PERSON`, `FREE` → `pricePerHour: null`).
3. **`SubjectCard.test.tsx`**: sin `onEdit` no hay botón de editar; con `onEdit` hay un botón `Editar materia <nombre>` y al hacer clic llama a `onEdit` con la materia.
4. **`EditSubjectModal.test.tsx`** (Testing Library + `userEvent`): envolver en `QueryClientProvider`; `vi.mock("@/modules/tutor/api/Tutorsubject.api")` para `updateTutorSubject`; `vi.mock("sonner")`.
   - muestra los valores precargados y el campo del nombre está deshabilitado
   - "Guardar cambios" habilitado con datos válidos
   - precio `0` → botón deshabilitado y mensaje "El precio debe ser mayor a cero"
   - desmarcar ambas modalidades → botón deshabilitado y mensaje "Seleccioná al menos una modalidad"
   - activar "Gratis" → el input de precio queda deshabilitado y el botón habilitado
   - envío válido llama a `updateTutorSubject` con `(tutorSubjectId, { modality, compensationType, pricePerHour })` correctos y luego a `onClose`

## No hacer

- No modificar `AddSubjectModal` ni `AddSubjectButton`.
- No permitir editar el nombre de la materia ni enviar `subjectName`.
- No llamar `axios`/`httpClient` desde componentes: todo por `api/ → hooks/ → components/`.
- No usar `useEffect` para precargar o resetear el formulario (se resuelve con `defaultValues` + `key`).
- No agregar `onError` con toast en el hook (duplicaría el interceptor).
- No usar `any`, ni `style={{}}`, ni rutas relativas largas (usar `@/`).
- No agregar la lógica de "reservas confirmadas" en el front: es responsabilidad del backend.
- No tocar la vista pública del tutor (`modules/student/tutorProfile`) ni la búsqueda del alumno.
- No crear componentes en `shared/` (solo los usa este módulo).
- No agregar dependencias nuevas.

## Limitación conocida (informar, no resolver)

CA 5 exige que el cambio se vea "de inmediato" en perfil y búsqueda. El backend no cachea, así que cualquier consulta posterior ya trae los datos nuevos; en este front se refresca el perfil del propio tutor (`["myTutorProfile"]`). Los clientes de otros usuarios (alumnos) verán el cambio en su próxima carga de datos, según el `staleTime` de sus queries. No se invalidan queries de otros módulos desde este módulo.

## Verificación (correr y pegar el resultado)

```bash
npx prettier --write <archivos creados/modificados>   # respetar .prettierrc.json
npm run format:check
npm run lint
npm run type-check
npm run test
npm run build
```

Chequeo manual (con el backend de US-53 corriendo): perfil del tutor → pestaña Materias → ícono de editar → modal con valores precargados → cambiar precio/modalidad → "Guardar cambios" → el modal se cierra y la tarjeta se actualiza sin recargar.

## Commits (convención del repo, descripción en español)

```
feat: agrega edición de precio y modalidad de materia del tutor
test: agrega tests de edición de materia del tutor
```

## Definition of Done

- [ ] Ícono de editar en cada materia de la pestaña "Materias" que abre el modal con valores actuales
- [ ] Se puede cambiar gratis/pago y precio (> 0 si es pago) y modalidad (≥ 1)
- [ ] Nombre de la materia visible pero deshabilitado; no se envía en el request
- [ ] Campo inválido resaltado con mensaje y "Guardar cambios" deshabilitado hasta corregir
- [ ] Al guardar: PUT correcto, toast de éxito, modal cerrado y perfil refrescado sin recargar
- [ ] Error del servidor: modal abierto con datos conservados y mensaje del backend
- [ ] Aviso en el modal sobre reservas ya confirmadas
- [ ] Formulario con react-hook-form + zodResolver (schema en `schemas/`), sin `any`, sin `useEffect` para datos
- [ ] Tests nuevos en verde; `lint`, `type-check`, `format:check`, `test` y `build` sin regresiones
- [ ] Code review aprobado
