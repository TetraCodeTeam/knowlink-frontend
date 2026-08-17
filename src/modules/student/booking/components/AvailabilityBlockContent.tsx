import { useState, useRef, useCallback } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { Box, Typography } from "@mui/material";
import {
  getReservationWindows,
  getWindowAtRelativePosition,
} from "@/modules/student/booking/utils/reservationWindowUtils";
import type { AvailabilityBlockContentProps } from "@/modules/student/booking/interfaces/bookingComponentPropsType";
import type { ReservationWindow } from "@/modules/student/booking/interfaces/reservationWindowType";
import { BOOKING_STATUS_META } from "@/modules/student/booking/constants/bookingLegendConstants";

const timeFormatter = new Intl.DateTimeFormat("es-AR", { hour: "2-digit", minute: "2-digit" });

function formatRange(start: Date, end: Date): string {
  return `${timeFormatter.format(start)} - ${timeFormatter.format(end)}`;
}

// Contenido interactivo de un bloque de disponibilidad. Por default se ve el
// rango COMPLETO del bloque centrado (ej. "16:00 - 18:00"). Al mover el
// mouse, se calcula en qué franja de 30 min cae el cursor y se resalta esa
// ventana de 1h con un recuadro sólido ocupando SOLO la porción proporcional
// que le corresponde dentro del bloque, con su horario exacto.
//
// Una vez que el alumno elige una ventana en CUALQUIER bloque del
// calendario (locked=true), todo bloque deja de reaccionar al mouse: el que
// tiene la selección queda fijo mostrándola: el resto vuelve a mostrar su
// rango completo, atenuado, sin hover ni click posible. No hay forma de
// cambiar de horario sin cancelar la reserva en curso 
export default function AvailabilityBlockContent({
  blockStart,
  blockEnd,
  selectedWindow,
  locked,
  onHoverWindow,
  onSelectWindow,
}: AvailabilityBlockContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredWindow, setHoveredWindow] = useState<ReservationWindow | null>(null);

  const windows = getReservationWindows(blockStart, blockEnd);


  const highlightedWindow = selectedWindow ?? (locked ? null : hoveredWindow);

  const handleMouseMove = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (locked) return;
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const relativeY = (event.clientY - rect.top) / rect.height;
      const window = getWindowAtRelativePosition(windows, relativeY);

      setHoveredWindow(window);
      onHoverWindow(window);
    },
    [locked, windows, onHoverWindow]
  );

  const handleMouseLeave = useCallback(() => {
    if (locked) return;
    setHoveredWindow(null);
    onHoverWindow(null);
  }, [locked, onHoverWindow]);

  const handleClick = useCallback(() => {
    if (locked) return;
    if (hoveredWindow) onSelectWindow(hoveredWindow);
  }, [locked, hoveredWindow, onSelectWindow]);

  // Comparar por timestamp (valor), no por referencia de objeto:
  // getReservationWindows() genera un array nuevo en cada render.
  const highlightIndex = highlightedWindow
    ? windows.findIndex((w) => w.start.getTime() === highlightedWindow.start.getTime())
    : -1;

  // Bloqueado por selección en OTRO bloque: se ve atenuado, sin interacción.
  const isDimmedByLock = locked && selectedWindow === null;

  return (
    <Box
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      sx={{
        position: "relative",
        height: "100%",
        width: "100%",
        cursor: locked ? "default" : "pointer",
        opacity: isDimmedByLock ? 0.4 : 1,
        transition: "opacity 0.15s ease",
      }}
    >
      {/* Rango completo del bloque, visible solo sin ninguna franja resaltada */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 0.5,
          opacity: highlightIndex >= 0 ? 0 : 1,
          transition: "opacity 0.1s ease",
        }}
      >
        <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
          {formatRange(blockStart, blockEnd)}
        </Typography>
      </Box>

      {/* Franja de 1h resaltada: ocupa solo su porción proporcional dentro
          del bloque, ya sea por hover o por selección ya confirmada. */}
      {highlightedWindow && highlightIndex >= 0 && (
        <Box
          sx={{
            position: "absolute",
            left: 2,
            right: 2,
            top: `${(highlightIndex / windows.length) * 100}%`,
            height: `${(1 / windows.length) * 100}%`,
            bgcolor: `${BOOKING_STATUS_META.SELECTED.color}CC`,
            border: `2px solid ${BOOKING_STATUS_META.SELECTED.color}`,
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 2px 8px ${BOOKING_STATUS_META.SELECTED.color}66`,
            pointerEvents: "none",
          }}
        >
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#fff", textAlign: "center" }}>
            {formatRange(highlightedWindow.start, highlightedWindow.end)}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
