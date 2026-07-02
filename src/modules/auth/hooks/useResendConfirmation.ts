import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { resendConfirmationEmail } from "@/modules/auth/api/auth.api";

export function useResendConfirmation() {
  return useMutation({
    mutationFn: (email: string) => resendConfirmationEmail(email),
    onSuccess: () => {
      toast.success("Correo de verificación reenviado. Revisá tu bandeja de entrada.");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ?? "Error al reenviar el correo. Intentá de nuevo.";
      toast.error(message);
    },
  });
}