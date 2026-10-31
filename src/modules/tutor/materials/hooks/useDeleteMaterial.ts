import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteMaterial as deleteMaterialApi } from "@/modules/tutor/materials/api/materials.api";
import {
  DELETE_MATERIAL_MESSAGES,
  MATERIALS_QUERY_KEY,
} from "@/modules/tutor/materials/constants/materials.constants";
import { isTerminalDeleteError } from "@/modules/tutor/materials/utils/materials.utils";

export function useDeleteMaterial() {
  const queryClient = useQueryClient();

  const invalidateMaterials = () =>
    queryClient.invalidateQueries({ queryKey: [MATERIALS_QUERY_KEY] });

  const mutation = useMutation({
    mutationKey: ["deleteMaterial"],
    mutationFn: (materialId: string) => deleteMaterialApi(materialId),
    onSuccess: async () => {
      toast.success(DELETE_MATERIAL_MESSAGES.success);
      await invalidateMaterials();
    },
    onError: async (error) => {
      // The httpClient interceptor already shows the error message.
      // If the result will not change, refresh the real list.
      if (isTerminalDeleteError(error)) {
        await invalidateMaterials();
      }
    },
  });

  return {
    deleteMaterial: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
}
