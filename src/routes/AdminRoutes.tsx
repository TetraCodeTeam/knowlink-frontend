import { Routes, Route, Navigate } from "react-router-dom";
import AdminCatalogoLayout from "@/modules/catalog/layouts/AdminCatalogoLayout";
import AdminCatalogoPage from "@/modules/catalog/pages/AdminCatalogoPage";
import SubjectAssociationsPage from "@/modules/catalog/pages/SubjectAssociationsPage";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminCatalogoLayout />}>
        <Route index element={<Navigate to="catalogo" replace />} />
        <Route path="catalogo" element={<AdminCatalogoPage />} />
        <Route
          path="catalogo/materias/:subjectId/asociaciones"
          element={<SubjectAssociationsPage />}
        />
      </Route>
    </Routes>
  );
}