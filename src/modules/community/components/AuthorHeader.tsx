import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import AuthorAvatar from "@/modules/community/components/AuthorAvatar";
import { useCommunityViewer } from "@/modules/community/hooks/useCommunityViewer";
import type { CommunityAuthor } from "@/modules/community/interfaces/responses/community-author.interface";
import { COMMUNITY_COLORS, chipSx, linkSx } from "@/modules/community/styles/community.styles";
import { formatRelativeTime } from "@/modules/community/utils/format-relative-time";

const nameSx = { fontSize: 15, fontWeight: 600, color: COMMUNITY_COLORS.text };

interface AuthorHeaderProps {
  author: CommunityAuthor;
  createdAt: string;
  /** Muestra una etiqueta "Tutor" / "Alumno" junto al nombre (respuestas). */
  showRoleLabel?: boolean;
}

export default function AuthorHeader({
  author,
  createdAt,
  showRoleLabel = false,
}: AuthorHeaderProps) {
  const { paths } = useCommunityViewer();
  // Solo los tutores tienen perfil público, y solo los alumnos pueden abrirlo.
  const profilePath =
    author.role === "TUTOR" && paths.tutorProfile ? paths.tutorProfile(author.userId) : null;
  const isTutor = author.role === "TUTOR";

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
      <AuthorAvatar
        fullName={author.fullName}
        profilePictureUrl={author.profilePictureUrl}
        verified={isTutor && author.verified}
      />
      <Box sx={{ minWidth: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          {profilePath ? (
            <Typography component={Link} to={profilePath} sx={{ ...nameSx, ...linkSx }}>
              {author.fullName}
            </Typography>
          ) : (
            <Typography component="span" sx={nameSx}>
              {author.fullName}
            </Typography>
          )}
          {showRoleLabel ? (
            <Box
              component="span"
              sx={{
                ...chipSx,
                bgcolor: isTutor ? "#E4E1FA" : "#EEF0F4",
                color: isTutor ? "#3F2FB5" : COMMUNITY_COLORS.muted,
              }}
            >
              {isTutor ? "Tutor" : "Alumno"}
            </Box>
          ) : null}
        </Box>
        <Typography sx={{ fontSize: 12.5, color: COMMUNITY_COLORS.subtle }}>
          {isTutor && author.averageRating != null ? (
            <Box component="span" sx={{ color: COMMUNITY_COLORS.star, fontWeight: 600 }}>
              ★ {author.averageRating.toFixed(1)}
              {" · "}
            </Box>
          ) : null}
          {formatRelativeTime(createdAt)}
          {!isTutor && author.careerName ? ` · Estudiante de ${author.careerName}` : ""}
          {isTutor && author.careerName ? ` · ${author.careerName}` : ""}
        </Typography>
      </Box>
    </Box>
  );
}
