import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resolveSessionClaim } from "@/modules/admin/session-claims/api/admin-session-claims.api";
import { SESSION_CLAIM_MESSAGES } from "@/modules/admin/session-claims/constants/session-claims.constants";
import type { ResolveSessionClaimRequest } from "@/modules/admin/session-claims/interfaces/requests/resolve-session-claim.request";
import { invalidateSessionClaimQueries } from "@/modules/admin/session-claims/utils/invalidate-session-claim-queries";
import { getErrorMessage } from "@/shared/utils/errors";

export function useResolveSessionClaim(claimId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ResolveSessionClaimRequest) => resolveSessionClaim(claimId, payload),
    onSuccess: async () => {
      toast.success(SESSION_CLAIM_MESSAGES.resolveSuccess);
      await invalidateSessionClaimQueries(queryClient, claimId);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, SESSION_CLAIM_MESSAGES.resolveError));
    },
  });
}
