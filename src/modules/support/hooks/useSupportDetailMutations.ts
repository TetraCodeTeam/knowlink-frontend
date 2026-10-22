import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTutorClaimComment } from "@/modules/support/api/supportClaims.api";
import { submitMaterialDefense } from "@/modules/support/api/supportMaterials.api";
import { useSnackbarStore } from "@/shared/hooks/useSnackbarStore";

export function useAddTutorClaimComment(claimId: string) {
  const queryClient = useQueryClient();
  const showMessage = useSnackbarStore((store) => store.showMessage);

  return useMutation({
    mutationFn: (comment: string) => addTutorClaimComment(claimId, comment),
    onSuccess: async () => {
      showMessage("Comentario agregado al reclamo.", "success");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["tutorSupport"] }),
        queryClient.invalidateQueries({ queryKey: ["tutorSupport", "claimDetail", claimId] }),
      ]);
    },
  });
}

export function useSubmitMaterialDefense(materialId: string) {
  const queryClient = useQueryClient();
  const showMessage = useSnackbarStore((store) => store.showMessage);

  return useMutation({
    mutationFn: ({ description, files }: { description: string; files: File[] }) =>
      submitMaterialDefense(materialId, description, files),
    onSuccess: async () => {
      showMessage("Descargo presentado correctamente.", "success");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["tutorSupport"] }),
        queryClient.invalidateQueries({
          queryKey: ["tutorSupport", "materialDetail", materialId],
        }),
      ]);
    },
  });
}
