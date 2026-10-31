import { useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import { TriangleAlert } from "lucide-react";
import AppButton from "@/shared/components/AppButton";
import AdminTopBar from "@/modules/admin/home/components/AdminTopBar";
import DashboardSkeleton from "@/modules/admin/home/components/DashboardSkeleton";
import ModerationQueueCard from "@/modules/admin/home/components/ModerationQueueCard";
import PerformancePanel from "@/modules/admin/home/components/PerformancePanel";
import { DEFAULT_DASHBOARD_RANGE } from "@/modules/admin/home/constants/admin-home.constants";
import { useDashboardSummary } from "@/modules/admin/home/hooks/useDashboardSummary";
import {
  cardsGridSx,
  errorStateSx,
  errorTextSx,
  errorTitleSx,
  pageSx,
} from "@/modules/admin/home/styles/admin-home.styles";
import { ADMIN_TOKENS } from "@/modules/admin/styles/admin-tokens";
import type { DashboardRange } from "@/modules/admin/types/dashboard-range.type";

/**
 * Home del administrador: compone el topbar, las dos colas de moderación y el
 * panel de rendimiento a partir de un único `useDashboardSummary`.
 *
 * El saludo y la fecha se renderizan siempre: solo el cuerpo cambia entre
 * loading, error y éxito, para que un fallo del endpoint no deje la pantalla vacía.
 */
export default function AdminHomePage() {
  const [range, setRange] = useState<DashboardRange>(DEFAULT_DASHBOARD_RANGE);
  const today = useMemo(() => new Date(), []);
  const { summary, isLoading, isFetching, isError, refetch } = useDashboardSummary(range);

  return (
    <Box sx={pageSx}>
      <AdminTopBar date={today} />

      {isLoading ? (
        <DashboardSkeleton />
      ) : isError && !summary ? (
        <Box role="alert" sx={errorStateSx}>
          <TriangleAlert size={28} color={ADMIN_TOKENS.rose700} aria-hidden />
          <Typography sx={errorTitleSx}>No pudimos cargar el resumen</Typography>
          <Typography sx={errorTextSx}>Revisá tu conexión e intentá de nuevo.</Typography>
          <AppButton appVariant="dark" loading={isFetching} onClick={() => void refetch()}>
            Reintentar
          </AppButton>
        </Box>
      ) : summary ? (
        <>
          <Box sx={cardsGridSx}>
            <ModerationQueueCard variant="claims" summary={summary.sessionClaims} />
            <ModerationQueueCard variant="reports" summary={summary.materialReports} />
          </Box>

          <PerformancePanel
            performance={summary.performance}
            range={range}
            onRangeChange={setRange}
            isFetching={isFetching}
          />
        </>
      ) : null}
    </Box>
  );
}
