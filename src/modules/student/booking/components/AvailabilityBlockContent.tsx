import { Box, Typography } from "@mui/material";
import type { AvailabilityBlockContentProps } from "@/modules/student/booking/interfaces/bookingComponentPropsType";
import { BOOKING_STATUS_META } from "@/modules/student/booking/constants/bookingLegendConstants";
import { useAvailabilityBlockInteraction } from "@/modules/student/booking/hooks/useAvailabilityBlockInteraction";
import BookingValidationMessage from "@/modules/student/booking/components/BookingValidationMessage";

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
  minimumNoticeMinutes,
  onHoverWindow,
  onSelectWindow,
  onDeselectWindow,
}: AvailabilityBlockContentProps) {
  const {
    containerRef,
    highlightedWindow,
    highlightIndex,
    isInvalidDrag,
    isMinimumNoticeViolation,
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
    minimumNoticeMinutes,
    onHoverWindow,
    onSelectWindow,
    onDeselectWindow,
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
        cursor: locked && !selectedWindow ? "default" : "pointer",
        userSelect: "none",
        WebkitUserSelect: "none",
        opacity: isDimmedByLock ? 0.4 : 1,
        transition: "opacity 0.15s ease",
      }}
    >
      {isInvalidDrag && (
        <BookingValidationMessage
          anchorEl={containerRef.current}
          message="Las reservas se realizan por hora completa, no se admite seleccionar medias horas"
        />
      )}
      {isMinimumNoticeViolation && (
        <BookingValidationMessage
          anchorEl={containerRef.current}
          message={`Este horario requiere una anticipación mínima de ${minimumNoticeMinutes / 60} horas.`}
        />
      )}
      {/* Franja de 1h resaltada: ocupa solo su porción proporcional dentro
          del bloque, ya sea por hover o por selección ya confirmada. */}
      {unavailableWindows.map((window) => (
        <Box
          key={`${window.start}-${window.end}`}
          sx={{
            position: "absolute",
            left: 2,
            right: 2,
            top: `${((new Date(window.start).getTime() - blockStart.getTime()) / (blockEnd.getTime() - blockStart.getTime())) * 100}%`,
            height: `${
              ((new Date(window.end).getTime() - new Date(window.start).getTime()) /
                (blockEnd.getTime() - blockStart.getTime())) *
              100
            }%`,
            bgcolor: BOOKING_STATUS_META[window.status].color,
            border: `1px solid ${BOOKING_STATUS_META[window.status].color}`,
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
            height: `${
              ((highlightedWindow.end.getTime() - highlightedWindow.start.getTime()) /
                (blockEnd.getTime() - blockStart.getTime())) *
              100
            }%`,
            bgcolor: BOOKING_STATUS_META.SELECTED.color,
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
