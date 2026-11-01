import { z } from "zod";

// Mismas reglas que el registro (user-register.schema.ts): mínimo 8, mayúscula, minúscula
// y un carácter especial. No importar desde ese archivo: lo modifica US-42.
export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])/,
        "Usá mayúsculas, minúsculas y un carácter especial"
      ),
    confirmNewPassword: z.string().min(1, "Debés confirmar la contraseña"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmNewPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
