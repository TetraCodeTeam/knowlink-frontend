import { useState } from "react";
import { Box } from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import AuthLayout from "@/modules/auth/layouts/AuthLayout";
import StudentAccountForm from "@/modules/auth/components/student-register/StudentAccountForm";
import { useRegistrationStore } from "@/modules/auth/hooks/useRegistrationStore";
import { useStudentRegister } from "@/modules/auth/hooks/useStudentRegister";
import type { StudentAccountData } from "@/modules/auth/schemas/user-register.schema";

export default function StudentRegisterPage() {
  const [credentials] = useState(() => useRegistrationStore.getState().credentials);
  const { mutate, isPending } = useStudentRegister();
  const navigate = useNavigate();

  if (!credentials) {
    return <Navigate to="/auth/register" replace />;
  }

  const handleSubmit = (data: StudentAccountData) => {
    mutate({
      email: credentials.email,
      password: credentials.password,
      confirmPassword: credentials.confirmPassword,
      ...data,
    });
  };

  const handleBack = () => {
    navigate("/auth/register");
  };

  const illustration = (
    <Box
      component="img"
      src="/register-image.png"
      alt="Estudiante con libros"
      sx={{ width: "100%" }}
    />
  );

  return (
    <AuthLayout illustration={illustration}>
      <StudentAccountForm onSubmit={handleSubmit} onBack={handleBack} isPending={isPending} />
    </AuthLayout>
  );
}
