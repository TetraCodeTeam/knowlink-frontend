import { Box, Typography } from "@mui/material";
import { STATISTICS_COLORS } from "@/modules/tutor/statistics/constants/statistics-colors.constants";
import type { UnheldSessions } from "@/modules/tutor/statistics/interfaces/responses/tutor-statistics.response";
import StatisticsCard from "@/modules/tutor/statistics/components/StatisticsCard";
import { insetTileSx, mutedTextSx } from "@/modules/tutor/statistics/styles/statistics.styles";

interface UnheldRow {
  id: string;
  title: string;
  detail: string;
  count: number;
}

interface UnheldSessionsCardProps {
  unheld: UnheldSessions;
}

export default function UnheldSessionsCard({ unheld }: UnheldSessionsCardProps) {
  const rows: UnheldRow[] = [
    {
      id: "by-tutor",
      title: "Canceladas por mí",
      detail: "Se reintegró el 100% al alumno",
      count: unheld.cancelledByTutor,
    },
    {
      id: "by-student",
      title: "Canceladas por el alumno",
      detail:
        unheld.cancelledByStudentCredited > 0
          ? `${unheld.cancelledByStudentCredited} con menos de 12 h: el monto se te acreditó`
          : "Con más de 12 h de aviso: se reintegró el monto al alumno",
      count: unheld.cancelledByStudent,
    },
    {
      id: "not-held",
      title: "No realizadas o no cumplidas",
      detail: "Sin confirmación por token o ausencia",
      count: unheld.notHeld,
    },
  ];

  return (
    <StatisticsCard title="Clases que no se dieron">
      <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 1.5 }}>
        {rows.map((row) => (
          <Box
            component="li"
            key={row.id}
            sx={{
              ...insetTileSx,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: 15, fontWeight: 500 }}>{row.title}</Typography>
              <Typography sx={mutedTextSx}>{row.detail}</Typography>
            </Box>
            <Typography
              sx={{ fontSize: 22, fontWeight: 700, color: STATISTICS_COLORS.textStrong }}
              aria-label={`${row.count} ${row.title}`}
            >
              {row.count}
            </Typography>
          </Box>
        ))}
      </Box>
    </StatisticsCard>
  );
}
