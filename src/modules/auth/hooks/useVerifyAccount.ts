import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { verifyAccount } from "../api/auth.api";

export function useVerifyAccount() {
  return useMutation({
    mutationFn: ({ userId, token }: { userId: string; token: string }) =>
      verifyAccount(userId, token),
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string; detail?: string } } })?.response?.data
          ?.message ??
        "El enlace es inválido o expiró. Solicitá uno nuevo desde la pantalla de registro.";
      toast.error(message);
    },
  });
}
