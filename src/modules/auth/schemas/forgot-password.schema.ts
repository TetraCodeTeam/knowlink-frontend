import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "El email es obligatorio").email("El email no es válido"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
