import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { deactivateTutorSubject } from "@/modules/tutors/api/tutor-subjects.api";
import {
  SUBJECT_HAS_ACTIVE_BOOKINGS,
  TUTOR_SELF_PROFILE_KEY,
  TUTOR_SUBJECT_DEACTIVATE_KEY,
} from "@/modules/tutors/constants";
import type { ErrorResponse } from "@/shared/interfaces/error-response.interface";
import { useSnackbarStore } from "@/shared/hooks/useSnackbarStore";

interface Options {
  onBlockedByBookings: () => void;
}

export function useDeactivateTutorSubject({ onBlockedByBookings }: Options) {
  const queryClient = useQueryClient();
  const showMessage = useSnackbarStore((s) => s.showMessage);

  const { isPending, mutate } = useMutation({
    mutationKey: [TUTOR_SUBJECT_DEACTIVATE_KEY],
    mutationFn: deactivateTutorSubject,
    onSuccess: () => {
      showMessage("La materia fue desactivada.", "success");
      void queryClient.invalidateQueries({ queryKey: [TUTOR_SELF_PROFILE_KEY] });
    },
    onError: (error) => {
      if (
        axios.isAxiosError<ErrorResponse>(error) &&
        error.response?.data?.detail === SUBJECT_HAS_ACTIVE_BOOKINGS
      ) {
        onBlockedByBookings();
        return;
      }
      const message = axios.isAxiosError<ErrorResponse>(error)
        ? error.response?.data?.message
        : undefined;
      showMessage(message ?? "Ocurrió un error inesperado.", "error");
    },
  });

  return { isPending, mutate };
}
