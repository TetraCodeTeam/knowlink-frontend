import { Routes, Route } from "react-router-dom";
import LoginPage from "@/modules/auth/pages/LoginPage";
import RegisterPage from "@/modules/auth/pages/RegisterPage";
import CheckEmailPage from "@/modules/auth/pages/CheckEmailPage";
import ActivateAccountPage from "@/modules/auth/pages/ActivateAccountPage";
import TutorRegisterPage from "@/modules/auth/pages/TutorRegisterPage";
import StudentRegisterPage from "@/modules/auth/pages/StudentRegisterPage";

export default function AuthRoutes() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="register/tutor" element={<TutorRegisterPage />} />
      <Route path="register/student" element={<StudentRegisterPage />} />
      <Route path="check-email" element={<CheckEmailPage />} />
      <Route path="activate" element={<ActivateAccountPage />} />
    </Routes>
  );
}