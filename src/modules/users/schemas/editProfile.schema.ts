import { z } from "zod";

export function createEditProfileSchema(requiresAddress: boolean) {
  return z
    .object({
      firstName: z
        .string()
        .trim()
        .min(1, "El nombre es obligatorio")
        .max(100, "El nombre no puede superar los 100 caracteres"),
      lastName: z
        .string()
        .trim()
        .min(1, "El apellido es obligatorio")
        .max(100, "El apellido no puede superar los 100 caracteres"),
      dni: z
        .string()
        .trim()
        .min(1, "El DNI es obligatorio")
        .regex(/^\d{7,8}$/, "El DNI debe tener 7 u 8 dígitos"),
      phoneNumber: z
        .string()
        .trim()
        .min(1, "El teléfono es obligatorio")
        .max(30, "El teléfono no puede superar los 30 caracteres"),
      career: z.string().min(1, "La carrera es obligatoria"),
      institutionalId: z
        .string()
        .trim()
        .max(50, "El legajo no puede superar los 50 caracteres")
        .optional(),
      biography: z.string().max(300, "La biografía no puede superar los 300 caracteres").optional(),
      address: z.string().max(255, "La dirección no puede superar los 255 caracteres").optional(),
    })
    .refine((data) => !requiresAddress || (data.address ?? "").trim().length > 0, {
      message: "La dirección es obligatoria para clases presenciales",
      path: ["address"],
    });
}

export type EditProfileFormValues = z.infer<ReturnType<typeof createEditProfileSchema>>;
