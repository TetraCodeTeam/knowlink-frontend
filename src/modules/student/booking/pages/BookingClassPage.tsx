import { useState } from "react";
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

  const monday = getCurrentWeekMonday();
  const from = toDateStr(monday);
  const rangeEnd = getWeekEnd(monday);
  rangeEnd.setDate(rangeEnd.getDate() + WEEKS_AHEAD * 7);
  const to = toDateStr(rangeEnd);

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
      // liberar es best-effort — si falla igual limpiamos la selección local,
      // el hold del lado del servidor va a expirar solo a los 15 min.
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
