import { Box, Typography } from "@mui/material";

export default function UnderConstructionPage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100%",
        gap: "0px",
        textAlign: "center",
        padding: "24px",
        backgroundColor: "transparent",
      }}
    >
      <Box
        component="img"
        src="/In-construction.png"
        alt="En construcción"
        sx={{
          width: 420,
          maxWidth: "90%",
          mb: "36px",
        }}
      />

      <Typography
        sx={{
          fontSize: "36px",
          fontWeight: 600,
          color: "#1a1a2e",
          mb: "16px",
        }}
      >
        Esta sección está en construcción
      </Typography>

      <Typography
        sx={{
          fontSize: "20px",
          color: "#666",
          maxWidth: "520px",
          lineHeight: 1.6,
        }}
      >
        Lamentamos las molestias, estamos trabajando para brindarte la mejor experiencia académica
      </Typography>
    </Box>
  );
}

