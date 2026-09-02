import type { Role } from "@/shared/types/role.type";

export interface LoginRequest {
  email: string;
  password: string;
  targetRole?: Role;
}
