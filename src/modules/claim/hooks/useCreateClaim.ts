import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { createClaim } from "@/modules/claim/api/claim.api";
import type { StartClaimFormData } from "@/modules/claim/hooks/startClaimSchema";

export function useCreateClaim(bookingId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["createClaim", bookingId],
    mutationFn: (data: StartClaimFormData) =>
      createClaim(
        bookingId,
        { reason: data.reason, comment: data.comment?.trim() || undefined },
        data.attachments
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["claimEligibility", bookingId] });
      queryClient.invalidateQueries({ queryKey: ["bookingDetail", bookingId] });
      queryClient.invalidateQueries({ queryKey: ["bookingHistory"] });
    },
    onError: (error) => {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      if (status === 409 || status === 422) {
        void queryClient.invalidateQueries({ queryKey: ["claimEligibility", bookingId] });
        void queryClient.invalidateQueries({ queryKey: ["bookingDetail", bookingId] });
        void queryClient.invalidateQueries({ queryKey: ["bookingHistory"] });
      }
    },
  });

  return { submitClaim: mutation.mutateAsync, isPending: mutation.isPending };
}
