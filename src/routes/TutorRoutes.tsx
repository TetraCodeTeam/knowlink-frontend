import { Routes, Route, Navigate } from "react-router-dom";
import TutorLayout from "@/modules/tutor/layouts/TutorLayout";
import TutorHomePage from "@/modules/tutor/pages/TutorHomePage";
import TutorProfilePage from "@/modules/tutor/profile/components/TutorProfilePage";
import { TutorEditProfilePage } from "@/modules/tutor/profile/pages/TutorEditProfilePage";
import UnderConstructionPage from "@/shared/components/UnderConstructionPage";
import TutorClassHistoryPage from "@/modules/tutor/pages/TutorClassHistoryPage";
import { WeeklyAgendaPage } from "@/modules/tutor/weekly-schedule/pages/WeeklyAgendaPage";
import { SupportPage } from "@/modules/support/pages/SupportPage";
import TutorStatisticsPage from "@/modules/tutor/statistics/pages/TutorStatisticsPage";

export default function TutorRoutes() {
  return (
    <Routes>
      <Route element={<TutorLayout />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<TutorHomePage />} />
        <Route path="classes" element={<TutorClassHistoryPage />} />
        <Route path="content" element={<UnderConstructionPage />} />
        <Route path="stats" element={<TutorStatisticsPage />} />
        <Route path="requests" element={<SupportPage />} />
        <Route path="profile" element={<TutorProfilePage />} />
        <Route path="profile/edit" element={<TutorEditProfilePage />} />
        <Route path="availability" element={<WeeklyAgendaPage />} />
      </Route>
    </Routes>
  );
}
