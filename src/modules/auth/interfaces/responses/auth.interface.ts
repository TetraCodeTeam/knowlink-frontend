import type { AuthRole } from "@/shared/types/role.type";

export interface AuthResponse {
  userId: string;
  email: string;
  fullName: string | null;
  token: string;
  role: AuthRole;
}