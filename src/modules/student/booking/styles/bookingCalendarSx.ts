import type { SxProps, Theme } from "@mui/material";
import { calendarBaseSx } from "@/shared/styles/calendarBaseSx";

// Extiende el estilo base de FullCalendar sumando los estados propios del
// flujo de reserva: disponible, reservado por otro, y pasado. El estado
// "seleccionado" no tiene clase propia acá: lo resuelve internamente
// AvailabilityBlockContent, pintando solo la franja de 1h correspondiente
// dentro del bloque (el bloque en sí conserva el fondo de "available").
// Usa un violeta propio (#5865C8), distinto del violeta general del
// proyecto (#5B6ED9), específico para los bloques de este calendario.
export const bookingCalendarSx: SxProps<Theme> = {
  ...calendarBaseSx,

  "& .fc-event.booking-slot-available": {
    bgcolor: "#acb2e4  !important",
    borderColor: "#acb2e4 !important",
    color: "#1a1a2e !important",
    boxShadow: "none",
  },

  "& .fc-event.booking-slot-reserved": {
    bgcolor: "#f5d98a !important",
    borderColor: "#f5d98a !important",
    color: "#6b5a1e !important",
    boxShadow: "none",
    cursor: "not-allowed",
    opacity: "1 !important",
  },

  "& .fc-event.booking-slot-past": {
    bgcolor: "#e2e2ea !important",
    borderColor: "#e2e2ea !important",
    color: "#8a8aa3 !important",
    boxShadow: "none",
    cursor: "not-allowed",
    opacity: "1 !important",
  },
};