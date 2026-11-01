import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addStudentClaimComment } from "@/modules/student/support/api/studentClaims.api";

export function useAddStudentClaimComment(claimId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (comment: string) => addStudentClaimComment(claimId, comment),
    onSuccess: async () => {
      toast.success("Comentario agregado al reclamo.");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["studentSupport"] }),
        queryClient.invalidateQueries({ queryKey: ["studentSupport", "claimDetail", claimId] }),
      ]);
    },
  });
}
