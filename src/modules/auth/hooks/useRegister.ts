import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { registerUser } from "@/modules/auth/api/auth.api";
import { AUTH_REGISTER_KEY } from "@/modules/auth/constants";

import type { UserRegisterRequest } from "@/modules/auth/interfaces/requests/user-register.interface";

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: [AUTH_REGISTER_KEY],
    mutationFn: (data: UserRegisterRequest) => registerUser(data),
    onSuccess: (_, variables) => {
      navigate("/auth/check-email", { state: { email: variables.email } });
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string; detail?: string } } })?.response?.data
          ?.message ?? "No se pudo crear la cuenta. Intentá de nuevo.";
      toast.error(message);
    },
  });
}