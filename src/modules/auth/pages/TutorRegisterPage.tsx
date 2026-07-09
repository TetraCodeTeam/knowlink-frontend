import { useState } from "react";
import { Navigate } from "react-router-dom";
import AuthLayout from "@/modules/auth/layouts/AuthLayout";
import RegistrationStepper from "@/modules/auth/components/RegistrationStepper";
import TutorRegisterWizard from "@/modules/auth/components/tutor-register/TutorRegisterWizard";
import { useRegistrationStore } from "@/modules/auth/hooks/useRegistrationStore";
import { Box } from "@mui/material";

export default function TutorRegisterPage() {
  const credentials = useRegistrationStore((s) => s.credentials);
  const [currentStep, setCurrentStep] = useState(1);

  if (!credentials) {
    return <Navigate to="/auth/register" replace />;
  }

  const illustration = (
    <Box
      component="img"
      src="/register-image.png"
      alt="Estudiante con libros"
      sx={{ width: "100%" }}
    />
  );

  return (
    <AuthLayout
      illustration={illustration}
      stepper={<RegistrationStepper currentStep={currentStep} totalSteps={4} />}
    >
      <TutorRegisterWizard
        credentials={{
          email: credentials.email,
          password: credentials.password,
          confirmPassword: credentials.confirmPassword,
        }}
        onStepChange={setCurrentStep}
      />
    </AuthLayout>
  );
}
