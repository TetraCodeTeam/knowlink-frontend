import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { GraduationCap } from "lucide-react";
import AppButton from "@/shared/components/AppButton";
import type { CommunityAuthor } from "@/modules/community/interfaces/responses/community-author.interface";
import { COMMUNITY_COLORS } from "@/modules/community/styles/community.styles";
import { getFirstName } from "@/modules/community/utils/get-first-name";

interface BookingCtaCardProps {
  tutor: CommunityAuthor;
  question: string;
  bookingPath: string;
}

/** Tarjeta de vinculación a tutoría que incluye el tutor en su respuesta. */
export default function BookingCtaCard({ tutor, question, bookingPath }: BookingCtaCardProps) {
  const navigate = useNavigate();
  const firstName = getFirstName(tutor.fullName);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 1.5,
        bgcolor: "#E3EAFD",
        borderRadius: "10px",
        px: 2,
        py: 1.5,
        mt: 1.5,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
        <GraduationCap size={22} color={COMMUNITY_COLORS.primaryDark} aria-hidden />
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: 14.5, fontWeight: 700, color: COMMUNITY_COLORS.text }}>
            {question}
          </Typography>
          <Typography sx={{ fontSize: 12.5, color: COMMUNITY_COLORS.muted }}>
            Reservá una clase con {tutor.fullName}
            {tutor.averageRating != null ? ` · ${tutor.averageRating.toFixed(1)} ★` : ""}
          </Typography>
        </Box>
      </Box>
      <AppButton
        size="small"
        onClick={() => navigate(bookingPath)}
        sx={{ bgcolor: "#2A1FB8", "&:hover": { bgcolor: "#1F1690" }, py: 0.9, fontSize: 13.5 }}
      >
        Agendar clase con {firstName}
      </AppButton>
    </Box>
  );
}
