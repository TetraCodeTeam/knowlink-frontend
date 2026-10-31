import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateTutorSubject } from "@/modules/tutor/api/Tutorsubject.api";
import type { UpdateTutorSubjectRequest } from "@/modules/tutor/interfaces/UpdateTutorSubjectRequest";

interface UpdateTutorSubjectVariables {
  tutorSubjectId: string;
  request: UpdateTutorSubjectRequest;
}

export function useUpdateTutorSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-tutor-subject"],
    mutationFn: ({ tutorSubjectId, request }: UpdateTutorSubjectVariables) =>
      updateTutorSubject(tutorSubjectId, request),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["myTutorProfile"] });
      toast.success("Materia actualizada correctamente.");
    },
    // Sin onError: el interceptor de httpClient ya muestra el mensaje del backend.
  });
}
