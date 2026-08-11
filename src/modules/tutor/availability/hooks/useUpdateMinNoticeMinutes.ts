import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateMinNoticeMinutes } from "@/modules/tutor/availability/api/tutor-notice.api";

export function useUpdateMinNoticeMinutes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-min-notice-minutes"],
    mutationFn: (minutes: number | null) => updateMinNoticeMinutes(minutes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["min-notice-minutes"] });
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "No se pudo actualizar la antelación mínima.";
      toast.error(message);
    },
  });
}