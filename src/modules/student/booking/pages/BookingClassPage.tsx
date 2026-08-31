import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import BookingCard from "@/modules/student/booking/components/BookingCard";
import BookingCalendar from "@/modules/student/booking/components/BookingCalendar";
import type { BookingSlot } from "@/modules/student/booking/interfaces/bookingSlotType";
import { useBookingRealtime } from "@/modules/student/booking/hooks/useBookingRealtime";
import { getCurrentWeekMonday, getWeekEnd, toDateStr } from "@/shared/utils/calendarDateUtils";

const WEEKS_AHEAD = 3;

export default function BookingClassPage() {
  const { tutorId = "" } = useParams<{ tutorId: string }>();
  const [slot, setSlot] = useState<BookingSlot | null>(null);

  const currentMonday = useMemo(() => getCurrentWeekMonday(), []);
  const fixedFrom = toDateStr(currentMonday);
  const fixedTo = useMemo(() => {
    const rangeEnd = getWeekEnd(currentMonday);
    rangeEnd.setDate(rangeEnd.getDate() + WEEKS_AHEAD * 7);
    return toDateStr(rangeEnd);
  }, [currentMonday]);

  // Rango real a consultar: el fijo inicial, o el que abarque la semana que
  // el alumno esté mirando en este momento, lo que sea más amplio — mismo
  // criterio que ya usamos en useAvailabilityDraft del lado del tutor.
  const [viewedRange, setViewedRange] = useState({ start: fixedFrom, end: fixedTo });

  const from = viewedRange.start < fixedFrom ? viewedRange.start : fixedFrom;
  const to = viewedRange.end > fixedTo ? viewedRange.end : fixedTo;

  const { bookingSlots, minimumNoticeMinutes, holdSlot, reserveSlot, releaseSlot } =
    useBookingRealtime(tutorId, from, to);

  const handleSelectSlot = async (nextSlot: BookingSlot) => {
    try {
      await holdSlot(nextSlot);
      setSlot(nextSlot);
    } catch {
      setSlot(null);
    }
  };

  const handleDeselectSlot = async () => {
    if (!slot) return;
    try {
      await releaseSlot(slot);
    } catch {
      // liberar es best-effort — si falla igual limpiamos la selección local
    } finally {
      setSlot(null);
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 4, p: 4, alignItems: "stretch" }}>
      <Box sx={{ flex: 1 }}>
        <BookingCalendar
          bookingSlots={bookingSlots}
          minimumNoticeMinutes={minimumNoticeMinutes}
          selectedSlot={slot}
          onSelectSlot={(nextSlot) => void handleSelectSlot(nextSlot)}
          onDeselectSlot={() => void handleDeselectSlot()}
          onViewedRangeChange={setViewedRange}
        />
      </Box>
      <BookingCard
        selectedSlot={slot}
        onReserveBooking={reserveSlot}
        onReleaseBooking={releaseSlot}
        onCancelSelectedSlot={() => setSlot(null)}
        tutorId={tutorId}
      />
    </Box>
  );
}