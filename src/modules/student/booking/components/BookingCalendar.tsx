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
import { useBookingSlots } from "@/modules/student/booking/hooks/useBookingSlots";
import type { ReservationWindow } from "@/modules/student/booking/interfaces/reservationWindowType";
import type { MockBookingSlotEvent } from "@/modules/student/booking/interfaces/mockBookingSlotEventType";
import type { BookingCalendarProps } from "@/modules/student/booking/interfaces/bookingComponentPropsType";
import type { SlotDisplayStatus } from "@/modules/student/booking/interfaces/slotDisplayStatusType";
import { BOOKING_STATUS_META } from "../constants/bookingLegendConstants";

const PLUGINS = [timeGridPlugin, interactionPlugin];
const HEADER_TOOLBAR = { left: "prev,next", center: "title", right: "" };
const TITLE_FORMAT = { month: "long" as const, year: "numeric" as const };
const SLOT_LABEL_FORMAT = {
  hour: "2-digit" as const,
  minute: "2-digit" as const,
  hour12: false as const,
};
const DAY_LABELS = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];

// Única fuente de verdad de "¿se puede tomar este slot?", consultada tanto
// para pintar el evento (classNames) como para permitir el click
// (handleEventClick). Evita que ambos criterios se desincronicen.
function getSlotStatus(slot: MockBookingSlotEvent): SlotDisplayStatus {
  if (isBeforeNow(new Date(slot.end))) return "PAST";
  if (slot.status === "BLOCKED") return "BLOCKED";
  if (slot.status === "RESERVED") return "RESERVED";
  return "AVAILABLE";
}

export default function BookingCalendar({ selectedSlot, onSelectSlot }: BookingCalendarProps) {
  const calendarRef = useRef<FullCalendar>(null);
  const bookingSlots = useBookingSlots();

  // MOCK_BOOKING_SLOTS todavía no viene de una API, pero igual se memoiza:
  // FullCalendar recalcula estado interno cuando cambia la *referencia* de
  // `events`, no solo su valor, así que conviene mantener la disciplina
  // desde ahora para cuando esto pase a venir de useQuery.
  const events = useMemo(
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

  // El id de un slot reservable ahora identifica una VENTANA de 1h dentro de
  // un bloque de disponibilidad, no el bloque completo (un mismo bloque
  // largo puede ofrecer varias ventanas distintas). Se compone del id del
  // bloque original + el horario exacto de inicio de la ventana.
  const handleSelectWindow = useCallback(
    (blockId: string, window: ReservationWindow) => {
      const durationHours =
        (window.end.getTime() - window.start.getTime()) / (60 * 60 * 1000);

      onSelectSlot({
        id: `${blockId}__${window.start.toISOString()}__${window.end.toISOString()}`,
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
            selectedWindow={selectedWindow}
            locked={selectedSlot !== null}
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

      const legendItem = BOOKING_STATUS_META[status as keyof typeof BOOKING_STATUS_META];

      if (legendItem?.description) {
        return <InfoTooltip message={legendItem.description}>{content}</InfoTooltip>;
      }
      return content;
    },
    [handleSelectWindow, selectedSlot]
  );


  const dayHeaderContent = useCallback(({ date, isToday }: DayHeaderContentArg) => (
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
  ), []);

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
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        mb: 2,
      }}
    >
      <BookingCalendarLegend />
    </Box>

    <Box sx={{ flex: 1, minHeight: 0 }}>
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
        height="100%"
        locale="es"
        firstDay={1}
      />
    </Box>
  </Box>
);
}
