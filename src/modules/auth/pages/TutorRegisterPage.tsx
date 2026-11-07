import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthLayout from "@/modules/auth/layouts/AuthLayout";
import RegistrationStepper from "@/modules/auth/components/RegistrationStepper";
import TutorRegisterWizard from "@/modules/auth/components/tutor-register/TutorRegisterWizard";
import { useRegistrationStore } from "@/modules/auth/hooks/useRegistrationStore";
import FrankieIllustration from "@/shared/frankie/FrankieIllustration";

export default function TutorRegisterPage() {
  const [credentials] = useState(() => useRegistrationStore.getState().credentials);
  const location = useLocation();
  const isDualRole = (location.state as { startAtStep?: number } | null)?.startAtStep === 2;
  const dualRoleCareer = (location.state as { career?: string } | null)?.career ?? "";
  const dualRoleInstitutionId =
    (location.state as { institutionId?: string } | null)?.institutionId ?? "";
  const [currentStep, setCurrentStep] = useState(1);

  if (!isDualRole && !credentials) {
    return <Navigate to="/auth/register" replace />;
  }

  const illustration = (
    <FrankieIllustration
      mood="happy"
      accessories={["sparkles"]}
      message="Compartir lo que sabés es una de las mejores formas de aprender."
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
        dualRoleInstitutionId={dualRoleInstitutionId}
      />
    </AuthLayout>
  );
}
