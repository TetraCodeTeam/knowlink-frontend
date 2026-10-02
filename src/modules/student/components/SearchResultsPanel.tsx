import { Avatar, Box, ButtonBase, Divider, Paper, Stack, Typography } from "@mui/material";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import StarIcon from "@mui/icons-material/Star";
import { getCareerIcon } from "../icons/career-icon";
import { highlightMatch } from "./highlight-match";
import type {
  SectionHeaderProps,
  SubjectRowProps,
  TutorRowProps,
  SearchResultsPanelProps,
} from "./interfaces/student-components.interface";

const BRAND_COLOR = "#5865C8";
const ICON_BOX_BG = "#EDEBFA";

function SectionHeader({ icon, label }: SectionHeaderProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {icon}
      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "text.primary" }}>
        {label}
      </Typography>
    </Box>
  );
}

function SubjectRow({ subject, query, onClick }: SubjectRowProps) {
  const CareerIcon = getCareerIcon(subject.career);

  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 1.5,
        width: "100%",
        textAlign: "left",
        borderRadius: 2,
        padding: 0.5,
      }}
    >
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
        <Typography variant="body2" sx={{ color: BRAND_COLOR, fontWeight: 500 }} noWrap>
          {highlightMatch(subject.name, query)}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
          {subject.career}
        </Typography>
      </Box>
    </ButtonBase>
  );
}

function TutorRow({ tutor, query, onClick }: TutorRowProps) {
  const hasRating = tutor.averageRating != null && tutor.totalReviews > 0;

  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        alignSelf: "flex-start",
        width: "100%",
        gap: 1.5,
        textAlign: "left",
        borderRadius: 2,
        padding: 0.5,
      }}
    >
      <Avatar
        src={tutor.photoProfile ?? undefined}
        sx={{
          width: 40,
          height: 40,
          flexShrink: 0,
          backgroundColor: ICON_BOX_BG,
          color: BRAND_COLOR,
          fontWeight: 600,
        }}
      >
        {tutor.fullName.charAt(0).toUpperCase()}
      </Avatar>

      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 500 }} noWrap>
          {highlightMatch(tutor.fullName, query)}
        </Typography>

        {hasRating ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <StarIcon sx={{ color: "#FBBF24", fontSize: 16 }} />
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              {tutor.averageRating!.toLocaleString("es-AR", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ({tutor.totalReviews} {tutor.totalReviews === 1 ? "Reseña" : "Reseñas"})
            </Typography>
          </Box>
        ) : (
          <Typography variant="caption" color="text.secondary">
            Sin reseñas aún
          </Typography>
        )}
      </Box>
    </ButtonBase>
  );
}

export default function SearchResultsPanel({
  query,
  subjects,
  tutors,
  loading,
  onSelectSubject,
  onSelectTutor,
}: SearchResultsPanelProps) {
  const hasSubjects = subjects.length > 0;
  const hasTutors = tutors.length > 0;
  const hasResults = hasSubjects || hasTutors;

  return (
    <Paper
      elevation={4}
      sx={{
        mt: 1,
        borderRadius: "20px",
        width: "100%",
        maxHeight: 420,
        overflow: "hidden",
      }}
    >
      {loading ? (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Buscando…
          </Typography>
        </Box>
      ) : !hasResults ? (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            No se encontraron resultados para tu búsqueda
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex" }}>
          {hasSubjects && (
            <Box sx={{ flex: 1, p: 3, minWidth: 0, maxHeight: 420, overflowY: "auto" }}>
              <SectionHeader
                icon={<MenuBookOutlinedIcon sx={{ color: "text.secondary" }} />}
                label="Materias"
              />
              <Stack spacing={2} sx={{ mt: 2 }}>
                {subjects.map((subject) => (
                  <SubjectRow
                    key={subject.name}
                    subject={subject}
                    query={query}
                    onClick={() => onSelectSubject(subject.name)}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {hasSubjects && hasTutors && <Divider orientation="vertical" flexItem sx={{ my: 1 }} />}

          {hasTutors && (
            <Box
              sx={{
                flex: 1,
                p: 3,
                minWidth: 0,
                maxHeight: 420,
                overflowY: "auto",
                width: 0,
              }}
            >
              <SectionHeader
                icon={<PersonOutlineIcon sx={{ color: "text.secondary" }} />}
                label="Tutores"
              />

              <Stack
                spacing={2}
                sx={{
                  mt: 2,
                  width: "100%",
                  alignItems: "stretch",
                }}
              >
                {tutors.map((tutor) => (
                  <TutorRow
                    key={tutor.tutorId}
                    tutor={tutor}
                    query={query}
                    onClick={() => onSelectTutor(tutor.tutorId)}
                  />
                ))}
              </Stack>
            </Box>
          )}
        </Box>
      )}
    </Paper>
  );
}
