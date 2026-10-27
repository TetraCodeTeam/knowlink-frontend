import type { ReactNode } from "react";
import { Box, Link, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { STATISTICS_COLORS } from "@/modules/tutor/statistics/constants/statistics-colors.constants";
import { TUTOR_STATISTICS_PATHS } from "@/modules/tutor/statistics/constants/statistics.constants";
import type { FundsStatus } from "@/modules/tutor/statistics/interfaces/responses/tutor-statistics.response";
import StatisticsCard from "@/modules/tutor/statistics/components/StatisticsCard";
import { mutedTextSx } from "@/modules/tutor/statistics/styles/statistics.styles";
import { formatCount } from "@/modules/tutor/statistics/utils/statistics-format.utils";
import { formatCurrency } from "@/shared/utils/currency.utils";

interface FundsStatusCardProps {
  funds: FundsStatus;
}

export default function FundsStatusCard({ funds }: FundsStatusCardProps) {
  const navigate = useNavigate();

  return (
    <StatisticsCard title="Estado de mis fondos">
      <Box sx={{ display: "grid" }}>
        <FundsRow
          color={STATISTICS_COLORS.success}
          title="Liberado"
          amount={funds.released.amount}
          detail={formatCount(funds.released.sessions, "sesión", "sesiones")}
        />
        <FundsRow
          color={STATISTICS_COLORS.primary}
          title="Pendiente de liberación"
          amount={funds.pendingRelease.amount}
          detail={`${formatCount(
            funds.pendingRelease.sessions,
            "sesión",
            "sesiones"
          )} · se resuelve con el resultado final`}
        />
        <FundsRow
          color={STATISTICS_COLORS.warning}
          title="Retenido por reclamo"
          amount={funds.withheldByClaim.amount}
          detail={
            <>
              {formatCount(
                funds.withheldByClaim.sessions,
                "sesión en disputa",
                "sesiones en disputa"
              )}
              {funds.withheldByClaim.sessions > 0 ? (
                <>
                  {" · "}
                  <Link
                    component="button"
                    type="button"
                    onClick={() => navigate(TUTOR_STATISTICS_PATHS.support)}
                    sx={{ fontSize: "inherit", verticalAlign: "baseline" }}
                  >
                    Ver en Soporte
                  </Link>
                </>
              ) : null}
            </>
          }
          isLast
        />
      </Box>
      <Typography sx={{ ...mutedTextSx, mt: 2 }}>
        Montos netos registrados por KnowLink, con el {funds.commissionPercentage}% de comisión
        descontado.
      </Typography>
    </StatisticsCard>
  );
}

interface FundsRowProps {
  color: string;
  title: string;
  amount: number;
  detail: ReactNode;
  isLast?: boolean;
}

function FundsRow({ color, title, amount, detail, isLast = false }: FundsRowProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 2,
        py: 1.5,
        borderBottom: isLast ? "none" : `1px solid ${STATISTICS_COLORS.border}`,
      }}
    >
      <Box sx={{ display: "flex", gap: 1.5, minWidth: 0 }}>
        <Box
          aria-hidden
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            bgcolor: color,
            mt: 0.75,
            flexShrink: 0,
          }}
        />
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: 15, fontWeight: 500 }}>{title}</Typography>
          <Typography component="div" sx={mutedTextSx}>
            {detail}
          </Typography>
        </Box>
      </Box>
      <Typography sx={{ fontSize: 17, fontWeight: 600, whiteSpace: "nowrap" }}>
        {formatCurrency(amount)}
      </Typography>
    </Box>
  );
}
