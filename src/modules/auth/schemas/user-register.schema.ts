import { z } from "zod";
import { ROLE_VALUES } from "@/shared/types/role.type";

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
    role: z.enum(ROLE_VALUES, { error: "El rol es obligatorio" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const studentAccountSchema = z.object({
  firstName: z.string().min(1, "El nombre es obligatorio"),
  lastName: z.string().min(1, "El apellido es obligatorio"),
  career: z.string().min(1, "La carrera es obligatoria"),
  phoneNumber: z.string().min(1, "El teléfono es obligatorio"),
  dni: z
    .string()
    .min(1, "El DNI es obligatorio")
    .regex(/^\d{7,8}$/, "El DNI debe tener 7 u 8 dígitos"),
  institutionalId: z.string().optional(),
  profilePictureUrl: z.string().optional(),
});

export type StudentAccountData = z.infer<typeof studentAccountSchema>;