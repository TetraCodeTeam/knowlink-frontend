import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addTutorClaimComment } from "@/modules/support/api/supportClaims.api";
import { submitMaterialDefense } from "@/modules/support/api/supportMaterials.api";

export function useAddTutorClaimComment(claimId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (comment: string) => addTutorClaimComment(claimId, comment),
    onSuccess: async () => {
      toast.success("Comentario agregado al reclamo.");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["tutorSupport"] }),
        queryClient.invalidateQueries({ queryKey: ["tutorSupport", "claimDetail", claimId] }),
      ]);
    },
  });
}

export function useSubmitMaterialDefense(materialId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ description, files }: { description: string; files: File[] }) =>
      submitMaterialDefense(materialId, description, files),
    onSuccess: async () => {
      toast.success("Descargo presentado correctamente.");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["tutorSupport"] }),
        queryClient.invalidateQueries({
          queryKey: ["tutorSupport", "materialDetail", materialId],
        }),
      ]);
    },
  });
}
