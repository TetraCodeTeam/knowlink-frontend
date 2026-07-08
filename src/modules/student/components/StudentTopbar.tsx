import { Box, Typography } from "@mui/material";
import { GraduationCap } from "lucide-react";

export const TOPBAR_HEIGHT = 64;
export const SIDEBAR_WIDTH = 120;

export default function StudentTopbar() {
  return (
    <Box
      component="header"
      sx={{
        position: "fixed",
        top: 0,
        right: 0,
        left: SIDEBAR_WIDTH,
        height: TOPBAR_HEIGHT,
        backgroundColor: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingX: "28px",
        zIndex: 99,
        borderBottom: "1px solid #F0EEFE",
      }}
    >
      {/* Search bar area — implemented by another team member */}
      <Box sx={{ flex: 1 }} />

      <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <GraduationCap size={32} color="#5865C8" />
        <Typography
          sx={{
            fontSize: "22px",
            fontWeight: 600,
            color: "#1a1a2e",
            letterSpacing: "-0.4px",
          }}
        >
          KnowLink
        </Typography>
      </Box>
    </Box>
  );
}
