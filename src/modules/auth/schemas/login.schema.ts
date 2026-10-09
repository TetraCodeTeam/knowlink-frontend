import { z } from "zod";
import { ROLE_VALUES } from "@/shared/types/role.type";

export const loginSchema = z.object({
  email: z.string().min(1, "El email es obligatorio").email("El email no es válido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
  role: z.enum(ROLE_VALUES).optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
