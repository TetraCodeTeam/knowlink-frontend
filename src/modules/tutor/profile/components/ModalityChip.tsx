import { Box, Typography } from "@mui/material";
import { Monitor, Building2 } from "lucide-react";
import { VIRTUAL_BG, PRESENTIAL_BG } from "@/modules/tutor/profile/constants/profileColors.constants";

interface ModalityChipProps {
  modality: "VIRTUAL" | "IN_PERSON";
}

export default function ModalityChip({ modality }: ModalityChipProps) {
  const isVirtual = modality === "VIRTUAL";
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        px: "18px",
        py: "10px",
        borderRadius: "20px",
        backgroundColor: isVirtual ? VIRTUAL_BG : PRESENTIAL_BG,
      }}
    >
      {isVirtual ? <Monitor size={22} /> : <Building2 size={22} />}
      <Typography sx={{ fontSize: "17px", fontWeight: 500, color: "#333" }}>
        {isVirtual ? "Virtual" : "Presencial"}
      </Typography>
    </Box>
  );
}
