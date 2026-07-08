import { useState } from "react";
import { Navigate } from "react-router-dom";
import AuthLayout from "@/modules/auth/layouts/AuthLayout";
import RegistrationStepper from "@/modules/auth/components/RegistrationStepper";
import TutorRegisterWizard from "@/modules/auth/components/tutor-register/TutorRegisterWizard";
import { useRegistrationStore } from "@/modules/auth/hooks/useRegistrationStore";

export default function TutorRegisterPage() {
  const credentials = useRegistrationStore((s) => s.credentials);
  const [currentStep, setCurrentStep] = useState(1);

  // Si no hay credenciales en el store, redirigir al registro
  if (!credentials) {
    return <Navigate to="/auth/register" replace />;
  }

  const illustration = (
    <img
      src="/register-image.png"
      alt="Estudiante con libros"
      style={{ width: "100%" }}
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
