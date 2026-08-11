import { Box, Typography } from "@mui/material";
import { Monitor, Building2 } from "lucide-react";
import { VIRTUAL_BG, PRESENTIAL_BG } from "@/modules/tutor/profile/constants/profileColors.constants";

interface ModalityChipProps {
  modality: "VIRTUAL" | "IN_PERSON";
  /** Cuando se usa como selector: si este chip es el elegido. Por defecto true (uso de solo lectura). */
  selected?: boolean;
  /** Si se provee, el chip se vuelve clickeable (uso como selector). */
  onClick?: () => void;
}

export default function ModalityChip({ modality, selected = true, onClick }: ModalityChipProps) {
  const isVirtual = modality === "VIRTUAL";
  const interactive = !!onClick;

  return (
    <Box
      onClick={onClick}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-pressed={interactive ? selected : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        px: "18px",
        py: "10px",
        borderRadius: "20px",
        backgroundColor: isVirtual ? VIRTUAL_BG : PRESENTIAL_BG,
        cursor: interactive ? "pointer" : "default",
        opacity: selected ? 1 : 0.45,
        border: "2px solid",
        borderColor: interactive && selected ? "#333" : "transparent",
        transition: "opacity 0.15s ease, border-color 0.15s ease",
      }}
    >
      {isVirtual ? <Monitor size={22} /> : <Building2 size={22} />}
      <Typography sx={{ fontSize: "17px", fontWeight: 500, color: "#333" }}>
        {isVirtual ? "Virtual" : "Presencial"}
      </Typography>
    </Box>
  );
}