import { z } from "zod";
import { MAX_CLAIM_COMMENT_LENGTH } from "@/modules/support/constants/support.constants";

export const claimCommentSchema = z.object({
  comment: z
    .string()
    .trim()
    .min(1, "Escribí un comentario")
    .max(
      MAX_CLAIM_COMMENT_LENGTH,
      `El comentario no puede superar los ${MAX_CLAIM_COMMENT_LENGTH} caracteres`
    ),
});

export type ClaimCommentFormValues = z.infer<typeof claimCommentSchema>;
