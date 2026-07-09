import { Routes, Route, Navigate } from "react-router-dom";
import AuthRoutes from "@/routes/AuthRoutes";
import ProtectedRoute from "@/routes/ProtectedRoute";
import StudentRoutes from "@/routes/StudentRoutes";

export default function RoutesProvider() {
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
