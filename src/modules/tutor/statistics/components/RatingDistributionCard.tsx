import { Box, Typography } from "@mui/material";
import { Star } from "lucide-react";
import { STATISTICS_COLORS } from "@/modules/tutor/statistics/constants/statistics-colors.constants";
import type { RatingDistribution } from "@/modules/tutor/statistics/interfaces/responses/tutor-statistics.response";
import StatisticsCard from "@/modules/tutor/statistics/components/StatisticsCard";
import { mutedTextSx } from "@/modules/tutor/statistics/styles/statistics.styles";
import {
  formatCount,
  formatRating,
} from "@/modules/tutor/statistics/utils/statistics-format.utils";

const STAR_COUNT = 5;

interface RatingDistributionCardProps {
  ratings: RatingDistribution;
}

export default function RatingDistributionCard({ ratings }: RatingDistributionCardProps) {
  const max = Math.max(1, ...ratings.buckets.map((bucket) => bucket.count));
  const roundedAverage = Math.round(ratings.average ?? 0);

  return (
    <StatisticsCard
      title="Distribución de calificaciones"
      action={
        <Typography sx={mutedTextSx}>{formatCount(ratings.total, "reseña", "reseñas")}</Typography>
      }
    >
      <Box sx={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
        <Box sx={{ textAlign: "center", minWidth: 96 }}>
          <Typography sx={{ fontSize: 44, fontWeight: 700, lineHeight: 1.1 }}>
            {formatRating(ratings.average)}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 0.25, my: 0.5 }} aria-hidden>
            {Array.from({ length: STAR_COUNT }, (_, index) => (
              <Star
                key={index}
                size={14}
                color={STATISTICS_COLORS.star}
                fill={index < roundedAverage ? STATISTICS_COLORS.star : "none"}
              />
            ))}
          </Box>
          <Typography sx={mutedTextSx}>promedio</Typography>
        </Box>

        <Box sx={{ flex: 1, minWidth: 200, display: "grid", gap: 1 }}>
          {ratings.buckets.map((bucket) => (
            <Box key={bucket.stars} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography sx={{ width: 28, fontSize: 13, color: STATISTICS_COLORS.textBody }}>
                {bucket.stars} ★
              </Typography>
              <Box
                role="img"
                aria-label={`${bucket.stars} estrellas: ${formatCount(bucket.count, "reseña", "reseñas")}`}
                sx={{
                  flex: 1,
                  height: 8,
                  borderRadius: 4,
                  bgcolor: STATISTICS_COLORS.starTrack,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: `${(bucket.count / max) * 100}%`,
                    height: "100%",
                    bgcolor: STATISTICS_COLORS.star,
                    borderRadius: 4,
                  }}
                />
              </Box>
              <Typography sx={{ width: 24, textAlign: "right", fontSize: 13, fontWeight: 600 }}>
                {bucket.count}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
      <Typography sx={{ ...mutedTextSx, mt: 2 }}>
        Solo se cuentan las reseñas ya visibles (cuando ambas partes calificaron o pasaron 24 h).
      </Typography>
    </StatisticsCard>
  );
}
