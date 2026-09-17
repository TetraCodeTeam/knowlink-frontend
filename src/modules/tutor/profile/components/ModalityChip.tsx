import { Box, Typography } from "@mui/material";
import { Monitor, Building2 } from "lucide-react";
import { VIRTUAL_BG, PRESENTIAL_BG } from "@/modules/tutor/profile/constants/profileColors.constants";

export type Modality = "VIRTUAL" | "IN_PERSON";
export type ModalityChipSize = "sm" | "md";

interface ModalityChipProps {
  modality: Modality;
  /** Cuando se usa como selector: si este chip es el elegido. Por defecto true (uso de solo lectura). */
  selected?: boolean;
  /** Si se provee, el chip se vuelve clickeable (uso como selector). */
  onClick?: () => void;
  /** "sm" para usos compactos (ej. junto a un nombre). Por defecto "md". */
  size?: ModalityChipSize;
}

const SIZE_STYLES: Record<ModalityChipSize, { iconSize: number; px: string; py: string; fontSize: string }> = {
  md: { iconSize: 22, px: "18px", py: "10px", fontSize: "17px" },
  sm: { iconSize: 16, px: "12px", py: "6px", fontSize: "0.85rem" },
};

export default function ModalityChip({
  modality,
  selected = true,
  onClick,
  size = "md",
}: ModalityChipProps) {
  const isVirtual = modality === "VIRTUAL";
  const interactive = !!onClick;
  const { iconSize, px, py, fontSize } = SIZE_STYLES[size];

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
        px,
        py,
        borderRadius: "20px",
        backgroundColor: isVirtual ? VIRTUAL_BG : PRESENTIAL_BG,
        cursor: interactive ? "pointer" : "default",
        opacity: selected ? 1 : 0.45,
        border: "2px solid",
        borderColor: interactive && selected ? "#333" : "transparent",
        transition: "opacity 0.15s ease, border-color 0.15s ease",
      }}
    >
      {isVirtual ? <Monitor size={iconSize} /> : <Building2 size={iconSize} />}
      <Typography sx={{ fontSize, fontWeight: 500, color: "#333" }}>
        {isVirtual ? "Virtual" : "Presencial"}
      </Typography>
    </Box>
  );
}