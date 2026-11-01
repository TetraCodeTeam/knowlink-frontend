import { Box, Typography } from "@mui/material";
import { CalendarDays } from "lucide-react";
import { formatAdminDate } from "@/modules/admin/home/utils/format-admin-date";
import {
  dateChipSx,
  dateChipTextSx,
  topBarSubtitleSx,
  topBarSx,
  topBarTitleSx,
} from "@/modules/admin/home/styles/admin-home.styles";

interface AdminTopBarProps {
  date: Date;
}

export default function AdminTopBar({ date }: AdminTopBarProps) {
  return (
    <Box component="header" sx={topBarSx}>
      <Box sx={{ minWidth: 0 }}>
        <Typography component="h1" sx={topBarTitleSx}>
          Hola, Admin
        </Typography>
        <Typography sx={topBarSubtitleSx}>
          Resumen general y métricas de moderación en tiempo real
        </Typography>
      </Box>

      <Box sx={dateChipSx}>
        <CalendarDays size={16} aria-hidden />
        <Typography sx={dateChipTextSx}>{formatAdminDate(date)}</Typography>
      </Box>
    </Box>
  );
}
