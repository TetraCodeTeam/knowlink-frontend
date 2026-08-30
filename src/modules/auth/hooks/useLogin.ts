import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AUTH_LOGIN_KEY } from "@/modules/auth/constants";
import { loginUser } from "@/modules/auth/api/auth.api";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import type { LoginFormValues } from "@/modules/auth/schemas/login.schema";

const ROLE_REDIRECT: Record<string, string> = {
  STUDENT: "/student/home",
  TUTOR: "/tutor/home",
};

export function useLogin() {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const { isPending, mutate } = useMutation({
    mutationKey: [AUTH_LOGIN_KEY],
    mutationFn: ({ email, password, role }: LoginFormValues) =>
      loginUser({ email, password, ...(role ? { targetRole: role } : {}) }),
    onSuccess: (authResponse) => {
      login(authResponse);
      const destination = ROLE_REDIRECT[authResponse.role] ?? "/student/home";
      navigate(destination, { replace: true });
    },
    onError: (error) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Credenciales incorrectas";
      toast.error(errorMessage);
    },
  });

  return { isPending, mutate };
}
