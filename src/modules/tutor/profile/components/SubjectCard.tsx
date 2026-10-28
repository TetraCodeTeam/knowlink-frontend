import { Box, Divider, Rating, Typography } from "@mui/material";
import type { TutorOwnSubject } from "@/modules/tutor/profile/interfaces/tutor-own-profile.interface";
import { STAR_COLOR } from "@/modules/tutor/profile/constants/profileColors.constants";
import { toModalityList } from "@/modules/tutor/profile/utils/profile.utils";
import ModalityChip from "@/modules/tutor/profile/components/ModalityChip";

interface SubjectCardProps {
  subject: TutorOwnSubject;
}

export default function SubjectCard({ subject }: SubjectCardProps) {
  const hasReviews =
    subject.averageRating !== null && subject.reviewCount !== null && subject.reviewCount > 0;
  const isFree = subject.compensationType === "FREE";
  const modalities = toModalityList(subject.modality);

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: "16px",
        p: "24px 26px",
        boxShadow: "0px 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      <Typography
        sx={{ fontSize: "24px", fontWeight: 700, color: "#1a1a2e", mb: "14px", lineHeight: 1.3 }}
      >
        {subject.subjectName}
      </Typography>

      {hasReviews ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mb: "16px" }}>
          <Rating
            value={subject.averageRating}
            precision={0.5}
            readOnly
            size="medium"
            sx={{
              "& .MuiRating-iconFilled": { color: STAR_COLOR },
              "& .MuiRating-iconEmpty": { color: STAR_COLOR, opacity: 0.35 },
            }}
          />
          <Divider
            orientation="vertical"
            flexItem
            sx={{ borderColor: "#2435A1", opacity: 0.5, my: "3px" }}
          />
          <Typography sx={{ fontSize: "17px", color: "#2435A1", fontWeight: 500 }}>
            {subject.averageRating!.toFixed(1)} · {subject.reviewCount} Reseñas
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "inline-flex",
            px: "14px",
            py: "6px",
            borderRadius: "20px",
            backgroundColor: "#F0F0F6",
            mb: "16px",
          }}
        >
          <Typography sx={{ fontSize: "17px", color: "#767684" }}>Aún no hay reseñas</Typography>
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {modalities.map((mod) => (
            <ModalityChip key={mod} modality={mod} />
          ))}
        </Box>
        <Typography sx={{ fontSize: "22px", fontWeight: 700, color: "#5B6ED9" }}>
          {isFree
            ? "Gratis"
            : subject.pricePerHour != null
            ? `$${Number(subject.pricePerHour).toLocaleString("es-AR")}`
            : "A consultar"}
        </Typography>
      </Box>
    </Box>
  );
}
