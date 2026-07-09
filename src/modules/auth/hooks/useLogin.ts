import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AUTH_LOGIN_KEY } from "@/modules/auth/constants";
import { loginUser } from "@/modules/auth/api/auth.api";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";

const ROLE_REDIRECT: Record<string, string> = {
  STUDENT: "/student/home",
  TUTOR: "/tutor/home",
};

export function useLogin() {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const { isPending, mutate } = useMutation({
    mutationKey: [AUTH_LOGIN_KEY],
    mutationFn: loginUser,
    onSuccess: (authResponse) => {
      login(authResponse);
      const destination = ROLE_REDIRECT[authResponse.role] ?? "/student/home";
      navigate(destination, { replace: true });
    },
    onError: () => {
      toast.error("Credenciales incorrectas");
    },
  });

  return { isPending, mutate };
}
