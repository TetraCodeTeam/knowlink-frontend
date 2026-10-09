# US-06 · Búsqueda — SPEC FRONTEND v3 (Enter → pantalla de resultados + límite de sugerencias)

**Repo:** knowlink-frontend
**Módulo:** `src/modules/student`
**Alcance:** extiende el buscador ya implementado (`SearchBar.tsx`, `SearchResultsPanel.tsx`, `TutoresPorMateriaPage.tsx`). No reemplaza nada de lo existente.

> Nota de alcance: estos 4 puntos no estaban en los criterios de aceptación originales de US-06 — son una historia derivada (llamémosla **US-06C** internamente hasta que se le asigne ID real en el backlog). Se documenta acá mismo porque extiende directamente los mismos componentes.

---

## 0. Requerimientos (tal como se definieron)

1. Las sugerencias del dropdown se acotan a **máximo 4** por sección (Materias y Tutores), cada una por separado.
2. **Enter** durante la escritura → navega a una pantalla nueva de resultados completos ("Materias Relacionadas" / mock Imagen 1).
3. Esa pantalla tiene un **switch** (Materias / Tutores) que define qué lista se muestra.
4. **Prioridad de materia sobre tutor**: el switch arranca siempre en "Materias", incluso si no hay resultados — en ese caso se muestra el empty state (con imagen) en la pestaña Materias. Lo mismo aplica a Tutores si esa pestaña no tiene resultados: mismo empty state, no auto-redirige a la otra pestaña.
5. Al seleccionar una materia desde esa pantalla → navega a `TutoresPorMateriaPage` (ya existe, no se toca) con el nombre exacto de la materia clickeada.

---

## 1. Nuevo componente compartido: `EmptyState`

No existe hoy ningún componente de estado vacío con ilustración en el repo (el de `SearchResultsPanel` es solo texto). Se crea uno reutilizable porque **este mismo empty state se necesita dos veces en la misma pantalla** (pestaña Materias vacía / pestaña Tutores vacía).

**Asset nuevo:** `src/shared/assets/illustrations/empty-search-results.png` (la ilustración provista: persona con lupa frente a un signo de pregunta).

**Archivo nuevo:** `src/shared/components/EmptyState.tsx`

```tsx
import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";

interface EmptyStateProps {
  /** Ilustración a mostrar. Tiene prioridad sobre `icon` si se pasan ambos. */
  image?: string;
  imageAlt?: string;
  /** Fallback cuando no hay ilustración disponible (ej. un ícono de MUI). */
  icon?: ReactNode;
  message: string;
}

export default function EmptyState({ image, imageAlt, icon, message }: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        py: 8,
        textAlign: "center",
      }}
    >
      {image ? (
        <Box
          component="img"
          src={image}
          alt={imageAlt ?? ""}
          sx={{ width: { xs: 180, sm: 220 }, height: "auto" }}
        />
      ) : icon ? (
        <Box
          sx={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            backgroundColor: "#EDEBFA",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>
      ) : null}
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 320 }}>
        {message}
      </Typography>
    </Box>
  );
}
```

`image` tiene prioridad sobre `icon` — se deja `icon` como fallback opcional para otros empty states del proyecto que todavía no tengan una ilustración asignada, sin forzar a todos los usos futuros a tener un PNG.

---

## 2. Límite de sugerencias en el dropdown (máx. 4 por sección)

**Archivo:** `src/modules/student/constants.ts` — agregar:

```ts
export const MAX_SEARCH_SUGGESTIONS = 4;
```

**Archivo:** `src/modules/student/components/SearchBar.tsx` — el recorte se aplica **solo a lo que se le pasa al panel**, no a los datos que ya vinieron del hook (esos se siguen usando completos en la pantalla de Enter, ver §4):

```tsx
import { MAX_SEARCH_SUGGESTIONS, buildMateriaTutorsRoute, buildTutorProfileRoute, buildSearchResultsRoute, TUTOR_ROLE } from "../constants";
// ...

<SearchResultsPanel
  query={inputValue}
  materias={materias.slice(0, MAX_SEARCH_SUGGESTIONS)}
  tutors={tutors.slice(0, MAX_SEARCH_SUGGESTIONS)}
  loading={isFetching}
  onSelectMateria={handleSelectMateria}
  onSelectTutor={handleSelectTutor}
/>
```

`SearchResultsPanel.tsx` no necesita cambios — ya renderiza lo que le llega, el corte se hace antes.

---

## 3. Extraer la lógica de "materias derivadas de tutores" a un util compartido

Hoy esa lógica vive **inline** dentro de `SearchBar.tsx` (el `useMemo` que dedupea `SubjectSummary` a partir de `tutors`). La nueva pantalla de resultados necesita la misma derivación sobre el mismo array de tutores — para no duplicar código, se extrae.

**Archivo nuevo:** `src/modules/student/utils/derive-materias.ts`

```ts
import type { SubjectSummary, TutorSearchResult } from "../interfaces/tutor-search-result.interface";

/**
 * El backend no expone una entidad "materia" separada — solo devuelve tutores
 * con sus subjects. Esta función deriva la lista de materias únicas a partir
 * de los tutores que trajo la búsqueda, dedupeando por nombre (case-insensitive).
 */
export function deriveMateriasFromTutors(tutors: TutorSearchResult[]): SubjectSummary[] {
  const seen = new Map<string, SubjectSummary>();
  for (const tutor of tutors) {
    for (const subject of tutor.subjects) {
      const key = subject.name.trim().toLowerCase();
      if (!seen.has(key)) {
        seen.set(key, subject);
      }
    }
  }
  return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name));
}
```

**`SearchBar.tsx`** — reemplazar el `useMemo` inline por:

```tsx
import { deriveMateriasFromTutors } from "../utils/derive-materias";
// ...
const materias = useMemo(() => deriveMateriasFromTutors(tutors), [tutors]);
```

---

## 4. Enter → navega a la pantalla de resultados completos

**`constants.ts`** — agregar:

```ts
export function buildSearchResultsRoute(query: string): string {
  return `/student/buscar?q=${encodeURIComponent(query)}`;
}
```

**`SearchBar.tsx`** — extender el `onKeyDown` existente (hoy solo maneja `Escape`):

```tsx
onKeyDown={(event) => {
  if (event.key === "Escape") {
    setOpen(false);
    return;
  }
  if (event.key === "Enter" && inputValue.trim().length > 0) {
    event.preventDefault(); // evita submit si el input alguna vez queda dentro de un <form>
    navigate(buildSearchResultsRoute(inputValue.trim()));
    setOpen(false);
  }
}}
```

No hace falta nada más en `SearchBar` — el Enter no depende de que el dropdown esté abierto ni de que haya resultados cargados todavía (si el alumno escribe rápido y aprieta Enter antes de que responda el backend, igual navega; la pantalla de destino dispara su propio fetch con el mismo query).

---

## 5. Ruta nueva

**`src/routes/StudentRoutes.tsx`:**

```tsx
import SearchResultsPage from "@/modules/student/pages/SearchResultsPage";
// ...
<Route path="buscar" element={<SearchResultsPage />} />
```

---

## 6. Nuevo componente: switch Materias / Tutores

Pill de dos opciones (mock Imagen 1, arriba a la derecha): ícono de libro + "Materias", ícono de persona + "Tutores", con la opción activa resaltada en violeta.

**Archivo nuevo:** `src/modules/student/components/SearchModeToggle.tsx`

```tsx
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

export type SearchMode = "materias" | "tutores";

interface SearchModeToggleProps {
  value: SearchMode;
  onChange: (mode: SearchMode) => void;
}

export default function SearchModeToggle({ value, onChange }: SearchModeToggleProps) {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={(_, next: SearchMode | null) => {
        if (next) onChange(next); // ignora el intento de deseleccionar la única opción activa
      }}
      sx={{
        backgroundColor: "#EDEBFA",
        borderRadius: "999px",
        p: 0.5,
        "& .MuiToggleButton-root": {
          border: "none",
          borderRadius: "999px !important",
          textTransform: "none",
          px: 2,
          gap: 0.5,
          "&.Mui-selected": {
            backgroundColor: "#5865C8",
            color: "#fff",
            "&:hover": { backgroundColor: "#4a54ad" },
          },
        },
      }}
    >
      <ToggleButton value="materias" aria-label="Ver materias">
        <MenuBookOutlinedIcon fontSize="small" /> Materias
      </ToggleButton>
      <ToggleButton value="tutores" aria-label="Ver tutores">
        <PersonOutlineIcon fontSize="small" /> Tutores
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
```

---

## 7. Nuevo componente: card de materia (para el grid, no el dropdown)

`MateriaRow` (en `SearchResultsPanel.tsx`) es una fila de dropdown, no una card de grid. Se crea una versión card equivalente al mock (ícono a la izquierda dentro de un cuadrado violeta, nombre en bold, carrera como subtítulo), reusando `getCareerIcon` que ya existe.

**Archivo nuevo:** `src/modules/student/components/MateriaResultCard.tsx`

```tsx
import { Box, Card, CardActionArea, Typography } from "@mui/material";
import type { SubjectSummary } from "../interfaces/tutor-search-result.interface";
import { getCareerIcon } from "../icons/career-icon";

const BRAND_COLOR = "#5865C8";
const ICON_BOX_BG = "#EDEBFA";

interface MateriaResultCardProps {
  materia: SubjectSummary;
  onClick: () => void;
  highlighted?: boolean;
}

export default function MateriaResultCard({ materia, onClick, highlighted }: MateriaResultCardProps) {
  const CareerIcon = getCareerIcon(materia.career);

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        borderColor: highlighted ? BRAND_COLOR : undefined,
        borderWidth: highlighted ? 2 : 1,
      }}
    >
      <CardActionArea onClick={onClick} sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 2, justifyContent: "flex-start" }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "10px",
            backgroundColor: ICON_BOX_BG,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <CareerIcon size={20} color={BRAND_COLOR} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body1" sx={{ fontWeight: 600 }} noWrap>
            {materia.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
            {materia.career}
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
}
```

> Ojo, mismo bug que ya se corrigió en `MateriaRow`/`TutorRow`: `CardActionArea` de MUI también trae `justifyContent: "center"` por defecto. Por eso el `sx` de arriba ya incluye `justifyContent: "flex-start"` explícito — sin eso, esta card va a tener el mismo problema de desalineación que vimos antes.

`highlighted`: en el mock la primera card aparece con borde violeta más marcado — se interpreta como la **materia más cercana a la coincidencia** (primer elemento del array, ya viene ordenado por relevancia desde el backend). Se aplica solo a `materias[0]` cuando hay más de un resultado. Si no se quiere este detalle visual, se puede omitir sin romper nada (prop opcional).

---

## 8. Nueva página: `SearchResultsPage.tsx`

**Archivo nuevo:** `src/modules/student/pages/SearchResultsPage.tsx`

```tsx
import { useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useSearchTutorsAndMaterias } from "../hooks/useSearchTutorsAndMaterias";
import { deriveMateriasFromTutors } from "../utils/derive-materias";
import { buildMateriaTutorsRoute, buildTutorProfileRoute } from "../constants";
import SearchModeToggle, { type SearchMode } from "../components/SearchModeToggle";
import MateriaResultCard from "../components/MateriaResultCard";
import TutorResultCard from "../components/TutorResultCard";
import EmptyState from "@/shared/components/EmptyState";
import emptySearchResultsImage from "@/shared/assets/illustrations/empty-search-results.png";

const EMPTY_MESSAGE = "No se encontraron resultados para tu búsqueda";

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") ?? "";

  // Siempre arranca en "materias": un alumno tiene más probabilidad de conocer
  // el nombre de una materia que el de un tutor (regla de negocio de US-06C).
  const [mode, setMode] = useState<SearchMode>("materias");

  const { data, isFetching } = useSearchTutorsAndMaterias(query);
  const tutores = useMemo(() => (Array.isArray(data) ? data : []), [data]);
  const materias = useMemo(() => deriveMateriasFromTutors(tutores), [tutores]);

  const title = mode === "materias" ? "Materias Relacionadas" : "Tutores Relacionados";

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <SearchModeToggle value={mode} onChange={setMode} />
      </Box>

      {isFetching ? (
        <Typography color="text.secondary">Buscando…</Typography>
      ) : mode === "materias" ? (
        materias.length === 0 ? (
          <EmptyState
            image={emptySearchResultsImage}
            imageAlt="No se encontraron resultados"
            message={EMPTY_MESSAGE}
          />
        ) : (
          <Grid container spacing={3}>
            {materias.map((materia, index) => (
              <Grid key={materia.name} size={{ xs: 12, sm: 6, md: 4 }}>
                <MateriaResultCard
                  materia={materia}
                  highlighted={index === 0 && materias.length > 1}
                  onClick={() => navigate(buildMateriaTutorsRoute(materia.name))}
                />
              </Grid>
            ))}
          </Grid>
        )
      ) : tutores.length === 0 ? (
        <EmptyState
          image={emptySearchResultsImage}
          imageAlt="No se encontraron resultados"
          message={EMPTY_MESSAGE}
        />
      ) : (
        <Grid container spacing={3}>
          {tutores.map((tutor) => (
            <Grid key={tutor.tutorId} size={{ xs: 12, sm: 6, md: 4 }}>
              <TutorResultCard tutor={tutor} onClick={() => navigate(buildTutorProfileRoute(tutor.tutorId))} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
```

**Decisión confirmada con el usuario:** el toggle **siempre** arranca en "Materias", incluso si esa lista viene vacía — en ese caso se muestra el `EmptyState` en la pestaña Materias. Mismo criterio para Tutores: si el alumno cambia manualmente a esa pestaña y no hay resultados, mismo `EmptyState`, sin redirección automática entre pestañas.

---

## 9. Checklist de lo pedido

| # | Requerimiento | Dónde se resuelve |
|---|---|---|
| 1 | Sugerencias del dropdown acotadas a 4 por sección | `SearchBar.tsx` (§2), constante `MAX_SEARCH_SUGGESTIONS` |
| 2 | Enter → pantalla de resultados | `SearchBar.tsx` `onKeyDown` (§4) + ruta `/student/buscar` (§5) |
| 3 | Click en materia de esa pantalla → `TutoresPorMateriaPage` con la materia seleccionada | `SearchResultsPage.tsx`, reusa `buildMateriaTutorsRoute` ya existente (§8) |
| 4 | Switch define si se ve Materias o Tutores | `SearchModeToggle.tsx` (§6) + estado `mode` en `SearchResultsPage` (§8) |
| 5 | Prioridad de materia sobre tutor | Default `mode = "materias"` (§8), fijo, sin auto-redirección |
| 6 | Empty state con imagen en ambas pestañas | `EmptyState.tsx` (§1), reusado en las dos ramas de `SearchResultsPage` |

---

## 10. Testing

- `SearchBar.test.tsx`: agregar caso — al presionar Enter con texto no vacío, se llama a `navigate` con `/student/buscar?q=...` y se cierra el panel (`setOpen(false)`); Enter con input vacío no navega.
- Nuevo test de recorte: con más de 4 materias/tutores en la respuesta mockeada, `SearchResultsPanel` recibe como máximo 4 de cada uno (verificar props pasadas, no hace falta contar DOM nodes si ya hay un test de render que lo cubra indirectamente).
- `SearchResultsPage.test.tsx` (nuevo):
  - Arranca en modo "materias" por default.
  - Con materias vacías → renderiza `EmptyState` con el texto exacto.
  - Cambiando el toggle a "tutores" con tutores vacíos → mismo `EmptyState`.
  - Click en una `MateriaResultCard` → `navigate` llamado con `buildMateriaTutorsRoute(nombre)`.
  - Click en un `TutorResultCard` (modo tutores) → `navigate` llamado con `buildTutorProfileRoute(tutorId)`.
  - La primera card de materias tiene el borde `highlighted` cuando hay 2+ materias; no lo tiene si hay una sola.
- `MateriaResultCard.test.tsx` (nuevo, opcional pero recomendado dado el bug ya visto con `justifyContent`): snapshot/regla de estilo que confirme `justifyContent: "flex-start"` presente, para no repetir el bug de alineación.

---

## 11. Fuera de alcance

- Filtros adicionales en `SearchResultsPage` (rating, modalidad) — corresponde a US-06B.
- Persistir el `mode` elegido entre búsquedas distintas (hoy siempre resetea a "materias" al entrar con un `q` nuevo).
- Optimización del PNG (compresión / conversión a SVG o WebP) — se usó el archivo tal cual se proveyó, sin procesar.