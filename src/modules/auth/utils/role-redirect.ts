import type { AuthRole } from "@/shared/types/role.type";

const ROLE_REDIRECT: Partial<Record<AuthRole, string>> = {
  STUDENT: "/student/home",
  TUTOR: "/tutor/home",
  ADMIN: "/admin/home",
};

export function getRoleDestination(role: AuthRole): string {
  return ROLE_REDIRECT[role] ?? "/student/home";
}
