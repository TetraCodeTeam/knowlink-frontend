import { useMutation } from "@tanstack/react-query";
import { activateTutorRole } from "@/modules/student/dual-role/api/studentDualRole.api";
import type { ActivateTutorRoleRequest } from "@/modules/student/dual-role/interfaces/studentDualRole.interface";

export function useActivateTutorRole() {
  const mutation = useMutation({
    mutationFn: (data: ActivateTutorRoleRequest) => activateTutorRole(data),
  });
  return { mutateAsync: mutation.mutateAsync, isPending: mutation.isPending };
}
