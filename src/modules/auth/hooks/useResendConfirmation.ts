import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { resendConfirmationEmail } from "@/modules/auth/api/auth.api";

export function useResendConfirmation() {
  return useMutation({
    mutationFn: (email: string) => resendConfirmationEmail(email),
    onSuccess: () => {
      toast.success("Correo de verificación reenviado. Revisá tu bandeja de entrada.");
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string; detail?: string } } })?.response?.data
          ?.message ?? "Error al reenviar el correo. Intentá de nuevo.";
      toast.error(message);
    },
  });
}
