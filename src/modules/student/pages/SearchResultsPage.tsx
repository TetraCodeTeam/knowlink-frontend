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

  const [mode, setMode] = useState<SearchMode>("materias");

  const { data, isFetching } = useSearchTutorsAndMaterias(query);
  const tutores = useMemo(() => (Array.isArray(data) ? data : []), [data]);
  const materias = useMemo(() => deriveMateriasFromTutors(tutores), [tutores]);

  const title = mode === "materias" ? "Materias Relacionadas" : "Tutores Relacionados";

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
