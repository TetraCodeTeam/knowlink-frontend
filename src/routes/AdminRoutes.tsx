import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "@/modules/admin/layouts/AdminLayout";
import AdminHomePage from "@/modules/admin/home/pages/AdminHomePage";
import AdminMaterialReportsPage from "@/modules/admin/material-reports/pages/AdminMaterialReportsPage";
import AdminSessionClaimsPage from "@/modules/admin/session-claims/pages/AdminSessionClaimsPage";
import { adminPaths } from "@/routes/paths";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to={adminPaths.home} replace />} />
        <Route path="home" element={<AdminHomePage />} />
        <Route path="material-reports" element={<AdminMaterialReportsPage />} />
        <Route path="session-claims" element={<AdminSessionClaimsPage />} />
        <Route path="*" element={<Navigate to={adminPaths.home} replace />} />
      </Route>
    </Routes>
  );
}
