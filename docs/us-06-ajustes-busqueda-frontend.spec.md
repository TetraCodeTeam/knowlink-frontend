# US-06 · Búsqueda unificada — Ajustes de QA (SPEC FRONTEND)

## 0. Metadata

| Campo | Valor |
|---|---|
| Historia | US-06 (Búsqueda unificada), ajustes surgidos de QA |
| Módulo | `student` (`src/modules/student`) |
| Repo / rama base | `TetraCodeTeam/knowlink-frontend` · `dev` |
| Ejecuta | OpenCode + DeepSeek V4 Flash |
| Depende de | `us-06-ajustes-busqueda-backend.spec.md` (endpoint `GET /api/v1/subjects/search/{query}` y orden de `/tutors/search`) |
| Estado del servidor | TanStack Query (`useQuery`), sin Zustand |

## 1. Contexto y causa raíz (verificada sobre `dev`)

1. `SearchBar.tsx` y `SearchResultsPage.tsx` obtienen las materias con `deriveMateriasFromTutors(tutors)`: solo existen las materias que algún tutor devuelto dicta. Una materia sin tutores nunca aparece, y con la base vacía el panel muestra "No se encontraron resultados para tu búsqueda".
2. El orden de los tutores es el que manda el backend (que hoy no ordena). `deriveMateriasFromTutors` sí ordena por `localeCompare`, pero sin dar prioridad a las que empiezan con el texto buscado.
3. `TutoresPorMateriaPage.tsx` muestra "No hay tutores disponibles para esta materia todavía." (texto simple, sin el estado vacío con Frankie).

## 2. Decisiones confirmadas

- Si busca "Álgebra" y no tiene tutores: la materia **aparece en el selector** (panel de sugerencias y página de resultados).
- Al ingresar a la materia sin tutores se muestra el cartel **"No se encontraron tutores para esta materia"**.
- Orden alfabético en sugerencias y resultados (tutores y materias), con prioridad a los que empiezan con el texto buscado. El orden de tutores y de materias del catálogo **lo define el backend**; el frontend no reordena esas listas.
- Con **filtros avanzados activos** (US-49) las materias se siguen derivando de los tutores filtrados (una materia "cumple" un filtro de modalidad/compensación/etc. solo si algún tutor lo cumple). Sin filtros, las materias salen del catálogo.

## 3. Criterios de aceptación (Gherkin)

```gherkin
Escenario: Materia sin tutores en el panel de sugerencias
  Dado que la materia "Álgebra" existe y no tiene tutores
  Cuando el alumno escribe "alg" en la barra de búsqueda
  Entonces el panel muestra la sección "Materias" con "Álgebra"
  Y no muestra la sección "Tutores"
  Y no muestra "No se encontraron resultados para tu búsqueda"

Escenario: Sin materias ni tutores
  Cuando el alumno escribe un texto que no coincide con ninguna materia ni tutor
  Entonces el panel muestra "No se encontraron resultados para tu búsqueda"

Escenario: Entrar a una materia sin tutores
  Dado el panel con la materia "Álgebra" sin tutores
  Cuando el alumno hace clic en "Álgebra"
  Entonces navega a la pantalla de tutores de esa materia
  Y se muestra el cartel "No se encontraron tutores para esta materia"

Escenario: Orden de sugerencias de tutores
  Dado los tutores "Claudia Pereyra", "Elena Ruiz", "Agustina Díaz", "Ana López"
  Cuando el alumno escribe "a"
  Entonces el panel lista los tutores en el orden que devuelve el backend: Agustina, Ana, Claudia, Elena
  # (limitado por MAX_SEARCH_SUGGESTIONS = 4)

Escenario: Orden de sugerencias de materias
  Dado las materias "Base de Datos", "Álgebra", "Análisis", "Cálculo"
  Cuando el alumno escribe "a"
  Entonces el panel lista: Álgebra, Análisis, Base de Datos, Cálculo

Escenario: Página de resultados, modo Materias, sin filtros
  Cuando el alumno presiona Enter con "alg"
  Entonces en el modo "Materias" se listan las materias del catálogo, incluidas las que no tienen tutores

Escenario: Página de resultados, modo Materias, con filtros activos
  Dado filtros avanzados aplicados
  Entonces las materias se derivan de los tutores filtrados (comportamiento actual)
  Y se mantienen los mensajes EMPTY_FILTERED_MESSAGE / EMPTY_SEARCH_MESSAGE de US-49
```

## 4. Cambios por archivo (`src/modules/student`)

### 4.1 API — `api/search.api.ts` (agregar)
```ts
/**
 * GET /api/v1/subjects/search/{query}
 * -> SubjectSummary[]  (materias del catálogo de la institución del alumno, con o sin tutores;
 *    ya ordenadas por el backend). Requiere rol STUDENT.
 */
export async function searchSubjects(query: string): Promise<SubjectSummary[]> {
  const response = await httpClient.get<SubjectSummary[]>(
    `/api/v1/subjects/search/${encodeURIComponent(query)}`
  );
  return response.data;
}
```
- Usar `SubjectSummary` de `interfaces/tutor-search-result.interface.ts` (mismo shape `{ name, career }`).
- Imports con alias `@/`, solo `httpClient` de `@/shared/lib/httpClient`.

### 4.2 Hook — `hooks/useSearchSubjects.ts` (nuevo)
- `useQuery` con `queryKey: [STUDENTS_SEARCH_KEY, "subjects", trimmedQuery]`.
- La key **debe empezar con `STUDENTS_SEARCH_KEY`** para que las invalidaciones por prefijo ya existentes (ver auditoría previa de US-06) también la alcancen. No crear una constante raíz nueva.
- `enabled: trimmedQuery.length > 0 && (options?.enabled ?? true)`. Misma firma de opciones que `useSearchTutorsAndMaterias`.
- Sin debounce (mismo criterio que el hook de tutores, ver comentario en `SearchBar.tsx`).

### 4.3 `components/SearchBar.tsx` (modificar)
- Agregar `const { data: subjectsData, isFetching: isFetchingSubjects } = useSearchSubjects(inputValue);`.
- `materias` = `Array.isArray(subjectsData) ? subjectsData : []`. **Eliminar** `deriveMateriasFromTutors` de este archivo (el dropdown no tiene filtros).
- `loading={isFetching || isFetchingSubjects}`.
- `materias.slice(0, MAX_SEARCH_SUGGESTIONS)` y `tutors.slice(0, MAX_SEARCH_SUGGESTIONS)` se mantienen; **no reordenar** antes del `slice` (el backend ya manda el orden).

### 4.4 `components/SearchResultsPanel.tsx`
- Sin cambios de lógica: `hasResults = hasMaterias || hasTutors` ya permite mostrar solo la sección Materias. Verificar que con `tutors = []` y `materias.length > 0` se renderiza una sola columna sin el `Divider`.

### 4.5 `pages/SearchResultsPage.tsx` (modificar)
- Llamar a `useSearchSubjects(query, { enabled: !hasActive })`.
- `materias = hasActive ? deriveMateriasFromTutors(tutores, query) : (subjectsData ?? [])`.
- `isFetching` combinado: incluir `isFetchingSubjects` solo cuando `!hasActive`.
- Empty state del modo materias: sin filtros, "vacío" = catálogo vacío (ya no depende de `tutores`). Con filtros, mantener la lógica actual (`baseTutores`, `EMPTY_FILTERED_MESSAGE`).
- El modo "Tutores" no cambia.

### 4.6 `utils/derive-materias.ts` (modificar, solo para el caso con filtros)
- Firma nueva: `deriveMateriasFromTutors(tutors, query?)`.
- Ordenar con los **mismos rangos que el backend** (empieza con el texto → otra palabra empieza → contiene), normalizando minúsculas y diacríticos (`normalize("NFD").replace(/\p{M}/gu, "")`), y desempate con `localeCompare(b.name, "es", { sensitivity: "base" })`.
- Si `query` es undefined, se comporta como hoy (alfabético).
- Actualizar el comentario del archivo: ya no es el camino principal sino el de "materias filtradas por tutores".

### 4.7 `pages/TutoresPorMateriaPage.tsx` (modificar)
- Reemplazar `NO_TUTORS_MESSAGE` por una constante en `constants.ts`: `EMPTY_SUBJECT_TUTORS_MESSAGE = "No se encontraron tutores para esta materia"`.
- Para el caso `tutores.length === 0`, usar el componente `EmptyState` de `@/shared/components/EmptyState` con el mismo estilo que `SearchResultsPage` (`mood="thinking"`, `accessories={["magnifier"]}`) y el mensaje nuevo. Seguir `docs/frankie.md` para estados vacíos.
- Mantener el mensaje `EMPTY_FILTERED_MESSAGE` cuando hay filtros activos y la búsqueda base sí tiene tutores (lógica actual).

### 4.8 `constants.ts`
- Agregar `EMPTY_SUBJECT_TUTORS_MESSAGE`. No modificar `EMPTY_SEARCH_MESSAGE` ni `EMPTY_FILTERED_MESSAGE`.

## 5. Dependencias y advertencias

- **Backend primero.** Sin `GET /api/v1/subjects/search/{query}` el panel quedaría sin materias. Si el endpoint falla, el panel debe seguir mostrando los tutores (no bloquear la sección Tutores por un error de materias).
- `TutoresPorMateriaPage` llama a `useSearchTutorsAndMaterias(materiaNombre)`, que matchea por *contiene*: al entrar a "Álgebra" también pueden venir tutores de "Álgebra Lineal". Es un comportamiento previo; **no** corregirlo en este cambio.
- El modo tutor (`TUTOR_ROLE`) deshabilita la barra: no disparar `useSearchSubjects` en ese caso (el hook de tutores ya no se ejecuta en esa rama porque el `return` temprano ocurre después de los hooks; mantener `enabled` coherente para que no haya 403 en modo tutor).
- Revisar que ninguna otra pantalla importe `deriveMateriasFromTutors` con la firma vieja (`grep` de usos antes de cambiarla).

## 6. Convenciones del repo (`CLAUDE.md` / `docs/base-standards.md`)

- Imports con alias `@/`; HTTP solo en `api/`; `useQuery` en `hooks/`; nada de `useEffect` + `fetch`.
- Sin `any`. Prettier: comillas dobles, `;`, printWidth 100, 2 espacios.
- Estilos: MUI para estructura, Tailwind para utilidades.
- Toasts: `@/shared/lib/toast`, nunca `sonner` directo (no aplica a este cambio, solo recordatorio).

## 7. Tests

Seguir la convención de tests ya usada en `modules/student` (verificar el runner existente antes de crear archivos nuevos):

1. `derive-materias`: con query, orden por rango (empieza → palabra → contiene) y desempate alfabético; sin query, alfabético.
2. `SearchResultsPanel`: solo materias (sin tutores) renderiza la sección Materias sin divisor y sin el mensaje de vacío; ambas vacías muestra "No se encontraron resultados para tu búsqueda".
3. `TutoresPorMateriaPage`: sin tutores muestra "No se encontraron tutores para esta materia"; con filtros activos y base con tutores muestra `EMPTY_FILTERED_MESSAGE`.
4. `SearchBar`: con la respuesta de materias llena y tutores vacía, el panel muestra Materias.

## 8. "No hacer"

- No reordenar en el frontend las listas de tutores ni de materias del catálogo (el orden lo define el backend).
- No usar `useEffect` + `axios` para pedir materias.
- No importar `sonner` ni crear una key raíz nueva de React Query.
- No agregar debounce ni cambiar `MAX_SEARCH_SUGGESTIONS` en este cambio.
- No cambiar el contrato ni el comportamiento de `searchTutors`.
- No tocar los filtros avanzados (`SearchFiltersPopover`, `useSearchFilters`).

## 9. Definition of Done

- [x] Buscar "alg" con la base sin tutores muestra "Álgebra" en el panel y en la página de resultados (modo Materias, sin filtros).
- [x] Entrar a la materia sin tutores muestra "No se encontraron tutores para esta materia" con `EmptyState`.
- [x] Sugerencias de tutores y materias en el orden esperado (a → Agustina, Ana, Claudia, Elena).
- [x] Con filtros activos el comportamiento de US-49 no cambia.
- [x] Un fallo de `/subjects/search` no oculta la sección Tutores.
- [x] `npm run lint`, `npm run build` y tests en verde.
