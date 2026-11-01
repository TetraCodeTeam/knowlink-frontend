import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { resetPassword } from "@/modules/auth/api/auth.api";
import { AUTH_RESET_PASSWORD_KEY } from "@/modules/auth/constants";
import type { ResetPasswordRequest } from "@/modules/auth/interfaces/requests/reset-password-request.interface";
import { isInvalidResetLinkError } from "@/modules/auth/utils/resetLink.utils";

export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: [AUTH_RESET_PASSWORD_KEY],
    mutationFn: (data: ResetPasswordRequest) => resetPassword(data),
    onSuccess: () => {
      toast.success("Contraseña actualizada. Iniciá sesión con tu nueva contraseña.");
      navigate("/auth/login", { replace: true });
    },
    onError: (error: unknown) => {
      // Enlace usado/vencido: la página muestra el panel "Este enlace ya no es válido".
      if (isInvalidResetLinkError(error)) return;

      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "No pudimos restablecer tu contraseña. Intentá de nuevo.";
      toast.error(message);
    },
  });
}
