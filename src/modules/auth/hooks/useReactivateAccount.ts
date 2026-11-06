import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "@/shared/lib/toast";
import { reactivateAccount } from "@/modules/auth/api/auth.api";
import { ACCOUNT_REACTIVATED_MESSAGE, AUTH_REACTIVATE_KEY } from "@/modules/auth/constants";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import { useReactivationStore } from "@/modules/auth/hooks/useReactivationStore";
import { getRoleDestination } from "@/modules/auth/utils/role-redirect";
import type { ReactivateRequest } from "@/modules/auth/interfaces/requests/reactivate-request.interface";
import type { ErrorResponse } from "@/shared/interfaces/error-response.interface";

export function useReactivateAccount() {
  const { login } = useAuthStore();
  const { clear } = useReactivationStore();
  const navigate = useNavigate();

  const { isPending, mutate } = useMutation({
    mutationKey: [AUTH_REACTIVATE_KEY],
    mutationFn: (data: ReactivateRequest) => reactivateAccount(data),
    onSuccess: (authResponse) => {
      login(authResponse);
      clear();
      navigate(getRoleDestination(authResponse.role), { replace: true });
      toast.success(ACCOUNT_REACTIVATED_MESSAGE);
    },
    onError: (error: unknown) => {
      const response = (error as { response?: { status?: number; data?: ErrorResponse } } | null)
        ?.response;
      const message =
        response?.data?.message ?? "No pudimos reactivar tu cuenta. Intentá nuevamente";

      toast.error(message);

      if (response?.status === 401) {
        clear();
        navigate("/auth/login", { replace: true });
      }
    },
  });

  return { isPending, mutate };
}
