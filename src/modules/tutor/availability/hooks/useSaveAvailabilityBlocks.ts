import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { saveWeekAvailabilityBlocks } from "@/modules/tutor/availability/api/availability.api";
import type { AvailabilityBlockRequest } from "@/modules/tutor/availability/interfaces/requests/availability-block.interface";

export function useSaveAvailabilityBlocks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["save-availability-blocks"],
    mutationFn: ({ weekStart, weekEnd, blocks }: { weekStart: string; weekEnd: string; blocks: AvailabilityBlockRequest[] }) =>
      saveWeekAvailabilityBlocks(weekStart, weekEnd, blocks),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability-blocks"] });
      toast.success("Disponibilidad guardada correctamente.");
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "No se pudo guardar la disponibilidad. Intentá de nuevo.";
      toast.error(message);
    },
  });
}