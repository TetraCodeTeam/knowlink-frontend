import { Box, Typography } from "@mui/material";
import type { AvailabilityBlockContentProps } from "@/modules/student/booking/interfaces/bookingComponentPropsType";
import { BOOKING_STATUS_META } from "@/modules/student/booking/constants/bookingLegendConstants";
import { useAvailabilityBlockInteraction } from "@/modules/student/booking/hooks/useAvailabilityBlockInteraction";

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
  unavailableWindows,
  locked,
  onHoverWindow,
  onSelectWindow,
}: AvailabilityBlockContentProps) {
  const {
    containerRef,
    highlightedWindow,
    highlightIndex,
    isInvalidDrag,
    isDimmedByLock,
    handleMouseMove,
    handleMouseLeave,
    handleMouseDown,
    handleMouseUp,
    handleClick,
  } = useAvailabilityBlockInteraction({
    blockStart,
    blockEnd,
    selectedWindow,
    unavailableWindows,
    locked,
    onHoverWindow,
    onSelectWindow,
  });

  return (
    <Box
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      sx={{
        position: "relative",
        height: "100%",
        width: "100%",
        cursor: locked ? "default" : "pointer",
        userSelect: "none",
        WebkitUserSelect: "none",
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

      {isInvalidDrag && (
        <Box
          sx={{
            position: "absolute",
            left: "calc(100% + 10px)",
            top: "50%",
            transform: "translateY(-50%)",
            width: 190,
            px: 1.5,
            py: 1,
            bgcolor: "#fff8e6",
            border: "1px solid #e8c56a",
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(91, 72, 20, 0.16)",
            zIndex: 20,
            pointerEvents: "none",
          }}
        >
          <Typography
            sx={{
              color: "#6b5a1e",
              fontSize: 12,
              fontWeight: 700,
              lineHeight: 1.35,
              textAlign: "center",
            }}
          >
            Las reservas se realizan por hora completa, no se admite seleccionar medias horas
          </Typography>
        </Box>
      )}
      {/* Franja de 1h resaltada: ocupa solo su porción proporcional dentro
          del bloque, ya sea por hover o por selección ya confirmada. */}
      {unavailableWindows.map((window) => (
        <Box
          key={`${window.start.toISOString()}-${window.end.toISOString()}`}
          sx={{
            position: "absolute",
            left: 2,
            right: 2,
            top: `${((window.start.getTime() - blockStart.getTime()) / (blockEnd.getTime() - blockStart.getTime())) * 100}%`,
            height: `${((window.end.getTime() - window.start.getTime()) /
              (blockEnd.getTime() - blockStart.getTime())) * 100}%`,
            bgcolor: `${BOOKING_STATUS_META.BLOCKED.color}CC`,
            border: `1px solid ${BOOKING_STATUS_META.BLOCKED.color}`,
            borderRadius: "6px",
            pointerEvents: "none",
          }}
        />
      ))}

      {highlightedWindow && highlightIndex >= 0 && (
        <Box
          sx={{
            position: "absolute",
            left: 2,
            right: 2,
            top: `${((highlightedWindow.start.getTime() - blockStart.getTime()) / (blockEnd.getTime() - blockStart.getTime())) * 100}%`,
            height: `${((highlightedWindow.end.getTime() - highlightedWindow.start.getTime()) /
              (blockEnd.getTime() - blockStart.getTime())) * 100}%`,
            bgcolor: `${BOOKING_STATUS_META.SELECTED.color}CC`,
            border: `1px solid ${BOOKING_STATUS_META.SELECTED.color}`,
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 1px 4px ${BOOKING_STATUS_META.SELECTED.color}ff`,
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
