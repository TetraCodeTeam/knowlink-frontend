import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import {
  cardHeaderSx,
  cardSx,
  cardTitleSx,
} from "@/modules/tutor/statistics/styles/statistics.styles";

interface StatisticsCardProps {
  title: string;
  /** Contenido alineado a la derecha del título (enlace, contador). */
  action?: ReactNode;
  children: ReactNode;
}

export default function StatisticsCard({ title, action, children }: StatisticsCardProps) {
  return (
    <Box component="section" sx={cardSx} aria-label={title}>
      <Box sx={cardHeaderSx}>
        <Typography component="h2" sx={cardTitleSx}>
          {title}
        </Typography>
        {action}
      </Box>
      {children}
    </Box>
  );
}
