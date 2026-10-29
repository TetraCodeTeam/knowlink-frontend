import { Box, Typography } from "@mui/material";
import { Clock } from "lucide-react";
import AppButton from "@/shared/components/AppButton";
import AdminStatusChip from "@/modules/admin/components/AdminStatusChip";
import FileKindIcon from "@/modules/admin/material-reports/components/FileKindIcon";
import ReportsCountBadge from "@/modules/admin/material-reports/components/ReportsCountBadge";
import { ADMIN_MATERIAL_REPORT_STATUS_META } from "@/modules/admin/material-reports/constants/material-report-status-meta";
import type { AdminMaterialReportListItem as AdminMaterialReportListItemResponse } from "@/modules/admin/material-reports/interfaces/responses/admin-material-report-list-item.response";
import {
  itemActionSx,
  itemBodySx,
  itemDangerMetaSx,
  itemMetaSx,
  itemMetaStrongSx,
  itemSeparatorSx,
  itemStripeSx,
  itemTitleRemovedSx,
  itemTitleRowSx,
  itemTitleSx,
  justificationLabelSx,
  justificationSx,
  justificationTextSx,
  listItemSelectedSx,
  listItemSx,
} from "@/modules/admin/material-reports/styles/material-reports.styles";
import type { AdminMaterialReportStatus } from "@/modules/admin/types/admin-material-report-status.type";
import { formatRelativeTime } from "@/modules/admin/material-reports/utils/relative-time";

interface MaterialReportListItemProps {
  report: AdminMaterialReportListItemResponse;
  selected: boolean;
  onSelect: (materialId: string) => void;
}

const ACTION_LABEL: Record<AdminMaterialReportStatus, string> = {
  PENDING: "Revisar denuncias",
  IN_REVIEW: "Ver detalle",
  REMOVED: "Ver resolución",
  DISMISSED: "Ver detalle",
};

export default function MaterialReportListItem({
  report,
  selected,
  onSelect,
}: MaterialReportListItemProps) {
  const meta = ADMIN_MATERIAL_REPORT_STATUS_META[report.status];
  const isOpen = report.status === "PENDING" || report.status === "IN_REVIEW";
  const isClosed = !isOpen;
  const isRemoved = report.status === "REMOVED";
  const actionVariant: "primary" | "outline" = report.status === "PENDING" ? "primary" : "outline";

  return (
    <Box
      component="li"
      sx={{ ...listItemSx, ...(selected ? listItemSelectedSx : {}) }}
      aria-label={report.fileName}
    >
      <Box sx={{ ...itemStripeSx, backgroundColor: meta.accent }} aria-hidden="true" />

      <Box sx={{ position: "relative", flexShrink: 0 }}>
        <FileKindIcon kind={report.fileKind} />
        <ReportsCountBadge count={report.reportsCount} open={isOpen} />
      </Box>

      <Box sx={itemBodySx}>
        <Box sx={itemTitleRowSx}>
          <Typography
            component="span"
            title={report.fileName}
            sx={{ ...itemTitleSx, ...(isRemoved ? itemTitleRemovedSx : {}) }}
          >
            {report.fileName}
          </Typography>
          <AdminStatusChip label={meta.label} tone={meta.tone} />
        </Box>

        <Typography sx={itemMetaSx}>
          <span>{report.subjectName}</span>
          <Box component="span" sx={itemSeparatorSx} aria-hidden="true">
            ·
          </Box>
          <span>{report.tutorName}</span>
        </Typography>

        <Box sx={itemMetaSx}>
          <Clock size={13} aria-hidden="true" />
          <span>{formatRelativeTime(report.lastReportedAt)}</span>

          {report.status === "IN_REVIEW" && report.assignedToName && (
            <>
              <Box component="span" sx={itemSeparatorSx} aria-hidden="true">
                ·
              </Box>
              <Box component="span" sx={itemMetaStrongSx}>
                Asignado a: {report.assignedToName}
              </Box>
            </>
          )}

          {report.status === "DISMISSED" && (
            <>
              <Box component="span" sx={itemSeparatorSx} aria-hidden="true">
                ·
              </Box>
              <span>Contenido válido bajo revisión académica</span>
            </>
          )}

          {report.status === "REMOVED" && (
            <>
              <Box component="span" sx={itemSeparatorSx} aria-hidden="true">
                ·
              </Box>
              <Box component="span" sx={itemDangerMetaSx}>
                Material retirado permanentemente
              </Box>
            </>
          )}
        </Box>

        {isClosed && (
          <Box sx={justificationSx}>
            <Typography component="p" sx={justificationLabelSx}>
              Justificación del moderador:
            </Typography>
            <Typography sx={justificationTextSx}>
              {report.resolutionNote || "Sin justificación registrada."}
            </Typography>
          </Box>
        )}
      </Box>

      <AppButton
        appVariant={actionVariant}
        size="small"
        onClick={() => onSelect(report.materialId)}
        sx={{ ...itemActionSx, py: 1, px: 2, fontSize: 13 }}
      >
        {ACTION_LABEL[report.status]}
      </AppButton>
    </Box>
  );
}
