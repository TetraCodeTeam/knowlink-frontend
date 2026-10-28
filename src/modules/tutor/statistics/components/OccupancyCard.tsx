import { Box, Link, Typography } from "@mui/material";
import { Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { STATISTICS_COLORS } from "@/modules/tutor/statistics/constants/statistics-colors.constants";
import {
  BAND_LABEL,
  BANDS_IN_ORDER,
  DAY_SHORT_LABEL,
  TUTOR_STATISTICS_PATHS,
} from "@/modules/tutor/statistics/constants/statistics.constants";
import type {
  Occupancy,
  OccupancyCell,
} from "@/modules/tutor/statistics/interfaces/responses/tutor-statistics.response";
import { cardSx, mutedTextSx } from "@/modules/tutor/statistics/styles/statistics.styles";
import {
  buildOccupancyInsight,
  findCell,
  getOccupancyLevel,
  getVisibleDays,
} from "@/modules/tutor/statistics/utils/occupancy.utils";
import {
  formatHours,
  formatPercent,
} from "@/modules/tutor/statistics/utils/statistics-format.utils";

const LEGEND = [
  { label: "0–19%", level: 0 },
  { label: "20–39%", level: 1 },
  { label: "40–59%", level: 2 },
  { label: "60% o más", level: 3 },
] as const;

interface OccupancyCardProps {
  occupancy: Occupancy;
}

export default function OccupancyCard({ occupancy }: OccupancyCardProps) {
  const navigate = useNavigate();
  const days = getVisibleDays(occupancy.cells);
  const insight = buildOccupancyInsight(occupancy.cells);

  return (
    <Box component="section" sx={cardSx} aria-label="Ocupación de mis horarios">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
          flexWrap: "wrap",
          mb: 2.5,
        }}
      >
        <Box>
          <Typography component="h2" sx={{ fontSize: 18, fontWeight: 600 }}>
            Ocupación de mis horarios
          </Typography>
          <Typography sx={mutedTextSx}>
            Horas reservadas sobre horas que ofreciste en Mi disponibilidad
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.5 }}>
          <Typography sx={{ fontSize: 34, fontWeight: 700, lineHeight: 1 }}>
            {formatPercent(occupancy.percentage)}
          </Typography>
          <Typography sx={mutedTextSx}>
            {formatHours(occupancy.bookedHours)} de {formatHours(occupancy.offeredHours)} ofrecidas
          </Typography>
        </Box>
      </Box>

      <Box sx={{ overflowX: "auto" }}>
        <Box
          role="table"
          aria-label="Ocupación por día y franja horaria"
          sx={{
            display: "grid",
            gridTemplateColumns: `minmax(96px, 120px) repeat(${days.length}, minmax(72px, 1fr))`,
            gap: 1,
            minWidth: 96 + days.length * 80,
          }}
        >
          <Box role="row" sx={{ display: "contents" }}>
            <Box role="columnheader" />
            {days.map((day) => (
              <Typography
                key={day}
                role="columnheader"
                sx={{ textAlign: "center", fontSize: 14, fontWeight: 600, pb: 0.5 }}
              >
                {DAY_SHORT_LABEL[day]}
              </Typography>
            ))}
          </Box>

          {BANDS_IN_ORDER.map((band) => (
            <Box key={band} role="row" sx={{ display: "contents" }}>
              <Box role="rowheader" sx={{ alignSelf: "center" }}>
                <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                  {BAND_LABEL[band].name}
                </Typography>
                <Typography sx={{ fontSize: 12, color: STATISTICS_COLORS.textMuted }}>
                  {BAND_LABEL[band].range}
                </Typography>
              </Box>
              {days.map((day) => (
                <OccupancyCellView
                  key={`${day}-${band}`}
                  cell={findCell(occupancy.cells, day, band)}
                  label={`${DAY_SHORT_LABEL[day]} ${BAND_LABEL[band].name.toLowerCase()}`}
                />
              ))}
            </Box>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
          mt: 2,
        }}
      >
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          {LEGEND.map((item) => (
            <LegendSwatch
              key={item.label}
              label={item.label}
              background={STATISTICS_COLORS.occupancy[item.level]}
            />
          ))}
          <LegendSwatch label="Sin disponibilidad" dashed />
        </Box>
        <Link
          component="button"
          type="button"
          onClick={() => navigate(TUTOR_STATISTICS_PATHS.availability)}
          sx={{ fontSize: 14 }}
        >
          Ajustar Mi disponibilidad
        </Link>
      </Box>

      {insight ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mt: 2,
            px: 2,
            py: 1.5,
            borderRadius: 2,
            bgcolor: STATISTICS_COLORS.surface,
          }}
        >
          <Lightbulb size={16} color={STATISTICS_COLORS.primary} aria-hidden />
          <Typography sx={{ fontSize: 14, color: STATISTICS_COLORS.textBody }}>
            {insight}
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
}

function OccupancyCellView({ cell, label }: { cell: OccupancyCell | undefined; label: string }) {
  const baseSx = {
    height: 48,
    borderRadius: 1.5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    fontWeight: 600,
  } as const;

  if (!cell || cell.percentage === null) {
    return (
      <Box
        role="cell"
        aria-label={`${label}: sin disponibilidad`}
        sx={{
          ...baseSx,
          border: `1px dashed ${STATISTICS_COLORS.occupancy[1]}`,
          color: STATISTICS_COLORS.textMuted,
          fontWeight: 400,
        }}
      >
        —
      </Box>
    );
  }

  const level = getOccupancyLevel(cell.percentage);
  return (
    <Box
      role="cell"
      aria-label={`${label}: ${cell.percentage}% de ocupación, ${formatHours(cell.bookedHours)} de ${formatHours(cell.offeredHours)}`}
      title={`${formatHours(cell.bookedHours)} de ${formatHours(cell.offeredHours)}`}
      sx={{
        ...baseSx,
        bgcolor: STATISTICS_COLORS.occupancy[level],
        color: STATISTICS_COLORS.occupancyText[level],
      }}
    >
      {cell.percentage}%
    </Box>
  );
}

function LegendSwatch({
  label,
  background,
  dashed = false,
}: {
  label: string;
  background?: string;
  dashed?: boolean;
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
      <Box
        aria-hidden
        sx={{
          width: 14,
          height: 14,
          borderRadius: 0.5,
          bgcolor: background,
          border: dashed ? `1px dashed ${STATISTICS_COLORS.occupancy[1]}` : "none",
        }}
      />
      <Typography sx={{ fontSize: 13, color: STATISTICS_COLORS.textBody }}>{label}</Typography>
    </Box>
  );
}
