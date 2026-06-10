import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AUTH_REGISTER_KEY } from "@/modules/auth/constants";
import { registerUser } from "@/modules/auth/api/auth.api";
import { useSnackbarStore } from "@/shared/hooks/useSnackbarStore";

export function useRegister() {
  const navigate = useNavigate();
  const showMessage = useSnackbarStore((s) => s.showMessage);

  const { isPending, mutate } = useMutation({
    mutationKey: [AUTH_REGISTER_KEY],
    mutationFn: registerUser,
    onSuccess: () => {
      showMessage("Cuenta creada exitosamente. Por favor iniciá sesión.", "success");
      navigate("/auth/login");
    },
  });

  return { isPending, mutate };
}
