import type { SxProps, Theme } from "@mui/material";

import { calendarBaseSx } from "@/shared/styles/calendarBaseSx";
import { AGENDA_BLOCK_COLOR } from "@/modules/tutor/weekly-schedule/constants/weekly-agenda.constants";

const availableCurrent = AGENDA_BLOCK_COLOR.available.current;
const availablePast = AGENDA_BLOCK_COLOR.available.past;
const bookedCurrent = AGENDA_BLOCK_COLOR.booked.current;
const bookedPast = AGENDA_BLOCK_COLOR.booked.past;

/**
 * Extiende calendarBaseSx. calendarBaseSx expone el color/borde/sombra del
 * evento como CSS vars (--fc-event-bg/border/color/shadow) con default
 * genérico; acá se pisan esas vars por clase en vez de repetir
 * bgcolor/borderColor con !important, así no hay pelea de especificidad
 * con el default y las demás pantallas que usan calendarBaseSx (ej.
 * AvailabilityEditor) no se ven afectadas.
 */
export const weeklyAgendaCalendarSx: SxProps<Theme> = {
  ...calendarBaseSx,

  "& .fc-agenda-past-day": {
    bgcolor: "#f7f7fb !important",
  },

  "& .fc-event.fc-block-available-current": {
    "--fc-event-bg": availableCurrent.bg,
    "--fc-event-border": availableCurrent.border,
    "--fc-event-color": availableCurrent.text,
    "--fc-event-text-color": availableCurrent.text,
    "--fc-event-shadow": "none",
    borderStyle: availableCurrent.borderStyle,
    borderWidth: "1.5px",
  },
  "& .fc-event.fc-block-available-past": {
    "--fc-event-bg": availablePast.bg,
    "--fc-event-border": availablePast.border,
    "--fc-event-color": availablePast.text,
    "--fc-event-text-color": availablePast.text,
    "--fc-event-shadow": "none",
    borderStyle: availablePast.borderStyle,
    borderWidth: "1.5px",
    cursor: "not-allowed",
  },
  "& .fc-event.fc-block-booked-current": {
    "--fc-event-bg": bookedCurrent.bg,
    "--fc-event-border": bookedCurrent.border,
    "--fc-event-color": bookedCurrent.text,
    "--fc-event-text-color": bookedCurrent.text,
    borderStyle: bookedCurrent.borderStyle,
    borderWidth: "1px",
  },
  "& .fc-event.fc-block-booked-past": {
    "--fc-event-bg": bookedPast.bg,
    "--fc-event-border": bookedPast.border,
    "--fc-event-color": bookedPast.text,
    "--fc-event-text-color": bookedPast.text,
    borderStyle: bookedPast.borderStyle,
    borderWidth: "1px",
    cursor: "not-allowed",
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

/** Chip blanco contenedor para fecha, navegación de semana y leyenda */
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
  gap: 0.5,
  border: "1px solid #F4F2FF",
  borderRadius: 4,
  px: 2.5,
  py: 2,
  bgcolor: "#fff",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  flex: 1,
};

export const agendaStatChipSx = (chipBg: string): SxProps<Theme> => ({
  bgcolor: chipBg,
  color: "text.secondary",
  fontWeight: 500,
  border: "none",
  "& .MuiChip-label": { px: 1.25, fontSize:"14px" },
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
  width: 15,
  height: 15,
  borderRadius: "30%",
  bgcolor: color,
  display: "inline-block",
});