import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import ActiveFiltersBar from "@/modules/student/components/ActiveFiltersBar";
import TutorResultCard from "@/modules/student/components/TutorResultCard";
import { buildTutorProfileRoute, EMPTY_FILTERED_MESSAGE } from "@/modules/student/constants";
import { useSearchFilters } from "@/modules/student/hooks/useSearchFilters";
import { useSearchTutorsAndMaterias } from "@/modules/student/hooks/useSearchTutorsAndMaterias";

const NO_TUTORS_MESSAGE = "No hay tutores disponibles para esta materia todavía.";

export default function TutoresPorMateriaPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const materiaNombre = searchParams.get("materia") ?? "";

  const { effectiveFilters, removeChip, clearFilters, hasActive } = useSearchFilters();

  const { data, isFetching } = useSearchTutorsAndMaterias(materiaNombre, effectiveFilters);
  const tutores = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const filteredEmpty = !isFetching && tutores.length === 0;
  const { data: baseData, isFetching: isBaseFetching } = useSearchTutorsAndMaterias(
    materiaNombre,
    undefined,
    { enabled: hasActive && filteredEmpty }
  );
  const baseTutores = useMemo(() => (Array.isArray(baseData) ? baseData : []), [baseData]);

  const baseLoading = hasActive && filteredEmpty && isBaseFetching;
  const emptyMessage =
    hasActive && baseTutores.length > 0 ? EMPTY_FILTERED_MESSAGE : NO_TUTORS_MESSAGE;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        Tutores que pueden ayudarte en {materiaNombre}
      </Typography>

      <ActiveFiltersBar filters={effectiveFilters} onRemove={removeChip} onClear={clearFilters} />

      {isFetching || baseLoading ? (
        <Typography color="text.secondary">Buscando tutores…</Typography>
      ) : tutores.length === 0 ? (
        <Typography color="text.secondary">{emptyMessage}</Typography>
      ) : (
        <Grid container spacing={3}>
          {tutores.map((tutor) => (
            <Grid key={tutor.tutorId} size={{ xs: 12, sm: 6, md: 4 }} sx={{ borderRadius: 1 }}>
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
