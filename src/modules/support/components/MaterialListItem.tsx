import { Box, Button, Typography } from "@mui/material";
import { ChevronRight, Flag } from "lucide-react";
import { SupportStatusChip } from "@/modules/support/components/SupportStatusChip";
import { FILE_FORMAT_META } from "@/modules/support/constants/file-format.constants";
import { MATERIAL_STATUS_META } from "@/modules/support/constants/status.constants";
import type { ReportedMaterialResponse } from "@/modules/support/interfaces/responses/reported-material.response";
import {
  detailButtonSx,
  getIconBoxSx,
  itemBodySx,
  itemMetaSx,
  itemTitleRowSx,
  itemTitleSx,
  listItemSx,
  metaSeparatorSx,
} from "@/modules/support/styles/support.styles";
import { pluralizeReports } from "@/modules/support/utils/format.utils";

interface MaterialListItemProps {
  material: ReportedMaterialResponse;
  onViewDetail: (materialId: string) => void;
  selected?: boolean;
}

export function MaterialListItem({
  material,
  onViewDetail,
  selected = false,
}: MaterialListItemProps) {
  const { label, tone } = MATERIAL_STATUS_META[material.status];
  const { icon: FormatIcon, bg, fg } = FILE_FORMAT_META[material.fileFormat];

  return (
    <Box
      component="li"
      sx={{
        ...listItemSx,
        border: selected ? "1px solid #4C5CB5" : "1px solid transparent",
        boxShadow: selected ? "0 2px 5px rgba(41, 62, 157, 0.2)" : "none",
        bgcolor: selected ? "#F4F5FF" : listItemSx.bgcolor,
      }}
    >
      <Box sx={getIconBoxSx(bg, fg)}>
        <FormatIcon size={18} aria-hidden="true" />
      </Box>

      <Box sx={itemBodySx}>
        <Box sx={itemTitleRowSx}>
          <Typography component="span" noWrap sx={itemTitleSx}>
            {material.fileName}
          </Typography>
          <SupportStatusChip label={label} tone={tone} />
        </Box>

        <Box sx={itemMetaSx}>
          <span>{material.subjectName}</span>
          <Box component="span" sx={metaSeparatorSx} aria-hidden="true">
            ·
          </Box>
          <Flag size={12} aria-hidden="true" />
          <span>{pluralizeReports(material.reportCount)}</span>
        </Box>
      </Box>

      <Button
        size="small"
        variant="text"
        endIcon={<ChevronRight size={14} aria-hidden="true" />}
        sx={detailButtonSx}
        onClick={() => onViewDetail(material.id)}
      >
        Ver detalle
      </Button>
    </Box>
  );
}
