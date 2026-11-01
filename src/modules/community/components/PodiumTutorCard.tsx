import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { BadgeCheck, CalendarDays, Crown, Medal, User } from "lucide-react";
import AuthorAvatar from "@/modules/community/components/AuthorAvatar";
import { PODIUM_BADGE_STYLE } from "@/modules/community/constants/podium-badge-config";
import { useCommunityViewer } from "@/modules/community/hooks/useCommunityViewer";
import type { RankedTutor } from "@/modules/community/interfaces/responses/ranked-tutor.interface";
import { COMMUNITY_COLORS } from "@/modules/community/styles/community.styles";

interface PodiumTutorCardProps {
  tutor: RankedTutor;
}

const actionSx = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 0.75,
  flex: 1,
  border: "none",
  borderRadius: "8px",
  py: 0.9,
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
};

export default function PodiumTutorCard({ tutor }: PodiumTutorCardProps) {
  const navigate = useNavigate();
  const { paths } = useCommunityViewer();
  const style = PODIUM_BADGE_STYLE[tutor.badge ?? "BRONZE"];
  const isFirst = tutor.position === 1;
  const profilePath = paths.tutorProfile?.(tutor.tutorId);
  const bookingPath = paths.booking?.(tutor.tutorId);
  const avatarSize = isFirst ? 96 : 80;

  return (
    <Box
      component="article"
      aria-label={`Puesto ${tutor.position}: ${tutor.fullName}`}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: 0.5,
        mt: isFirst ? 0 : { xs: 0, md: 5 },
        minWidth: 0,
      }}
    >
      {isFirst ? <Crown size={30} color={style.accent} fill={style.accent} aria-hidden /> : null}

      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: 30,
          height: 30,
          px: 1,
          borderRadius: "15px",
          bgcolor: style.accent,
          color: "#FFFFFF",
          fontSize: 13,
          fontWeight: 800,
        }}
      >
        {isFirst ? "1º" : `#${tutor.position}`}
      </Box>

      <Box
        sx={{
          p: 0.5,
          borderRadius: "16px",
          border: `3px solid ${style.accent}`,
          display: "inline-flex",
        }}
      >
        <AuthorAvatar
          fullName={tutor.fullName}
          profilePictureUrl={tutor.profilePictureUrl}
          verified={tutor.verified}
          size={avatarSize}
        />
      </Box>

      <Typography
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.5,
          fontSize: isFirst ? 19 : 17,
          fontWeight: 700,
          color: COMMUNITY_COLORS.text,
          mt: 0.5,
        }}
      >
        {tutor.fullName}
        {tutor.verified ? (
          <BadgeCheck size={16} color={style.accent} aria-label="Verificado" />
        ) : null}
      </Typography>
      {tutor.careerName ? (
        <Typography sx={{ fontSize: 13, color: COMMUNITY_COLORS.muted }}>
          {tutor.careerName}
        </Typography>
      ) : null}
      {tutor.averageRating != null ? (
        <Typography sx={{ fontSize: 13, color: COMMUNITY_COLORS.star, fontWeight: 600 }}>
          ★ {tutor.averageRating.toFixed(1)}
          <Box component="span" sx={{ color: COMMUNITY_COLORS.subtle, fontWeight: 400 }}>
            {" · "}({tutor.reviewsCount} {tutor.reviewsCount === 1 ? "reseña" : "reseñas"})
          </Box>
        </Typography>
      ) : null}

      <Box
        sx={{
          width: "100%",
          maxWidth: 290,
          mt: 1,
          bgcolor: "#FFFFFF",
          borderRadius: "12px",
          border: `1.5px solid ${isFirst ? style.accent : COMMUNITY_COLORS.border}`,
          boxShadow: isFirst ? `0 4px 16px ${style.accentSoft}` : "none",
          p: 1.75,
        }}
      >
        <Typography
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            color: style.accent,
          }}
        >
          <Medal size={13} aria-hidden />
          {style.caption}
        </Typography>
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: COMMUNITY_COLORS.text, my: 0.75 }}>
          {tutor.completedClasses}{" "}
          {tutor.completedClasses === 1 ? "clase concretada" : "clases concretadas"} en KnowLink
        </Typography>
        {profilePath || bookingPath ? (
          <Box sx={{ display: "flex", gap: 1, mt: 1.25 }}>
            {profilePath ? (
              <Box
                component="button"
                type="button"
                onClick={() => navigate(profilePath)}
                sx={{ ...actionSx, bgcolor: "#EEF0FD", color: COMMUNITY_COLORS.primaryDark }}
              >
                <User size={14} aria-hidden />
                Perfil
              </Box>
            ) : null}
            {bookingPath ? (
              <Box
                component="button"
                type="button"
                onClick={() => navigate(bookingPath)}
                sx={{
                  ...actionSx,
                  bgcolor: style.buttonBg,
                  color: "#FFFFFF",
                  "&:hover": { bgcolor: style.buttonHoverBg },
                }}
              >
                <CalendarDays size={14} aria-hidden />
                Reservar
              </Box>
            ) : null}
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}
