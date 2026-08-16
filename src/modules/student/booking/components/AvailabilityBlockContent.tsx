import { useState, useRef, useCallback } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { Box, Typography } from "@mui/material";
import {
  getReservationWindows,
  getWindowAtRelativePosition,
} from "@/modules/student/booking/utils/reservationWindowUtils";
import type { ReservationWindow } from "@/modules/student/booking/utils/reservationWindowUtils";

interface AvailabilityBlockContentProps {
  blockStart: Date;
  blockEnd: Date;
  selectedWindow: ReservationWindow | null;
  onHoverWindow: (window: ReservationWindow | null) => void;
  onSelectWindow: (window: ReservationWindow) => void;
}

const timeFormatter = new Intl.DateTimeFormat("es-AR", { hour: "2-digit", minute: "2-digit" });

function formatRange(start: Date, end: Date): string {
  return `${timeFormatter.format(start)} - ${timeFormatter.format(end)}`;
}

export default function AvailabilityBlockContent({
  blockStart,
  blockEnd,
  selectedWindow,
  onHoverWindow,
  onSelectWindow,
}: AvailabilityBlockContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredWindow, setHoveredWindow] = useState<ReservationWindow | null>(null);

  const isFixed = selectedWindow !== null;
  const windows = getReservationWindows(blockStart, blockEnd);

  const highlightedWindow = selectedWindow ?? hoveredWindow;

  const handleMouseMove = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (isFixed) return;
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const relativeY = (event.clientY - rect.top) / rect.height;
      const window = getWindowAtRelativePosition(windows, relativeY);

      setHoveredWindow(window);
      onHoverWindow(window);
    },
    [isFixed, windows, onHoverWindow],
  );

  const handleMouseLeave = useCallback(() => {
    if (isFixed) return;
    setHoveredWindow(null);
    onHoverWindow(null);
  }, [isFixed, onHoverWindow]);

  const handleClick = useCallback(() => {
    if (isFixed) return;
    if (hoveredWindow) onSelectWindow(hoveredWindow);
  }, [isFixed, hoveredWindow, onSelectWindow]);

  // Comparar por timestamp (valor), no por referencia: getReservationWindows
  // genera un array nuevo en cada render, así que .indexOf() por referencia
  // nunca matchea.
  const highlightIndex = highlightedWindow
    ? windows.findIndex((w) => w.start.getTime() === highlightedWindow.start.getTime())
    : -1;

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
        cursor: isFixed ? "default" : "pointer",
      }}
    >
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

      {highlightedWindow && highlightIndex >= 0 && (
        <Box
          sx={{
            position: "absolute",
            left: 2,
            right: 2,
            top: `${(highlightIndex / windows.length) * 100}%`,
            height: `${(1 / windows.length) * 100}%`,
            bgcolor: "rgba(88, 101, 200, 0.9)",
            border: "2px solid #5865C8",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(88, 101, 200, 0.4)",
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