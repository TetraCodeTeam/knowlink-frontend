import { useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useSearchTutorsAndMaterias } from "@/modules/student/hooks/useSearchTutorsAndMaterias";
import { buildTutorProfileRoute } from "@/modules/student/constants";
import TutorResultCard from "@/modules/student/components/TutorResultCard";

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
