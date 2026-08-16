import { useCallback, useMemo, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventContentArg, DayHeaderContentArg } from "@fullcalendar/core";
import { Box, Typography } from "@mui/material";
import { isBeforeNow } from "@/shared/utils/calendarDateUtils";
import { bookingCalendarSx } from "@/modules/student/booking/styles/bookingCalendarSx";
import InfoTooltip from "@/modules/student/booking/components/InfoTooltip";
import BookingCalendarLegend from "@/modules/student/booking/components/BookingCalendarLegend";
import AvailabilityBlockContent from "@/modules/student/booking/components/AvailabilityBlockContent";
import type { ReservationWindow } from "@/modules/student/booking/utils/reservationWindowUtils";
import {
  RESERVED_SLOT_TOOLTIP,
  MOCK_BOOKING_SLOTS,
} from "@/modules/student/booking/mockBookingSlots";
import type { MockBookingSlotEvent } from "@/modules/student/booking/mockBookingSlots";
import type { BookingSlot } from "@/modules/student/booking/components/BookingCard";

const PLUGINS = [timeGridPlugin, interactionPlugin];
const HEADER_TOOLBAR = { left: "prev,next", center: "title", right: "" };
const TITLE_FORMAT = { month: "long" as const, year: "numeric" as const };
const SLOT_LABEL_FORMAT = {
  hour: "2-digit" as const,
  minute: "2-digit" as const,
  hour12: false as const,
};
const DAY_LABELS = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];

type ResolvedSlotStatus = "AVAILABLE" | "RESERVED_BY_OTHER" | "PAST";

function getSlotStatus(slot: MockBookingSlotEvent): ResolvedSlotStatus {
  if (isBeforeNow(new Date(slot.end))) return "PAST";
  if (slot.status === "RESERVED_BY_OTHER") return "RESERVED_BY_OTHER";
  return "AVAILABLE";
}

interface BookingCalendarProps {
  selectedSlot: BookingSlot | null;
  onSelectSlot: (slot: BookingSlot) => void;
}

export default function BookingCalendar({ selectedSlot, onSelectSlot }: BookingCalendarProps) {
  const calendarRef = useRef<FullCalendar>(null);

  const events = useMemo(
    () =>
      MOCK_BOOKING_SLOTS.map((slot) => {
        const status = getSlotStatus(slot);
        return {
          id: slot.id,
          start: slot.start,
          end: slot.end,
          classNames:
            status === "RESERVED_BY_OTHER"
              ? ["booking-slot-reserved"]
              : status === "PAST"
                ? ["booking-slot-past"]
                : ["booking-slot-available"],
          editable: false,
          extendedProps: { status },
        };
      }),
    [],
  );

  // El id de un slot reservable identifica una VENTANA de 1h dentro de un
  // bloque de disponibilidad, no el bloque completo. Se compone del id del
  // bloque original + el horario exacto de inicio de la ventana.
  const handleSelectWindow = useCallback(
    (blockId: string, window: ReservationWindow) => {
      onSelectSlot({
        id: `${blockId}__${window.start.toISOString()}`,
        date: window.start.toLocaleDateString("es-AR", {
          weekday: "long",
          day: "numeric",
          month: "long",
        }),
        startTime: window.start.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
        endTime: window.end.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
      });
    },
    [onSelectSlot],
  );

  const eventContent = useCallback(
    (arg: EventContentArg) => {
      const status = arg.event.extendedProps.status as ResolvedSlotStatus;

      if (status === "AVAILABLE") {
        if (!arg.event.start || !arg.event.end) return null;

        const isThisBlockSelected = selectedSlot?.id.startsWith(`${arg.event.id}__`) ?? false;
        const selectedWindow: ReservationWindow | null = isThisBlockSelected
          ? (() => {
              const windowStart = new Date(selectedSlot!.id.split("__")[1]);
              return { start: windowStart, end: new Date(windowStart.getTime() + 60 * 60 * 1000) };
            })()
          : null;

        return (
          <AvailabilityBlockContent
            blockStart={arg.event.start}
            blockEnd={arg.event.end}
            selectedWindow={selectedWindow}
            onHoverWindow={() => {}}
            onSelectWindow={(window) => handleSelectWindow(arg.event.id, window)}
          />
        );
      }

      const content = (
        <Box sx={{ px: 0.5, py: 0.25, fontSize: 12, fontWeight: 600, height: "100%" }}>
          {arg.timeText}
        </Box>
      );

      if (status === "RESERVED_BY_OTHER") {
        return <InfoTooltip message={RESERVED_SLOT_TOOLTIP}>{content}</InfoTooltip>;
      }
      if (status === "PAST") {
        return <InfoTooltip message="Este horario ya pasó.">{content}</InfoTooltip>;
      }
      return content;
    },
    [handleSelectWindow, selectedSlot],
  );

  const dayHeaderContent = useCallback(
    (arg: DayHeaderContentArg) => (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 0.5 }}>
        <Typography variant="body2" fontWeight={600}>
          {DAY_LABELS[arg.date.getDay()]}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {arg.date.getDate()}
        </Typography>
      </Box>
    ),
    [],
  );

  return (
    <Box sx={bookingCalendarSx}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", mb: 2 }}>
        <BookingCalendarLegend />
      </Box>

      <FullCalendar
        ref={calendarRef}
        plugins={PLUGINS}
        initialView="timeGridWeek"
        headerToolbar={HEADER_TOOLBAR}
        titleFormat={TITLE_FORMAT}
        dayHeaderContent={dayHeaderContent}
        allDaySlot={false}
        slotMinTime="08:00:00"
        slotMaxTime="21:00:00"
        slotDuration="00:30:00"
        slotLabelInterval="01:00:00"
        slotLabelFormat={SLOT_LABEL_FORMAT}
        selectable={false}
        events={events}
        eventContent={eventContent}
        height={600}
        locale="es"
        firstDay={1}
      />
    </Box>
  );
}