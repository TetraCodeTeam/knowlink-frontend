import type { SxProps, Theme } from "@mui/material";
import { calendarBaseSx } from "@/shared/styles/calendarBaseSx";

// Extiende el estilo base de FullCalendar con los estados del flujo de
// reserva: disponible, bloqueado, reservado y pasado. El estado
// "seleccionado" no tiene clase propia acá: lo resuelve internamente
// AvailabilityBlockContent, pintando solo la franja de 1h correspondiente
// dentro del bloque (el bloque en sí conserva el fondo de "available").
export const bookingCalendarSx: SxProps<Theme> = {
  ...calendarBaseSx,

  "& .fc-event.booking-slot-available": {
    bgcolor: "#acb2e4 !important",
    borderColor: "#acb2e4 !important",
    color: "#1a1a2e !important",
    boxShadow: "none",
  },

  "& .fc-event.booking-slot-blocked": {
    bgcolor: "#f5d98a !important",
    borderColor: "#f5d98a !important",
    color: "#6b5a1e !important",
    boxShadow: "none",
    cursor: "not-allowed",
    opacity: "1 !important",
  },

  "& .fc-event.booking-slot-reserved": {
    bgcolor: "#dfe1ec !important",
    borderColor: "#dfe1ec !important",
    color: "#4d4d5d !important",
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
