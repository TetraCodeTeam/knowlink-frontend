import { z } from "zod";

export const CLAIM_COMMENT_MAX_LENGTH = 400;

export const startClaimSchema = z.object({
  reason: z.enum(
    ["STUDENT_COULD_NOT_ATTEND", "TUTOR_COULD_NOT_ATTEND", "I_COULD_NOT_ATTEND"],
    { error: "Seleccioná qué sucedió en la clase" }
  ),
  comment: z
    .string()
    .max(CLAIM_COMMENT_MAX_LENGTH, `Máximo ${CLAIM_COMMENT_MAX_LENGTH} caracteres`)
    .optional(),
  attachment: z.instanceof(File).optional(),
});

export type StartClaimFormData = z.infer<typeof startClaimSchema>;