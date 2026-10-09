import { useQuery } from "@tanstack/react-query";
import { getBookingCalendar } from "@/modules/student/booking/api/booking.api";

export function useBookingSlots(tutorId: string, from: string, to: string) {
  return useQuery({
    queryKey: ["booking-calendar", tutorId, from, to],
    queryFn: async () => {
      const calendar = await getBookingCalendar(tutorId, from, to);
      return { slots: calendar.slots, minimumNoticeMinutes: calendar.minimumNoticeMinutes ?? 0 };
    },
    enabled: Boolean(tutorId),
  });
}