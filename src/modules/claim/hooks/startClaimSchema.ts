import { z } from "zod";

export const CLAIM_COMMENT_MAX_LENGTH = 500;
export const CLAIM_MAX_ATTACHMENTS = 3;
export const CLAIM_MAX_ATTACHMENT_SIZE_BYTES = 5 * 1024 * 1024;
export const CLAIM_ALLOWED_ATTACHMENT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
] as const;

export const startClaimSchema = z.object({
  reason: z.enum(["STUDENT_COULD_NOT_ATTEND", "TUTOR_COULD_NOT_ATTEND", "I_COULD_NOT_ATTEND"], {
    error: "Seleccioná qué sucedió en la clase",
  }),
  comment: z
    .string()
    .max(CLAIM_COMMENT_MAX_LENGTH, `Máximo ${CLAIM_COMMENT_MAX_LENGTH} caracteres`)
    .optional(),
  attachments: z
    .array(z.instanceof(File))
    .max(CLAIM_MAX_ATTACHMENTS, `Podés adjuntar hasta ${CLAIM_MAX_ATTACHMENTS} archivos.`)
    .refine(
      (files) => files.every((file) => file.size <= CLAIM_MAX_ATTACHMENT_SIZE_BYTES),
      "Cada archivo adjunto no puede superar los 5 MB."
    )
    .refine(
      (files) =>
        files.every((file) =>
          CLAIM_ALLOWED_ATTACHMENT_TYPES.some((contentType) => contentType === file.type)
        ),
      "Solo se permiten archivos PDF, JPG o PNG."
    ),
});

export type StartClaimFormData = z.infer<typeof startClaimSchema>;
