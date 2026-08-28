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

const ROLE_LABEL: Record<string, string> = {
  STUDENT: "Alumno",
  TUTOR: "Tutor",
};

export function useLogin() {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const { isPending, mutate } = useMutation({
    mutationKey: [AUTH_LOGIN_KEY],
    mutationFn: ({ email, password }: LoginFormValues) => loginUser({ email, password }),
    onSuccess: (authResponse, variables) => {
      if (authResponse.role !== variables.role) {
        toast.error(
          `Esta cuenta está registrada como ${ROLE_LABEL[authResponse.role] ?? authResponse.role}. Selecciona ese rol para continuar.`,
        );
        return;
      }
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
