import { TutorProfilePage } from "@/modules/student/pages/ViewTutorProfile";
import { Route, Routes } from "react-router-dom";

export default function StudentRoutes() {
  return (
    <Routes>
      <Route path="tutor/:tutorId" element={<TutorProfilePage />} />
      <Route path="tutor/:tutorId/disponibilidad" element={<div>Disponibilidad – Coming soon</div>} />
    </Routes>
  );
}