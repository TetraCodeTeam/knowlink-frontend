import type { SxProps, Theme } from "@mui/material";

import { AGENDA_BLOCK_COLOR } from "@/modules/tutor/weekly-schedule/constants/weekly-agenda.constants";
import { calendarBaseSx } from "@/shared/styles/calendarBaseSx";

const availableCurrent = AGENDA_BLOCK_COLOR.available.current;
const availablePast = AGENDA_BLOCK_COLOR.available.past;
const bookedCurrent = AGENDA_BLOCK_COLOR.booked.current;
const bookedPast = AGENDA_BLOCK_COLOR.booked.past;

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
};