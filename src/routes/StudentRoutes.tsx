import { TutorProfilePage } from "@/modules/student/pages/ViewTutorProfile";
import { Route, Routes } from "react-router-dom";

export default function StudentRoutes() {
  return (
    <Routes>
      <Route path="tutor/:tutorId" element={<TutorProfilePage />} />
    </Routes>
  );
};