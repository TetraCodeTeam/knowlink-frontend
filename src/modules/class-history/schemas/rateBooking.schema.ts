import { z } from "zod";
import { MAX_RATING_COMMENT_LENGTH } from "@/modules/class-history/constants/classHistory.constants";

export const rateBookingSchema = z.object({
  score: z.number().min(1, "Seleccioná una calificación").max(5),
  comment: z
    .string()
    .trim()
    .max(MAX_RATING_COMMENT_LENGTH, `El comentario no puede superar los ${MAX_RATING_COMMENT_LENGTH} caracteres`)
    .optional(),
});

export type RateBookingFormValues = z.infer<typeof rateBookingSchema>;
