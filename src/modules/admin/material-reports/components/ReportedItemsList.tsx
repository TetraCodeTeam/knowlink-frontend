import { Box, Typography } from "@mui/material";
import type { AdminMaterialReportItem } from "@/modules/admin/material-reports/interfaces/responses/admin-material-report-item.response";
import {
  reportCommentMutedSx,
  reportCommentSx,
  reportDateSx,
  reportHeaderSx,
  reportItemSx,
  reportListSx,
  reportReasonSx,
  sectionSx,
  sectionTitleSx,
} from "@/modules/admin/material-reports/styles/material-reports.styles";
import { formatReportDate } from "@/modules/admin/material-reports/utils/relative-time";

interface ReportedItemsListProps {
  title: string;
  reports: AdminMaterialReportItem[];
}

export default function ReportedItemsList({ title, reports }: ReportedItemsListProps) {
  return (
    <Box sx={sectionSx}>
      <Typography component="h3" sx={sectionTitleSx}>
        {title}
      </Typography>

      <Box component="ul" sx={reportListSx}>
        {reports.map((report, index) => (
          <Box
            component="li"
            key={`${report.reportedAt}-${report.reason}-${index}`}
            sx={reportItemSx}
          >
            <Box sx={reportHeaderSx}>
              <Typography sx={reportReasonSx}>{report.reason}</Typography>
              <Typography sx={reportDateSx}>{formatReportDate(report.reportedAt)}</Typography>
            </Box>
            <Typography
              sx={{ ...reportCommentSx, ...(report.comment ? {} : reportCommentMutedSx) }}
            >
              {report.comment || "Sin comentario del denunciante"}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
