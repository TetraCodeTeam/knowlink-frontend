# Mejoras UX — Navegación post-carga y visualización de materiales (Frontend)

## Metadata

| Campo | Valor |
|---|---|
| ID Historia | — (mejoras sobre US-16, US-17 y US-26) |
| Módulos | `tutor/materials`, `student/tutorProfile`, nuevo `shared/material-preview` |
| Repo / rama base | `TetraCodeTeam/knowlink-frontend`, rama `dev` (commit `a26bbd6`) |
| Rama de trabajo sugerida | `git checkout dev && git pull && git checkout -b feat/material-navigation-and-preview` |
| Backend | **Sin cambios.** Ver sección "Backend" |
| Verificado contra | `knowlink-frontend@dev` (2026-11-09) |

**Convención de idioma:** identificadores en **inglés**; todo texto visible en **español** (voseo). Imports con alias `@/`. Prettier: doble comilla, `;`, 100 columnas. Llamadas HTTP solo en `api/`, data fetching con `useQuery`/`useMutation` en `hooks/`, sin `any`. Detalle en `docs/base-standards.md`.

## Antes de empezar (obligatorio)

1. Leer `CLAUDE.md` y `docs/base-standards.md`.
2. Línea base **antes de tocar nada**: `npm run test`, `npm run lint`, `npm run type-check`. Si algo ya está rojo, anotarlo y no arreglarlo acá.
3. Hacer el **spike del punto M2.0** antes de escribir el visor.

## Resumen

| # | Pedido | Sección |
|---|---|---|
| M1 | Al terminar de cargar un material, el tutor queda posicionado en la materia donde lo cargó | M1 |
| M2 | Alumno y tutor pueden visualizar los documentos sin salir de la app | M2 |

---

## M1 — Ir a la materia donde se cargó el material

### Problema (verificado)

`MaterialsSection` es dueño del filtro (`selectedCatalogSubjectId`, `undefined` = "Todo"). `UploadMaterialDialog` elige la materia en su propio estado interno y, al terminar, solo hace `toast.success` + `handleClose()`: no le avisa nada a `MaterialsSection`. Si el tutor está filtrando "Álgebra" y sube un material de "Física", la lista sigue en "Álgebra" y el material nuevo no aparece.

### Criterios de aceptación

```gherkin
Feature: Posicionarse en la materia del material cargado

  Background:
    Given un tutor autenticado en la pestaña "Recursos" de su perfil

  Scenario: Cargar material de otra materia
    Given el filtro activo es "Álgebra"
    When el tutor sube un material de "Física"
    Then el filtro activo pasa a "Física"
    And el chip "Física" queda visible en la barra de materias (se desplaza si estaba fuera de pantalla)
    And el material recién cargado aparece en el listado sin recargar la página

  Scenario: Cargar material estando en "Todo"
    Given el filtro activo es "Todo"
    When el tutor sube un material de "Física"
    Then el filtro activo pasa a "Física"

  Scenario: Cargar material de la misma materia
    Given el filtro activo es "Física"
    When el tutor sube un material de "Física"
    Then el filtro sigue en "Física" y el material aparece en el listado

  Scenario: La carga falla
    When la subida devuelve error
    Then el filtro NO cambia y el diálogo sigue abierto (comportamiento actual)

  Scenario: El tutor cancela o cierra el diálogo
    Then el filtro NO cambia
```

### Cambios (rutas bajo `src/modules/tutor/materials/`)

**1. `components/UploadMaterialDialog.tsx`** — nueva prop opcional y llamada tras el éxito:

```tsx
interface UploadMaterialDialogProps {
  open: boolean;
  onClose: () => void;
  onUploaded?: (catalogSubjectId: string) => void;
}
```

En `handleSubmit`, **capturar el id antes de `handleClose()`** (que resetea `selectedCatalogSubjectId`):

```tsx
const uploadedSubjectId = selectedCatalogSubjectId;
await uploadMaterial({ name: materialName.trim(), subjectId: uploadedSubjectId, file: selectedFile });
toast.success("Material subido correctamente");
onUploaded?.(uploadedSubjectId);
handleClose();
```

La llamada va dentro del `try`, después del `await`, así que en error nunca se ejecuta.

**2. `components/MaterialsSection.tsx`**

- Pasar `onUploaded={setSelectedCatalogSubjectId}` a `<UploadMaterialDialog />`.
- Agregar `aria-pressed={active}` a los chips (hoy no tienen estado accesible; además sirve como selector estable para el scroll y para los tests).
- Efecto que mantiene visible el chip activo:

```tsx
useEffect(() => {
  scrollRef.current
    ?.querySelector<HTMLElement>('[aria-pressed="true"]')
    ?.scrollIntoView?.({ behavior: "smooth", inline: "nearest", block: "nearest" });
}, [selectedCatalogSubjectId]);
```

`scrollIntoView?.` con optional call porque jsdom no lo implementa.

### Por qué el material nuevo aparece sin trabajo extra

`useUploadMaterial` ya hace `invalidateQueries({ queryKey: ["materials"] })` (prefijo) en `onSuccess`. Eso marca como *stale* **todas** las queries `["materials", id]`, incluso las inactivas, así que al cambiar a la query de la materia nueva (con `staleTime` de 5 min) se refetchea igual. **No tocar `useUploadMaterial` ni `useGetMaterials`.** Se ve un instante "Cargando materiales..." al cambiar de materia: es esperado.

### Fuera de alcance

Preseleccionar en el diálogo la materia del chip activo (mejora de UX relacionada, no pedida).

---

## M2 — Visualizar documentos (alumno y tutor)

### Estado actual (verificado)

| Rol | Hoy |
|---|---|
| Alumno | `TutorMaterialCard` y `TutorMaterialModal` solo tienen "Descargar" → `useTutorMaterialDownload` pide la URL firmada y hace `window.open(url, "_blank")`. No hay visor in-app. |
| Tutor | `MaterialCard` solo tiene el botón de eliminar. No puede ni abrir ni ver el archivo que subió. |

Formatos permitidos en la subida: **PDF, PNG, XLSX** (`ALLOWED_FORMATS`; el backend valida igual).

### Decisiones de diseño

1. **Un solo visor compartido** en `src/shared/material-preview/` (lo usan dos módulos, por eso `shared/` y no un módulo). No importa tipos de `modules/*`: recibe `{ id, title, format }` con `format: string`.
2. **Cada formato tiene un tratamiento**:
   - `PDF` → `<iframe>` con el PDF.
   - `PNG` → `<img>` con `object-fit: contain`.
   - `XLSX` y cualquier otro → **sin vista previa**: mensaje "No hay vista previa disponible para este formato." + botón "Descargar". No se agrega librería de planillas: no hay ninguna en `package.json` y el paquete `xlsx` de npm está sin mantenimiento. Si más adelante se quiere previsualizar XLSX, es una historia aparte.
3. **El archivo se carga como `Blob` y se muestra con una URL `blob:`** (no con la URL firmada directo en el `<iframe>`), con el `type` **fijado por nuestro mapeo de formato** (`application/pdf`, `image/png`), **nunca el `Content-Type` de la respuesta**. El backend valida extensión y content-type declarado pero no los bytes: así un archivo mal rotulado no se interpreta como HTML bajo el origen de la app. **No** poner `sandbox` en el iframe del PDF (rompe el visor nativo de Chrome).
4. **La request a la URL firmada NO usa `httpClient`**: ese cliente agrega el `Bearer` del usuario y se lo mandaría a Supabase. Usar `axios` plano con `responseType: "blob"` y sin headers de auth.
5. **Descargar** conserva el comportamiento actual (pedir URL firmada y `window.open`).
6. Los errores de la request al backend los muestra el interceptor de `httpClient` (toast). El visor **no duplica el toast**; solo muestra un estado de error inline con "Reintentar".

### M2.0 — Spike previo (15 min, obligatorio)

No pude verificar en este análisis cómo responde Supabase Storage a un `<iframe>` y a un `fetch` desde el origen de la app. Probar con una URL firmada real de un PDF y un PNG:

1. `<iframe src={signedUrl}>` y `<img src={signedUrl}>` directos: ¿renderizan en Chrome, Firefox y Safari? Si **sí**, se puede simplificar y no usar blob (ahorrar M2.2 y la decisión 3/4).
2. `axios.get(signedUrl, { responseType: "blob" })`: ¿pasa CORS? Si **no**, caer a la opción 1 para PNG y, para PDF, abrir en pestaña nueva en vez de iframe; documentar el resultado en el PR.

El resto de la spec asume que el camino por blob funciona.

### Criterios de aceptación

```gherkin
Feature: Visualizar materiales

  Scenario: El alumno ve un PDF
    Given un alumno con acceso a los materiales de un tutor
    When hace clic en "Ver {título}" de un material PDF
    Then se abre un diálogo con el título del material
    And mientras carga se muestra un indicador de progreso
    And al terminar se muestra el PDF dentro del diálogo

  Scenario: El alumno ve una imagen
    When hace clic en "Ver {título}" de un material PNG
    Then se muestra la imagen completa dentro del diálogo

  Scenario: Formato sin vista previa
    When hace clic en "Ver {título}" de un material XLSX
    Then el diálogo dice "No hay vista previa disponible para este formato."
    And ofrece el botón "Descargar"
    And no se pide el archivo al almacenamiento

  Scenario: El tutor ve su propio material
    Given un tutor en la pestaña "Recursos"
    When hace clic en "Ver {nombre del archivo}" de una fila
    Then se abre el mismo diálogo con el contenido de su material

  Scenario: Error al cargar
    Given el backend o el almacenamiento fallan
    Then el diálogo muestra un estado de error con el botón "Reintentar"
    And "Reintentar" vuelve a pedir el archivo

  Scenario: Cerrar libera recursos
    When el usuario cierra el diálogo
    Then se revoca la URL blob y se cancela la request si seguía en curso

  Scenario: Descargar desde el visor
    When hace clic en "Descargar" dentro del diálogo
    Then se ejecuta la descarga actual (URL firmada en pestaña nueva)

  Scenario: Material no disponible (denuncia en revisión) o sin acceso
    Then el backend responde 403, el interceptor muestra su mensaje
    And el diálogo muestra el estado de error
```

### Archivos a crear / modificar

| # | Acción | Archivo |
|---|---|---|
| 1 | CREAR | `src/shared/material-preview/api/materialPreview.api.ts` |
| 2 | CREAR | `src/shared/material-preview/utils/previewFormat.ts` |
| 3 | CREAR | `src/shared/material-preview/hooks/useMaterialPreview.ts` |
| 4 | CREAR | `src/shared/material-preview/hooks/useMaterialDownload.ts` |
| 5 | CREAR | `src/shared/material-preview/components/MaterialPreviewDialog.tsx` |
| 6 | CREAR | `src/shared/material-preview/interfaces/previewable-material.interface.ts` |
| 7 | MODIFICAR | `src/modules/tutor/materials/components/MaterialCard.tsx` |
| 8 | MODIFICAR | `src/modules/tutor/materials/components/MaterialsSection.tsx` |
| 9 | MODIFICAR | `src/modules/student/tutorProfile/components/TutorMaterialCard.tsx` |
| 10 | MODIFICAR | `src/modules/student/tutorProfile/components/TutorMaterialModal.tsx` |

### M2.1 — API (`materialPreview.api.ts`)

```ts
import axios from "axios";
import { httpClient } from "@/shared/lib/httpClient";

// Mismo endpoint que ya usa el alumno; el backend también lo permite al tutor dueño.
export async function getMaterialSignedUrl(materialId: string): Promise<string> {
  const { data } = await httpClient.get<string>(`/api/v1/materials/${materialId}/download`);
  return data;
}

// axios plano a propósito: NO usar httpClient (adjuntaría el Bearer del usuario a Supabase).
export async function fetchMaterialBlob(signedUrl: string, mimeType: string, signal?: AbortSignal) {
  const { data } = await axios.get<Blob>(signedUrl, { responseType: "blob", signal });
  return new Blob([data], { type: mimeType });
}
```

No tocar `getMaterialDownloadUrl` de `student/tutorProfile/api/getTutorProfile.ts` (el alumno sigue usándolo para descargar).

### M2.2 — Utilidad (`previewFormat.ts`)

```ts
export type PreviewKind = "pdf" | "image" | "unsupported";

export function getPreviewKind(format: string): PreviewKind {
  const f = format.toUpperCase();
  if (f === "PDF") return "pdf";
  if (f === "PNG") return "image";
  return "unsupported";
}

export const PREVIEW_MIME: Record<Exclude<PreviewKind, "unsupported">, string> = {
  pdf: "application/pdf",
  image: "image/png",
};
```

### M2.3 — Hook de carga (`useMaterialPreview.ts`)

- `useQuery` con `queryKey: ["material-preview", materialId]`, `enabled: open && kind !== "unsupported"`, `retry: false`, `staleTime: 0`, `gcTime: 0` (son archivos de hasta 10 MB; no se cachean).
- `queryFn: ({ signal }) => getMaterialSignedUrl(id).then((url) => fetchMaterialBlob(url, PREVIEW_MIME[kind], signal))`. React Query cancela vía `signal` cuando el query se desmonta/desactiva.
- Con el `Blob` resultante crear la URL en un `useEffect` y **revocarla en el cleanup**:

```ts
useEffect(() => {
  if (!query.data) { setObjectUrl(null); return; }
  const url = URL.createObjectURL(query.data);
  setObjectUrl(url);
  return () => URL.revokeObjectURL(url);
}, [query.data]);
```

- Retorna `{ objectUrl, isLoading, isError, refetch, kind }`.

### M2.4 — Descarga (`useMaterialDownload.ts`)

Misma lógica que `useTutorMaterialDownload` (pedir URL firmada → `window.open(url, "_blank", "noopener,noreferrer")`, con `toast.error` si falla), pero ubicada en `shared/` para que el visor la use sin importar de `modules/student`. No reemplazar el hook del alumno en esta historia.

### M2.5 — Diálogo (`MaterialPreviewDialog.tsx`)

Props (en `interfaces/previewable-material.interface.ts`):

```ts
export interface PreviewableMaterial { id: string; title: string; format: string }
export interface MaterialPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  material: PreviewableMaterial | null;
}
```

- `Dialog` MUI `fullWidth maxWidth="md"`, `fullScreen` en `xs` (`useMediaQuery(theme.breakpoints.down("sm"))`): en celulares el iframe de PDF necesita todo el alto.
- Encabezado: título (`noWrap`, con `title` para el texto completo), botón "Descargar" y `IconButton` "Cerrar" (`aria-label="Cerrar"`).
- Cuerpo con altura fija (`height: { xs: "100%", md: "70vh" }`):
  - cargando → `CircularProgress` centrado con `aria-label="Cargando vista previa"`.
  - error → `FrankieErrorState` (`@/shared/frankie/FrankieErrorState`, export default) con `message="No pudimos cargar la vista previa."` y `onRetry={refetch}` (ya trae el botón "Reintentar"). Ver `docs/frankie.md`, fila "Fallo al cargar una sección".
  - `pdf` → `<iframe src={objectUrl} title={`Vista previa de ${title}`} style={{ width: "100%", height: "100%", border: 0 }} />`.
  - `image` → `<img src={objectUrl} alt={title} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />`.
  - `unsupported` → ícono + "No hay vista previa disponible para este formato.".
- Si `material` es `null`, no renderiza nada.

### M2.6 — Integración tutor

- `MaterialCard`: nueva prop `onPreview: (material: Material) => void` y un `IconButton` con `Eye` (lucide) **antes** del de eliminar, `aria-label={`Ver ${displayName}`}`, color `#5865C8`.
- `MaterialsSection`: estado `materialToPreview: Material | null`; renderizar

```tsx
<MaterialPreviewDialog
  open={materialToPreview !== null}
  onClose={() => setMaterialToPreview(null)}
  material={
    materialToPreview && {
      id: materialToPreview.id,
      title: getMaterialDisplayName(materialToPreview),
      format: materialToPreview.format,
    }
  }
/>
```

### M2.7 — Integración alumno

- `TutorMaterialCard`: estado `previewItem: TutorMaterialItem | null`; al lado del botón de descarga de cada fila, `IconButton` `Eye` con `aria-label={`Ver ${item.title}`}` que hace `setPreviewItem(item)`. Renderizar un único `MaterialPreviewDialog` **fuera** del condicional `hasConfirmedBooking` (después de `TutorMaterialModal` en el JSX para que apile encima), con `format: previewItem.fileType`.
- `TutorMaterialModal`: nueva prop `onPreview: (item: TutorMaterialItem) => void`; botón "Ver" (`variant="outlined"`, `startIcon={<Eye size={16} />}`, `aria-label={`Ver ${item.title}`}`) antes de "Descargar". La card le pasa `onPreview={setPreviewItem}`.
- El flujo de denuncia (`ReportMaterialFlow`) no se toca.

---

## Backend

Sin cambios. Verificado en `knowlink-backend@dev`:

- `GET /api/v1/materials/{id}/download` (`MaterialControllerImpl.download`) acepta `STUDENT`, `TUTOR` y `ADMIN`. Para alumno valida acceso por sesión completada (`validateAccessOrDeny`) y que el material esté disponible; para tutor exige ser el dueño; devuelve la URL firmada con validez de 3600 s (`SIGNED_URL_EXPIRATION_SECONDS`).
- `POST /api/v1/materials` ya devuelve `subjectId` (id del catálogo) en el `MaterialResponse`, consistente con `catalogSubjectId` del frontend; M1 igual usa el id del selector, no depende de la respuesta.

## Tests (`npm run test`; viven en `test/` espejando `src/`)

Mockear `URL.createObjectURL` / `URL.revokeObjectURL` (jsdom no los implementa) en `test/setup.ts` o dentro de cada test.

| Archivo | Casos |
|---|---|
| `test/modules/tutor/materials/MaterialsSection.test.tsx` (extender) | Mockear `UploadMaterialDialog` o `uploadMaterial`; tras subir un material de "Física" estando en "Álgebra" el chip "Física" tiene `aria-pressed="true"`; desde "Todo" también; si la subida falla el filtro no cambia. Botón `Ver {nombre}` abre el visor. |
| `test/modules/tutor/materials/UploadMaterialDialog.test.tsx` (crear) | `onUploaded` se llama con el id de la materia **elegida** y después de `uploadMaterial`; no se llama si `uploadMaterial` rechaza. |
| `test/modules/shared/material-preview/previewFormat.test.ts` | `PDF`/`pdf` → `pdf`, `PNG` → `image`, `XLSX`/`DOCX`/vacío → `unsupported`. |
| `test/modules/shared/material-preview/MaterialPreviewDialog.test.tsx` | PDF → renderiza `iframe` con `src` blob; PNG → `img`; XLSX → mensaje y **no** se llama a la API; error → botón "Reintentar" vuelve a pedir; el Blob se crea con el MIME del mapeo aunque la respuesta traiga otro; al desmontar se llama `revokeObjectURL`. |
| `test/modules/student/tutorProfile/TutorMaterialCard.test.tsx` (crear; la carpeta ya tiene `ViewTutorProfile.test.tsx`, `ReviewItem.test.tsx`, etc.) | `Ver {título}` abre el diálogo desde la card y desde el modal "Ver Todo". |

## Definition of Done

- [ ] Spike M2.0 hecho y resultado anotado en el PR.
- [ ] `npm run test`, `npm run lint` (sin warnings), `npm run format:check` y `npm run type-check` en verde.
- [ ] Prueba manual en Chrome, Firefox y Safari (PDF y PNG) y en viewport móvil.
- [ ] Prueba manual M1: subir material de otra materia estando filtrado; subir desde "Todo"; fallo de subida.
- [ ] Sin `any`, sin `httpClient` en componentes, sin imports de `modules/*` dentro de `shared/material-preview`.

## Qué NO hacer

- No usar `httpClient` para pedir el archivo a la URL firmada.
- No tomar el `Content-Type` de la respuesta para armar el Blob.
- No agregar librerías de planillas ni de PDF.
- No tocar `useUploadMaterial`, `useGetMaterials` ni `ReportMaterialFlow`.
- No cambiar el comportamiento del botón "Descargar" existente.
