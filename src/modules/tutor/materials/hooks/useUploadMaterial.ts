import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadMaterial as uploadMaterialApi } from "@/modules/tutor/materials/api/materials.api";
import type { CreateMaterialRequest } from "@/modules/tutor/materials/interfaces/material.interface";

export function useUploadMaterial() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["uploadMaterial"],
    mutationFn: (data: CreateMaterialRequest) => uploadMaterialApi(data),
    onSuccess: () => {
      // Invalidate all subject material queries so the list refreshes
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
  });

  return {
    uploadMaterial: mutation.mutateAsync, // mutateAsync to support async/await in components
    isPending: mutation.isPending,
  };
}
