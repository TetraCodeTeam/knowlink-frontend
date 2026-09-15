import timeGridPlugin from "@fullcalendar/timegrid";

import {
  AGENDA_CALENDAR_SLOT_MAX_TIME,
  AGENDA_CALENDAR_SLOT_MIN_TIME,
  AGENDA_CALENDAR_SLOT_DURATION,
} from "@/modules/tutor/weekly-schedule/constants/weekly-agenda.constants";

export const WEEKLY_AGENDA_CALENDAR_CONFIG = {
  plugins: [timeGridPlugin],
  initialView: "timeGridWeek",
  headerToolbar: false as const,
  locale: "es",
  firstDay: 1,
  allDaySlot: false,
  slotMinTime: AGENDA_CALENDAR_SLOT_MIN_TIME,
  slotMaxTime: AGENDA_CALENDAR_SLOT_MAX_TIME,
  slotDuration: AGENDA_CALENDAR_SLOT_DURATION,
  slotLabelFormat: { hour: "2-digit" as const, minute: "2-digit" as const, hour12: false },
  dayHeaderFormat: { weekday: "short" as const, day: "numeric" as const },
  editable: false,
  selectable: false,
  eventStartEditable: false,
  eventDurationEditable: false,
  height: "auto" as const,
  // Línea de "ahora" nativa; el sombreado de horas pasadas se agrega
  // aparte como background event (ver buildPastTimeShadingEvent).
  nowIndicator: true,
};