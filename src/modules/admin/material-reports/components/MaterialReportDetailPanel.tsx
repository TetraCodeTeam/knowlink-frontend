import { useState } from "react";
import { Box, Skeleton, Typography } from "@mui/material";
import AppButton from "@/shared/components/AppButton";
import BeforeResolvingGuide from "@/modules/admin/components/BeforeResolvingGuide";
import DismissReportDialog from "@/modules/admin/material-reports/components/DismissReportDialog";
import MaterialReportDetailHeader from "@/modules/admin/material-reports/components/MaterialReportDetailHeader";
import RemoveMaterialDialog from "@/modules/admin/material-reports/components/RemoveMaterialDialog";
import ReportedItemsList from "@/modules/admin/material-reports/components/ReportedItemsList";
import ResolutionActions from "@/modules/admin/material-reports/components/ResolutionActions";
import TutorOwnerCard from "@/modules/admin/material-reports/components/TutorOwnerCard";
import type { AdminStatusTone } from "@/modules/admin/constants/admin-status-meta";
import {
  MATERIAL_REPORT_GUIDELINES,
  MATERIAL_REPORT_MESSAGES,
} from "@/modules/admin/material-reports/constants/material-reports.constants";
import { useAdminMaterialReportDetail } from "@/modules/admin/material-reports/hooks/useAdminMaterialReportDetail";
import { useAssignMaterialReport } from "@/modules/admin/material-reports/hooks/useAssignMaterialReport";
import type { AdminMaterialReportDetailResponse } from "@/modules/admin/material-reports/interfaces/responses/admin-material-report-detail.response";
import {
  detailErrorSx,
  detailErrorTextSx,
  detailErrorTitleSx,
  detailNoteSx,
  detailPanelSx,
  detailSubtitleSx,
  detailTitleSx,
  infoLabelSx,
  infoRowSx,
  infoValueSx,
  resolutionNoteLabelSx,
  resolutionNoteSx,
  resolutionNoteTextSx,
  sectionSx,
  sectionTitleSx,
} from "@/modules/admin/material-reports/styles/material-reports.styles";

interface MaterialReportDetailPanelProps {
  materialId: string | null;
}

type DialogKind = "remove" | "dismiss" | null;

interface PanelHeader {
  title: string;
  subtitle: string;
  badgeLabel: string;
  badgeTone: AdminStatusTone;
}

function getPanelHeader(detail: AdminMaterialReportDetailResponse): PanelHeader {
  if (detail.status === "PENDING") {
    return {
      title: "Detalle de la denuncia",
      subtitle: "Revisión previa a la asignación",
      badgeLabel: "Sin asignar",
      badgeTone: "warning",
    };
  }

  if (detail.status === "IN_REVIEW") {
    return {
      title: `En revisión por ${detail.assignedToName ?? "otro administrador"}`,
      subtitle: "Solicitud asignada",
      badgeLabel: "Asignada",
      badgeTone: "info",
    };
  }

  if (detail.status === "REMOVED") {
    return {
      title: "Material eliminado",
      subtitle: "Resolución final",
      badgeLabel: "Eliminado",
      badgeTone: "danger",
    };
  }

  return {
    title: "Denuncia desestimada",
    subtitle: "Resolución final",
    badgeLabel: "Desestimado",
    badgeTone: "success",
  };
}

function reportsTitle(detail: AdminMaterialReportDetailResponse): string {
  if (detail.status === "PENDING") {
    return `${detail.reportsCount} ${detail.reportsCount === 1 ? "denuncia asociada" : "denuncias asociadas"}`;
  }
  if (detail.status === "IN_REVIEW") return "Agrupadas por recurso";
  return "Denuncias resueltas";
}

export default function MaterialReportDetailPanel({ materialId }: MaterialReportDetailPanelProps) {
  const { detail, isLoading, isError, refetch } = useAdminMaterialReportDetail(materialId);
  const assignMutation = useAssignMaterialReport(materialId ?? "");
  const [dialog, setDialog] = useState<DialogKind>(null);

  if (!materialId) {
    return (
      <Box component="aside" aria-label="Detalle de la denuncia" sx={detailPanelSx}>
        <Typography component="h2" sx={detailTitleSx}>
          Seleccioná un material
        </Typography>
        <Typography sx={detailSubtitleSx}>
          Elegí un archivo de la lista para ver las denuncias recibidas y resolverlo.
        </Typography>
        <BeforeResolvingGuide guidelines={MATERIAL_REPORT_GUIDELINES} />
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box
        component="aside"
        aria-label="Detalle de la denuncia"
        aria-busy="true"
        sx={detailPanelSx}
      >
        <Skeleton variant="text" width="70%" height={32} />
        <Skeleton variant="text" width="50%" />
        <Skeleton variant="rounded" height={96} />
        <Skeleton variant="rounded" height={140} />
        <Skeleton variant="rounded" height={120} />
      </Box>
    );
  }

  if (isError || !detail) {
    return (
      <Box component="aside" aria-label="Detalle de la denuncia" sx={detailPanelSx}>
        <Box role="alert" sx={detailErrorSx}>
          <Typography sx={detailErrorTitleSx}>
            {MATERIAL_REPORT_MESSAGES.detailErrorTitle}
          </Typography>
          <Typography sx={detailErrorTextSx}>{MATERIAL_REPORT_MESSAGES.detailErrorText}</Typography>
          <AppButton appVariant="dark" onClick={() => void refetch()}>
            Reintentar
          </AppButton>
        </Box>
      </Box>
    );
  }

  const header = getPanelHeader(detail);

  return (
    <Box component="aside" aria-label="Detalle de la denuncia" sx={detailPanelSx}>
      <MaterialReportDetailHeader
        title={header.title}
        subtitle={header.subtitle}
        badgeLabel={header.badgeLabel}
        badgeTone={header.badgeTone}
      />

      <TutorOwnerCard tutor={detail.tutor} />

      <Box sx={sectionSx}>
        <Typography component="h3" sx={sectionTitleSx}>
          Recurso y materia
        </Typography>
        <Box sx={infoRowSx}>
          <Typography sx={infoLabelSx}>Recurso</Typography>
          <Typography title={detail.fileName} sx={infoValueSx}>
            {detail.fileName}
          </Typography>
        </Box>
        <Box sx={infoRowSx}>
          <Typography sx={infoLabelSx}>Materia solicitada</Typography>
          <Typography sx={infoValueSx}>{detail.subjectName}</Typography>
        </Box>
      </Box>

      <ReportedItemsList title={reportsTitle(detail)} reports={detail.reports} />

      {detail.status === "PENDING" && (
        <Box sx={sectionSx}>
          <AppButton
            appVariant="primary"
            fullWidth
            loading={assignMutation.isPending}
            onClick={() => assignMutation.mutate()}
          >
            Tomar solicitud
          </AppButton>
          <Typography sx={detailNoteSx}>
            Al tomar la solicitud, el material pasará a estar <strong>En revisión</strong> asignado
            a tu cuenta.
          </Typography>
        </Box>
      )}

      {detail.status === "IN_REVIEW" && detail.assignedToMe && (
        <ResolutionActions
          onRemove={() => setDialog("remove")}
          onDismiss={() => setDialog("dismiss")}
        />
      )}

      {detail.status === "IN_REVIEW" && !detail.assignedToMe && (
        <Typography sx={detailNoteSx}>
          Solo el administrador asignado puede resolver esta solicitud.
        </Typography>
      )}

      {(detail.status === "REMOVED" || detail.status === "DISMISSED") && (
        <Box sx={resolutionNoteSx}>
          <Typography sx={resolutionNoteLabelSx}>Justificación del moderador:</Typography>
          <Typography sx={resolutionNoteTextSx}>
            {detail.resolutionNote || "Sin justificación registrada."}
          </Typography>
        </Box>
      )}

      <RemoveMaterialDialog
        materialId={detail.materialId}
        open={dialog === "remove"}
        onClose={() => setDialog(null)}
      />
      <DismissReportDialog
        materialId={detail.materialId}
        open={dialog === "dismiss"}
        onClose={() => setDialog(null)}
      />
    </Box>
  );
}
