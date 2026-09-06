import { Routes, Route, Navigate } from "react-router-dom";
import StudentLayout from "@/modules/student/layouts/StudentLayout";
import StudentHomePage from "@/modules/student/pages/StudentHomePage";
import StudentProfilePage from "@/modules/student/pages/StudentProfilePage";
import SubjectTutorsPage from "@/modules/student/pages/SubjectTutorsPage";
import SearchResultsPage from "@/modules/student/pages/SearchResultsPage";
import UnderConstructionPage from "@/shared/components/UnderConstructionPage";
import { TutorProfilePage } from "@/modules/student/pages/ViewTutorProfile";

export default function StudentRoutes() {
  return (
    <Routes>
      <Route element={<StudentLayout />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<StudentHomePage />} />
        <Route path="classes" element={<UnderConstructionPage />} />
        <Route path="notifications" element={<UnderConstructionPage />} />
        <Route path="complaints" element={<UnderConstructionPage />} />
        <Route path="profile" element={<StudentProfilePage />} />
        <Route path="tutor/:tutorId" element={<TutorProfilePage />} />
        <Route path="tutor/:tutorId/disponibilidad" element={<UnderConstructionPage />} />
        <Route path="tutores" element={<SubjectTutorsPage />} />
        <Route path="buscar" element={<SearchResultsPage />} />
      </Route>
    </Routes>
  );
}
