import { Box, Typography } from "@mui/material";
import { STATISTICS_COLORS } from "@/modules/tutor/statistics/constants/statistics-colors.constants";
import type { MonthlySessions } from "@/modules/tutor/statistics/interfaces/responses/tutor-statistics.response";
import StatisticsCard from "@/modules/tutor/statistics/components/StatisticsCard";
import { formatMonthLabel } from "@/modules/tutor/statistics/utils/period.utils";

const CHART_HEIGHT = 150;
const MIN_BAR_HEIGHT = 4;
const BAR_SLOT_WIDTH = 56;

interface MonthlySessionsChartProps {
  months: MonthlySessions[];
}

export default function MonthlySessionsChart({ months }: MonthlySessionsChartProps) {
  const max = Math.max(1, ...months.map((month) => month.completedSessions));
  const spansSeveralYears = new Set(months.map((month) => month.month.slice(0, 4))).size > 1;

  return (
    <StatisticsCard title="Sesiones completadas por mes">
      <Box sx={{ overflowX: "auto", pb: 1 }}>
        <Box
          role="img"
          aria-label={`Sesiones completadas por mes: ${months
            .map(
              (month) =>
                `${formatMonthLabel(month.month, spansSeveralYears)} ${month.completedSessions}`
            )
            .join(", ")}`}
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: months.length <= 6 ? "space-around" : "flex-start",
            gap: 1,
            minWidth: months.length * BAR_SLOT_WIDTH,
            height: CHART_HEIGHT + 44,
            borderBottom: `1px solid ${STATISTICS_COLORS.border}`,
          }}
        >
          {months.map((month, index) => {
            const isLatest = index === months.length - 1;
            const barHeight = Math.max(
              MIN_BAR_HEIGHT,
              (month.completedSessions / max) * CHART_HEIGHT
            );
            return (
              <Box
                key={month.month}
                sx={{
                  width: BAR_SLOT_WIDTH,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.5 }}>
                  {month.completedSessions}
                </Typography>
                <Box
                  sx={{
                    width: 40,
                    height: barHeight,
                    borderRadius: "6px 6px 0 0",
                    bgcolor: isLatest ? STATISTICS_COLORS.primary : STATISTICS_COLORS.primaryTint,
                  }}
                />
              </Box>
            );
          })}
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: months.length <= 6 ? "space-around" : "flex-start",
            gap: 1,
            minWidth: months.length * BAR_SLOT_WIDTH,
            mt: 0.75,
          }}
        >
          {months.map((month) => (
            <Typography
              key={month.month}
              sx={{
                width: BAR_SLOT_WIDTH,
                textAlign: "center",
                fontSize: 13,
                color: STATISTICS_COLORS.textMuted,
              }}
            >
              {formatMonthLabel(month.month, spansSeveralYears)}
            </Typography>
          ))}
        </Box>
      </Box>
    </StatisticsCard>
  );
}
