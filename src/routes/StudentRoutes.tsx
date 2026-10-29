import { Routes, Route, Navigate } from "react-router-dom";
import StudentLayout from "@/modules/student/layouts/StudentLayout";
import CommunityFeedPage from "@/modules/community/pages/CommunityFeedPage";
import MyPostsPage from "@/modules/community/pages/MyPostsPage";
import PostThreadPage from "@/modules/community/pages/PostThreadPage";
import TutorPodiumPage from "@/modules/community/pages/TutorPodiumPage";
import { OwnProfilePage } from "@/modules/student/profile/pages/OwnProfilePage";
import TutoresPorMateriaPage from "@/modules/student/pages/TutoresPorMateriaPage";
import SearchResultsPage from "@/modules/student/pages/SearchResultsPage";
import UnderConstructionPage from "@/shared/components/UnderConstructionPage";
import { TutorProfilePage } from "@/modules/student/tutorProfile/pages/ViewTutorProfile";
import BookingPreviewPage from "@/modules/student/booking/pages/BookingClassPage";
import StudentClassHistoryPage from "@/modules/student/pages/StudentClassHistoryPage";

export default function StudentRoutes() {
  return (
    <Routes>
      <Route element={<StudentLayout />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<CommunityFeedPage />} />
        <Route path="community/mine" element={<MyPostsPage />} />
        <Route path="community/podium" element={<TutorPodiumPage />} />
        <Route path="community/posts/:postId" element={<PostThreadPage />} />
        <Route path="classes" element={<StudentClassHistoryPage />} />

        <Route path="complaints" element={<UnderConstructionPage />} />
        <Route path="profile" element={<OwnProfilePage />} />
        <Route path="tutor/:tutorId" element={<TutorProfilePage />} />
        <Route path="tutor/:tutorId/disponibilidad" element={<UnderConstructionPage />} />
        <Route path="tutor/:tutorId/booking" element={<BookingPreviewPage />} />
        <Route path="tutores" element={<TutoresPorMateriaPage />} />
        <Route path="buscar" element={<SearchResultsPage />} />
      </Route>
    </Routes>
  );
}
