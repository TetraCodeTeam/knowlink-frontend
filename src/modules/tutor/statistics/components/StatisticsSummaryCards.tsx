import type { ReactNode } from "react";
import { Box, LinearProgress, Typography } from "@mui/material";
import { CheckCheck, Clock3, DollarSign, Star } from "lucide-react";
import { STATISTICS_COLORS } from "@/modules/tutor/statistics/constants/statistics-colors.constants";
import type { StatisticsSummary } from "@/modules/tutor/statistics/interfaces/responses/tutor-statistics.response";
import {
  cardSx,
  mutedTextSx,
  rowGridSx,
} from "@/modules/tutor/statistics/styles/statistics.styles";
import {
  describeDelta,
  formatCount,
  formatPercent,
  formatRating,
  NO_VALUE,
} from "@/modules/tutor/statistics/utils/statistics-format.utils";
import { formatCurrency } from "@/shared/utils/currency.utils";

interface SummaryCardProps {
  label: string;
  icon: ReactNode;
  iconBg: string;
  value: ReactNode;
  children?: ReactNode;
}

function SummaryCard({ label, icon, iconBg, value, children }: SummaryCardProps) {
  return (
    <Box component="article" sx={cardSx} aria-label={label}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
        <Typography sx={{ fontSize: 14, color: STATISTICS_COLORS.textMuted }}>{label}</Typography>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1.5,
            bgcolor: iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>
      </Box>
      <Typography
        sx={{ fontSize: 34, fontWeight: 700, color: STATISTICS_COLORS.textStrong, lineHeight: 1.2 }}
      >
        {value}
      </Typography>
      {children}
    </Box>
  );
}

const DELTA_COLOR = {
  positive: STATISTICS_COLORS.success,
  negative: STATISTICS_COLORS.danger,
  neutral: STATISTICS_COLORS.textMuted,
} as const;

interface StatisticsSummaryCardsProps {
  summary: StatisticsSummary;
}

export default function StatisticsSummaryCards({ summary }: StatisticsSummaryCardsProps) {
  const delta = describeDelta(summary.completedSessions, summary.completedSessionsPreviousPeriod);
  const rate = summary.fulfillmentRate;

  return (
    <Box sx={rowGridSx({ md: 2, lg: 4 })}>
      <SummaryCard
        label="Sesiones completadas"
        iconBg={STATISTICS_COLORS.primarySoft}
        icon={<CheckCheck size={18} color={STATISTICS_COLORS.primary} aria-hidden />}
        value={summary.completedSessions}
      >
        <Typography sx={{ fontSize: 13, mt: 1, color: DELTA_COLOR[delta.tone] }}>
          {delta.text}
        </Typography>
      </SummaryCard>

      <SummaryCard
        label="Tasa de cumplimiento"
        iconBg={STATISTICS_COLORS.primarySoft}
        icon={<Clock3 size={18} color={STATISTICS_COLORS.primary} aria-hidden />}
        value={formatPercent(rate)}
      >
        <LinearProgress
          variant="determinate"
          value={rate ?? 0}
          aria-label="Tasa de cumplimiento"
          sx={{
            mt: 1.5,
            height: 6,
            borderRadius: 3,
            bgcolor: STATISTICS_COLORS.starTrack,
            "& .MuiLinearProgress-bar": { bgcolor: STATISTICS_COLORS.primary, borderRadius: 3 },
          }}
        />
        <Typography sx={{ ...mutedTextSx, mt: 1 }}>
          {rate === null
            ? "Todavía no hay sesiones que hayan llegado a su horario"
            : `${summary.completedSessions} de ${summary.eligibleSessions} ${
                summary.eligibleSessions === 1 ? "sesión que llegó" : "sesiones que llegaron"
              } a su horario`}
        </Typography>
      </SummaryCard>

      <SummaryCard
        label="Calificación promedio"
        iconBg="#FFF3D6"
        icon={
          <Star
            size={18}
            color={STATISTICS_COLORS.star}
            fill={STATISTICS_COLORS.star}
            aria-hidden
          />
        }
        value={
          <>
            {formatRating(summary.averageRating)}
            {summary.averageRating !== null ? (
              <Box
                component="span"
                sx={{ fontSize: 14, fontWeight: 400, color: STATISTICS_COLORS.textMuted, ml: 0.75 }}
              >
                / 5
              </Box>
            ) : null}
          </>
        }
      >
        <Typography sx={{ ...mutedTextSx, mt: 1 }}>
          {summary.reviewsCount === 0
            ? "Sin reseñas visibles todavía"
            : `Basado en ${formatCount(summary.reviewsCount, "reseña visible", "reseñas visibles")}`}
        </Typography>
      </SummaryCard>

      <SummaryCard
        label="Ingresos netos generados"
        iconBg={STATISTICS_COLORS.successSoft}
        icon={<DollarSign size={18} color={STATISTICS_COLORS.success} aria-hidden />}
        value={summary.netIncome > 0 ? formatCurrency(summary.netIncome) : NO_VALUE}
      >
        <Typography sx={{ ...mutedTextSx, mt: 1 }}>
          Con el {summary.commissionPercentage}% de comisión ya descontado
        </Typography>
      </SummaryCard>
    </Box>
  );
}
