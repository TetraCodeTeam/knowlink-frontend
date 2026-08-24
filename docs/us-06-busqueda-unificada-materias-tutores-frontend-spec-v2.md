# US-06 · Búsqueda Unificada de Materias y Tutores — SPEC FRONTEND (v2, sobre código existente)

**Repo:** knowlink-frontend · branch base: `julian-salvucci`
**Módulo:** `src/modules/student`
**Story Points:** 5 · **Prioridad:** CRÍTICA

> Esta spec **no reescribe** `SearchBar.tsx` ni `SearchResultsPanel.tsx` — ya están implementados y funcionando. Es un **gap-analysis**: qué falta para que la historia cumpla sus 7 criterios de aceptación, tomando el código de la rama como fuente de verdad.

---

## 0. Inventario de lo que ya existe (confirmado leyendo el repo)

| Archivo | Estado | Notas |
|---|---|---|
| `components/SearchBar.tsx` | ✅ Completo | Input pill, guard de rol tutor (deshabilitado + candado + caption), Popper anclado con `sameWidthModifier`, `ClickAwayListener`, cierre con `Escape`. |
| `components/SearchResultsPanel.tsx` | ✅ Completo | Dos columnas (Materias/Tutores), estado `loading`, estado vacío con el texto exacto del criterio 6, `highlightMatch`. |
| `hooks/useSearchTutorsAndMaterias.ts` | ✅ Completo | React Query, **sin debounce** (decisión ya tomada — dispara 1 request por tecla contra `/api/v1/tutors/search/{query}`). |
| `api/search.api.ts` | ⚠️ Parcial | Pega a `GET /api/v1/tutors/search/{query}`, que **solo matchea por nombre de materia** (`findBySubject_NameContainingIgnoreCase`), no por nombre de tutor. |
| `constants.ts` (`buildTutorProfileRoute`, `buildMateriaTutorsRoute`) | 🔴 **Roto** | Ver §1 y §2. |
| `interfaces/tutor-search-result.interface.ts` | ✅ En uso | `TutorSearchResult` + `SubjectSummary` (con `career`). Es el tipo real que consume todo el feature. |
| `interfaces/materia-search-result.interface.ts` | 🗑️ Muerto | `MateriaSearchResult { materiaId, nombre }` — **cero imports en todo el repo**. |
| `interfaces/search-results.interface.ts` | 🗑️ Muerto | Redefine `TutorSearchResult` con `subjects: string[]` (forma vieja, incompatible con la actual) — **cero imports en todo el repo**. |
| Ruta destino de tutor (`StudentRoutes.tsx`) | Existe, pero con otro path | `path="tutor/:tutorId"` montado bajo `/student/*` → path real: **`/student/tutor/:tutorId`**. |
| Ruta destino de materia (`/tutores?materia=...`) | 🔴 **No existe** | `StudentRoutes.tsx` no tiene ninguna ruta `tutores`. Al día de hoy, clickear una materia navega a una ruta inexistente → 404 / fallback. |
| `test/.../SearchBar.test.tsx` | ✅ Completo | Cubre placeholder, sugerencias dinámicas, empty state, guard de rol. El CP-003.15 ("matchea por nombre") está **mockeado a nivel hook**, no prueba el contrato real del backend. |

---

## 1. 🔴 Bug — `buildTutorProfileRoute` apunta a una ruta que no existe

**Archivo:** `src/modules/student/constants.ts`

```ts
// ACTUAL (roto):
export function buildTutorProfileRoute(tutorId: string): string {
  return `/tutores/${tutorId}`;
}
```

La ruta real registrada en `StudentRoutes.tsx` es `tutor/:tutorId` (singular) montada bajo `/student/*` (ver `RoutesProvider.tsx`). Es decir, el path real es `/student/tutor/:tutorId`, no `/tutores/:id`.

**Fix:**

```ts
export function buildTutorProfileRoute(tutorId: string): string {
  return `/student/tutor/${tutorId}`;
}
```

✅ Con este fix, "Click en un Tutor" (criterio 4) redirige correctamente a `ViewTutorProfile.tsx` (el componente que exporta `TutorProfilePage`), que ya lee `tutorId` con `useParams()`.

---

## 2. 🔴 Falta — página y ruta de "Tutores que dictan la materia X" (criterio 3)

Hoy `buildMateriaTutorsRoute` arma `/tutores?materia=${nombre}` pero **no hay ninguna ruta ni página que la resuelva**. Hay que crear ambas cosas.

### 2.1 Fix de la constante (alinear con el prefijo `/student`)

```ts
export function buildMateriaTutorsRoute(materiaNombre: string): string {
  return `/student/tutores?materia=${encodeURIComponent(materiaNombre)}`;
}
```

### 2.2 Nueva ruta en `StudentRoutes.tsx`

```tsx
import TutoresPorMateriaPage from "@/modules/student/pages/TutoresPorMateriaPage";

// dentro de <Route element={<StudentLayout />}>:
<Route path="tutores" element={<TutoresPorMateriaPage />} />
```

### 2.3 Nueva página: `src/modules/student/pages/TutoresPorMateriaPage.tsx`

**Dato clave:** no hace falta un endpoint nuevo. El backend ya filtra por nombre de materia en `/api/v1/tutors/search/{query}` — si mandamos el **nombre exacto de la materia** como query, el mismo endpoint devuelve exactamente los tutores que la dictan. Es decir, esta página **reutiliza `useSearchTutorsAndMaterias`**.

```tsx
import { useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, Grid, Typography } from "@mui/material";
import { useSearchTutorsAndMaterias } from "../hooks/useSearchTutorsAndMaterias";
import { buildTutorProfileRoute } from "../constants";
import TutorResultCard from "../components/TutorResultCard"; // nuevo, ver 2.4

export default function TutoresPorMateriaPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const materiaNombre = searchParams.get("materia") ?? "";

  const { data, isFetching } = useSearchTutorsAndMaterias(materiaNombre);
  const tutores = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        Tutores que pueden ayudarte en {materiaNombre}
      </Typography>

      {isFetching ? (
        <Typography color="text.secondary">Buscando tutores…</Typography>
      ) : tutores.length === 0 ? (
        <Typography color="text.secondary">
          No hay tutores disponibles para esta materia todavía.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {tutores.map((tutor) => (
            <Grid key={tutor.tutorId} size={{ xs: 12, sm: 6, md: 4 }}>
              <TutorResultCard
                tutor={tutor}
                onClick={() => navigate(buildTutorProfileRoute(tutor.tutorId))}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
```

> **Sobre "la primera materia debe ser la más cercana a la búsqueda":** con este enfoque no aplica igual que en el análisis anterior — acá no hay múltiples materias en la página de destino, hay **una** materia (la elegida) y una grilla de tutores. El nombre que se muestra en el header (`materiaNombre`) es literalmente el que el alumno clickeó en el dropdown, así que siempre es exacto, no aproximado. Si en el futuro se agrega tolerancia a variantes de nombre (ej. "Bases de Datos" vs "Sistemas de Bases de Datos Avanzadas"), ahí sí habría que decidir cuál nombre mostrar — **no es necesario para cumplir los criterios de aceptación actuales de US-06**, queda como nota para US-06B si aparece ese caso.

### 2.4 Nuevo componente: `TutorResultCard.tsx`

Card para el grid de la Imagen 2 (avatar, nombre, rating, chips de materias). Puede reusar mucho de `TutorRow` de `SearchResultsPanel.tsx` pero en formato card en vez de fila de dropdown — extraer lo compartido a un helper si conviene, o directamente crear una versión nueva más grande (avatar más grande, chips visibles de `subjects[].name`, sin necesidad de `highlightMatch` porque acá no hay texto de búsqueda activo).

```tsx
interface TutorResultCardProps {
  tutor: TutorSearchResult;
  onClick: () => void;
}
```

- Avatar 56px, nombre, rating (mismo patrón que `TutorRow`: `StarIcon` + promedio + cantidad de reseñas, o "Sin reseñas aún").
- Chips (`Chip` de MUI) con `tutor.subjects.map(s => s.name)`.
- Card completa clickeable (`CardActionArea` de MUI) → `onClick`.

---

## 3. ✅ Backend confirmado (rama `Julian-SalvucciV3`) — el criterio 4 ya se cumple

**Corrección sobre una versión anterior de esta spec:** se había marcado esto como gap de backend a partir de un comentario desactualizado en `search.api.ts`. Al leer el código real de `knowlink-backend` (rama `Julian-SalvucciV3`) se confirma que **el match por nombre de tutor ya está implementado**:

```java
// TutorProfileServiceImpl#searchTutor
List<TutorProfile> nameMatches = tutorProfileRepository
    .findByUser_FullNameContainingIgnoreCase(query);
```

Esto se combina (dedupeado por `tutorId`, vía `groupedResults`) con el match por materia (`TutorSearchSpecifications.subjectNameContains`). Hay un test de integración (`TutorSearchControllerTest`) que lo cubre sembrando tutores con nombres distintos y verificando el match. **No hace falta ningún cambio de backend para este punto** — el comentario de `search.api.ts` en el frontend quedó desactualizado y conviene corregirlo/borrarlo para no confundir a quien lea el código después:

```ts
// ACTUALIZAR el comentario de search.api.ts: ya no es cierto que
// "Matchea únicamente por nombre de materia, NO por nombre de tutor".
```

### 3.1 🐛 Bug real encontrado en backend (sí bloqueante, pero de datos, no de contrato)

En `TutorSearchMapper.from()`:

```java
return new TutorSearchResponse(
    tutorProfile.getUser().getUserId(),
    tutorProfile.getUser().getFullName(),
    tutorProfile.getProfilePictureUrl(),
    tutorProfile.getAverageRating(),
    4, // o getTotalReviews() según tu entidad   <-- HARDCODEADO
    ...
);
```

`totalReviews` está fijo en `4` para **todos** los tutores. El frontend (`TutorRow` en `SearchResultsPanel.tsx`) muestra ese número tal cual (`({tutor.totalReviews} Reseñas)`), así que hoy en producción todas las cards del buscador van a decir "(4 Reseñas)" sin importar la realidad. Esto no es un problema de esta spec de frontend, pero **si no se corrige en backend, el frontend va a mostrar un dato incorrecto sin que haya nada mal en su propio código** — vale la pena dejarlo anotado acá para no perderlo de vista al validar la historia. Fix sugerido (spec de backend aparte): usar `ratingRepository.findVisibleByRatedUserId(userId).size()`, mismo patrón que ya usa `TutorProfileServiceImpl` para el perfil completo del tutor.

### 3.2 Nota — filtros de US-06B ya están soportados por el backend

El endpoint `/api/v1/tutors/search/{query}` ya acepta `modality`, `compensation`, `dayOfWeek`, `verifiedOnly` y `minRating` como query params opcionales combinables con AND (`TutorSearchFilters`). El frontend hoy no los envía. Cuando se aborde US-06B, no hace falta tocar backend — alcanza con agregar esos params a `searchTutors()` en `search.api.ts` y la UI de filtros correspondiente.

---

## 4. 🗑️ Limpieza — interfaces muertas

Sin ningún `import` en todo el repo (confirmado con grep):

- `src/modules/student/interfaces/materia-search-result.interface.ts`
- `src/modules/student/interfaces/search-results.interface.ts` (redefine `TutorSearchResult` con una forma vieja e incompatible con `tutor-search-result.interface.ts` — riesgo de que alguien importe el archivo equivocado por error de autocompletado)

**Acción:** eliminar ambos archivos. Si en algún momento el backend empieza a exponer un catálogo de materias con `materiaId` propio (relacionado con US-43), recrear la interfaz en ese momento con el shape real que devuelva el backend, no antes.

---

## 5. Checklist de criterios de aceptación (estado real, no aspiracional)

| # | Criterio | Estado |
|---|---|---|
| 1 | Campo único de texto | ✅ Ya implementado |
| 2 | Resultados mixtos en dos secciones | ✅ Ya implementado |
| 3 | Click en materia → tutores que la dictan | 🔴 Falta ruta + página (§2) |
| 4 | Click en tutor → perfil completo / tutores matchean por nombre | 🔴 Ruta rota (§1). El match por nombre en backend ya funciona (§3) |
| 5 | Sugerencias dinámicas sin confirmar búsqueda | ✅ Ya implementado (sin debounce, por decisión propia) |
| 6 | Mensaje de "no se encontraron resultados" | ✅ Ya implementado, texto exacto |
| 7 | Guard de rol (solo alumno activo, tutor bloqueado) | ✅ Ya implementado en frontend — falta confirmar que el backend realmente devuelve 403 con `@PreAuthorize("hasRole('STUDENT')")` cuando corresponde (dice el comentario que sí, no lo tengo verificado end-to-end) |

---

## 6. Trabajo a realizar (resumen accionable)

1. Fix `buildTutorProfileRoute` → `/student/tutor/${tutorId}` (constants.ts).
2. Fix `buildMateriaTutorsRoute` → agregar prefijo `/student` (constants.ts).
3. Crear `TutoresPorMateriaPage.tsx` + registrar ruta `tutores` en `StudentRoutes.tsx`.
4. Crear `TutorResultCard.tsx` para el grid de esa página.
5. Eliminar `materia-search-result.interface.ts` y `search-results.interface.ts`.
6. Actualizar/borrar el comentario desactualizado en `search.api.ts` que dice que el backend "NO" matchea por nombre de tutor (§3). Avisar a backend del bug de `totalReviews` hardcodeado en `TutorSearchMapper` (§3.1) — no bloquea el frontend, pero conviene que quede trackeado.
7. Tests nuevos:
   - `TutoresPorMateriaPage.test.tsx`: título muestra el nombre de la materia del query param, grid renderiza `TutorResultCard` por cada tutor, estado vacío, click navega con la ruta corregida.
   - Actualizar/agregar test de `SearchBar` que verifique que al clickear una materia se llama a `navigate` con `/student/tutores?materia=...` (hoy no hay ningún test que cubra la navegación, solo el render de resultados).
