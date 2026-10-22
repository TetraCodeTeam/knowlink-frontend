import { Box, Button } from "@mui/material";
import { ArrowRight, Info, Lock, ShieldCheck } from "lucide-react";
import { SideInfoCard } from "@/modules/support/components/SideInfoCard";
import { SummaryCard, type SummaryTile } from "@/modules/support/components/SummaryCard";
import { TONE_COLORS } from "@/modules/support/styles/supportShared.styles";
import {
  sideBadgeSx,
  sideColumnSx,
  sideLinkSx,
} from "@/modules/support/styles/supportSidebar.styles";

interface ClaimsSidebarProps {
  openCount: number;
  inReviewCount: number;
  onGoToClassHistory: () => void;
}

export function ClaimsSidebar({
  openCount,
  inReviewCount,
  onGoToClassHistory,
}: ClaimsSidebarProps) {
  const tiles: SummaryTile[] = [
    { id: "open", value: openCount, label: "Abierto", caption: "En cola", tone: "neutral" },
    {
      id: "in-review",
      value: inReviewCount,
      label: "En revisión",
      caption: "Con mediador",
      tone: "info",
    },
  ];

  return (
    <Box sx={sideColumnSx}>
      <SummaryCard title="Resumen de Reclamos" tiles={tiles} />

      <SideInfoCard
        icon={<Info size={16} aria-hidden="true" />}
        iconBg={TONE_COLORS.neutral.bg}
        iconColor={TONE_COLORS.neutral.fg}
        title="Antes de reclamar"
      >
        Solo podés abrir un reclamo activo por sesión. Elegí la sesión desde tu historial de clases
        para iniciar uno nuevo.
        <Button
          variant="text"
          endIcon={<ArrowRight size={14} aria-hidden="true" />}
          sx={sideLinkSx}
          onClick={onGoToClassHistory}
        >
          Ir al historial de clases
        </Button>
      </SideInfoCard>

      <SideInfoCard
        icon={<Lock size={16} aria-hidden="true" />}
        iconBg="#FCE4E4"
        iconColor="#C62828"
        title="Fondos retenidos"
      >
        Mientras un reclamo esté abierto o en revisión, el dinero de esa sesión no se transfiere. Se
        libera automáticamente cuando el administrador resuelve el caso.
        <Box sx={sideBadgeSx}>
          <ShieldCheck size={12} aria-hidden="true" />
          Protección de pagos KnowLink
        </Box>
      </SideInfoCard>
    </Box>
  );
}
