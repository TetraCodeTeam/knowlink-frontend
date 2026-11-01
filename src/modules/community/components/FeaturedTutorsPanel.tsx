import { Link, useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import AuthorAvatar from "@/modules/community/components/AuthorAvatar";
import { useCommunityViewer } from "@/modules/community/hooks/useCommunityViewer";
import { useTutorPodium } from "@/modules/community/hooks/useTutorPodium";
import { COMMUNITY_COLORS, cardSx, linkSx } from "@/modules/community/styles/community.styles";

interface FeaturedTutorsPanelProps {
  /** Estira la tarjeta hasta el final de su columna (feed vacío). */
  fill?: boolean;
}

export default function FeaturedTutorsPanel({ fill = false }: FeaturedTutorsPanelProps) {
  const navigate = useNavigate();
  const { paths } = useCommunityViewer();
  const { podium, isLoading } = useTutorPodium();
  const tutors = podium?.podium ?? [];

  return (
    <Box
      component="section"
      aria-labelledby="featured-tutors-title"
      sx={{ ...cardSx, ...(fill ? { flex: 1 } : {}) }}
    >
      <Box
        sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 1 }}
      >
        <Typography
          id="featured-tutors-title"
          component="h2"
          sx={{ fontSize: 18, fontWeight: 700 }}
        >
          Tutores destacados
        </Typography>
        <Typography
          component={Link}
          to={paths.podium}
          sx={{ ...linkSx, fontSize: 13, fontWeight: 700, color: COMMUNITY_COLORS.primaryDark }}
        >
          Ver todos
        </Typography>
      </Box>
      <Typography sx={{ fontSize: 13.5, color: COMMUNITY_COLORS.muted, mt: 1, mb: 1.5 }}>
        Estos tutores se destacan en la comunidad por sus aportes:
      </Typography>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={22} aria-label="Cargando tutores destacados" />
        </Box>
      ) : tutors.length === 0 ? (
        <Typography sx={{ fontSize: 13.5, color: COMMUNITY_COLORS.subtle }}>
          Todavía no hay tutores destacados este mes.
        </Typography>
      ) : (
        // minmax(0, 1fr): sin esto la columna crece al ancho del texto más largo (noWrap) y el botón se sale.
        <Box
          component="ul"
          sx={{
            listStyle: "none",
            m: 0,
            p: 0,
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: 1.5,
          }}
        >
          {tutors.map((tutor) => (
            <Box
              component="li"
              key={tutor.tutorId}
              sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}
            >
              <AuthorAvatar
                fullName={tutor.fullName}
                profilePictureUrl={tutor.profilePictureUrl}
                size={38}
              />
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography noWrap sx={{ fontSize: 14, fontWeight: 600 }}>
                  {tutor.fullName}
                </Typography>
                <Typography noWrap sx={{ fontSize: 12, color: COMMUNITY_COLORS.subtle }}>
                  {tutor.subjects.slice(0, 2).join(" & ") || tutor.careerName || "Tutor"}
                </Typography>
                {tutor.averageRating != null ? (
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: COMMUNITY_COLORS.star }}>
                    ★ {tutor.averageRating.toFixed(1)}
                  </Typography>
                ) : null}
              </Box>
              {paths.booking ? (
                <Box
                  component="button"
                  type="button"
                  onClick={() => navigate(paths.booking?.(tutor.tutorId) ?? paths.home)}
                  aria-label={`Reservar una clase con ${tutor.fullName}`}
                  sx={{
                    flexShrink: 0,
                    border: "none",
                    cursor: "pointer",
                    bgcolor: "#EEF0FD",
                    color: COMMUNITY_COLORS.primaryDark,
                    fontSize: 12.5,
                    fontWeight: 700,
                    px: 1.5,
                    py: 0.6,
                    borderRadius: "6px",
                    "&:hover": { bgcolor: "#DEE2FB" },
                  }}
                >
                  Reservar
                </Box>
              ) : null}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
