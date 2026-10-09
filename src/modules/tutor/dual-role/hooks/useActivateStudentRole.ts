import { useMutation } from "@tanstack/react-query";
import { activateStudentRole } from "@/modules/tutor/dual-role/api/tutorDualRole.api";

export function useActivateStudentRole() {
  const mutation = useMutation({ mutationFn: activateStudentRole });
  return { mutateAsync: mutation.mutateAsync, isPending: mutation.isPending };
}
