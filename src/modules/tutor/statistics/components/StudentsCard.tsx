import { Box, Typography } from "@mui/material";
import { STATISTICS_COLORS } from "@/modules/tutor/statistics/constants/statistics-colors.constants";
import type { StudentsStatistics } from "@/modules/tutor/statistics/interfaces/responses/tutor-statistics.response";
import StatisticsCard from "@/modules/tutor/statistics/components/StatisticsCard";
import { insetTileSx, mutedTextSx } from "@/modules/tutor/statistics/styles/statistics.styles";
import { formatCount } from "@/modules/tutor/statistics/utils/statistics-format.utils";

interface StudentsCardProps {
  students: StudentsStatistics;
}

export default function StudentsCard({ students }: StudentsCardProps) {
  const totalSessions = students.sessionsWithRecurrentStudents + students.sessionsWithNewStudents;
  const recurrentShare =
    totalSessions === 0 ? 0 : (students.sessionsWithRecurrentStudents / totalSessions) * 100;

  return (
    <StatisticsCard title="Tus alumnos">
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 2 }}>
        <Box sx={insetTileSx}>
          <Typography sx={mutedTextSx}>Alumnos distintos</Typography>
          <Typography sx={{ fontSize: 30, fontWeight: 700 }}>{students.distinct}</Typography>
        </Box>
        <Box sx={insetTileSx}>
          <Typography sx={mutedTextSx}>Alumnos recurrentes</Typography>
          <Typography sx={{ fontSize: 30, fontWeight: 700 }}>
            {students.recurrent}
            <Box
              component="span"
              sx={{ fontSize: 14, fontWeight: 400, color: STATISTICS_COLORS.textMuted, ml: 1 }}
            >
              · {students.recurrentPercentage}%
            </Box>
          </Typography>
        </Box>
      </Box>

      <Box
        role="img"
        aria-label={`${formatCount(students.sessionsWithRecurrentStudents, "sesión", "sesiones")} con recurrentes y ${formatCount(students.sessionsWithNewStudents, "sesión", "sesiones")} con alumnos nuevos`}
        sx={{
          display: "flex",
          height: 10,
          borderRadius: 5,
          overflow: "hidden",
          mt: 2.5,
          bgcolor: STATISTICS_COLORS.starTrack,
        }}
      >
        <Box sx={{ width: `${recurrentShare}%`, bgcolor: STATISTICS_COLORS.primary }} />
        <Box sx={{ flex: 1, bgcolor: STATISTICS_COLORS.occupancy[1] }} />
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", columnGap: 3, rowGap: 0.5, mt: 1.25 }}>
        <LegendItem
          color={STATISTICS_COLORS.primary}
          label={`${formatCount(students.sessionsWithRecurrentStudents, "sesión", "sesiones")} con recurrentes`}
        />
        <LegendItem
          color={STATISTICS_COLORS.occupancy[1]}
          label={`${formatCount(students.sessionsWithNewStudents, "sesión", "sesiones")} con alumnos nuevos`}
        />
      </Box>
      <Typography sx={{ ...mutedTextSx, mt: 2 }}>
        Un alumno es recurrente cuando completó 2 o más sesiones con vos en el período.
      </Typography>
    </StatisticsCard>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
      <Box aria-hidden sx={{ width: 10, height: 10, borderRadius: 0.5, bgcolor: color }} />
      <Typography sx={{ fontSize: 13, color: STATISTICS_COLORS.textBody }}>{label}</Typography>
    </Box>
  );
}
