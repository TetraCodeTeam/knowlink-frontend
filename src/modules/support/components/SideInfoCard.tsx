import type { ReactNode } from "react";
import { Box } from "@mui/material";
import { getIconBoxSx } from "@/modules/support/styles/supportShared.styles";
import {
  sideCardBodySx,
  sideCardHeaderSx,
  sideCardSx,
  sideCardTitleSx,
} from "@/modules/support/styles/supportSidebar.styles";

interface SideInfoCardProps {
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  children: ReactNode;
}

export function SideInfoCard({ icon, iconBg, iconColor, title, children }: SideInfoCardProps) {
  return (
    <Box component="section" sx={{ ...sideCardSx }}>
      <Box sx={sideCardHeaderSx}>
        <Box sx={{ ...getIconBoxSx(iconBg, iconColor), width: 32, height: 32 }}>{icon}</Box>
        <Box component="h3" sx={{ ...sideCardTitleSx, m: 0 }}>
          {title}
        </Box>
      </Box>
      <Box sx={{ ...sideCardBodySx }}>{children}</Box>
    </Box>
  );
}
