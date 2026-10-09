import { useMutation } from "@tanstack/react-query";
import { switchToTutorRole } from "@/modules/student/dual-role/api/studentDualRole.api";

export function useSwitchToTutorRole() {
  const mutation = useMutation({ mutationFn: switchToTutorRole });
  return { mutateAsync: mutation.mutateAsync, isPending: mutation.isPending };
}
