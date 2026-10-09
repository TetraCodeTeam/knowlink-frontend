import type { SxProps, Theme } from "@mui/material";

import { AGENDA_BLOCK_COLOR } from "@/modules/tutor/weekly-schedule/constants/weekly-agenda.constants";
import { calendarBaseSx } from "@/shared/styles/calendarBaseSx";

const availableCurrent = AGENDA_BLOCK_COLOR.available.current;
const availablePast = AGENDA_BLOCK_COLOR.available.past;
const bookedCurrent = AGENDA_BLOCK_COLOR.booked.current;
const bookedPast = AGENDA_BLOCK_COLOR.booked.past;

export const weeklyAgendaCalendarSx: SxProps<Theme> = {
  ...calendarBaseSx,

  "& .fc-day-today": {
    backgroundColor: "rgba(91, 110, 217, 0.03) !important",
    boxShadow: "inset 0 0 0 1px rgba(91, 110, 217, 0.12)",
  },

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

  "& .fc-event .agenda-event-content": {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "2px",
    lineHeight: 1.15,
    padding: "3px 6px 4px",
    width: "100%",
    height: "100%",
  },
  "& .fc-event .agenda-event-time": {
    fontSize: "0.68rem",
    lineHeight: 1.2,
    opacity: 0.9,
  },
  "& .fc-event .agenda-event-title": {
    fontSize: "0.75rem",
    lineHeight: 1.2,
    fontWeight: 600,
  },
};