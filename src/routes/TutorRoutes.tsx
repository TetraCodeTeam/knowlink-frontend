import { Routes, Route, Navigate } from "react-router-dom";
import TutorLayout from "@/modules/tutor/layouts/TutorLayout";
import TutorHomePage from "@/modules/tutor/pages/TutorHomePage";
import TutorProfilePage from "@/modules/tutor/pages/TutorProfilePage";
import UnderConstructionPage from "@/shared/components/UnderConstructionPage";
import AvailabilityPage from "@/modules/tutor/pages/AvailabilityPage";

export default function TutorRoutes() {
  return (
    <Routes>
      <Route element={<TutorLayout />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<TutorHomePage />} />
        <Route path="classes" element={<UnderConstructionPage />} />
        <Route path="content" element={<UnderConstructionPage />} />
        <Route path="stats" element={<UnderConstructionPage />} />
        <Route path="notifications" element={<UnderConstructionPage />} />
        <Route path="requests" element={<UnderConstructionPage />} />
        <Route path="profile" element={<TutorProfilePage />} />
        <Route path="availability" element={<AvailabilityPage />} />
      </Route>
    </Routes>
  );
}
