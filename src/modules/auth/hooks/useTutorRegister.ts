import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
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
      navigate("/auth/check-email", { state: { email: variables.email } });
      clearCredentials();
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string; detail?: string } } })?.response?.data
          ?.message ?? "No se pudo crear la cuenta. Intentá de nuevo.";
      toast.error(message);
    },
  });
}