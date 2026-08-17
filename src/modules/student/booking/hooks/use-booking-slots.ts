import { useMemo } from "react";
import { MOCK_BOOKING_SLOTS } from "@/modules/student/booking/mockBookingSlots";

export function useBookingSlots() {
  return useMemo(() => MOCK_BOOKING_SLOTS, []);
}
