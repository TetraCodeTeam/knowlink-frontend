import { Box, Typography } from "@mui/material";
import { emptyStateSx } from "@/modules/tutor/materials/styles/materialsStyles";

export default function MaterialEmptyState() {
  return (
    <Box sx={emptyStateSx}>
      <Box
        component="img"
        src="/upload-material.png"
        alt="Sin materiales"
        sx={{
          width: { xs: 160, md: 190 },
          height: { xs: 160, md: 190 },
          objectFit: "contain",
          opacity: 0.85,
        }}
      />
      <Typography sx={{ fontSize: "15px", fontWeight: 500, color: "#231D58", maxWidth: 400 }}>
        Actualmente no hay material de estudio cargado en esta sección
      </Typography>
    </Box>
  );
}
