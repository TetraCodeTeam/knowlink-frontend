import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Step1Data } from "@/modules/auth/schemas/tutor-register.schema";
import type { Step2Data } from "@/modules/auth/schemas/tutor-register.schema";
import Step1Account from "@/modules/auth/components/tutor-register/steps/Step1Account";
import Step2AcademicProfile from "@/modules/auth/components/tutor-register/steps/Step2AcademicProfile";
import Step4Confirmation from "@/modules/auth/components/tutor-register/steps/Step4Confirmation";
import { useTutorRegister } from "@/modules/auth/hooks/useTutorRegister";
import { useActivateTutorRole } from "@/modules/student/dual-role/hooks/useActivateTutorRole";
import RoleRedirectDialog from "@/modules/student/dual-role/components/RoleRedirectDialog";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import { toast } from "sonner";

interface Credentials {
  email: string;
  password: string;
  confirmPassword: string;
}

interface TutorRegisterWizardProps {
  credentials: Credentials;
  onStepChange: (step: number) => void;
  initialStep?: number;
  isDualRole?: boolean;
  dualRoleCareer?: string;
}

export default function TutorRegisterWizard({
  credentials,
  onStepChange,
  initialStep = 1,
  isDualRole = false,
  dualRoleCareer = "",
}: TutorRegisterWizardProps) {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { mutate: registerTutor, isPending: isRegistering } = useTutorRegister();
  const { mutateAsync: activateTutorRole } = useActivateTutorRole();

  const [step, setStep] = useState(initialStep);
  const [step1Data, setStep1Data] = useState<Partial<Step1Data>>({});
  const [step2Data, setStep2Data] = useState<Partial<Step2Data>>({});
  const [showRedirectDialog, setShowRedirectDialog] = useState(false);

  const goTo = (next: number) => {
    setStep(next);
    onStepChange(next);
  };

  const handleStep1Next = (data: Step1Data) => {
    setStep1Data(data);
    goTo(2);
  };

  const handleStep2Next = async (data: Step2Data) => {
    setStep2Data(data);
    if (isDualRole) {
      try {
        await activateTutorRole({
          biography: data.biography ?? "",
          address: data.address ?? "",
          subjects: data.subjects.map((s) => ({
            subjectName: s.subjectName,
            modality: s.modality,
            compensationType: s.compensationType,
            pricePerHour: s.compensationType === "FREE" ? undefined : (s.pricePerHour ?? undefined),
          })),
        });
        setShowRedirectDialog(true);
      } catch {
        toast.error("No se pudo activar el rol de tutor");
      }
      return;
    }
    goTo(3);
  };

  const handleConfirm = () => {
    const s1 = step1Data as Step1Data;
    const s2 = step2Data as Step2Data;
    registerTutor({
      ...credentials,
      firstName: s1.firstName,
      lastName: s1.lastName,
      dni: s1.dni,
      phoneNumber: s1.phoneNumber,
      career: s1.career,
      institutionalId: s1.institutionalId || undefined,
      profilePictureUrl: s1.profilePictureUrl || undefined,
      biography: s2.biography || undefined,
      address: s2.address || undefined,
      subjects: s2.subjects.map((s) => ({
        subjectName: s.subjectName,
        modality: s.modality,
        compensationType: s.compensationType,
        pricePerHour: s.compensationType === "FREE" ? undefined : (s.pricePerHour ?? undefined),
      })),
    });
  };

  if (step === 1) {
    return (
      <Step1Account
        defaultValues={step1Data}
        onNext={handleStep1Next}
        onBack={() => navigate("/auth/register")}
      />
    );
  }

  if (step === 2) {
    return (
      <>
        <Step2AcademicProfile
          career={isDualRole ? dualRoleCareer : (step1Data.career || "")}
          defaultValues={step2Data}
          onNext={(data) => void handleStep2Next(data)}
          onBack={() => (isDualRole ? navigate(-1) : goTo(1))}
        />
        <RoleRedirectDialog
          open={showRedirectDialog}
          variant="activation"
          onRedirect={() => {
            logout();
            navigate("/auth/login", { replace: true });
          }}
        />
      </>
    );
  }

  return (
    <Step4Confirmation
      step1={step1Data as Step1Data}
      step2={step2Data as Step2Data}
      isPending={isRegistering}
      onConfirm={handleConfirm}
      onBack={() => goTo(2)}
    />
  );
}

