import type { SxProps, Theme } from "@mui/material";
import { calendarBaseSx } from "@/shared/styles/calendarBaseSx";
import { BOOKING_STATUS_META } from "@/modules/student/booking/constants/bookingLegendConstants";

const AVAILABLE_COLOR = BOOKING_STATUS_META.AVAILABLE.color;
const BLOCKED_COLOR = BOOKING_STATUS_META.BLOCKED.color;
const RESERVED_COLOR = BOOKING_STATUS_META.RESERVED.color;
const PAST_COLOR = BOOKING_STATUS_META.PAST.color;

// Extiende el estilo base de FullCalendar con los estados del flujo de
// reserva: disponible, bloqueado, reservado y pasado. El estado
// "seleccionado" no tiene clase propia acá: lo resuelve internamente
// AvailabilityBlockContent, pintando solo la franja de 1h correspondiente
// dentro del bloque (el bloque en sí conserva el fondo de "available").
export const bookingCalendarSx: SxProps<Theme> = {
  ...calendarBaseSx,

  "& .fc-toolbar-title": {
    fontSize: "1.35rem",
    textAlign: "center",
    textTransform: "capitalize",
  },

  "& .fc-event.booking-slot-available": {
    bgcolor: `${AVAILABLE_COLOR} !important`,
    borderColor: `${AVAILABLE_COLOR} !important`,
    color: "#1a1a2e !important",
    boxShadow: "none",
    overflow: "visible !important",
  },

  "& .fc-event.booking-slot-available:has(.booking-validation-message)": {
    zIndex: "100 !important",
  },

  "& .fc-event.booking-slot-blocked": {
    bgcolor: `${BLOCKED_COLOR} !important`,
    borderColor: `${BLOCKED_COLOR} !important`,
    color: "#6b5a1e !important",
    boxShadow: "none",
    cursor: "not-allowed",
    opacity: "1 !important",
  },

  "& .fc-event.booking-slot-reserved": {
    bgcolor: `${RESERVED_COLOR} !important`,
    borderColor: `${RESERVED_COLOR} !important`,
    color: "#4d4d5d !important",
    boxShadow: "none",
    cursor: "not-allowed",
    opacity: "1 !important",
  },

  "& .fc-event.booking-slot-past": {
    bgcolor: `${PAST_COLOR} !important`,
    borderColor: `${PAST_COLOR} !important`,
    color: "#8a8aa3 !important",
    boxShadow: "none",
    cursor: "not-allowed",
    opacity: "1 !important",
  },
};
