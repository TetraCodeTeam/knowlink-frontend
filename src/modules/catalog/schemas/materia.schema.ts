import { z } from "zod";

export const materiaSchema = z.object({
  name: z.string().min(1, "El nombre de la materia es obligatorio"),
  careerIds: z.array(z.string()).min(1, "Seleccioná al menos una carrera"),
});

export type MateriaFormData = z.infer<typeof materiaSchema>;

export const asociacionesSchema = z.object({
  careerIds: z
    .array(z.string())
    .min(1, "Una materia debe quedar asociada al menos a una carrera"),
});

export type AsociacionesFormData = z.infer<typeof asociacionesSchema>;