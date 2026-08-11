import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { removeWeekCustomization } from "@/modules/tutor/availability/api/availability-blocks.api";

export function useRemoveWeekCustomization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["remove-week-customization"],
    mutationFn: (weekStart: string) => removeWeekCustomization(weekStart),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["week-customization"] });
      toast.success(
        "Listo. La próxima vez que actualices tu horario habitual, esta semana también se va a actualizar."
      );
    },
    onError: () => {
      toast.error("No se pudo quitar la personalización de esta semana. Intentá de nuevo.");
    },
  });
}
