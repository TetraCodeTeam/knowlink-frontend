import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useSearchFilters } from "../hooks/useSearchFilters";
import { useSearchTutorsAndMaterias } from "../hooks/useSearchTutorsAndMaterias";
import { deriveMateriasFromTutors } from "../utils/derive-materias";
import {
  buildMateriaTutorsRoute,
  buildTutorProfileRoute,
  EMPTY_FILTERED_MESSAGE,
  EMPTY_SEARCH_MESSAGE,
} from "../constants";
import ActiveFiltersBar from "../components/ActiveFiltersBar";
import SearchModeToggle from "../components/SearchModeToggle";
import MateriaResultCard from "../components/MateriaResultCard";
import TutorResultCard from "../components/TutorResultCard";
import EmptyState from "@/shared/components/EmptyState";
import emptySearchResultsImage from "@/shared/assets/illustrations/empty-search-results.png";

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") ?? "";

  const { filters, effectiveFilters, mode, setMode, removeChip, clearFilters, hasActive } =
    useSearchFilters();

  const { data, isFetching } = useSearchTutorsAndMaterias(query, effectiveFilters);
  const tutores = useMemo(() => (Array.isArray(data) ? data : []), [data]);
  const materias = useMemo(() => deriveMateriasFromTutors(tutores), [tutores]);

  // AC-5: para diferenciar "sin resultados por filtros" de "la búsqueda base
  // tampoco tiene resultados" se consulta la búsqueda base sin filtros. Usa la
  // misma query key que el dropdown de sugerencias, así que queda cacheada.
  const filteredEmpty = !isFetching && tutores.length === 0;
  const { data: baseData, isFetching: isBaseFetching } = useSearchTutorsAndMaterias(
    query,
    undefined,
    { enabled: hasActive && filteredEmpty }
  );
  const baseTutores = useMemo(() => (Array.isArray(baseData) ? baseData : []), [baseData]);

  const baseLoading = hasActive && filteredEmpty && isBaseFetching;
  const emptyMessage =
    hasActive && baseTutores.length > 0 ? EMPTY_FILTERED_MESSAGE : EMPTY_SEARCH_MESSAGE;

  const title = mode === "materias" ? "Materias Relacionadas" : "Tutores Relacionados";

  const emptyState = (
    <EmptyState
      image={emptySearchResultsImage}
      imageAlt="No se encontraron resultados"
      message={emptyMessage}
    />
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <SearchModeToggle value={mode} onChange={setMode} />
      </Box>

      <ActiveFiltersBar filters={effectiveFilters} onRemove={removeChip} onClear={clearFilters} />

      {isFetching || baseLoading ? (
        <Typography color="text.secondary">Buscando…</Typography>
      ) : mode === "materias" ? (
        materias.length === 0 ? (
          emptyState
        ) : (
          <Grid container spacing={3}>
            {materias.map((materia, index) => (
              <Grid key={materia.name} size={{ xs: 12, sm: 6, md: 4 }}>
                <MateriaResultCard
                  materia={materia}
                  highlighted={index === 0 && materias.length > 1}
                  onClick={() => navigate(buildMateriaTutorsRoute(materia.name, filters))}
                />
              </Grid>
            ))}
          </Grid>
        )
      ) : tutores.length === 0 ? (
        emptyState
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
