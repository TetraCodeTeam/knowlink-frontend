import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthLayout from "@/modules/auth/layouts/AuthLayout";
import RegistrationStepper from "@/modules/auth/components/RegistrationStepper";
import TutorRegisterWizard from "@/modules/auth/components/tutor-register/TutorRegisterWizard";
import { useRegistrationStore } from "@/modules/auth/hooks/useRegistrationStore";
import { Box } from "@mui/material";

export default function TutorRegisterPage() {
  const [credentials] = useState(() => useRegistrationStore.getState().credentials);
  const location = useLocation();
  const isDualRole = (location.state as { startAtStep?: number } | null)?.startAtStep === 2;
  const dualRoleCareer = (location.state as { career?: string } | null)?.career ?? "";
  const [currentStep, setCurrentStep] = useState(1);

  if (!isDualRole && !credentials) {
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
      stepper={<RegistrationStepper currentStep={currentStep} totalSteps={isDualRole ? 1 : 3} />}
    >
      <TutorRegisterWizard
        credentials={credentials ?? { email: "", password: "", confirmPassword: "" }}
        onStepChange={isDualRole ? () => {} : setCurrentStep}
        initialStep={isDualRole ? 2 : 1}
        isDualRole={isDualRole}
        dualRoleCareer={dualRoleCareer}
      />
    </AuthLayout>
  );
}
