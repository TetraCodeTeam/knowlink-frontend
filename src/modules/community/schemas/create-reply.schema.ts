import { z } from "zod";
import {
  BOOKING_QUESTION_MAX_LENGTH,
  REPLY_MAX_LENGTH,
} from "@/modules/community/constants/community.constants";

export const createReplySchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Escribí tu respuesta")
    .max(REPLY_MAX_LENGTH, `La respuesta no puede superar los ${REPLY_MAX_LENGTH} caracteres`),
  file: z.instanceof(File).nullable(),
  includeBookingCard: z.boolean(),
  bookingCardQuestion: z
    .string()
    .trim()
    .max(
      BOOKING_QUESTION_MAX_LENGTH,
      `La pregunta no puede superar los ${BOOKING_QUESTION_MAX_LENGTH} caracteres`
    ),
});

export type CreateReplyFormData = z.infer<typeof createReplySchema>;

export const editReplySchema = createReplySchema.pick({ content: true });

export type EditReplyFormData = z.infer<typeof editReplySchema>;
