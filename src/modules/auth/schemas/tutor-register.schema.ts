import { z } from "zod";

export const step1Schema = z.object({
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

export type Step1Data = z.infer<typeof step1Schema>;

export const subjectSchema = z
  .object({
    subjectName: z.string().min(1, "La materia es obligatoria"),
    modality: z.enum(["VIRTUAL", "IN_PERSON"]),
    compensationType: z.enum(["FREE", "PAID"]),
    pricePerHour: z.number().positive("El precio debe ser mayor a cero").nullish(),
    isBasic: z.boolean(),
  })
  .refine((s) => s.compensationType === "FREE" || (s.pricePerHour != null && s.pricePerHour > 0), {
    message: "El precio debe ser mayor a cero",
    path: ["pricePerHour"],
  });

export type SubjectData = z.infer<typeof subjectSchema>;

export const step2Schema = z
  .object({
    biography: z.string().max(300, "La biografía no puede superar los 300 caracteres").optional(),
    subjects: z.array(subjectSchema).min(1, "Debés agregar al menos una materia"),
    address: z.string().optional(),
  })
  .refine(
    (data) => {
      const needsAddress = data.subjects.some((s) => s.modality === "IN_PERSON");
      return !needsAddress || (data.address != null && data.address.trim().length > 0);
    },
    {
      message: "La dirección es obligatoria para clases presenciales",
      path: ["address"],
    }
  );

export type Step2Data = z.infer<typeof step2Schema>;
