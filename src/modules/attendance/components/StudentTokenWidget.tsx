import { useRef } from "react";
import { Box, Paper, Typography } from "@mui/material";

import { useDraggablePosition } from "@/modules/attendance/hooks/useDraggablePosition";
import { useStudentTokenStore } from "@/modules/attendance/hooks/useStudentTokenStore";

/**
 *  persiste entre navegaciones. Se muestra/oculta según `active` del store.
 *
 * A diferencia del widget del tutor, este es puramente informativo:
 * no hay input, no hay confirmación — el estudiante solo necesita
 * poder leerle el código a su tutor.
 */
export const StudentTokenWidget = () => {
  const paperRef = useRef<HTMLDivElement>(null);
  const active = useStudentTokenStore((state) => state.active);

  const { position, isDragging, handleMouseDragStart, handleTouchDragStart } = useDraggablePosition(
    paperRef,
    { horizontalAnchor: "right" }
  );

  if (!active) return null;

  const digits = active.code.split("");

  return (
    <Paper
      ref={paperRef}
      elevation={8}
      onMouseDown={handleMouseDragStart}
      onTouchStart={handleTouchDragStart}
      sx={{
        position: "fixed",
        top: position.y,
        right: position.x,
        zIndex: 1300,
        width: 220,
        borderRadius: 4,
        overflow: "hidden",
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: isDragging ? "none" : "auto",
      }}
    >
      <Box sx={{ bgcolor: "#5865C8", py: 1.5, textAlign: "center" }}>
        <Typography variant="caption" sx={{ color: "#fff", fontWeight: 700, letterSpacing: 1.5 }}>
          TOKEN
        </Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            bgcolor: "#EDEBFC",
            borderRadius: 3,
            py: 1.25,
          }}
        >
          {digits.map((digit, index) => (
            <Typography key={index} variant="body1" fontWeight={700} sx={{ color: "#5865C8" }}>
              {digit}
            </Typography>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};
