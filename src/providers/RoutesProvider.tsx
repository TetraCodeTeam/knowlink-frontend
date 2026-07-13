import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import AuthRoutes from "@/routes/AuthRoutes";
import ProtectedRoute from "@/routes/ProtectedRoute";
import StudentRoutes from "@/routes/StudentRoutes";
import TutorRoutes from "@/routes/TutorRoutes";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";

const isDevAuthBypassEnabled = import.meta.env.DEV;

function RoleRedirect() {
  const authResponse = useAuthStore((s) => s.authResponse);
  if (authResponse?.role === "TUTOR") return <Navigate to="/tutor/home" replace />;
  return <Navigate to="/student/home" replace />;
}

function RoleRoute({ allowedRole }: { allowedRole: string }) {
  if (isDevAuthBypassEnabled) {
    return <Outlet />;
  }

  const authResponse = useAuthStore((s) => s.authResponse);
  if (!authResponse || authResponse.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

export default function RoutesProvider() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/auth/*" element={<AuthRoutes />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRole="STUDENT" />}>
          <Route path="/student/*" element={<StudentRoutes />} />
        </Route>
        <Route element={<RoleRoute allowedRole="TUTOR" />}>
          <Route path="/tutor/*" element={<TutorRoutes />} />
        </Route>
        <Route path="/" element={<RoleRedirect />} />
      </Route>

      {/* Fallback */}
      <Route
        path="*"
        element={
          <Navigate
            to={isAuthenticated || isDevAuthBypassEnabled ? "/" : "/auth/login"}
            replace
          />
        }
      />
    </Routes>
  );
}
