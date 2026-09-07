import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTutorSubject } from "@/modules/tutor/api/tutorSubject.api";
import { toast } from "sonner";
import type { TutorSubjectRequest } from "@/modules/tutor/interfaces/TutorSubjectRequest";

export function useCreateTutorSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: TutorSubjectRequest) => createTutorSubject(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myTutorProfile"] });
      toast.success("Materia agregada correctamente");
    },
    onError: () => {
      toast.error("No se pudo agregar la materia. Intentá de nuevo.");
    },
  });
}
