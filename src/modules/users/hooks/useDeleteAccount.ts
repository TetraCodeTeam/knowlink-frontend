import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { deleteMyAccount } from "@/modules/users/api/users.api";
import {
  ACCOUNT_DELETED_MESSAGE,
  ACCOUNT_HAS_ACTIVE_BOOKINGS,
  ACCOUNT_HAS_PENDING_OBLIGATIONS,
  ACTIVE_BOOKINGS_BLOCK_MESSAGE,
  USERS_DELETE_ACCOUNT_KEY,
} from "@/modules/users/constants";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import { NOTIFICATION_QUERY_KEYS } from "@/modules/notifications/constants/notification-query-keys";
import type { ErrorResponse } from "@/shared/interfaces/error-response.interface";

const GENERIC_ERROR_MESSAGE = "No pudimos eliminar tu cuenta. Intentá nuevamente";
const WRONG_PASSWORD_MESSAGE = "La contraseña es incorrecta";
const NOT_ALLOWED_MESSAGE = "Esta cuenta no puede eliminarse desde acá.";

export function useDeleteAccount() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationKey: [USERS_DELETE_ACCOUNT_KEY],
    mutationFn: deleteMyAccount,
    onSuccess: () => {
      // The JWT is already invalid after deletion: do NOT call POST /auth/logout.
      logout();
      queryClient.removeQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all });
      navigate("/auth/login", { replace: true });
      toast.success(ACCOUNT_DELETED_MESSAGE);
    },
    onError: (error) => {
      if (!axios.isAxiosError<ErrorResponse>(error)) {
        toast.error(GENERIC_ERROR_MESSAGE);
        return;
      }

      const status = error.response?.status;
      const { detail, message } = error.response?.data ?? {};

      if (status === 401) {
        setPasswordError(WRONG_PASSWORD_MESSAGE);
        return;
      }

      if (status === 403) {
        toast.error(NOT_ALLOWED_MESSAGE);
        return;
      }

      if (status === 400 && message) {
        setPasswordError(message);
        return;
      }

      if (status === 409 && detail === ACCOUNT_HAS_ACTIVE_BOOKINGS) {
        setBlockedMessage(message ?? ACTIVE_BOOKINGS_BLOCK_MESSAGE);
        return;
      }

      if (status === 409 && detail === ACCOUNT_HAS_PENDING_OBLIGATIONS && message) {
        setBlockedMessage(message);
        return;
      }

      toast.error(message ?? GENERIC_ERROR_MESSAGE);
    },
  });

  const reset = () => {
    setBlockedMessage(null);
    setPasswordError(null);
    mutation.reset();
  };

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    blockedMessage,
    passwordError,
    reset,
  };
}
