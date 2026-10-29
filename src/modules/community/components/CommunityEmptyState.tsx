import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import { COMMUNITY_COLORS, cardSx } from "@/modules/community/styles/community.styles";

interface CommunityEmptyStateProps {
  icon: ReactNode;
  message: string;
  /** Estira la tarjeta hasta ocupar el alto que le sobra a su contenedor. */
  fill?: boolean;
}

export default function CommunityEmptyState({
  icon,
  message,
  fill = false,
}: CommunityEmptyStateProps) {
  return (
    <Box
      sx={{
        ...cardSx,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.5,
        textAlign: "center",
        py: 4,
        ...(fill ? { flex: 1 } : {}),
      }}
    >
      <Box
        aria-hidden
        sx={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          bgcolor: COMMUNITY_COLORS.lavender,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>
      <Typography sx={{ fontSize: 15, color: COMMUNITY_COLORS.muted, maxWidth: 420 }}>
        {message}
      </Typography>
    </Box>
  );
}
