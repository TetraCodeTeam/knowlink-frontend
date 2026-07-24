import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TutorSubjectRequest } from "../interfaces/TutorSubjectRequest";
import { createTutorSubject } from "../api/Tutorsubject.api";

export function useCreateTutorSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-tutor-subject"],
    mutationFn: (request: TutorSubjectRequest) => createTutorSubject(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutorProfile", "me"] });
      toast.success("Materia agregada correctamente.");
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "No se pudo agregar la materia. Intentá de nuevo.";
      toast.error(message);
    },
  });
}