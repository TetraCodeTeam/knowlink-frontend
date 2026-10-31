import {
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { STATISTICS_COLORS } from "@/modules/tutor/statistics/constants/statistics-colors.constants";
import type { SubjectPerformance } from "@/modules/tutor/statistics/interfaces/responses/tutor-statistics.response";
import { cardSx, mutedTextSx } from "@/modules/tutor/statistics/styles/statistics.styles";
import {
  formatCount,
  formatRating,
  NO_VALUE,
} from "@/modules/tutor/statistics/utils/statistics-format.utils";
import { formatCurrency } from "@/shared/utils/currency.utils";

const MAX_STARS = 5;

const HEADER_DIVIDER = "rgba(255, 255, 255, 0.3)";

const headerCellSx = {
  bgcolor: STATISTICS_COLORS.primary,
  color: "#fff",
  fontWeight: 600,
  fontSize: 14,
  borderBottom: "none",
  textAlign: "center",
  // Separador fino entre columnas; la primera no lleva.
  "&:not(:first-of-type)": { borderLeft: `1px solid ${HEADER_DIVIDER}` },
} as const;

const bodyCellSx = {
  textAlign: "center",
  "&:not(:first-of-type)": { borderLeft: `1px solid ${STATISTICS_COLORS.border}` },
} as const;

interface SubjectPerformanceTableProps {
  subjects: SubjectPerformance[];
}

export default function SubjectPerformanceTable({ subjects }: SubjectPerformanceTableProps) {
  return (
    <Box component="section" sx={cardSx} aria-label="Desempeño por materia">
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 2 }}>
        <Typography component="h2" sx={{ fontSize: 18, fontWeight: 600 }}>
          Desempeño por materia
        </Typography>
        <Typography sx={mutedTextSx}>Ordenado por sesiones completadas</Typography>
      </Box>

      <TableContainer>
        <Table size="medium" sx={{ minWidth: 760 }}>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ ...headerCellSx, borderRadius: "10px 0 0 10px" }}>
                Materia
              </TableCell>
              <TableCell align="center" sx={headerCellSx}>
                Compensación
              </TableCell>
              <TableCell align="center" sx={headerCellSx}>
                Sesiones completadas
              </TableCell>
              <TableCell align="center" sx={headerCellSx}>
                Calificación
              </TableCell>
              <TableCell align="center" sx={headerCellSx}>
                Alumnos (recurrentes)
              </TableCell>
              <TableCell align="center" sx={{ ...headerCellSx, borderRadius: "0 10px 10px 0" }}>
                Ingresos netos
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subjects.map((subject) => (
              <SubjectRow key={subject.tutorSubjectId} subject={subject} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

function SubjectRow({ subject }: { subject: SubjectPerformance }) {
  return (
    <TableRow hover>
      <TableCell align="center" sx={{ ...bodyCellSx, fontWeight: 500 }}>
        {subject.subjectName}
        {subject.deactivated ? (
          <Box sx={{ mt: 0.5 }}>
            <Chip
              size="small"
              label="Desactivada"
              sx={{
                height: 20,
                fontSize: 12,
                bgcolor: "#EDEBFA",
                color: STATISTICS_COLORS.textBody,
              }}
            />
          </Box>
        ) : null}
      </TableCell>
      <TableCell align="center" sx={bodyCellSx}>
        <Chip
          size="small"
          label={
            subject.compensationType === "PAID" && subject.pricePerHour !== null
              ? `Paga · ${formatCurrency(subject.pricePerHour)}`
              : "Gratuita"
          }
          sx={{ bgcolor: STATISTICS_COLORS.primarySoft, color: STATISTICS_COLORS.primaryDark }}
        />
      </TableCell>
      <TableCell align="center" sx={{ ...bodyCellSx, fontWeight: 600 }}>
        {subject.completedSessions}
      </TableCell>
      <TableCell align="center" sx={bodyCellSx}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5 }}>
          <Typography sx={{ fontWeight: 600, minWidth: 28 }}>
            {formatRating(subject.averageRating)}
          </Typography>
          <Box
            role="img"
            aria-label={`Calificación ${formatRating(subject.averageRating)} de ${MAX_STARS}`}
            sx={{
              width: 90,
              height: 6,
              borderRadius: 3,
              bgcolor: STATISTICS_COLORS.starTrack,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: `${((subject.averageRating ?? 0) / MAX_STARS) * 100}%`,
                height: "100%",
                bgcolor: STATISTICS_COLORS.star,
              }}
            />
          </Box>
          <Typography sx={mutedTextSx}>
            {formatCount(subject.reviewsCount, "reseña", "reseñas")}
          </Typography>
        </Box>
      </TableCell>
      <TableCell align="center" sx={bodyCellSx}>
        {subject.distinctStudents} ({subject.recurrentStudents})
      </TableCell>
      <TableCell align="center" sx={{ ...bodyCellSx, fontWeight: 600 }}>
        {subject.netIncome === null ? NO_VALUE : formatCurrency(subject.netIncome)}
      </TableCell>
    </TableRow>
  );
}
