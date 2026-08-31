import { Avatar, Box, Card, CardActionArea, Chip, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import type { TutorSearchResult } from "@/modules/student/interfaces/tutor-search-result.interface";

interface TutorResultCardProps {
  tutor: TutorSearchResult;
  onClick: () => void;
}

export default function TutorResultCard({ tutor, onClick }: TutorResultCardProps) {
  const hasRating = tutor.averageRating != null && tutor.totalReviews > 0;

  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardActionArea onClick={onClick} sx={{ p: 2, height: "100%", alignItems: "flex-start" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1.5 }}>
          <Avatar
            src={tutor.photoProfile ?? undefined}
            sx={{ width: 56, height: 56, flexShrink: 0 }}
          >
            {tutor.fullName.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }} noWrap>
              {tutor.fullName}
            </Typography>
            {hasRating ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <StarIcon sx={{ color: "#FBBF24", fontSize: 16 }} />
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {tutor.averageRating!.toLocaleString("es-AR", {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ({tutor.totalReviews} {tutor.totalReviews === 1 ? "Reseña" : "Reseñas"})
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Sin reseñas aún
              </Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {tutor.subjects.map((subject) => (
            <Chip key={subject.name} label={subject.name} size="small" variant="outlined" />
          ))}
        </Box>
      </CardActionArea>
    </Card>
  );
}
