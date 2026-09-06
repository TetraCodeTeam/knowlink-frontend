import { useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useSearchTutorsAndSubjects } from "../hooks/useSearchTutorsAndSubjects";
import { deriveSubjectsFromTutors } from "../utils/derive-subjects";
import { buildSubjectTutorsRoute, buildTutorProfileRoute } from "../constants";
import SearchModeToggle, { type SearchMode } from "../components/SearchModeToggle";
import SubjectResultCard from "../components/SubjectResultCard";
import TutorResultCard from "../components/TutorResultCard";
import EmptyState from "@/shared/components/EmptyState";
import emptySearchResultsImage from "@/shared/assets/illustrations/empty-search-results.png";

const EMPTY_MESSAGE = "No se encontraron resultados para tu búsqueda";

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") ?? "";

  const [mode, setMode] = useState<SearchMode>("subjects");

  const { data, isFetching } = useSearchTutorsAndSubjects(query);
  const tutors = useMemo(() => (Array.isArray(data) ? data : []), [data]);
  const subjects = useMemo(() => deriveSubjectsFromTutors(tutors), [tutors]);

  const title = mode === "subjects" ? "Materias Relacionadas" : "Tutores Relacionados";

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
      ) : mode === "subjects" ? (
        subjects.length === 0 ? (
          <EmptyState
            image={emptySearchResultsImage}
            imageAlt="No se encontraron resultados"
            message={EMPTY_MESSAGE}
          />
        ) : (
          <Grid container spacing={3}>
            {subjects.map((subject, index) => (
              <Grid key={subject.name} size={{ xs: 12, sm: 6, md: 4 }}>
                <SubjectResultCard
                  subject={subject}
                  highlighted={index === 0 && subjects.length > 1}
                  onClick={() => navigate(buildSubjectTutorsRoute(subject.name))}
                />
              </Grid>
            ))}
          </Grid>
        )
      ) : tutors.length === 0 ? (
        <EmptyState
          image={emptySearchResultsImage}
          imageAlt="No se encontraron resultados"
          message={EMPTY_MESSAGE}
        />
      ) : (
        <Grid container spacing={3}>
          {tutors.map((tutor) => (
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
