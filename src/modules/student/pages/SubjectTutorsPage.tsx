import { useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useSearchTutorsAndSubjects } from "../hooks/useSearchTutorsAndSubjects";
import { buildTutorProfileRoute } from "../constants";
import TutorResultCard from "../components/TutorResultCard";

export default function SubjectTutorsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const subjectName = searchParams.get("materia") ?? "";

  const { data, isFetching } = useSearchTutorsAndSubjects(subjectName);
  const tutors = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        Tutores que pueden ayudarte en {subjectName}
      </Typography>

      {isFetching ? (
        <Typography color="text.secondary">Buscando tutores…</Typography>
      ) : tutors.length === 0 ? (
        <Typography color="text.secondary">
          No hay tutores disponibles para esta materia todavía.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {tutors.map((tutor) => (
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
