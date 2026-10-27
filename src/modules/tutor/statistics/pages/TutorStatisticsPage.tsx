import { useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import AppButton from "@/shared/components/AppButton";
import FundsStatusCard from "@/modules/tutor/statistics/components/FundsStatusCard";
import MonthlySessionsChart from "@/modules/tutor/statistics/components/MonthlySessionsChart";
import OccupancyCard from "@/modules/tutor/statistics/components/OccupancyCard";
import RatingDistributionCard from "@/modules/tutor/statistics/components/RatingDistributionCard";
import StatisticsEmptyState from "@/modules/tutor/statistics/components/StatisticsEmptyState";
import StatisticsPeriodFilter from "@/modules/tutor/statistics/components/StatisticsPeriodFilter";
import StatisticsSummaryCards from "@/modules/tutor/statistics/components/StatisticsSummaryCards";
import StudentsCard from "@/modules/tutor/statistics/components/StudentsCard";
import SubjectPerformanceTable from "@/modules/tutor/statistics/components/SubjectPerformanceTable";
import UnheldSessionsCard from "@/modules/tutor/statistics/components/UnheldSessionsCard";
import { DEFAULT_PERIOD } from "@/modules/tutor/statistics/constants/statistics.constants";
import { useTutorStatistics } from "@/modules/tutor/statistics/hooks/useTutorStatistics";
import type { PeriodSelection } from "@/modules/tutor/statistics/interfaces/period-selection.interface";
import type { TutorStatisticsResponse } from "@/modules/tutor/statistics/interfaces/responses/tutor-statistics.response";
import {
  headerSx,
  pageSubtitleSx,
  pageSx,
  pageTitleSx,
  periodCaptionSx,
  rowGridSx,
} from "@/modules/tutor/statistics/styles/statistics.styles";
import { formatPeriodRange } from "@/modules/tutor/statistics/utils/period.utils";

export default function TutorStatisticsPage() {
  const [selection, setSelection] = useState<PeriodSelection>({ period: DEFAULT_PERIOD });
  const { statistics, isLoading, isFetching, isError, refetch } = useTutorStatistics(selection);

  return (
    <Box sx={pageSx} aria-busy={isFetching}>
      <Box sx={headerSx}>
        <Box>
          <Typography component="h1" sx={pageTitleSx}>
            Panel de estadísticas
          </Typography>
          <Typography sx={pageSubtitleSx}>
            Tu actividad, reputación, alumnos, horarios e ingresos en KnowLink.
          </Typography>
          {statistics ? (
            <Typography sx={periodCaptionSx} aria-live="polite">
              Mostrando {formatPeriodRange(statistics.period.from, statistics.period.to)} ·
              Actualizado al registrarse cada resultado de sesión
            </Typography>
          ) : null}
        </Box>

        <StatisticsPeriodFilter
          selection={selection}
          onSelectQuick={(period) => setSelection({ period })}
          onApplyCustom={(from, to) => setSelection({ period: "CUSTOM", from, to })}
        />
      </Box>

      {isLoading && !statistics ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress aria-label="Cargando estadísticas" />
        </Box>
      ) : null}

      {isError && !statistics ? <StatisticsError onRetry={() => void refetch()} /> : null}

      {statistics ? (
        <Box sx={{ opacity: isFetching ? 0.6 : 1, transition: "opacity 0.15s" }}>
          <StatisticsContent statistics={statistics} />
        </Box>
      ) : null}
    </Box>
  );
}

function StatisticsContent({ statistics }: { statistics: TutorStatisticsResponse }) {
  if (!statistics.hasActivity) {
    return <StatisticsEmptyState />;
  }

  const hasFunds = statistics.funds !== null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <StatisticsSummaryCards summary={statistics.summary} />

      <Box sx={rowGridSx({ md: 2, lg: hasFunds ? 3 : 2 })}>
        <MonthlySessionsChart months={statistics.monthlySessions} />
        <UnheldSessionsCard unheld={statistics.unheldSessions} />
        {statistics.funds ? <FundsStatusCard funds={statistics.funds} /> : null}
      </Box>

      <Box sx={rowGridSx({ md: 2, lg: 2 })}>
        <RatingDistributionCard ratings={statistics.ratings} />
        <StudentsCard students={statistics.students} />
      </Box>

      <OccupancyCard occupancy={statistics.occupancy} />
      <SubjectPerformanceTable subjects={statistics.subjects} />
    </Box>
  );
}

function StatisticsError({ onRetry }: { onRetry: () => void }) {
  return (
    <Box
      role="alert"
      sx={{
        bgcolor: "background.paper",
        borderRadius: 3,
        p: 6,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
        No pudimos cargar tus estadísticas
      </Typography>
      <Typography color="text.secondary">Revisá tu conexión e intentá nuevamente.</Typography>
      <AppButton onClick={onRetry}>Reintentar</AppButton>
    </Box>
  );
}
