import { Outlet } from "react-router-dom";
import { Box, Typography } from "@mui/material";

export default function AdminCatalogoLayout() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <Box
        sx={{
          borderBottom: "1px solid #e2e8f0",
          bgcolor: "#ffffff",
          px: 3,
          py: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography variant="h6" fontWeight={700} sx={{ color: "#5B6ED9" }}>
          KnowLink
        </Typography>
        <Typography variant="body2" color="text.secondary">
          · Administración
        </Typography>
      </Box>
      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
          px: 3,
          py: 4,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}