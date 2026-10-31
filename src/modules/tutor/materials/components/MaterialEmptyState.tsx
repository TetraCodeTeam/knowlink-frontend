import { Box, Typography } from "@mui/material";
import { emptyStateSx } from "@/modules/tutor/materials/styles/materialsStyles";

export default function MaterialEmptyState() {
  return (
    <Box sx={emptyStateSx}>
      <Box
        component="img"
        src="/upload-material.png"
        alt="Sin materiales"
        sx={{ width: 260, height: 260, objectFit: "contain", opacity: 0.85 }}
      />
      <Typography sx={{ fontSize: "18px", fontWeight: 500, color: "#231D58", maxWidth: 400 }}>
        Actualmente no hay material de estudio cargado en esta sección
      </Typography>
    </Box>
  );
}
