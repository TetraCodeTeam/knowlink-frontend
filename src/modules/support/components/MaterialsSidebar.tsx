import { Box, Button } from "@mui/material";
import { Bell, ExternalLink, Hourglass, Scale, ShieldAlert, TriangleAlert } from "lucide-react";
import { SideInfoCard } from "@/modules/support/components/SideInfoCard";
import { SummaryCard, type SummaryTile } from "@/modules/support/components/SummaryCard";
import {
  sideBulletListSx,
  sideBulletSx,
  sideColumnSx,
  sideLinkSx,
  TONE_COLORS,
} from "@/modules/support/styles/support.styles";

interface MaterialsSidebarProps {
  reportedCount: number;
  inReviewCount: number;
  onOpenFileRules: () => void;
}

export function MaterialsSidebar({
  reportedCount,
  inReviewCount,
  onOpenFileRules,
}: MaterialsSidebarProps) {
  const tiles: SummaryTile[] = [
    {
      id: "reported",
      value: reportedCount,
      label: "Materiales con denuncias",
      icon: <TriangleAlert size={14} aria-hidden="true" />,
      tone: "neutral",
    },
    {
      id: "in-review",
      value: inReviewCount,
      label: "En revisión",
      icon: <Hourglass size={14} aria-hidden="true" />,
      tone: "info",
    },
  ];

  return (
    <Box sx={sideColumnSx}>
      <SummaryCard title="Resumen de Material" tiles={tiles} />

      <SideInfoCard
        icon={<ShieldAlert size={16} aria-hidden="true" />}
        iconBg={TONE_COLORS.info.bg}
        iconColor={TONE_COLORS.info.fg}
        title="¿Qué pasa después de una denuncia?"
      >
        Un administrador revisa el material denunciado y decide si corresponde darlo de baja. Si se
        confirma, el archivo deja de estar disponible para los alumnos y te llegará una notificación
        con el resultado.
        <Box component="ul" sx={sideBulletListSx}>
          <Box component="li" sx={sideBulletSx}>
            <Scale size={12} aria-hidden="true" />
            Evaluación según políticas de propiedad intelectual y pertinencia académica.
          </Box>
          <Box component="li" sx={sideBulletSx}>
            <Bell size={12} aria-hidden="true" />
            Aviso automático al tutor asignado en caso de baja preventiva.
          </Box>
        </Box>
        <Button
          variant="text"
          endIcon={<ExternalLink size={13} aria-hidden="true" />}
          sx={sideLinkSx}
          onClick={onOpenFileRules}
        >
          Normativa de archivos
        </Button>
      </SideInfoCard>
    </Box>
  );
}
