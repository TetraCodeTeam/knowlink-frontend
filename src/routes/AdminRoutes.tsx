import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "@/modules/admin/layouts/AdminLayout";
import UnderConstructionPage from "@/shared/components/UnderConstructionPage";
import { adminPaths } from "@/routes/paths";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to={adminPaths.home} replace />} />
        <Route path="home" element={<UnderConstructionPage />} />
        <Route path="material-reports" element={<UnderConstructionPage />} />
        <Route path="session-claims" element={<UnderConstructionPage />} />
        <Route path="*" element={<Navigate to={adminPaths.home} replace />} />
      </Route>
    </Routes>
  );
}
