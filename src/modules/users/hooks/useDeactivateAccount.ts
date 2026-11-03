import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { deactivateMyAccount } from "@/modules/users/api/users.api";
import {
  ACCOUNT_HAS_ACTIVE_BOOKINGS,
  ACCOUNT_NOT_ACTIVE,
  ACTIVE_BOOKINGS_BLOCK_MESSAGE,
  DEACTIVATE_ACCOUNT_KEY,
} from "@/modules/users/constants";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import type { ErrorResponse } from "@/shared/interfaces/error-response.interface";

interface Options {
  onBlockedByBookings: (message: string) => void;
}

export function useDeactivateAccount({ onBlockedByBookings }: Options) {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const { isPending, mutate } = useMutation({
    mutationKey: [DEACTIVATE_ACCOUNT_KEY],
    mutationFn: deactivateMyAccount,
    onSuccess: () => {
      // Non-ACTIVE accounts are rejected by JwtAuthenticationFilter (US-24 Paso 7), so the JWT is
      // already invalid after deactivation: do NOT call POST /auth/logout.
      logout();
      navigate("/auth/login", { replace: true });
      toast.success("Tu cuenta fue desactivada. Podés volver cuando quieras.");
    },
    onError: (error) => {
      if (!axios.isAxiosError<ErrorResponse>(error)) {
        toast.error("Ocurrió un error inesperado.");
        return;
      }
      const { detail, message } = error.response?.data ?? {};
      if (detail === ACCOUNT_HAS_ACTIVE_BOOKINGS) {
        onBlockedByBookings(message ?? ACTIVE_BOOKINGS_BLOCK_MESSAGE);
        return;
      }
      if (error.response?.status === 401 || detail === ACCOUNT_NOT_ACTIVE) {
        logout();
        navigate("/auth/login", { replace: true });
        return;
      }
      toast.error(message ?? "Ocurrió un error inesperado.");
    },
  });

  return { isPending, mutate };
}
