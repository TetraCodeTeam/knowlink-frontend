import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";

export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isDevAuthBypassEnabled = import.meta.env.DEV;

  if (isDevAuthBypassEnabled) {
    return <Outlet />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
}
