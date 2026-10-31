# US-17 — Eliminar material propio (Frontend)

> Spec generado a partir de la exploración real de `knowlink-frontend`, rama `feature/delete-subject` (commit `2503308`). Reemplaza el borrador anterior, que asumía que no existía módulo de materiales. Hoy el módulo existe en `src/modules/tutor/materials` y la UI del tutor está montada.

## Metadata

| Campo | Valor |
|---|---|
| ID Historia | US-17 |
| Story Points | 1 (compartido con backend) |
| Prioridad | Baja |
| Rol | `TUTOR` |
| Módulo frontend | `tutor/materials` (`src/modules/tutor/materials`) — **existente, no crear `modules/materials`** |
| Pantalla | `TutorProfilePage` → pestaña "Recursos" → `MaterialsSection` |
| Repo / rama base | `TetraCodeTeam/knowlink-frontend` / `feature/delete-subject` (commit `2503308`) |
| Relacionadas | US-16 (subida/listado, ya implementado), US-26 (acceso del alumno — **no** se toca), US-27 (denuncia), US-23 (baja por admin — fuera de alcance) |
| Backend | `knowlink-backend/docs/us-17-eliminar-material-propio-backend.spec.md` — `DELETE /api/v1/materials/{id}` |

## Antes de empezar (obligatorio)

1. Leer `AGENTS.md` y `docs/base-standards.md`. Ante conflicto manda `base-standards.md`.
2. Correr la línea base **antes de tocar nada**: `npm run test`, `npm run lint`, `npm run type-check`. Si algo ya está rojo, anotarlo y no arreglarlo en esta historia.
3. Trabajar en una rama propia: `git checkout dev && git pull && git checkout -b feat/delete-own-material` (o la rama de la historia si ya existe).
4. Este spec **no** implementa backend. El endpoint se desarrolla en `knowlink-backend` con la spec hermana; acá solo se consume.
5. Respetar el flujo obligatorio `api/ → hooks/ → components/`. Nada de `httpClient` en componentes.

## Historia

Como tutor, quiero poder eliminar materiales que yo mismo subí, para mantener mi repositorio actualizado y retirar contenido desactualizado o incorrecto.

## Criterios de aceptación (frontend)

El frontend es dueño del **AC1** (confirmación y cancelación). El **AC2** (el material y el archivo desaparecen de verdad) lo garantiza el backend; el frontend solo debe refrescar el listado para que el ítem desaparezca.

```gherkin
Feature: Eliminar material propio

  Background:
    Given un tutor autenticado en la pestaña "Recursos" de su perfil

  Scenario: Cada material propio tiene una acción de eliminar
    Given el tutor ve el listado de sus materiales
    Then cada fila tiene un botón con aria-label "Eliminar {nombre del archivo}"
    And el botón no aparece en la vista del alumno ni en perfiles públicos

  Scenario: Confirmación antes de eliminar
    When el tutor hace clic en "Eliminar Resumen Unidad 3 - Derivadas.pdf"
    Then se abre un diálogo con el título "Eliminar material"
    And el cuerpo dice "¿Estás seguro de que querés eliminar permanentemente Resumen Unidad 3 - Derivadas.pdf?"
    And el diálogo tiene los botones "Cancelar" y "Eliminar"
    And todavía NO se llamó al backend

  Scenario: Cancelar no elimina nada
    Given el diálogo de confirmación está abierto
    When el tutor hace clic en "Cancelar", presiona Esc o hace clic afuera
    Then el diálogo se cierra
    And no se envía ningún DELETE
    And el material sigue en el listado

  Scenario: Confirmar elimina el material
    Given el diálogo de confirmación está abierto
    When el tutor hace clic en "Eliminar"
    Then se envía DELETE /api/v1/materials/{id}
    And mientras la request está en curso ambos botones quedan deshabilitados
    And al responder 204 el diálogo se cierra, se muestra "Material eliminado correctamente." y el material desaparece del listado sin recargar la página

  Scenario: El material tiene denuncias asociadas
    Given el material tiene al menos una denuncia registrada
    When el tutor confirma la eliminación
    Then el backend responde 409 con detail "MATERIAL_HAS_REPORTS"
    And se muestra el mensaje del backend ("No podés eliminar un material con denuncias asociadas.")
    And el diálogo se cierra y el material sigue en el listado

  Scenario: Falla el almacenamiento
    Given el backend responde 502 con detail "STORAGE_ERROR"
    When el tutor confirma la eliminación
    Then se muestra el mensaje del backend
    And el diálogo queda abierto con los botones habilitados para reintentar
    And el material sigue en el listado

  Scenario: El material ya no existe
    Given el material fue eliminado en otra pestaña
    When el tutor confirma la eliminación
    Then el backend responde 404 con detail "MATERIAL_NOT_FOUND"
    And se muestra el mensaje del backend
    And el diálogo se cierra y el listado se refresca
```

## Estado actual verificado (no re-investigar)

| Elemento | Estado real en `feature/delete-subject` |
|---|---|
| `src/modules/tutor/materials/` | Ya existe con `api/`, `components/`, `constants/`, `hooks/`, `interfaces/`, `styles/`, `utils/`. **No** crear un módulo nuevo en `src/modules/materials`. |
| `api/materials.api.ts` | Expone `getMaterialsBySubject(subjectId)` y `uploadMaterial(data)`. **No existe `deleteMaterial`.** |
| `interfaces/material.interface.ts` | `Material { id, name, originalFileName, tutorId, tutorName, subjectId, subjectName, format, downloadUrl, uploadedAt, sizeInBytes }` y `CreateMaterialRequest`. No tiene `reportsCount` ni `alreadyReported`. |
| `MaterialResponse` (backend) | Sí devuelve `reportsCount` y `alreadyReported`, pero `MaterialServiceImpl.listBySubject` los calcula solo para `ADMIN` (`includeReportsCount = role == ADMIN`). Para `TUTOR` siempre llega `reportsCount = 0`, así que **no se puede pre-deshabilitar** el botón por denuncias desde el listado. |
| `components/MaterialCard.tsx` | Solo muestra ícono + nombre (`name` + extensión de `originalFileName`). Es la fila del listado y se usa **únicamente** en `MaterialsSection`. |
| `components/MaterialsSection.tsx` | Único consumidor: `TutorProfilePage` (pestaña "Recursos"). Filtra por materia, usa `useGetMaterials` + `useMySubjectsWithCatalogId` y abre `UploadMaterialDialog`. **No tiene estado de borrado.** |
| `hooks/useGetMaterials.ts` | `useQueries` con `queryKey: ["materials", subjectId]` y `staleTime` de 5 min. |
| `hooks/useUploadMaterial.ts` | Patrón del módulo para mutaciones: `mutationKey`, `mutationFn`, `onSuccess` que invalida `["materials"]`, y retorna `{ uploadMaterial: mutation.mutateAsync, isPending }`. |
| `shared/components/AppConfirmDialog.tsx` | Ya existe y se usa en el admin (`RemoveMaterialDialog`). Props: `open`, `title`, `message`, `severity` (`warning | danger`), `confirmLabel`, `cancelLabel`, `content`, `onConfirm`, `onCancel`, `isPending`. Con `isPending` deshabilita ambos botones y el `cancel` del botón; el Esc/backdrop llama `onCancel` **sin** chequear `isPending`. |
| `shared/lib/httpClient.ts` | El interceptor ya muestra un toast de error con `data.message ?? data.detail` y hace logout en 401. **No duplicar el toast de error.** |
| Toasts | Se usa `toast` de `sonner` directo en hooks (ver `useRemoveMaterial`) y en diálogos (`UploadMaterialDialog`). |
| Tests | Viven en `test/modules/...` espejando `src/`, **no** en `__tests__/` colocados. `test/setup.ts` ya configura `jest-dom`, `ResizeObserver` y `matchMedia`. |
| Scripts | `npm run test`, `npm run lint` (con `--max-warnings 0`), `npm run format:check`, `npm run type-check`. |
| Estilos | MUI + `sx`. **Tailwind no está instalado**; no agregarlo. |
| `MaterialCard` ya muestra | `{name}.{extensión en minúsculas}`. La confirmación debe mostrar exactamente ese mismo string para no confundir al usuario. |

## Contrato backend que consume

| Método | Path | Éxito | Errores relevantes |
|---|---|---|---|
| `DELETE` | `/api/v1/materials/{id}` | `204 No Content` sin cuerpo | `401`, `403` (`ACCESS_DENIED`), `404` (`MATERIAL_NOT_FOUND`), `409` (`MATERIAL_HAS_REPORTS`), `502` (`STORAGE_ERROR`) |

Formato de error (`ApiError`): `{ "status": number, "message": string, "detail": string }`.

| Status | `detail` | Mensaje que muestra el interceptor |
|---|---|---|
| 403 | `ACCESS_DENIED` | `No tenés permiso para eliminar este material` |
| 404 | `MATERIAL_NOT_FOUND` | `El material no existe.` |
| 409 | `MATERIAL_HAS_REPORTS` | `No podés eliminar un material con denuncias asociadas.` |
| 502 | `STORAGE_ERROR` | `No se pudo comunicar con el almacenamiento de archivos. Intentá nuevamente más tarde.` |

> El `403` por rol (`STUDENT`/`ADMIN`) lo emite Spring Security antes del método y puede no traer `ApiError`; en ese caso el interceptor cae al texto genérico. No hay que hacer nada especial: el botón solo se renderiza en la vista del tutor.

## Decisiones de diseño

1. **Reutilizar `AppConfirmDialog`** (`severity="danger"`) en vez de crear un `Dialog` desde cero. Ya tiene el layout, el ícono y el estado `isPending` resueltos, y es el mismo patrón que usa el admin para dar de baja material.
2. **Un único diálogo** en `MaterialsSection` con `materialToDelete: Material | null`, no uno por fila.
3. **El nombre del mensaje** es el que ve el usuario en la fila (`name` + extensión). Se extrae a `getMaterialDisplayName()` para que `MaterialCard` y el diálogo no dupliquen la lógica.
4. **Sin eliminación optimista**: el borrado es permanente; el ítem desaparece recién cuando el backend confirma e invalida la query.
5. **El hook no muestra toast de error**: lo hace el interceptor. Sí muestra el toast de éxito.
6. **`invalidateQueries({ queryKey: ["materials"] })`** (prefijo), igual que `useUploadMaterial`; refresca todas las queries por materia sin conocer el `subjectId`.
7. **Sin `reportsCount` en la UI**: el backend no lo expone al tutor (llega `0`), así que no se puede deshabilitar el botón antes de intentar. El caso de denuncias se resuelve con el `409`.
8. **No se toca el módulo `student/tutorProfile`**: el alumno no ve ni puede ejecutar esta acción. Tampoco se toca `support` (historial de denuncias del tutor) ni `admin/material-reports` (baja por admin, que es un soft delete distinto).

## Archivos a crear / modificar

Todos los paths de producción son relativos a `src/modules/tutor/materials/` salvo los indicados.

| # | Acción | Archivo |
|---|---|---|
| 1 | MODIFICAR | `constants/materials.constants.ts` |
| 2 | MODIFICAR | `api/materials.api.ts` |
| 3 | MODIFICAR | `utils/materials.utils.ts` |
| 4 | CREAR | `hooks/useDeleteMaterial.ts` |
| 5 | CREAR | `components/DeleteMaterialDialog.tsx` |
| 6 | MODIFICAR | `components/MaterialCard.tsx` |
| 7 | MODIFICAR | `components/MaterialsSection.tsx` |
| 8 | CREAR | `test/modules/tutor/materials/fixtures.ts` |
| 9 | CREAR | `test/modules/tutor/materials/useDeleteMaterial.test.tsx` |
| 10 | CREAR | `test/modules/tutor/materials/DeleteMaterialDialog.test.tsx` |
| 11 | CREAR | `test/modules/tutor/materials/MaterialsSection.test.tsx` |

No se crean archivos de tipos nuevos: `Material` ya existe y **no** se modifica.

## Implementación

### 1. `constants/materials.constants.ts` — claves y textos

Agregar al final del archivo existente:

```ts
export const MATERIALS_QUERY_KEY = "materials";

export const DELETE_MATERIAL_MESSAGES = {
  title: "Eliminar material",
  confirmLabel: "Eliminar",
  cancelLabel: "Cancelar",
  success: "Material eliminado correctamente.",
  confirm: (materialName: string) =>
    `¿Estás seguro de que querés eliminar permanentemente ${materialName}?`,
} as const;
```

- `MATERIALS_QUERY_KEY` se usa para invalidar el prefijo; `useGetMaterials` hoy usa el literal `"materials"`. No hace falta refactorizarlo, pero **si se toca**, usar la constante.
- Los textos van en español rioplatense (voseo), como el resto de la app.

### 2. `api/materials.api.ts` — función de borrado

Agregar sin tocar `getMaterialsBySubject` ni `uploadMaterial`:

```ts
export async function deleteMaterial(materialId: string): Promise<void> {
  await httpClient.delete(`/api/v1/materials/${materialId}`);
}
```

- Solo `httpClient`. No usar `rawHttpClient` (se perdería el toast de error y el logout en 401).
- La respuesta es `204` sin cuerpo: no tipar ni devolver datos.

### 3. `utils/materials.utils.ts` — dos helpers puros

```ts
import axios from "axios";
import type { Material } from "@/modules/tutor/materials/interfaces/material.interface";

export function getMaterialDisplayName(
  material: Pick<Material, "name" | "originalFileName">
): string {
  const extension = material.originalFileName.split(".").pop()?.toLowerCase();
  return extension ? `${material.name}.${extension}` : material.name;
}

/**
 * Errores en los que reintentar no cambia el resultado:
 * el material no es propio (403), ya no existe (404) o tiene denuncias (409).
 * Un 502 o un error de red sí son reintentables.
 */
export function isTerminalDeleteError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false;
  const status = error.response?.status;
  return status === 403 || status === 404 || status === 409;
}
```

- `getMaterialDisplayName` reemplaza la lógica inline que hoy tiene `MaterialCard` (`name` + extensión). Mismo resultado visual, una sola fuente de verdad.
- Sin `any`: el parámetro es `unknown`.

### 4. `hooks/useDeleteMaterial.ts` — mutación

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteMaterial as deleteMaterialApi } from "@/modules/tutor/materials/api/materials.api";
import {
  DELETE_MATERIAL_MESSAGES,
  MATERIALS_QUERY_KEY,
} from "@/modules/tutor/materials/constants/materials.constants";
import { isTerminalDeleteError } from "@/modules/tutor/materials/utils/materials.utils";

export function useDeleteMaterial() {
  const queryClient = useQueryClient();

  const invalidateMaterials = () =>
    queryClient.invalidateQueries({ queryKey: [MATERIALS_QUERY_KEY] });

  const mutation = useMutation({
    mutationKey: ["deleteMaterial"],
    mutationFn: (materialId: string) => deleteMaterialApi(materialId),
    onSuccess: async () => {
      toast.success(DELETE_MATERIAL_MESSAGES.success);
      await invalidateMaterials();
    },
    onError: async (error) => {
      // El toast de error ya lo muestra el interceptor de httpClient.
      // Si el resultado no va a cambiar, refrescamos el listado real.
      if (isTerminalDeleteError(error)) {
        await invalidateMaterials();
      }
    },
  });

  return {
    deleteMaterial: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
}
```

- Mismo shape que `useUploadMaterial` (`mutateAsync` + `isPending`), para que el componente no maneje el objeto `mutation` completo.
- **No** agregar un `toast.error` en `onError`: duplicaría el del interceptor.
- **No** hacer update optimista del cache.

### 5. `components/DeleteMaterialDialog.tsx` — confirmación

```tsx
import AppConfirmDialog from "@/shared/components/AppConfirmDialog";
import { useDeleteMaterial } from "@/modules/tutor/materials/hooks/useDeleteMaterial";
import { DELETE_MATERIAL_MESSAGES } from "@/modules/tutor/materials/constants/materials.constants";
import {
  getMaterialDisplayName,
  isTerminalDeleteError,
} from "@/modules/tutor/materials/utils/materials.utils";
import type { Material } from "@/modules/tutor/materials/interfaces/material.interface";

interface DeleteMaterialDialogProps {
  open: boolean;
  material: Material;
  onClose: () => void;
}

export default function DeleteMaterialDialog({
  open,
  material,
  onClose,
}: DeleteMaterialDialogProps) {
  const { deleteMaterial, isPending } = useDeleteMaterial();
  const displayName = getMaterialDisplayName(material);

  const handleCancel = () => {
    if (isPending) return;
    onClose();
  };

  const handleConfirm = async () => {
    try {
      await deleteMaterial(material.id);
      onClose();
    } catch (error) {
      // Un 502 (o error de red) deja el diálogo abierto para reintentar.
      if (isTerminalDeleteError(error)) onClose();
    }
  };

  return (
    <AppConfirmDialog
      open={open}
      title={DELETE_MATERIAL_MESSAGES.title}
      message={DELETE_MATERIAL_MESSAGES.confirm(displayName)}
      severity="danger"
      confirmLabel={DELETE_MATERIAL_MESSAGES.confirmLabel}
      cancelLabel={DELETE_MATERIAL_MESSAGES.cancelLabel}
      onConfirm={() => void handleConfirm()}
      onCancel={handleCancel}
      isPending={isPending}
    />
  );
}
```

Puntos no negociables:

- **No** llamar `httpClient` acá: solo el hook.
- **No** mostrar el toast de éxito acá: lo hace el hook.
- `handleCancel` bloquea el cierre mientras `isPending`. `AppConfirmDialog` ya deshabilita los botones, pero su `onClose` (Esc/backdrop) llama `onCancel` sin chequear, así que el guard es necesario.
- `void handleConfirm()` mantiene el handler síncrono, igual que `RemoveMaterialDialog` (`onConfirm={() => void handleSubmit(onSubmit)()}`).
- Sin `requireCheckbox`: el diseño pide un solo paso de confirmación.
- No usar `useEffect` para resetear nada: el diálogo se desmonta al cerrar (`MaterialsSection` lo renderiza condicionalmente).

### 6. `components/MaterialCard.tsx` — botón de eliminar

Cambios:

```tsx
import { Box, IconButton, Typography } from "@mui/material";
import { Trash2 } from "lucide-react";
import { getMaterialDisplayName } from "@/modules/tutor/materials/utils/materials.utils";

interface MaterialCardProps {
  material: Material;
  onDelete: (material: Material) => void;
}

export default function MaterialCard({ material, onDelete }: MaterialCardProps) {
  const { icon: Icon, bgColor, iconColor } = getFileIconAndColor(material.format);
  const displayName = getMaterialDisplayName(material);
  ...
  <IconButton
    size="small"
    onClick={() => onDelete(material)}
    aria-label={`Eliminar ${displayName}`}
    sx={{
      color: "#7A2323",
      flexShrink: 0,
      "&:hover": { backgroundColor: "#F4E4E4" },
    }}
  >
    <Trash2 size={18} />
  </IconButton>
```

- Reemplazar el cálculo inline de `displayName` y `fileExtension` por `getMaterialDisplayName(material)`; el `<Typography>` sigue mostrando `displayName`.
- El botón va al final de la fila, después del nombre. La fila **no** es clickeable hoy, así que no hace falta `stopPropagation`.
- `onDelete` es obligatorio: el único consumidor es `MaterialsSection`, que siempre lo pasa. No dejarlo opcional para evitar un botón muerto.
- El `aria-label` incluye el nombre visible, que es lo que usan los tests (`getByRole("button", { name: "Eliminar ..." })`).

### 7. `components/MaterialsSection.tsx` — integrar el diálogo

Agregar estado y render (sin tocar el resto del componente):

```tsx
import { useEffect, useRef, useState } from "react";
import DeleteMaterialDialog from "@/modules/tutor/materials/components/DeleteMaterialDialog";
import type { Material } from "@/modules/tutor/materials/interfaces/material.interface";

const [materialToDelete, setMaterialToDelete] = useState<Material | null>(null);

// dentro del map existente:
<MaterialCard
  key={material.id}
  material={material}
  onDelete={setMaterialToDelete}
/>

// al final, junto a <UploadMaterialDialog />:
{materialToDelete && (
  <DeleteMaterialDialog
    material={materialToDelete}
    open
    onClose={() => setMaterialToDelete(null)}
  />
)}
```

- Un solo diálogo para toda la lista.
- El render condicional con `materialToDelete &&` evita pasar `null` al diálogo.
- Al cerrarse, la invalidación del hook refresca `["materials"]` y el ítem desaparece; si era el último, se muestra `MaterialEmptyState` automáticamente.
- **No** recargar la página ni usar `window.location.reload()`.

### 8. Qué no se toca

- `interfaces/material.interface.ts`: **no** agregar `reportsCount` ni `alreadyReported`. El tutor recibe `0` y usarlo induciría a error.
- `hooks/useGetMaterials.ts` y `hooks/useUploadMaterial.ts`: funcionan tal cual.
- `shared/lib/httpClient.ts`: el interceptor ya hace lo necesario.
- `shared/components/AppConfirmDialog.tsx`: se reutiliza sin cambios.
- `student/tutorProfile/**`, `support/**`, `admin/material-reports/**`: fuera de alcance.
- No migraciones, no endpoints nuevos, no dependencias nuevas.

## Manejo de errores

| Caso | Origen del mensaje | Qué hace el diálogo | Qué hace el listado |
|---|---|---|---|
| `204` | toast de éxito del hook | se cierra | se invalida `["materials"]` |
| `401` | interceptor + logout | no aplica: la sesión termina y la app navega al login | no importa |
| `403` (`ACCESS_DENIED`) | interceptor | se cierra (reintentar no sirve) | se invalida por precaución |
| `404` (`MATERIAL_NOT_FOUND`) | interceptor | se cierra | se invalida: el ítem ya no existe |
| `409` (`MATERIAL_HAS_REPORTS`) | interceptor | se cierra | se invalida; el material sigue |
| `502` (`STORAGE_ERROR`) | interceptor | **queda abierto**, botones habilitados | no se invalida (el backend hizo rollback) |
| Error de red / timeout | interceptor (texto genérico) | queda abierto | no se invalida |

Reglas:

- **Nunca** construir el texto de error en el componente: el interceptor ya muestra `message` (y cae a `detail`).
- **Nunca** mostrar dos toasts para el mismo error.
- El `502` es reintentable: `isPending` vuelve a `false` y el botón "Eliminar" queda activo.
- Un `409` se explica solo: el mensaje del backend dice que el material tiene denuncias. No hace falta un texto extra ni un link a soporte.

## Testing (Vitest + Testing Library)

Los tests nuevos van en `test/modules/tutor/materials/`, espejando el módulo. Usar `QueryClient` con `retry: false`, `vi.mock` de la API y de `sonner` (mismo patrón que `test/modules/admin/material-reports/*`).

### `fixtures.ts`

```ts
import type { Material } from "@/modules/tutor/materials/interfaces/material.interface";

export function makeMaterial(overrides: Partial<Material> = {}): Material {
  return {
    id: "mat-1",
    name: "Resumen Unidad 3 - Derivadas",
    originalFileName: "resumen_derivadas.pdf",
    tutorId: "tutor-1",
    tutorName: "Ana Gómez",
    subjectId: "subject-1",
    subjectName: "Análisis Matemático",
    format: "PDF",
    downloadUrl: "https://example.com/firmada",
    uploadedAt: "2026-10-01T10:00:00",
    sizeInBytes: 1024,
    ...overrides,
  };
}
```

### `useDeleteMaterial.test.tsx`

- **Éxito**: `deleteMaterial` resuelve → `toast.success("Material eliminado correctamente.")` y `invalidateQueries({ queryKey: ["materials"] })`.
- **404**: rechaza con `{ isAxiosError: true, response: { status: 404 } }` → invalida `["materials"]` y **no** llama `toast.error` (lo hace el interceptor).
- **409**: idem 404 (invalida).
- **502**: rechaza con status 502 → **no** invalida y **no** muestra toast propio.
- Usar `renderHook` + wrapper `QueryClientProvider` y espiar `invalidateQueries` (patrón de `adminMaterialReportHooks.test.tsx`).

Helper sugerido para los errores:

```ts
function apiError(status: number) {
  return { isAxiosError: true, response: { status, data: { status, message: "", detail: "" } } };
}
```

### `DeleteMaterialDialog.test.tsx`

- **Mensaje exacto**: renderiza `¿Estás seguro de que querés eliminar permanentemente Resumen Unidad 3 - Derivadas.pdf?` (nombre + extensión).
- **Cancelar** → `onClose` una vez y `deleteMaterial` **no** se llama.
- **Confirmar** → `deleteMaterial` una vez con `"mat-1"`; al resolver, `onClose` una vez.
- **Pending**: `deleteMaterial` devuelve una promesa que no resuelve → ambos botones (`Cancelar`, `Eliminar`) quedan `disabled`.
- **409** → `onClose` se llama (el diálogo se cierra) y se invalida `["materials"]`.
- **502** → `onClose` **no** se llama, el diálogo sigue en el DOM y el botón "Eliminar" vuelve a estar habilitado.
- El mock de la API debe incluir `deleteMaterial` en la factory de `vi.mock`, igual que en `RemoveMaterialDialog.test.tsx`.

### `MaterialsSection.test.tsx`

Integración liviana (sin backend):

- Mockear `@/modules/tutor/materials/hooks/useGetMaterials` para devolver dos materiales y `useMySubjectsWithCatalogId` para devolver una materia.
- Renderizar dentro de `QueryClientProvider`.
- Cada material tiene un botón `Eliminar {displayName}`.
- Al hacer clic en el primero, se abre el diálogo con el nombre de **ese** material (no el del otro).
- Cancelar cierra el diálogo y no llama a la API.

### Comandos

```bash
npm run test
npm run lint
npm run format:check
npm run type-check
```

`npm run lint` corre con `--max-warnings 0`: ningún `any` y ningún import o variable sin usar.

## Impacto en backend (referencia)

- Esta spec **depende** de que el backend implemente `DELETE /api/v1/materials/{id}` con los códigos de la tabla de contrato.
- El caso `409 MATERIAL_HAS_REPORTS` es nuevo respecto del borrador anterior: antes el backend no lo contemplaba.
- Si el backend todavía no está deployado, el frontend se puede mergear igual (los tests mockean la API), pero la funcionalidad no se puede probar end-to-end hasta que exista el endpoint.

## No hacer

- ❌ No crear `src/modules/materials/` ni duplicar el módulo que ya existe en `src/modules/tutor/materials/`.
- ❌ No llamar `httpClient`/`axios` desde componentes; solo vía `api/` → `hooks/`.
- ❌ No crear un `Dialog` nuevo si `AppConfirmDialog` cubre el caso.
- ❌ No eliminar el ítem de forma optimista antes de la confirmación del backend.
- ❌ No duplicar el toast de error del interceptor.
- ❌ No agregar `reportsCount` a `Material` ni deshabilitar el botón por denuncias: el backend devuelve `0` al tutor.
- ❌ No mostrar el botón en la vista del alumno, en perfiles públicos ni en el historial de denuncias del tutor.
- ❌ No reutilizar `useRemoveMaterial` del admin: es otra operación (soft delete + notificación).
- ❌ No tocar `AppConfirmDialog`, `httpClient`, `Material` ni el módulo `student`.
- ❌ No agregar dependencias (MUI, TanStack Query, sonner, lucide y Vitest ya están).
- ❌ No usar `style={{}}` inline ni Tailwind.
- ❌ No usar `useEffect` + `fetch` ni recargar la página tras eliminar.
- ❌ No traducir los textos de UI al inglés.

## Definition of Done

- [ ] `deleteMaterial` en `api/materials.api.ts` usando `httpClient`
- [ ] `useDeleteMaterial` con `onSuccess` (toast + invalidación) y `onError` que invalida en 403/404/409 sin duplicar el toast
- [ ] `DeleteMaterialDialog` basado en `AppConfirmDialog`, con mensaje exacto, bloqueo durante `isPending` y cierre solo en errores terminales
- [ ] Botón "Eliminar" con `aria-label` en cada fila de `MaterialCard`, integrado en `MaterialsSection` con un único diálogo
- [ ] Tras un `204` el material desaparece del listado sin recargar; si era el último, se ve el estado vacío
- [ ] `409 MATERIAL_HAS_REPORTS` muestra el mensaje del backend y deja el material en el listado
- [ ] `502 STORAGE_ERROR` deja el diálogo abierto para reintentar
- [ ] Tests de hook, diálogo e integración en verde; `lint`, `format:check` y `type-check` limpios
- [ ] Sin cambios en `Material`, `AppConfirmDialog`, `httpClient`, `student/` ni `support/`
- [ ] Commit(s) `feat:` / `test:` en español y PR que referencie US-17 y la spec de backend

## Diferencias con el borrador anterior

| Punto | Borrador viejo | Este spec |
|---|---|---|
| Módulo | `src/modules/materials/` (nuevo) | `src/modules/tutor/materials/` (existente) |
| Dependencia con US-16 | “no existe el listado, reportar impedimento” | US-16 ya está implementado; se integra en `MaterialsSection` |
| Diálogo | `Dialog` de MUI creado a mano | `AppConfirmDialog` compartido |
| Toast de éxito | `showMessage` de `useSnackbarStore` | `toast` de `sonner` en el hook (patrón real del repo) |
| Errores | Solo 403/404/502 | Se agrega `409 MATERIAL_HAS_REPORTS` y se define qué pasa con cada código |
| Tests | `__tests__/` colocados | `test/modules/tutor/materials/` (estructura real del repo) |
| Nombre mostrado | `name` a secas | `getMaterialDisplayName()` = `name` + extensión, igual que la fila |