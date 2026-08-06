import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { registerStudent } from "@/modules/auth/api/auth.api";
import { AUTH_REGISTER_KEY } from "@/modules/auth/constants";
import { useRegistrationStore } from "@/modules/auth/hooks/use-registration-store";
import type { StudentRegisterRequest } from "@/modules/auth/interfaces/requests/student-register.interface";

export function useStudentRegister() {
  const navigate = useNavigate();
  const clearCredentials = useRegistrationStore((s) => s.clearCredentials);

  return useMutation({
    mutationKey: [AUTH_REGISTER_KEY],
    mutationFn: (data: StudentRegisterRequest) => registerStudent(data),
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