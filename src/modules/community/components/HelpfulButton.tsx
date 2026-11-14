import { Box, Tooltip } from "@mui/material";
import { Lightbulb } from "lucide-react";
import { chipSx } from "@/modules/community/styles/community.styles";

interface HelpfulButtonProps {
  /** Cantidad de marcas "Esto me sirvió". */
  count: number;
  /** El usuario ya lo marcó. */
  marked: boolean;
  /** Hay una marca en curso: se bloquea para no enviar dos veces. */
  pending?: boolean;
  /** Si se pasa, el botón queda deshabilitado y este texto explica por qué (p. ej. "es tu propio aporte"). */
  lockedReason?: string;
  onClick: () => void;
}

/** "Esto me sirvió · N votos": se usa en las respuestas del hilo y en los aportes. */
export default function HelpfulButton({
  count,
  marked,
  pending = false,
  lockedReason,
  onClick,
}: HelpfulButtonProps) {
  const isLocked = lockedReason !== undefined;

  return (
    <Tooltip title={lockedReason ?? ""}>
      <span>
        <Box
          component="button"
          type="button"
          disabled={isLocked || pending}
          aria-pressed={marked}
          onClick={onClick}
          sx={{
            ...chipSx,
            border: "none",
            cursor: "pointer",
            px: 1.5,
            py: 0.6,
            fontSize: 12,
            bgcolor: marked ? "#D7D3F7" : "#EEEBFC",
            color: "#3F2FB5",
            "&:disabled": { cursor: "default", opacity: isLocked ? 0.75 : 0.6 },
            "&:hover:not(:disabled)": { bgcolor: "#D7D3F7" },
          }}
        >
          <Lightbulb
            size={15}
            aria-hidden
            fill={marked ? "#F5B820" : "none"}
            color={marked ? "#B7860B" : "#3F2FB5"}
          />
          Esto me sirvió
          <Box component="span" sx={{ fontWeight: 400 }}>
            · {count} {count === 1 ? "voto" : "votos"}
          </Box>
        </Box>
      </span>
    </Tooltip>
  );
}
