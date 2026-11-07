import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import AuthLayout from "@/modules/auth/layouts/AuthLayout";
import StudentAccountForm from "@/modules/auth/components/student-register/StudentAccountForm";
import { useRegistrationStore } from "@/modules/auth/hooks/useRegistrationStore";
import { useStudentRegister } from "@/modules/auth/hooks/useStudentRegister";
import type { StudentAccountData } from "@/modules/auth/schemas/user-register.schema";
import FrankieIllustration from "@/shared/frankie/FrankieIllustration";

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
    <FrankieIllustration
      mood="love"
      accessories={["hearts"]}
      message="Un paso más y ya sos parte. ¡Vas a aprender un montón!"
    />
  );

  return (
    <AuthLayout illustration={illustration}>
      <StudentAccountForm onSubmit={handleSubmit} onBack={handleBack} isPending={isPending} />
    </AuthLayout>
  );
}
