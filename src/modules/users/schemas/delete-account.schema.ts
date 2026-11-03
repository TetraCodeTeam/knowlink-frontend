import { z } from "zod";

export const deleteAccountSchema = z.object({
  password: z.string().min(1, "La contraseña es requerida"),
});

export type DeleteAccountFormValues = z.infer<typeof deleteAccountSchema>;
