import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.string().min(1, "El email es obligatorio").email("El email debe ser válido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])/,
        "Usá mayúsculas, minúsculas y un carácter especial"
      ),
    confirmPassword: z.string().min(1, "Debés confirmar la contraseña"),
    role: z.enum(["STUDENT", "TUTOR"], { error: "El rol es obligatorio" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;