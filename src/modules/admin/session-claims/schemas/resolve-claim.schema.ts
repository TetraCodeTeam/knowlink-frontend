import { z } from "zod";
import { SESSION_CLAIM_JUSTIFICATION_MAX_LENGTH } from "@/modules/admin/session-claims/constants/session-claims.constants";

export const resolveClaimSchema = z.object({
  favoredParty: z.enum(["STUDENT", "TUTOR"], {
    error: "Elegí a favor de quién resolver",
  }),
  justification: z
    .string()
    .trim()
    .min(1, "La justificación es obligatoria")
    .max(
      SESSION_CLAIM_JUSTIFICATION_MAX_LENGTH,
      `La justificación no puede superar los ${SESSION_CLAIM_JUSTIFICATION_MAX_LENGTH} caracteres`
    ),
});

export type ResolveClaimFormValues = z.infer<typeof resolveClaimSchema>;
