import { useState } from "react";
import { Box } from "@mui/material";
import BookingCard from "@/modules/student/booking/components/BookingCard";
import BookingCalendar from "@/modules/student/booking/components/BookingCalendar";
import type { BookingSlot } from "@/modules/student/booking/interfaces/bookingSlotType";
import { useBookingRealtime } from "@/modules/student/booking/hooks/useBookingRealtime";
import { MOCK_MINIMUM_NOTICE_MINUTES } from "@/modules/student/booking/mockdata";


export default function BookingClassPage() {
  const [slot, setSlot] = useState<BookingSlot | null>(null);
  const { bookingSlots, holdSlot, reserveSlot, releaseSlot } = useBookingRealtime("mock-tutor");

  const handleSelectSlot = async (nextSlot: BookingSlot) => {
    try {
      await holdSlot(nextSlot);
      setSlot(nextSlot);
    } catch {
      setSlot(null);
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 4, p: 4, alignItems: "stretch" }}>
      <Box sx={{ flex: 1 }}>
        <BookingCalendar
          bookingSlots={bookingSlots}
          minimumNoticeMinutes={MOCK_MINIMUM_NOTICE_MINUTES}
          selectedSlot={slot}
          onSelectSlot={(nextSlot) => void handleSelectSlot(nextSlot)}
        />
      </Box>

      <BookingCard
        selectedSlot={slot}
        onReserveBooking={reserveSlot}
        onReleaseBooking={releaseSlot}
        onCancelSelectedSlot={() => setSlot(null)}
      />
    </Box>
  );
}
