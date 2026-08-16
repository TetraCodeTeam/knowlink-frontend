import type { SxProps, Theme } from "@mui/material";
import { calendarBaseSx } from "@/shared/styles/calendarBaseSx";

// Extiende el estilo base de FullCalendar sumando los estados propios del
// flujo de reserva: seleccionado, bloqueado por otro estudiante, y pasado.
export const bookingCalendarSx: SxProps<Theme> = {
  ...calendarBaseSx,

  // Bloque disponible seleccionado por el alumno
  "& .fc-event.booking-slot-selected": {
    bgcolor: "#5B6ED9 !important",
    borderColor: "#5B6ED9 !important",
    boxShadow: "0 2px 6px rgba(91, 110, 217, 0.35)",
  },

  // Bloque tomado temporalmente por otro alumno: amarillo, no clickeable
  "& .fc-event.booking-slot-locked": {
    bgcolor: "#f5d98a !important",
    borderColor: "#f5d98a !important",
    color: "#6b5a1e !important",
    boxShadow: "none",
    cursor: "not-allowed",
    opacity: "1 !important",
  },

  // Bloque cuyo horario ya pasó: gris, no clickeable
  "& .fc-event.booking-slot-past": {
    bgcolor: "#e2e2ea !important",
    borderColor: "#e2e2ea !important",
    color: "#8a8aa3 !important",
    boxShadow: "none",
    cursor: "not-allowed",
    opacity: "1 !important",
  },
};