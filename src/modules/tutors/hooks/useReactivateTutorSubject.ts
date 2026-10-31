import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { reactivateTutorSubject } from "@/modules/tutors/api/tutor-subjects.api";
import { TUTOR_SELF_PROFILE_KEY, TUTOR_SUBJECT_REACTIVATE_KEY } from "@/modules/tutors/constants";
import type { ErrorResponse } from "@/shared/interfaces/error-response.interface";
import { useSnackbarStore } from "@/shared/hooks/useSnackbarStore";

export function useReactivateTutorSubject() {
  const queryClient = useQueryClient();
  const showMessage = useSnackbarStore((s) => s.showMessage);

  const { isPending, mutate } = useMutation({
    mutationKey: [TUTOR_SUBJECT_REACTIVATE_KEY],
    mutationFn: reactivateTutorSubject,
    onSuccess: () => {
      showMessage("La materia fue reactivada.", "success");
      void queryClient.invalidateQueries({ queryKey: [TUTOR_SELF_PROFILE_KEY] });
    },
    onError: (error) => {
      const message = axios.isAxiosError<ErrorResponse>(error)
        ? error.response?.data?.message
        : undefined;
      showMessage(message ?? "Ocurrió un error inesperado.", "error");
    },
  });

  return { isPending, mutate };
}
