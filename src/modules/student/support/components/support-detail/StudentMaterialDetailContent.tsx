import { Box, Typography } from "@mui/material";
import { AlertCircle, Flag } from "lucide-react";
import type { StudentMaterialReportDetail } from "@/modules/student/support/interfaces/responses/student-material-report-detail.response";
import { SUPPORT_COLORS } from "@/modules/support/constants/support-colors.constants";
import { formatLongDate } from "@/modules/support/utils/format.utils";
import { SupportDetailSection } from "@/modules/support/components/support-detail/SupportDetailSection";
import { detailCardSx } from "@/modules/support/styles/supportDetail.styles";
import {
  supportAccentTextSx,
  supportBodyTextSx,
  supportDangerTextSx,
  supportMutedTextSx,
  supportTitleTextSx,
} from "@/modules/support/styles/supportText.styles";

interface StudentMaterialDetailContentProps {
  material: StudentMaterialReportDetail;
}

function resolutionText(material: StudentMaterialReportDetail): string | null {
  if (material.status !== "RESOLVED" || !material.resolution) return null;
  return material.resolution === "UPHELD"
    ? "La denuncia fue confirmada: el material fue dado de baja."
    : "La denuncia fue desestimada: el material permanece disponible.";
}

function availabilityText(material: StudentMaterialReportDetail): { label: string; color: string } {
  if (material.materialAvailable) {
    return { label: "Disponible en plataforma", color: SUPPORT_COLORS.success };
  }
  if (material.status === "RESOLVED") {
    return { label: "Se dio de baja", color: SUPPORT_COLORS.danger };
  }
  return { label: "No disponible mientras se revisa", color: SUPPORT_COLORS.orange };
}

export function StudentMaterialDetailContent({ material }: StudentMaterialDetailContentProps) {
  const resolution = resolutionText(material);
  const availability = availabilityText(material);

  return (
    <>
      <SupportDetailSection title="Material denunciado">
        <Box sx={detailCardSx}>
          <Typography sx={supportTitleTextSx}>
            {material.originalFileName || material.name}
          </Typography>
          <Typography sx={{ ...supportBodyTextSx, mt: 0.25 }}>
            {material.subjectName} · {material.format.toUpperCase()}
          </Typography>
          <Typography
            sx={{
              fontSize: 14,
              color: availability.color,
              mt: 0.5,
            }}
          >
            {availability.label}
          </Typography>
        </Box>
      </SupportDetailSection>

      <SupportDetailSection title="Mi denuncia">
        <Box sx={detailCardSx}>
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
            <Typography sx={supportDangerTextSx}>{material.reasonLabel}</Typography>
            <Typography sx={{ ...supportMutedTextSx, flexShrink: 0 }}>
              {formatLongDate(material.reportedAt.slice(0, 10))}
            </Typography>
          </Box>
          <Typography sx={{ ...supportBodyTextSx, color: SUPPORT_COLORS.textQuote, mt: 0.5 }}>
            {material.description || "Sin descripción adicional."}
          </Typography>
          {resolution && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, mt: 1 }}>
              <Flag size={13} color={SUPPORT_COLORS.primaryIcon} aria-hidden="true" />
              <Typography sx={supportAccentTextSx}>{resolution}</Typography>
            </Box>
          )}
        </Box>
      </SupportDetailSection>

      <SupportDetailSection title="Revisión">
        <Box sx={{ ...detailCardSx, display: "flex", alignItems: "center", gap: 0.75 }}>
          <AlertCircle size={14} color={SUPPORT_COLORS.primaryIcon} />
          <Box>
            <Typography sx={supportTitleTextSx}>{material.reviewTeamName}</Typography>
            <Typography sx={supportMutedTextSx}>
              {material.reviewerName
                ? `A cargo de ${material.reviewerName}`
                : "Equipo de revisión asignado"}
            </Typography>
          </Box>
        </Box>
      </SupportDetailSection>
    </>
  );
}
