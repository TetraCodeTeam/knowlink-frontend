import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/modules/auth/logout/api/logout.api";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import { NOTIFICATION_QUERY_KEYS } from "@/modules/notifications/constants/notification-query-keys";

export function useLogout() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  const { mutate: triggerLogout, isPending } = useMutation({
    mutationKey: ["logout"],
    mutationFn: logoutUser,
    onSettled: () => {
      queryClient.removeQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all });
      logout();
      navigate("/auth/login", { replace: true });
    },
  });

  return { triggerLogout, isPending };
}
