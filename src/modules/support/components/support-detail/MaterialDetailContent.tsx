import { Box, Button, Link, Typography } from "@mui/material";
import { AlertCircle, ArrowUpRight, FileText } from "lucide-react";
import type { MaterialReportingPolicy } from "@/modules/support/interfaces/responses/material-reporting-policy.response";
import type { ReportedMaterialDetail } from "@/modules/support/interfaces/responses/reported-material-detail.response";
import { formatLongDate } from "@/modules/support/utils/format.utils";
import { formatSupportReason } from "@/modules/support/utils/supportDetail.utils";
import { SupportDetailSection } from "./SupportDetailSection";
import { attachmentLinkSx, detailCardSx } from "../../styles/supportDetail.styles";
import { MaterialDefenseForm } from "./MaterialDefenseForm";

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
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: "#282A3B" }}>
            {material.originalFileName || material.name}
          </Typography>
          <Typography sx={{ fontSize: 14, color: "#686C7B", mt: 0.25 }}>
            {material.subjectName} · {material.format.toUpperCase()}
          </Typography>
          <Typography
            sx={{ fontSize: 14, color: material.available ? "#357A51" : "#A94442", mt: 0.5 }}
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
              sx={{ mt: 0.75, fontSize: 14, textTransform: "none" }}
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
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#A94442" }}>
                {formatSupportReason(report.reason)}
              </Typography>
              <Typography sx={{ fontSize: 14, color: "#73778A", flexShrink: 0 }}>
                {formatLongDate(report.reportedAt.slice(0, 10))}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 14, color: "#55596B", mt: 0.5 }}>
              {report.description || "Sin descripción adicional."}
            </Typography>
          </Box>
        ))}
      </SupportDetailSection>

      <SupportDetailSection title="Revisión">
        <Box sx={{ ...detailCardSx, display: "flex", alignItems: "center", gap: 0.75 }}>
          <AlertCircle size={14} color="#5866B1" />
          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 600, color: "#282A3B" }}>
              {material.reviewTeamName}
            </Typography>
            <Typography sx={{ fontSize: 14, color: "#73778A" }}>
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
            <Typography
              sx={{ fontSize: 14, color: "#55596B", fontStyle: "italic", lineHeight: 1.5 }}
            >
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
          <Typography sx={{ ...detailCardSx, fontSize: 14, color: "#73778A" }}>
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
