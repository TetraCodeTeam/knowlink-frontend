import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/modules/auth/logout/api/logout.api";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";

export function useLogout() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const { mutate: triggerLogout, isPending } = useMutation({
    mutationKey: ["logout"],
    mutationFn: logoutUser,
    onSettled: () => {
      logout();
      navigate("/auth/login", { replace: true });
    },
  });

  return { triggerLogout, isPending };
}
