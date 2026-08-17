import { useState } from "react";
import { Box } from "@mui/material";
import BookingCard from "@/modules/student/booking/components/BookingCard";
import BookingCalendar from "@/modules/student/booking/components/BookingCalendar";
import type { BookingSlot } from "@/modules/student/booking/interfaces/bookingSlotType";


export default function BookingClassPage() {
  const [slot, setSlot] = useState<BookingSlot | null>(null);

  return (
    <Box sx={{ display: "flex", gap: 4, p: 4, alignItems: "flex-start" }}>
      <Box sx={{ flex: 1 }}>
        <BookingCalendar selectedSlot={slot} onSelectSlot={setSlot} />
      </Box>

      <BookingCard selectedSlot={slot} />
    </Box>
  );
}
