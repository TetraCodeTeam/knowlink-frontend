import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClaim, type CreateClaimRequest } from "@/modules/class-history/api/claims.api";

export function useCreateClaim(bookingId: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (request: CreateClaimRequest) => createClaim(bookingId, request),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["bookingHistory"] }),
        queryClient.invalidateQueries({ queryKey: ["claimEligibility", bookingId] }),
        queryClient.invalidateQueries({ queryKey: ["tutorSupport"] }),
      ]);
    },
  });

  return mutation;
}
