import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { registerTutor } from "@/modules/auth/api/auth.api";
import { AUTH_TUTOR_REGISTER_KEY } from "@/modules/auth/constants";
import type { TutorRegisterRequest } from "@/modules/auth/interfaces/requests/tutor-register.interface";
import { useRegistrationStore } from "@/modules/auth/hooks/useRegistrationStore";

export function useTutorRegister() {
  const navigate = useNavigate();
  const clearCredentials = useRegistrationStore((s) => s.clearCredentials);

  return useMutation({
    mutationKey: [AUTH_TUTOR_REGISTER_KEY],
    mutationFn: (data: TutorRegisterRequest) => registerTutor(data),
    onSuccess: (_, variables) => {
      clearCredentials();
      navigate("/auth/check-email", { state: { email: variables.email } });
    },
    onError: () => {
      clearCredentials();
    },
  });
}
