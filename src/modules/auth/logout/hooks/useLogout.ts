import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "../api/logout.api";

export function useLogout() {
    const navigate = useNavigate();
    const {logout} = useAuthStore();
    
    const {mutate: triggerLogout, isPending} = useMutation({
        mutationFn: logoutUser,
        onSettled: () => {
            logout();
            navigate("/auth/login");
        },
    });
    return { triggerLogout, isPending };
}