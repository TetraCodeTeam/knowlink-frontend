import { Box, Typography } from "@mui/material";
import AdminStatusChip from "@/modules/admin/material-reports/components/AdminStatusChip";
import type { AdminStatusTone } from "@/modules/admin/material-reports/constants/material-report-status-meta";
import {
  detailHeaderSx,
  detailSubtitleSx,
  detailTitleRowSx,
  detailTitleSx,
} from "@/modules/admin/material-reports/styles/material-reports.styles";

interface MaterialReportDetailHeaderProps {
  title: string;
  subtitle: string;
  badgeLabel: string;
  badgeTone: AdminStatusTone;
}

export default function MaterialReportDetailHeader({
  title,
  subtitle,
  badgeLabel,
  badgeTone,
}: MaterialReportDetailHeaderProps) {
  return (
    <Box sx={detailHeaderSx}>
      <Box sx={detailTitleRowSx}>
        <Typography component="h2" sx={detailTitleSx}>
          {title}
        </Typography>
        <AdminStatusChip label={badgeLabel} tone={badgeTone} />
      </Box>
      <Typography sx={detailSubtitleSx}>{subtitle}</Typography>
    </Box>
  );
}
