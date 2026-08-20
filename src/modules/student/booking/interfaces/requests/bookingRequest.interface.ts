import type { BookingFormValues } from "@/modules/student/booking/schemas/booking.schema";

export interface BookingRequest extends BookingFormValues {
  tutorId: string;
  start: string;
  end: string;
}
