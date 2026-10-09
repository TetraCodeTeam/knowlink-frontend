import { z } from "zod";
import { BOOKING_MODALITY_OPTIONS } from "@/modules/student/booking/constants/modality.constants";

export const bookingSchema = z.object({
  bookingSlotId: z.string().min(1, "Seleccioná un horario"),
  tutorSubjectId: z.string().min(1, "Seleccioná una materia"),
  topic: z.string().trim().min(1, "Ingresá el tema a tratar"),
  modality: z.enum(BOOKING_MODALITY_OPTIONS, {
    error: "Seleccioná una modalidad",
  }),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;

export const DEFAULT_BOOKING_FORM_VALUES: BookingFormValues = {
  bookingSlotId: "",
  tutorSubjectId: "",
  topic: "",
  modality: "VIRTUAL",
};
