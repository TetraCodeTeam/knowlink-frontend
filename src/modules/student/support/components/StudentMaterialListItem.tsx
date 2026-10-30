import { Box, Button, Typography } from "@mui/material";
import { ChevronRight, UserRound } from "lucide-react";
import { SupportStatusChip } from "@/modules/support/components/SupportStatusChip";
import { FILE_FORMAT_META } from "@/modules/support/constants/file-format.constants";
import { SUPPORT_COLORS } from "@/modules/support/constants/support-colors.constants";
import { MATERIAL_STATUS_META } from "@/modules/support/constants/status.constants";
import type { StudentMaterialReportResponse } from "@/modules/student/support/interfaces/responses/student-support.response";
import { normalizeFileFormat } from "@/modules/student/support/utils/fileFormat.utils";
import {
  detailButtonSx,
  itemBodySx,
  itemMetaSx,
  itemReasonSx,
  itemTitleRowSx,
  itemTitleSx,
  listItemSx,
  metaSeparatorSx,
} from "@/modules/support/styles/supportList.styles";
import { getIconBoxSx } from "@/modules/support/styles/supportShared.styles";

interface StudentMaterialListItemProps {
  material: StudentMaterialReportResponse;
  onViewDetail: (reportId: string) => void;
  selected?: boolean;
}

export function StudentMaterialListItem({
  material,
  onViewDetail,
  selected = false,
}: StudentMaterialListItemProps) {
  const { tone } = MATERIAL_STATUS_META[material.status];
  const { icon: FormatIcon, bg, fg } = FILE_FORMAT_META[normalizeFileFormat(material.format)];

  return (
    <Box
      component="li"
      sx={{
        ...listItemSx,
        border: selected ? `1px solid ${SUPPORT_COLORS.borderSelected}` : "1px solid transparent",
        boxShadow: selected ? "0 2px 5px rgba(41, 62, 157, 0.2)" : "none",
        bgcolor: selected ? SUPPORT_COLORS.surfaceSelected : listItemSx.bgcolor,
      }}
    >
      <Box sx={getIconBoxSx(bg, fg)}>
        <FormatIcon size={18} aria-hidden="true" />
      </Box>

      <Box sx={itemBodySx}>
        <Box sx={itemTitleRowSx}>
          <Typography component="span" noWrap sx={itemTitleSx}>
            {material.originalFileName || material.name}
          </Typography>
          <SupportStatusChip label={material.statusLabel} tone={tone} />
        </Box>

        <Box sx={itemMetaSx}>
          <span>{material.subjectName}</span>
          <Box component="span" sx={metaSeparatorSx} aria-hidden="true">
            ·
          </Box>
          <UserRound size={12} aria-hidden="true" />
          <span>{material.tutorName}</span>
        </Box>

        <Typography noWrap sx={itemReasonSx}>
          Motivo: {material.reasonLabel}
        </Typography>
      </Box>

      <Button
        size="small"
        variant="text"
        endIcon={<ChevronRight size={14} aria-hidden="true" />}
        sx={detailButtonSx}
        onClick={() => onViewDetail(material.reportId)}
      >
        Ver detalle
      </Button>
    </Box>
  );
}
