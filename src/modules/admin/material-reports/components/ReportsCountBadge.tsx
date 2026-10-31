import { Box } from "@mui/material";
import {
  reportsBadgeClosedSx,
  reportsBadgeOpenSx,
  reportsBadgeSx,
} from "@/modules/admin/material-reports/styles/material-reports.styles";

interface ReportsCountBadgeProps {
  count: number;
  open: boolean;
}

export default function ReportsCountBadge({ count, open }: ReportsCountBadgeProps) {
  return (
    <Box
      component="span"
      aria-label={`${count} ${count === 1 ? "denuncia" : "denuncias"}`}
      sx={{ ...reportsBadgeSx, ...(open ? reportsBadgeOpenSx : reportsBadgeClosedSx) }}
    >
      {count}
    </Box>
  );
}
