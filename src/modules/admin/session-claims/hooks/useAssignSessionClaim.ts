import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { assignSessionClaim } from "@/modules/admin/session-claims/api/admin-session-claims.api";
import { SESSION_CLAIM_MESSAGES } from "@/modules/admin/session-claims/constants/session-claims.constants";
import { invalidateSessionClaimQueries } from "@/modules/admin/session-claims/utils/invalidate-session-claim-queries";
import { getErrorMessage } from "@/shared/utils/errors";

export function useAssignSessionClaim(claimId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => assignSessionClaim(claimId),
    onSuccess: async () => {
      toast.success(SESSION_CLAIM_MESSAGES.assignSuccess);
      await invalidateSessionClaimQueries(queryClient, claimId);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, SESSION_CLAIM_MESSAGES.assignError));
      // Otro admin pudo tomarlo antes: refrescamos el estado real del reclamo.
      void invalidateSessionClaimQueries(queryClient, claimId);
    },
  });
}
