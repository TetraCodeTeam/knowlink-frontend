import { Routes, Route, Navigate } from "react-router-dom";
import AuthRoutes from "@/routes/AuthRoutes";
import ProtectedRoute from "@/routes/ProtectedRoute";
import StudentRoutes from "@/routes/StudentRoutes";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";

export default function RoutesProvider() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/auth/*" element={<AuthRoutes />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<div>Dashboard – Coming soon</div>} />
        <Route path="/student/*" element={<StudentRoutes />} />
      </Route>

      {/* Fallback */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/" : "/auth/login"} replace />}
      />
    </Routes>
  );
}