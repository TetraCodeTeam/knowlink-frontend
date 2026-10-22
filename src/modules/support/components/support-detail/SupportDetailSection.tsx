import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import { detailTileSx, detailTileTitleSx, sectionLabelSx } from "../../styles/supportDetail.styles";

interface SupportDetailBlockProps {
  title: string;
  children: ReactNode;
}

export function SupportDetailSection({ title, children }: SupportDetailBlockProps) {
  return (
    <Box>
      <Typography sx={sectionLabelSx}>{title}</Typography>
      {children}
    </Box>
  );
}

export function SupportDetailTile({ title, children }: SupportDetailBlockProps) {
  return (
    <Box sx={detailTileSx}>
      <Typography sx={detailTileTitleSx}>{title}</Typography>
      {children}
    </Box>
  );
}
