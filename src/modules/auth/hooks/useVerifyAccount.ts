import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { verifyAccount } from "../api/auth.api";

export function useVerifyAccount() {
  return useMutation({
    mutationFn: ({ userId, token }: { userId: string; token: string }) =>
      verifyAccount(userId, token),
    onError: () => {
      toast.error("The link is invalid or has expired. Please request a new one.");
    },
  });
}