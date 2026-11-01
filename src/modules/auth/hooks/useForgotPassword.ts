import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { requestPasswordReset } from "@/modules/auth/api/auth.api";
import { AUTH_FORGOT_PASSWORD_KEY } from "@/modules/auth/constants";

export function useForgotPassword() {
  return useMutation({
    mutationKey: [AUTH_FORGOT_PASSWORD_KEY],
    mutationFn: (email: string) => requestPasswordReset(email),
    // El éxito (204) NO distingue si el correo existe: la página muestra siempre el mismo mensaje.
    onError: () => {
      toast.error("No pudimos procesar la solicitud. Intentá de nuevo en unos minutos.");
    },
  });
}
