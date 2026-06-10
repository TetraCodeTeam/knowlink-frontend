import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AUTH_LOGIN_KEY } from "@/modules/auth/constants";
import { loginUser } from "@/modules/auth/api/auth.api";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";

export function useLogin() {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const { isPending, mutate } = useMutation({
    mutationKey: [AUTH_LOGIN_KEY],
    mutationFn: loginUser,
    onSuccess: (authResponse) => {
      login(authResponse);
      navigate("/");
    },
  });

  return { isPending, mutate };
}
