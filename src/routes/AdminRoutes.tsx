import { Navigate, Route, Routes } from "react-router-dom";
import UnderConstructionPage from "@/shared/components/UnderConstructionPage";
import { adminPaths } from "@/routes/paths";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to={adminPaths.home} replace />} />
      <Route path="home" element={<UnderConstructionPage />} />
      <Route path="material-reports" element={<UnderConstructionPage />} />
      <Route path="session-claims" element={<UnderConstructionPage />} />
      <Route path="*" element={<Navigate to={adminPaths.home} replace />} />
    </Routes>
  );
}
