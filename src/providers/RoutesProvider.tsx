import { Routes, Route, Navigate } from "react-router-dom";
import AuthRoutes from "@/routes/AuthRoutes";
import ProtectedRoute from "@/routes/ProtectedRoute";
import StudentRoutes from "@/routes/StudentRoutes";
import TutorRoutes from "@/routes/TutorRoutes";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";

function RoleRedirect() {
  const authResponse = useAuthStore((s) => s.authResponse);
  if (authResponse?.role === "TUTOR") return <Navigate to="/tutor/home" replace />;
  return <Navigate to="/student/home" replace />;
}

export default function RoutesProvider() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/auth/*" element={<AuthRoutes />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/student/*" element={<StudentRoutes />} />
        <Route path="/tutor/*" element={<TutorRoutes />} />
        <Route path="/" element={<RoleRedirect />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
