import { useState } from "react";
import { Box } from "@mui/material";
import { Navigate } from "react-router-dom";
import AuthLayout from "@/modules/auth/layouts/AuthLayout";
import StudentAccountForm from "@/modules/auth/components/student-register/StudentAccountForm";
import { useRegistrationStore } from "@/modules/auth/hooks/useRegistrationStore";
import { useStudentRegister } from "@/modules/auth/hooks/useStudentRegister";
import type { StudentAccountData } from "@/modules/auth/schemas/user-register.schema";

export default function StudentRegisterPage() {
  const [credentials] = useState(() => useRegistrationStore.getState().credentials);
  const clearCredentials = useRegistrationStore((s) => s.clearCredentials);
  const { mutate, isPending } = useStudentRegister();

  if (!credentials) {
    return <Navigate to="/auth/register" replace />;
  }

  const handleSubmit = (data: StudentAccountData) => {
    mutate({
      ...credentials,
      ...data,
    });
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
      <StudentAccountForm
        onSubmit={handleSubmit}
        onBack={() => clearCredentials()}
        isPending={isPending}
      />
    </AuthLayout>
  );
}
