# SPEC — US-49: Filtrar resultados de búsqueda — FRONTEND

> **Uso:** pasar este archivo completo a OpenCode (DeepSeek V4 Flash) parado en `TetraCodeTeam/knowlink-frontend`. Guardarlo como `docs/us-49-filtrar-busqueda-frontend.spec.md`.
> **Rama de trabajo:** crear `feat/us-49-search-filters` desde `dev`.
> **Verificado contra:** `knowlink-frontend@dev` (commit `cba2b78`, 2026-10-31).
> **Dependencia:** el spec backend `us-49-filtrar-busqueda-backend.spec.md` agrega `daysOfWeek` (lista) y `timeFrame` al endpoint y corrige `verifiedOnly`. El frontend se puede desarrollar en paralelo contra el contrato de abajo; los tests mockean el hook/API, no necesitan el backend.

## Metadata

| Campo | Valor |
|---|---|
| ID | US-49 |
| Módulo | búsqueda (código en `src/modules/student/`) |
| Story Points | 5 |
| Prioridad | MEDIA |
| Tags | #RN-06 #RN-07 |
| Relacionadas | US-06A (búsqueda base), US-07, US-22, US-08 |
| Diseño | 2 mockups "Filtros Avanzados": (a) modo **Materias** → panel completo de 5 filtros; (b) modo **Tutores** → panel reducido con solo Disponibilidad y Calificación Mínima. Ver sección UI |

## Historia

Como alumno, quiero refinar los resultados de búsqueda usando filtros, para acotar las opciones según mis preferencias y disponibilidad.

## Criterios de aceptación (Gherkin)

```gherkin
Feature: Filtrar resultados de búsqueda (UI)

  Scenario: AC-1 — Abrir y elegir filtros
    Given el alumno está en /student/buscar?q=Sistemas
    When hace clic en el ícono de filtros de la barra de búsqueda
    Then se abre el panel "Filtros Avanzados" con: Modalidad, Compensación, Disponibilidad (L M X J V S D), Tutor Verificado y Calificación Mínima

  Scenario: AC-1 — Panel reducido en modo Tutores
    Given el alumno está en /student/buscar con el toggle en "Tutores"
    When abre el panel de filtros
    Then solo ve Disponibilidad (L M X J V S D) y Calificación Mínima
    And no ve Modalidad, Compensación ni Tutor Verificado (son atributos de la materia, no del tutor)

  Scenario: Cambiar de modo conserva los filtros de materia
    Given filtros Virtual + Pago aplicados en modo Materias
    When el alumno cambia a "Tutores"
    Then esos filtros no se envían ni se muestran como chips
    And al volver a "Materias" se recuperan

  Scenario: AC-2 — Aplicar filtros actualiza resultados
    Given el panel abierto con Virtual, Pago y calificación 4 elegidos
    When hace clic en "Aplicar Filtros"
    Then el panel se cierra, la URL refleja los filtros y la lista se vuelve a pedir al backend con esos filtros
    And se muestran solo los tutores devueltos (AND lo resuelve el backend)

  Scenario: AC-3 — Filtros activos destacados
    Given hay filtros aplicados
    Then debajo del título se muestra una chip removible por cada filtro activo
    And el ícono de filtros muestra un indicador con la cantidad de filtros activos

  Scenario: AC-4 — Quitar un filtro
    When el alumno quita una chip
    Then solo ese filtro se elimina y la lista se actualiza

  Scenario: AC-4 — Limpiar todos
    When el alumno hace clic en "Limpiar filtros" (barra de chips o panel)
    Then se eliminan todos los filtros y vuelven los resultados originales de la búsqueda base

  Scenario: AC-5 — Sin resultados por filtros
    Given hay filtros activos
    And la búsqueda base SIN filtros sí tiene resultados
    When la lista filtrada queda vacía
    Then se muestra "No se encontraron tutores para los filtros seleccionados"

  Scenario: AC-5 — Sin resultados de búsqueda base (se diferencia)
    Given hay filtros activos
    And la búsqueda base SIN filtros tampoco tiene resultados
    Then se muestra el mensaje existente "No se encontraron resultados para tu búsqueda"
```

---

## Estado actual del código (verificado en `dev`)

El frontend **no tiene nada de filtros**. Piezas existentes sobre las que se construye (todas en `src/modules/student/`):

| Pieza | Archivo | Nota |
|---|---|---|
| API | `api/search.api.ts` → `searchTutors(query)` | `GET /api/v1/tutors/search/${encodeURIComponent(query)}`; vía `httpClient` |
| Hook | `hooks/useSearchTutorsAndMaterias.ts` | `useQuery`, key `[STUDENTS_SEARCH_KEY, trimmedQuery]`, `enabled` si hay texto |
| Constantes y rutas | `constants.ts` | `STUDENTS_SEARCH_KEY`, `buildSearchResultsRoute(q)`, `buildMateriaTutorsRoute(nombre)`, `buildTutorProfileRoute` |
| Barra | `components/SearchBar.tsx` | input pill en `StudentTopbar`; dropdown de sugerencias (`SearchResultsPanel`); rol TUTOR → input deshabilitado |
| Resultados | `pages/SearchResultsPage.tsx` | ruta `/student/buscar?q=`; toggle Materias/Tutores (`SearchModeToggle`); `EmptyState` con `EMPTY_MESSAGE` |
| Tutores por materia | `pages/TutoresPorMateriaPage.tsx` | ruta `/student/tutores?materia=` |
| Utils | `utils/derive-materias.ts` | deriva materias únicas desde los tutores devueltos |
| Tipos | `interfaces/tutor-search-result.interface.ts` | `TutorSearchResult`, `SubjectSummary` |
| Compartidos | `@/shared/constants/modality.ts` (`SharedModality = "VIRTUAL" \| "IN_PERSON"`, `MODALITY_LABEL`), `@/shared/components/EmptyState`, `@/shared/components/AppButton` | reutilizar, no duplicar |
| Tests | `test/modules/student/components/SearchBar.test.tsx`, `.../pages/TutoresPorMateriaPage.test.tsx`, fixtures `test/fixtures/busqueda/tutoresDePrueba.ts` | **mockean** `useSearchTutorsAndMaterias` con `vi.mock` |

> ⚠️ **Compatibilidad con tests existentes:** esos tests mockean `useSearchTutorsAndMaterias` devolviendo `{ data, isFetching }`. Mantener ese hook con **firma retrocompatible** (`(query, filters?, options?)`) y devolver el resultado de `useQuery` tal cual, para que no se rompan.

Convenciones del repo (`AGENTS.md`, `docs/base-standards.md`): imports con alias `@/`; HTTP solo vía `httpClient` desde `api/`; estado de servidor con TanStack Query; **nada de `useEffect` + axios**; sin `any`; sin `style={{}}` (usar `sx`); formularios con `react-hook-form` + `zodResolver` + schema Zod **cuando hay formulario** (acá el panel es una selección de estado local, ver nota); Prettier: doble comilla, `;`, trailing comma ES5, 100 cols, 2 espacios; textos de UI en español; commits `feat:`/`test:` en español.

---

## Contrato backend consumido

```
GET /api/v1/tutors/search/{query}
  ?modality=VIRTUAL|IN_PERSON|BOTH
  &compensation=FREE|PAID
  &daysOfWeek=TUESDAY,WEDNESDAY      ← lista separada por COMAS
  &timeFrame=MORNING|AFTERNOON|EVENING
  &verifiedOnly=true
  &minRating=4
200 → TutorSearchResult[]   (sin cambios; [] si no hay match)
400 → filtro inválido · 403 → rol no STUDENT
```

⚠️ **Gotcha de axios:** por defecto serializa arrays como `daysOfWeek[]=A&daysOfWeek[]=B`, que Spring **no** bindea. Enviar `daysOfWeek` como string con comas: `params.daysOfWeek = days.join(",")`. Omitir (no enviar) los parámetros sin valor; nunca mandar `undefined`/vacío como string.

---

## Decisiones de diseño (ya tomadas — no re-discutir)

1. **Los filtros viven en la URL** (`useSearchParams`), no en Zustand. Motivo: `SearchBar` (en el topbar) y `SearchResultsPage` son componentes hermanos y necesitan el mismo estado; además sobrevive a F5 y funciona el botón "atrás". Nombres de parámetros = los del backend: `modality`, `compensation`, `daysOfWeek` (comas), `verifiedOnly` (`true`), `minRating`, `timeFrame`.
2. **Estado "borrador" dentro del panel:** el panel edita una copia local y recién "Aplicar Filtros" la escribe en la URL. Cerrar con la X o clic afuera descarta el borrador.
3. **Modalidad = selección exclusiva con deselección** (clic en la chip activa la apaga). `Presencial → IN_PERSON`, `Virtual → VIRTUAL`. Nunca se envía `BOTH` desde la UI (el backend ya incluye materias `BOTH` al filtrar por `VIRTUAL`/`IN_PERSON`).
4. **Compensación:** radio `Gratuito → FREE`, `Pago → PAID`. Sin valor por defecto (ninguno elegido = sin filtro). Se limpia con "Limpiar Filtros".
5. **Disponibilidad:** multi-selección de días (OR entre días). Mapeo letra→enum: `L=MONDAY, M=TUESDAY, X=WEDNESDAY, J=THURSDAY, V=FRIDAY, S=SATURDAY, D=SUNDAY`. **Sin UI de franja horaria** (el diseño solo trae días; el criterio dice "día **o** franja"). El tipo y la serialización ya soportan `timeFrame` para poder sumarlo después sin tocar la API; si llega en la URL se respeta y se muestra como chip.
6. **Tutor verificado:** `Switch`; encendido → `verifiedOnly=true`; apagado → no se envía.
7. **Calificación mínima:** 5 estrellas clicables (MUI `Rating`, `precision={1}`); clic sobre el valor ya elegido lo borra. Valor 1–5 → `minRating`.
8. **Dónde aparece el ícono de filtros:** dentro de la `SearchBar`, **solo** en `/student/buscar` y `/student/tutores` (`useMatch`). En el resto de rutas no se muestra. En modo TUTOR (input deshabilitado) tampoco.
9. **Los filtros se propagan** de `/student/buscar` a `/student/tutores?materia=` al hacer clic en una materia, y esa página también muestra la barra de chips y el mensaje de AC-5.
11. **El panel depende del modo (mockup de Tutores).** `Materias` (y `/student/tutores?materia=`, que es contexto de materia) → 5 filtros. `Tutores` → solo **Disponibilidad** y **Calificación Mínima**. Motivo: modalidad, compensación y "verificado" viven en la materia ofrecida (`TutorSubject`); sin materia concreta no tienen sentido.
12. **El modo pasa a la URL** (`mode=tutores`; ausente = `materias`) porque el panel está en `SearchBar` y el toggle en `SearchResultsPage` (hoy `useState` local). Reemplazar ese `useState<SearchMode>` por el parámetro.
13. **Filtros efectivos por modo:** la URL guarda todo, pero en modo Tutores solo se **usan** (API, chips, badge, mensaje AC-5) los filtros de disponibilidad y calificación. Los de materia quedan guardados y se retoman al volver a Materias. "Aplicar" en modo Tutores **fusiona** el borrador sobre los filtros ocultos sin tocarlos; "Limpiar Filtros" y "Limpiar filtros" (barra) limpian solo los filtros efectivos del modo actual.
10. **Diferenciar AC-5** sin tocar el backend: cuando hay filtros activos y la lista filtrada está vacía, se consulta la **búsqueda base sin filtros** (misma query key que ya usa el dropdown de sugerencias → cacheada) para saber cuál de los dos mensajes mostrar.

---

## UI (según el mockup)

**Botón de filtros:** `IconButton` con ícono "sliders" a la derecha dentro del pill de búsqueda (cuadrado redondeado violeta claro, `#EDEBFA` más oscuro; ícono `TuneIcon` de `@mui/icons-material`). Con filtros activos: `Badge` con la cantidad. `aria-label="Filtros avanzados"`.

**Panel "Filtros Avanzados"** — dos variantes según el modo (ver decisión 11); en la variante Tutores se renderizan solo los bloques *Disponibilidad* y *Calificación Mínima* (mismo estilo, mismo orden) y el footer idéntico. (`Popover` de MUI anclado al botón, ancho ≈ 280–300 px, `borderRadius` 12px, sombra suave). Colores de marca ya usados en el módulo: `#5865C8` (primario), `#EDEBFA` (fondo claro).

| Bloque | Control | Detalle |
|---|---|---|
| Header | Título `Filtros Avanzados` + `IconButton` X (cierra y descarta) | |
| Modalidad | `ToggleButtonGroup` exclusivo con 2 botones `Presencial` / `Virtual` | seleccionado: fondo `#5865C8`, texto blanco; no seleccionado: gris claro |
| Compensación | `RadioGroup` horizontal `Gratuito` / `Pago` | |
| Disponibilidad | 7 círculos `L M X J V S D` multi-select | seleccionado: fondo `#EDEBFA` + borde `#5865C8`; cada uno con `aria-label` del día completo ("Lunes"… "Domingo") y `aria-pressed` |
| (divisor) | | |
| Tutor Verificado | label con ícono check-círculo + subtítulo `Sólo mostrar perfiles validados por la universidad` + `Switch` a la derecha | |
| Calificación Mínima | `Rating` de 5 estrellas amarillas (`#FBBF24`, igual que `TutorResultCard`) | |
| Footer | `Limpiar Filtros` (outlined gris) · `Aplicar Filtros` (contained `#5865C8`) | "Limpiar Filtros" **vacía el borrador** y además, si había filtros aplicados, los aplica ya (limpia URL) y cierra el panel |

En modo Tutores el título de la página en el mockup es `Tutores` (hoy el código dice `Tutores Relacionados`); dejar el texto actual salvo que se confirme el cambio.

**Barra de filtros activos** (`ActiveFiltersBar`), debajo del título de la página, solo si hay filtros: una `Chip` `onDelete` por filtro + botón de texto `Limpiar filtros`. Etiquetas de chip:

| Filtro | Chip |
|---|---|
| modality | `Virtual` / `Presencial` |
| compensation | `Gratuito` / `Pago` |
| days | una chip **por día**: `Lunes`, `Martes`, … (quitar un día no quita los otros) |
| timeFrame | `Mañana` / `Tarde` / `Noche` |
| verifiedOnly | `Verificado` |
| minRating | `4+ ★` (texto `"{n}+ estrellas"` en `aria-label`) |

---

## Estructura de archivos (todo en `src/modules/student/`)

**Crear:**

```
interfaces/search-filters.interface.ts
schemas/search-filters.schema.ts
utils/search-filters.utils.ts
hooks/useSearchFilters.ts
components/SearchFiltersPopover.tsx
components/ActiveFiltersBar.tsx
```

**Modificar:**

```
constants.ts
api/search.api.ts
hooks/useSearchTutorsAndMaterias.ts
components/SearchBar.tsx
pages/SearchResultsPage.tsx
pages/TutoresPorMateriaPage.tsx
```

### 1. `interfaces/search-filters.interface.ts`

```ts
import type { SharedModality } from "@/shared/constants/modality";

export type CompensationFilter = "FREE" | "PAID";
export type WeekDay =
  | "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
export type TimeFrameFilter = "MORNING" | "AFTERNOON" | "EVENING";

export interface SearchFilters {
  modality?: SharedModality;        // "VIRTUAL" | "IN_PERSON"
  compensation?: CompensationFilter;
  daysOfWeek: WeekDay[];            // [] = sin filtro; siempre en orden L→D, sin repetidos
  timeFrame?: TimeFrameFilter;
  verifiedOnly: boolean;
  minRating?: 1 | 2 | 3 | 4 | 5;
}

export const EMPTY_SEARCH_FILTERS: SearchFilters = { daysOfWeek: [], verifiedOnly: false };
```

### 2. `schemas/search-filters.schema.ts`
Schema Zod (v4) que valida **cada parámetro por separado** y descarta los inválidos en vez de fallar (la URL la puede editar el usuario): usar `safeParse` campo por campo (o `.catch(undefined)`). Reglas: `modality ∈ {VIRTUAL, IN_PERSON}`; `compensation ∈ {FREE, PAID}`; `daysOfWeek` = split por coma, filtrar a valores válidos, deduplicar, ordenar L→D; `timeFrame` válido; `verifiedOnly` solo si es exactamente `"true"`; `minRating` entero 1–5. Exportar `type` con `z.infer` donde aplique.

### 3. `utils/search-filters.utils.ts`
Funciones puras (sin React):

| Función | Contrato |
|---|---|
| `parseSearchFilters(params: URLSearchParams): SearchFilters` | usa el schema; valores inválidos → ignorados |
| `applySearchFiltersToParams(params: URLSearchParams, filters: SearchFilters): URLSearchParams` | devuelve una **copia**; borra primero las 6 claves de filtro y escribe solo las presentes; **conserva** `q`/`materia` y cualquier otra clave |
| `hasActiveFilters(f)` / `countActiveFilters(f)` | `countActiveFilters` cuenta **grupos** activos (modalidad, compensación, disponibilidad —días y/o franja—, verificado, calificación; máx. 5); es lo que muestra el badge del botón |
| `buildFilterChips(f): { key: string; label: string; remove: (f: SearchFilters) => SearchFilters }[]` | una chip por filtro (y por día); `remove` devuelve los filtros sin ese elemento |
| `getEffectiveFilters(f, mode: SearchMode): SearchFilters` | `materias` → `f` tal cual; `tutores` → solo `daysOfWeek`, `timeFrame` y `minRating` (el resto en su valor vacío). Toda la UI y la API usan **esto**, no `f` crudo |
| `mergeDraft(current, draft, mode)` | aplica sobre `current` solo los campos visibles del modo; los ocultos se conservan |
| `clearForMode(current, mode)` | vacía solo los campos efectivos del modo |
| `toApiParams(f): Record<string, string>` | solo claves con valor; `daysOfWeek` como `join(",")`; `verifiedOnly` → `"true"`; `minRating` → string |

### 4. `constants.ts` (agregar, sin romper lo existente)

```ts
export const WEEK_DAYS: { letter: string; value: WeekDay; label: string }[] = [
  { letter: "L", value: "MONDAY", label: "Lunes" },
  { letter: "M", value: "TUESDAY", label: "Martes" },
  { letter: "X", value: "WEDNESDAY", label: "Miércoles" },
  { letter: "J", value: "THURSDAY", label: "Jueves" },
  { letter: "V", value: "FRIDAY", label: "Viernes" },
  { letter: "S", value: "SATURDAY", label: "Sábado" },
  { letter: "D", value: "SUNDAY", label: "Domingo" },
];
export const TIME_FRAME_LABEL: Record<TimeFrameFilter, string> = {
  MORNING: "Mañana", AFTERNOON: "Tarde", EVENING: "Noche",
};
export const COMPENSATION_LABEL: Record<CompensationFilter, string> = { FREE: "Gratuito", PAID: "Pago" };
export const EMPTY_FILTERED_MESSAGE = "No se encontraron tutores para los filtros seleccionados";
export const EMPTY_SEARCH_MESSAGE = "No se encontraron resultados para tu búsqueda";
```

Extender **sin cambiar el comportamiento con un solo argumento**:
`buildSearchResultsRoute(query, filters?)` y `buildMateriaTutorsRoute(nombre, filters?)` → mismas URLs de hoy cuando `filters` es `undefined`/vacío; si hay filtros, agregan sus params usando `applySearchFiltersToParams`.

### 5. `api/search.api.ts`
`searchTutors(query: string, filters?: SearchFilters)`: `httpClient.get<TutorSearchResult[]>(url, { params: filters ? toApiParams(filters) : undefined })`. Misma URL base de hoy. Actualizar el comentario de contrato (menciona la rama vieja `Julian-SalvucciV3`).

### 6. `hooks/useSearchTutorsAndMaterias.ts`

```ts
export function useSearchTutorsAndMaterias(
  query: string,
  filters?: SearchFilters,
  options?: { enabled?: boolean }
)
```
- `queryKey: [STUDENTS_SEARCH_KEY, trimmedQuery, toApiParams(filters ?? EMPTY_SEARCH_FILTERS)]` — **objeto normalizado**, así `{}` (sin filtros) es la misma key que usa el dropdown de sugerencias. No cambiar `STUDENTS_SEARCH_KEY` (el prefijo se usa para invalidar).
- `enabled: trimmedQuery.length > 0 && (options?.enabled ?? true)`.

### 7. `hooks/useSearchFilters.ts`
Sobre `useSearchParams` de `react-router-dom`:

```ts
const { filters, effectiveFilters, mode, setMode, setFilters, removeChip, clearFilters, hasActive } = useSearchFilters();
```
- `mode` = `searchParams.get("mode") === "tutores" ? "tutores" : "materias"`; `setMode` escribe/borra `mode` (conservando el resto). En `/student/tutores` forzar `"materias"` (no hay toggle ahí). `effectiveFilters = getEffectiveFilters(filters, mode)`; `hasActive`, chips y badge se calculan sobre `effectiveFilters`.
- `filters` = `useMemo(() => parseSearchFilters(searchParams), [searchParams])`.
- `setFilters(next)` = `setSearchParams(applySearchFiltersToParams(searchParams, next))` (push, para que "atrás" funcione).
- `clearFilters()` = `setFilters(EMPTY_SEARCH_FILTERS)`.
- `removeChip(chip)` = `setFilters(chip.remove(filters))`.

### 8. `components/SearchFiltersPopover.tsx`

```ts
interface SearchFiltersPopoverProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  mode: SearchMode;                       // define qué secciones se renderizan
  filters: SearchFilters;                 // aplicados (fuente de verdad: URL)
  onApply: (next: SearchFilters) => void;
  onClose: () => void;
}
```
- `useState<SearchFilters>` borrador, **resincronizado con `filters` cada vez que el panel pasa a `open`** (sin `useEffect` + fetch; un `useEffect` o `key` solo para sincronizar estado local está permitido).
- "Aplicar Filtros" → `onApply(mergeDraft(filters, draft, mode))`; "Limpiar Filtros" → `onApply(clearForMode(filters, mode))` (limpia y cierra).
- Es un componente de presentación: no hace HTTP ni lee la URL.
- Accesibilidad: `role="dialog"`, `aria-labelledby` del título; cada control con label; navegación por teclado; Esc cierra.

### 9. `components/ActiveFiltersBar.tsx`
Props: `filters`, `onRemove(chip)`, `onClear()`. Devuelve `null` si no hay filtros. Cada `Chip` con `onDelete` y `aria-label` "Quitar filtro {label}". Botón de texto `Limpiar filtros`.

### 10. `components/SearchBar.tsx`
- Agregar el botón de filtros como `endAdornment` del `TextField` **solo** si `useMatch("/student/buscar") || useMatch("/student/tutores")` y no es modo TUTOR.
- Estado local `filtersAnchor: HTMLElement | null`. Abrir el panel cierra el dropdown de sugerencias (`setOpen(false)`).
- Pasar `mode` de `useSearchFilters()` al popover. `onApply` → `setFilters(next)` y cerrar.
- **No** cambiar el flujo existente de sugerencias (las sugerencias siguen sin filtros) ni el `Enter` → `navigate(buildSearchResultsRoute(query))` (una **nueva búsqueda parte sin filtros**; es el comportamiento esperado).
- Cuidar que el `ClickAwayListener` existente no cierre el panel por clics adentro (el `Popover` va en portal; los eventos burbujean por el árbol de React, debería andar — verificar a mano).

### 11. `pages/SearchResultsPage.tsx`
- `const { filters, effectiveFilters, mode, setMode, removeChip, clearFilters, hasActive } = useSearchFilters();` — el `SearchModeToggle` pasa a usar `mode`/`setMode` (URL) en lugar de `useState`.
- `useSearchTutorsAndMaterias(query, effectiveFilters)` para la lista (los `materias` se derivan de **esta** lista filtrada).
- Base para AC-5: `const filteredEmpty = !isFetching && tutores.length === 0;` y
  `useSearchTutorsAndMaterias(query, undefined, { enabled: hasActive && filteredEmpty })`.
- Mensaje vacío: si `hasActive` y (`baseTutores.length > 0` **o** la base aún está cargando) → `EMPTY_FILTERED_MESSAGE`; si `hasActive` y la base cargó vacía → `EMPTY_SEARCH_MESSAGE`; si no hay filtros → `EMPTY_SEARCH_MESSAGE` (igual que hoy). Mientras la base carga, mostrar `Buscando…`, no un mensaje provisorio.
- Renderizar `<ActiveFiltersBar>` entre el header y los resultados. Reemplazar la constante local `EMPTY_MESSAGE` por la de `constants.ts`.
- Al hacer clic en una materia: `navigate(buildMateriaTutorsRoute(materia.name, filters))` (acá `filters` completo: es modo Materias, todos son efectivos).
- Las dos ramas vacías (modo materias y modo tutores) usan la misma lógica de mensaje.

### 12. `pages/TutoresPorMateriaPage.tsx`
Mismo patrón: `useSearchFilters()`, `useSearchTutorsAndMaterias(materiaNombre, filters)`, `ActiveFiltersBar`, y para lista vacía: con filtros activos → `EMPTY_FILTERED_MESSAGE` (misma verificación de base con `materiaNombre`); sin filtros → el texto actual `No hay tutores disponibles para esta materia todavía.` (no cambiar ese texto: lo cubre un test existente).

---

## Tests (Vitest + React Testing Library)

Fixtures: extender `test/fixtures/busqueda/tutoresDePrueba.ts` (no crear otro). Los tests de páginas siguen el patrón existente: `vi.mock` del hook + `MemoryRouter`; para distinguir llamada filtrada vs. base usar `mockImplementation((q, filters) => ...)`.

Crear:

| Archivo | Casos |
|---|---|
| `test/modules/student/utils/search-filters.utils.test.ts` | parse→serialize→parse es idempotente; valores inválidos en URL se ignoran (`modality=XXX`, `minRating=9`, `daysOfWeek=MONDAY,FOO`); días ordenados L→D y sin duplicados; `applySearchFiltersToParams` conserva `q`; `toApiParams` manda `daysOfWeek` con comas y omite lo vacío; `buildFilterChips` da una chip por día; `remove` de una chip no toca las demás; `buildSearchResultsRoute("x")` sin filtros == URL actual |
| `test/modules/student/components/SearchFiltersPopover.test.tsx` | con `mode="materias"` muestra las 5 secciones; con `mode="tutores"` solo Disponibilidad y Calificación; modalidad exclusiva y se deselecciona con 2º clic; días multi-select (`aria-pressed`); estrellas: clic fija, 2º clic sobre el mismo valor borra; "Aplicar" llama `onApply` con el borrador exacto; "Limpiar Filtros" llama `onApply(EMPTY_SEARCH_FILTERS)`; X y Esc llaman `onClose` **sin** `onApply`; al reabrir muestra los filtros aplicados, no un borrador descartado |
| `test/modules/student/utils/search-filters.mode.test.ts` | `getEffectiveFilters` en `tutores` descarta modalidad/compensación/verificado; `mergeDraft` en `tutores` conserva los ocultos; `clearForMode` en `tutores` no borra los de materia |
| `test/modules/student/components/ActiveFiltersBar.test.tsx` | no renderiza sin filtros; una chip por filtro; quitar chip llama `onRemove` con la chip correcta; "Limpiar filtros" llama `onClear` |
| `test/modules/student/pages/SearchResultsPage.test.tsx` | con filtros en la URL el hook se llama con esos filtros; chips visibles; AC-5: filtrado vacío + base con resultados → `EMPTY_FILTERED_MESSAGE`; filtrado vacío + base vacía → `EMPTY_SEARCH_MESSAGE`; sin filtros y vacío → `EMPTY_SEARCH_MESSAGE` y la base **no** se consulta (`enabled:false`); clic en materia navega conservando filtros; en `?mode=tutores` el hook se llama solo con disponibilidad/calificación aunque la URL tenga `modality=VIRTUAL`; el toggle escribe `mode` en la URL |

Actualizar:
- `SearchBar.test.tsx`: el ícono de filtros **no** aparece en `/student/home`, **sí** en `/student/buscar`, **no** aparece en modo TUTOR; "Aplicar" escribe los params en la URL conservando `q`.
- `TutoresPorMateriaPage.test.tsx`: con filtros activos y lista vacía → `EMPTY_FILTERED_MESSAGE`; sin filtros se mantiene el texto actual.

Comandos: `pnpm test` (o `npm test`), `npm run lint`, `npm run build` (typecheck con `tsc -b`). Los tres deben pasar.

## No hacer

- No usar Zustand ni `useState` global para los filtros ni para el modo: van en la URL.
- No mostrar Modalidad/Compensación/Verificado en modo Tutores, ni enviarlos al backend en ese modo.
- No enviar `daysOfWeek` como array de axios (rompe el binding de Spring); siempre `join(",")`.
- No enviar `modality=BOTH` ni parámetros vacíos.
- No agregar UI de franja horaria (solo tipo/serialización/chip).
- No mostrar el ícono de filtros fuera de `/student/buscar` y `/student/tutores`.
- No cambiar el comportamiento del dropdown de sugerencias ni agregarle filtros.
- No llamar axios desde componentes; no `useEffect` + fetch; no `any`; no `style={{}}`.
- No crear en `shared/` nada que solo use este módulo.
- No modificar `knowlink-backend`.
- No agregar dependencias nuevas (MUI, `react-router-dom`, Zod ya alcanzan).
- No sincronizar el texto del input de la barra con `?q=` (limitación preexistente, fuera de US-49).

## Definition of Done

- [ ] Panel "Filtros Avanzados" fiel a ambos mockups: 5 filtros en Materias, solo Disponibilidad y Calificación en Tutores; botones Limpiar/Aplicar.
- [ ] Modo en la URL (`mode`); cambiar de modo conserva los filtros de materia sin enviarlos en Tutores.
- [ ] Filtros en la URL (`modality`, `compensation`, `daysOfWeek`, `verifiedOnly`, `minRating`, `timeFrame`); recargar la página los conserva.
- [ ] Aplicar actualiza la lista pidiendo al backend con los parámetros correctos (`daysOfWeek` con comas).
- [ ] Chips de filtros activos + badge con cantidad en el botón (AC-3).
- [ ] Quitar chip individual y "Limpiar filtros" funcionan y restauran los resultados originales (AC-4).
- [ ] Mensajes AC-5 diferenciados (filtros vs. búsqueda base) en `/student/buscar` y `/student/tutores`.
- [ ] Filtros se propagan al navegar de una materia a `/student/tutores`.
- [ ] Tests nuevos y actualizados pasan; no se rompió ningún test existente.
- [ ] `lint`, `build` (tsc) y `test` en verde.
