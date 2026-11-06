import type { ReactNode } from "react";
import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

interface FrankieSpeechBubbleProps {
  children: ReactNode;
  /** Hacia dónde apunta la colita: abajo (Frankie debajo) o a la izquierda (Frankie al costado). */
  tail?: "bottom" | "left";
  sx?: SxProps<Theme>;
}

/** Globo de diálogo de Frankie: lo que dice, en primera persona y con voz cercana. */
export default function FrankieSpeechBubble({
  children,
  tail = "bottom",
  sx,
}: FrankieSpeechBubbleProps) {
  const tailSx =
    tail === "bottom"
      ? { left: "50%", bottom: -8, ml: "-8px" }
      : { left: -8, top: "50%", mt: "-8px" };

  return (
    <Box
      sx={[
        {
          position: "relative",
          px: 2.25,
          py: 1.5,
          borderRadius: "18px",
          bgcolor: "#fff",
          border: "1.5px solid #E4E2F6",
          boxShadow: "0 8px 20px -14px rgba(63, 76, 174, 0.5)",
          color: "#2B2F6B",
          fontSize: 14.5,
          fontWeight: 600,
          lineHeight: 1.5,
          "&::after": {
            content: '""',
            position: "absolute",
            width: 14,
            height: 14,
            bgcolor: "#fff",
            borderRight: "1.5px solid #E4E2F6",
            borderBottom: "1.5px solid #E4E2F6",
            transform: tail === "bottom" ? "rotate(45deg)" : "rotate(135deg)",
            ...tailSx,
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {children}
    </Box>
  );
}
