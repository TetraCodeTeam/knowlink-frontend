import type { ReactNode } from "react";
import { Box } from "@mui/material";
import {
  getSummaryTileSx,
  sideCardSx,
  sideCardTitleSx,
  summaryCaptionSx,
  summaryGridSx,
  summaryLabelSx,
  summaryTileIconSx,
  summaryValueSx,
  type SummaryTone,
} from "@/modules/support/styles/supportSidebar.styles";

export interface SummaryTile {
  id: string;
  value: number;
  label: string;
  caption?: string;
  icon?: ReactNode;
  tone: SummaryTone;
}

interface SummaryCardProps {
  title: string;
  tiles: SummaryTile[];
}

export function SummaryCard({ title, tiles }: SummaryCardProps) {
  return (
    <Box component="section" sx={sideCardSx}>
      <Box component="h3" sx={{ ...sideCardTitleSx, m: 0, mb: 1.5 }}>
        {title}
      </Box>
      <Box sx={summaryGridSx}>
        {tiles.map((tile) => (
          <Box key={tile.id} sx={getSummaryTileSx(tile.tone)}>
            {tile.icon ? (
              <Box component="span" sx={summaryTileIconSx}>
                {tile.icon}
              </Box>
            ) : null}
            <Box sx={summaryValueSx(tile.tone)}>{tile.value}</Box>
            <Box sx={summaryLabelSx}>{tile.label}</Box>
            {tile.caption ? <Box sx={summaryCaptionSx}>{tile.caption}</Box> : null}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
