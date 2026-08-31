import { useCallback, useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type {
  EventContentArg,
  DayHeaderContentArg,
  DayCellContentArg,
  DatesSetArg,
} from "@fullcalendar/core";
import { Box, Typography } from "@mui/material";
import {
  isBeforeToday,
  isBeforeNow,
  toDateStr,
  formatWeekRangeTitle,
  toLocalDateTimeStr,
} from "@/shared/utils/calendarDateUtils";
import { bookingCalendarSx } from "@/modules/student/booking/styles/bookingCalendarSx";
import BookingCalendarLegend from "@/modules/student/booking/components/BookingCalendarLegend";
import AvailabilityBlockContent from "@/modules/student/booking/components/AvailabilityBlockContent";
import BookingStatusEventContent from "@/modules/student/booking/components/BookingStatusEventContent";
import CalendarNavHeader from "@/shared/components/CalendarNavHeader";
import type { ReservationWindow } from "@/modules/student/booking/interfaces/reservationWindowType";
import type { BookingSlotEvent } from "@/modules/student/booking/interfaces/bookingSlotEventType";
import type { BookingCalendarProps } from "@/modules/student/booking/interfaces/bookingComponentPropsType";
import type { SlotDisplayStatus } from "@/modules/student/booking/interfaces/slotDisplayStatusType";
import { BOOKING_STATUS_META } from "@/modules/student/booking/constants/bookingLegendConstants";

const PLUGINS = [timeGridPlugin, interactionPlugin];
const SLOT_LABEL_FORMAT = {
  hour: "2-digit" as const,
  minute: "2-digit" as const,
  hour12: false as const,
};
const DAY_LABELS = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];

function getSlotStatus(slot: BookingSlotEvent): SlotDisplayStatus {
  if (isBeforeNow(new Date(slot.end))) return "PAST";
  if (slot.status === "BLOCKED") return "BLOCKED";
  if (slot.status === "RESERVED") return "RESERVED";
  return "AVAILABLE";
}

export default function BookingCalendar({
  selectedSlot,
  bookingSlots = [],
  minimumNoticeMinutes = 0,
  onSelectSlot,
  onDeselectSlot,
  onViewedRangeChange,
}: BookingCalendarProps) {
  const calendarRef = useRef<FullCalendar>(null);
  const [rangeLabel, setRangeLabel] = useState("");
  const [viewedRange, setViewedRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });

  const slotEvents = useMemo(
    () =>
      bookingSlots.map((slot) => {
        const status = getSlotStatus(slot);
        return {
          id: slot.id,
          start: slot.start,
          end: slot.end,
          classNames:
            status === "BLOCKED"
              ? ["booking-slot-blocked"]
              : status === "RESERVED"
                ? ["booking-slot-reserved"]
                : status === "PAST"
                  ? ["booking-slot-past"]
                  : ["booking-slot-available"],
          editable: false,
          extendedProps: { status },
        };
      }),
    [bookingSlots]
  );

  // Franja que sombrea desde la medianoche del día de hoy hasta el instante
  // actual, para orientar visualmente al alumno sobre "dónde está parado" en
  // la semana — mismo patrón que ya usa el calendario de disponibilidad del
  // tutor. Solo se agrega si la semana visible incluye el día de hoy.
  const nowOverlayEvent = useMemo(() => {
    const todayStr = toDateStr(new Date());
    const isViewingToday = todayStr >= viewedRange.start && todayStr <= viewedRange.end;
    if (!isViewingToday) return null;

    return {
      start: `${todayStr}T00:00:00`,
      end: toLocalDateTimeStr(new Date()), // antes: new Date().toISOString().slice(0, 19)
      display: "background",
      classNames: ["fc-past-now"],
    };
  }, [viewedRange]);

  const events = useMemo(
    () => (nowOverlayEvent ? [...slotEvents, nowOverlayEvent] : slotEvents),
    [slotEvents, nowOverlayEvent]
  );

  const handleSelectWindow = useCallback(
    (blockId: string, window: ReservationWindow) => {
      const durationHours = (window.end.getTime() - window.start.getTime()) / (60 * 60 * 1000);

      onSelectSlot({
        id: `${blockId}__${window.start.toISOString()}__${window.end.toISOString()}`,
        startIso: window.start.toISOString(),
        endIso: window.end.toISOString(),
        date: window.start.toLocaleDateString("es-AR", {
          weekday: "long",
          day: "numeric",
          month: "long",
        }),
        startTime: window.start.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
        endTime: window.end.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
        durationHours,
      });
    },
    [onSelectSlot]
  );

  const eventContent = useCallback(
    (arg: EventContentArg) => {
      const status = arg.event.extendedProps.status as SlotDisplayStatus;

      if (status === "AVAILABLE") {
        if (!arg.event.start || !arg.event.end) return null;

        const isThisBlockSelected = selectedSlot?.id.startsWith(`${arg.event.id}__`) ?? false;
        const selectedWindow: ReservationWindow | null = isThisBlockSelected
          ? (() => {
              const [, windowStartIso, windowEndIso] = selectedSlot!.id.split("__");
              return { start: new Date(windowStartIso), end: new Date(windowEndIso) };
            })()
          : null;

        return (
          <AvailabilityBlockContent
            blockStart={arg.event.start}
            blockEnd={arg.event.end}
            unavailableWindows={
              bookingSlots.find((slot) => slot.id === arg.event.id)?.unavailableWindows ?? []
            }
            minimumNoticeMinutes={minimumNoticeMinutes}
            selectedWindow={selectedWindow}
            locked={selectedSlot !== null}
            onHoverWindow={() => {}}
            onSelectWindow={(window) => handleSelectWindow(arg.event.id, window)}
            onDeselectWindow={onDeselectSlot}
          />
        );
      }

      const legendItem = BOOKING_STATUS_META[status as keyof typeof BOOKING_STATUS_META];
      if (legendItem?.description) {
        return (
          <BookingStatusEventContent timeText={arg.timeText} message={legendItem.description} />
        );
      }
      return (
        <Box sx={{ px: 0.5, py: 0.25, fontSize: 12, fontWeight: 600, height: "100%" }}>
          {arg.timeText}
        </Box>
      );
    },
    [bookingSlots, handleSelectWindow, minimumNoticeMinutes, onDeselectSlot, selectedSlot]
  );

  const dayHeaderContent = useCallback(
    ({ date, isToday }: DayHeaderContentArg) => (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
        <Typography variant="caption" fontWeight={700} color={isToday ? "#5B6ED9" : "#4A4B5E"}>
          {DAY_LABELS[date.getDay()]}
        </Typography>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            fontWeight: 700,
            bgcolor: isToday ? "#5B6ED9" : "transparent",
            color: isToday ? "#fff" : "#1A1A2E",
            boxShadow: isToday ? "0 4px 10px rgba(91, 110, 217, 0.35)" : "none",
          }}
        >
          {date.getDate()}
        </Box>
      </Box>
    ),
    []
  );

  const dayCellClassNames = useCallback(
    (arg: DayCellContentArg) => (isBeforeToday(arg.date) ? ["fc-past-day"] : []),
    []
  );

  const handleDatesSetInternal = useCallback(
    (arg: DatesSetArg) => {
      const inclusiveEnd = new Date(arg.end);
      inclusiveEnd.setDate(inclusiveEnd.getDate() - 1);
      setRangeLabel(formatWeekRangeTitle(arg.start, inclusiveEnd));

      const range = { start: toDateStr(arg.start), end: toDateStr(inclusiveEnd) };
      setViewedRange(range);
      onViewedRangeChange(range); // 👈 nuevo
    },
    [onViewedRangeChange]
  );

  return (
    <Box
      sx={{
        ...bookingCalendarSx,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
        <BookingCalendarLegend />
      </Box>

      <CalendarNavHeader
        label={rangeLabel}
        onPrev={() => calendarRef.current?.getApi().prev()}
        onNext={() => calendarRef.current?.getApi().next()}
      />

      <Box sx={{ flex: 1, minHeight: 0 }}>
        <FullCalendar
          ref={calendarRef}
          plugins={PLUGINS}
          initialView="timeGridWeek"
          headerToolbar={false}
          datesSet={handleDatesSetInternal}
          dayHeaderContent={dayHeaderContent}
          dayCellClassNames={dayCellClassNames}
          allDaySlot={false}
          slotMinTime="08:00:00"
          slotMaxTime="23:00:00"
          slotDuration="00:30:00"
          slotLabelInterval="01:00:00"
          slotLabelFormat={SLOT_LABEL_FORMAT}
          selectable={false}
          events={events}
          eventContent={eventContent}
          height="100%"
          locale="es"
          firstDay={1}
        />
      </Box>
    </Box>
  );
}
