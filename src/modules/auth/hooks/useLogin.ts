import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ACCOUNT_DEACTIVATED_CODE,
  AUTH_LOGIN_KEY,
  REACTIVATE_ROUTE,
} from "@/modules/auth/constants";
import { loginUser } from "@/modules/auth/api/auth.api";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import { useReactivationStore } from "@/modules/auth/hooks/useReactivationStore";
import type { LoginFormValues } from "@/modules/auth/schemas/login.schema";
import type { ErrorResponse } from "@/shared/interfaces/error-response.interface";
import { getRoleDestination } from "@/modules/auth/utils/role-redirect";

export function useLogin() {
  const { login } = useAuthStore();
  const { setPendingCredentials } = useReactivationStore();
  const navigate = useNavigate();

  const { isPending, mutate } = useMutation({
    mutationKey: [AUTH_LOGIN_KEY],
    mutationFn: ({ email, password }: LoginFormValues) => loginUser({ email, password }),
    onSuccess: (authResponse) => {
      login(authResponse);
      navigate(getRoleDestination(authResponse.role), { replace: true });
    },
    onError: (error: unknown, variables: LoginFormValues) => {
      const response = (error as { response?: { status?: number; data?: ErrorResponse } } | null)
        ?.response;

      if (response?.status === 403 && response.data?.detail === ACCOUNT_DEACTIVATED_CODE) {
        setPendingCredentials(variables);
        navigate(REACTIVATE_ROUTE);
        return;
      }

      const errorMessage = response?.data?.message ?? "Credenciales incorrectas";
      toast.error(errorMessage);
    },
  });

  return { isPending, mutate };
}
