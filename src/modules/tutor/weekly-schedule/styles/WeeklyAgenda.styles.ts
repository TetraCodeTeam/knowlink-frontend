import type { SxProps, Theme } from "@mui/material";

import { calendarBaseSx } from "@/shared/styles/calendarBaseSx";
import { AGENDA_BLOCK_COLOR } from "@/modules/tutor/weekly-schedule/constants/weekly-agenda.constants";

const availableCurrent = AGENDA_BLOCK_COLOR.available.current;
const availablePast = AGENDA_BLOCK_COLOR.available.past;
const bookedCurrent = AGENDA_BLOCK_COLOR.booked.current;
const bookedPast = AGENDA_BLOCK_COLOR.booked.past;

/**
 * Extiende calendarBaseSx. IMPORTANTE: calendarBaseSx define
 * ".fc-event" con bgcolor/borderColor en "!important" — eso pisaría
 * cualquier color que le pongamos a los bloques de esta pantalla si
 * dependiéramos solo de props del evento (backgroundColor/borderColor
 * en el EventInput, que FullCalendar aplica como estilo inline, de
 * menor especificidad que un !important en clase). Por eso acá los 4
 * combos de color se fuerzan también con !important sobre selectores
 * más específicos (".fc-event.fc-block-xxx"), y dejan de pasarse como
 * prop del evento en el mapper.
 */
export const weeklyAgendaCalendarSx: SxProps<Theme> = {
  ...calendarBaseSx,

  "& .fc-event.fc-block-available-current": {
    bgcolor: `${availableCurrent.bg} !important`,
    borderColor: `${availableCurrent.border} !important`,
    color: `${availableCurrent.text} !important`,
    borderStyle: `${availableCurrent.borderStyle} !important`,
    borderWidth: "1.5px !important",
    boxShadow: "none !important",
  },
  "& .fc-event.fc-block-available-past": {
    bgcolor: `${availablePast.bg} !important`,
    borderColor: `${availablePast.border} !important`,
    color: `${availablePast.text} !important`,
    borderStyle: `${availablePast.borderStyle} !important`,
    borderWidth: "1.5px !important",
    boxShadow: "none !important",
    cursor: "not-allowed",
  },
  "& .fc-event.fc-block-booked-current": {
    bgcolor: `${bookedCurrent.bg} !important`,
    borderColor: `${bookedCurrent.border} !important`,
    color: `${bookedCurrent.text} !important`,
    borderStyle: `${bookedCurrent.borderStyle} !important`,
    borderWidth: "1px !important",
  },
  "& .fc-event.fc-block-booked-past": {
    bgcolor: `${bookedPast.bg} !important`,
    borderColor: `${bookedPast.border} !important`,
    color: `${bookedPast.text} !important`,
    borderStyle: `${bookedPast.borderStyle} !important`,
    borderWidth: "1px !important",
    cursor: "not-allowed",
  },

  // Línea de "ahora" nativa: gris en vez del rojo default.
  "& .fc-timegrid-now-indicator-line": {
    borderColor: "#999999 !important",
    borderWidth: "1.5px !important",
  },
  "& .fc-timegrid-now-indicator-arrow": {
    display: "none",
  },

  // Contenido custom del evento (ver eventContent en el componente).
  "& .fc-event .agenda-event-content": {
    display: "flex",
    flexDirection: "column",
    lineHeight: 1.3,
    padding: "2px 4px",
  },
  "& .fc-event .agenda-event-time": {
    fontSize: "0.7rem",
    opacity: 0.85,
  },
  "& .fc-event .agenda-event-title": {
    fontSize: "0.8rem",
    fontWeight: 600,
  },
} as SxProps<Theme>;

/** Chip blanco contenedor para fecha, navegación de semana y leyenda (US-52). */
export const agendaToolbarChipSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  bgcolor: "#fff",
  border: "1px solid #ececf4",
  borderRadius: 3,
  px: 1.5,
  py: 0.75,
  boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
};

export const agendaSummaryCardSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 1.5,
  border: "1px solid #ececf4",
  borderRadius: 4,
  px: 2.5,
  py: 2,
  bgcolor: "#fff",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  flex: 1,
};

export const agendaStatChipSx = (chipBg: string): SxProps<Theme> => ({
  bgcolor: chipBg,
  color: "text.secondary",
  fontWeight: 500,
  border: "none",
  "& .MuiChip-label": { px: 1.25 },
});

export const agendaStatIconBoxSx = (iconBg: string): SxProps<Theme> => ({
  width: 36,
  height: 36,
  borderRadius: 2,
  bgcolor: iconBg,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
});

export const agendaLegendDotSx = (color: string): SxProps<Theme> => ({
  width: 10,
  height: 10,
  borderRadius: "50%",
  bgcolor: color,
  display: "inline-block",
});