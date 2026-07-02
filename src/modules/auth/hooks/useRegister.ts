import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { registerUser } from "../api/auth.api";
import { AUTH_REGISTER_KEY } from "../constants";

import type { UserRegisterRequest } from "../interfaces/requests/user-register.interface";

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: [AUTH_REGISTER_KEY],
    mutationFn: (data: UserRegisterRequest) => registerUser(data),
    onSuccess: (_, variables) => {
      navigate("/auth/check-email", { state: { email: variables.email } });
    },
    onError: () => {
      toast.error("Registration failed. Please try again.");
    },
  });
}
