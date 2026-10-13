import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import {
  listCountSx,
  listHeaderSx,
  listSubtitleSx,
  listTitleSx,
} from "@/modules/support/styles/support.styles";

interface SupportListSectionProps {
  title: string;
  subtitle: string;
  count: number;
  children: ReactNode;
}

export function SupportListSection({ title, subtitle, count, children }: SupportListSectionProps) {
  return (
    <Box component="section">
      <Box sx={listHeaderSx}>
        <Typography component="h2" sx={listTitleSx}>
          {title}
        </Typography>
        <Typography component="span" sx={listCountSx}>
          {count} {count === 1 ? "registrado" : "registrados"}
        </Typography>
      </Box>
      <Typography sx={listSubtitleSx}>{subtitle}</Typography>
      {children}
    </Box>
  );
}
