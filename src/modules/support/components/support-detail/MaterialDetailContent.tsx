import { Box, Button, Link, Typography } from "@mui/material";
import { AlertCircle, ArrowUpRight, FileText } from "lucide-react";
import type { MaterialReportingPolicy } from "@/modules/support/interfaces/responses/material-reporting-policy.response";
import type { ReportedMaterialDetail } from "@/modules/support/interfaces/responses/reported-material-detail.response";
import { SUPPORT_COLORS } from "@/modules/support/constants/support-colors.constants";
import { formatLongDate } from "@/modules/support/utils/format.utils";
import { formatSupportReason } from "@/modules/support/utils/supportDetail.utils";
import { SupportDetailSection } from "@/modules/support/components/support-detail/SupportDetailSection";
import {
  attachmentLinkSx,
  detailCardSx,
  supportLinkButtonSx,
} from "@/modules/support/styles/supportDetail.styles";
import {
  supportBodyTextSx,
  supportDangerTextSx,
  supportMutedTextSx,
  supportQuoteTextSx,
  supportTitleTextSx,
} from "@/modules/support/styles/supportText.styles";
import { MaterialDefenseForm } from "@/modules/support/components/support-detail/MaterialDefenseForm";

interface MaterialDetailContentProps {
  material: ReportedMaterialDetail;
  policy: MaterialReportingPolicy | undefined;
  policyIsLoading: boolean;
  policyIsError: boolean;
}

export function MaterialDetailContent({
  material,
  policy,
  policyIsLoading,
  policyIsError,
}: MaterialDetailContentProps) {
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
              color: material.available ? SUPPORT_COLORS.success : SUPPORT_COLORS.danger,
              mt: 0.5,
            }}
          >
            {material.available ? "Disponible para estudiantes" : "No disponible"}
          </Typography>
          {material.previewUrl && (
            <Button
              component="a"
              href={material.previewUrl}
              target="_blank"
              rel="noreferrer"
              size="small"
              endIcon={<ArrowUpRight size={14} />}
              sx={{ ...supportLinkButtonSx, mt: 0.75 }}
            >
              Abrir material
            </Button>
          )}
        </Box>
      </SupportDetailSection>

      <SupportDetailSection title={`Denuncias recibidas · ${material.reportCount}`}>
        {material.reports.map((report) => (
          <Box key={report.reportId} sx={{ ...detailCardSx, mb: 0.75 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
              <Typography sx={supportDangerTextSx}>{formatSupportReason(report.reason)}</Typography>
              <Typography sx={{ ...supportMutedTextSx, flexShrink: 0 }}>
                {formatLongDate(report.reportedAt.slice(0, 10))}
              </Typography>
            </Box>
            <Typography sx={{ ...supportBodyTextSx, color: SUPPORT_COLORS.textQuote, mt: 0.5 }}>
              {report.description || "Sin descripción adicional."}
            </Typography>
          </Box>
        ))}
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

      <SupportDetailSection title="Descargo y evidencias">
        {material.defense?.submitted ? (
          <Box sx={detailCardSx}>
            <Typography sx={supportQuoteTextSx}>
              {material.defense.description || "Se presentó un descargo sin descripción."}
            </Typography>
            {material.defense.attachments.map((attachment) => (
              <Link
                key={attachment.attachmentId}
                href={attachment.signedUrl}
                target="_blank"
                rel="noreferrer"
                sx={{ ...attachmentLinkSx, mt: 0.75 }}
              >
                <FileText size={14} />
                {attachment.fileName}
              </Link>
            ))}
          </Box>
        ) : (
          <Typography sx={{ ...detailCardSx, ...supportMutedTextSx }}>
            Todavía no presentaste un descargo.
          </Typography>
        )}
      </SupportDetailSection>

      {!material.defense?.submitted && material.status !== "RESOLVED" && (
        <MaterialDefenseForm
          materialId={material.materialId}
          policy={policy}
          policyIsLoading={policyIsLoading}
          policyIsError={policyIsError}
        />
      )}
    </>
  );
}
