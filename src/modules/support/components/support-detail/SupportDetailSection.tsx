import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import { detailCardSx, sectionLabelSx } from "./supportDetail.styles";

export function SupportDetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box>
      <Typography sx={sectionLabelSx}>{title}</Typography>
      {children}
    </Box>
  );
}

export function SupportDetailTile({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box sx={{ ...detailCardSx, minWidth: 0, flex: 1 }}>
      <Typography sx={{ fontSize: 12, color: "#73778A", mb: 0.4 }}>{title}</Typography>
      {children}
    </Box>
  );
}
