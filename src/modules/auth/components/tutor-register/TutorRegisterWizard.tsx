import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Step1Data } from "@/modules/auth/schemas/tutor-register.schema";
import type { Step2Data } from "@/modules/auth/schemas/tutor-register.schema";
import Step1Account from "@/modules/auth/components/tutor-register/steps/Step1Account";
import Step2AcademicProfile from "@/modules/auth/components/tutor-register/steps/Step2AcademicProfile";
import Step3MercadoPago from "@/modules/auth/components/tutor-register/steps/Step3MercadoPago";
import Step4Confirmation from "@/modules/auth/components/tutor-register/steps/Step4Confirmation";
import { useTutorRegister } from "@/modules/auth/hooks/useTutorRegister";

interface Credentials {
  email: string;
  password: string;
  confirmPassword: string;
}

interface TutorRegisterWizardProps {
  credentials: Credentials;
  onStepChange: (step: number) => void;
}

export default function TutorRegisterWizard({
  credentials,
  onStepChange,
}: TutorRegisterWizardProps) {
  const navigate = useNavigate();
  const { mutate, isPending } = useTutorRegister();

  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState<Partial<Step1Data>>({});
  const [step2Data, setStep2Data] = useState<Partial<Step2Data>>({});
  const [mpLinked] = useState(false);

  const goTo = (next: number) => {
    setStep(next);
    onStepChange(next);
  };

  const handleStep1Next = (data: Step1Data) => {
    setStep1Data(data);
    goTo(2);
  };

  const handleStep2Next = (data: Step2Data) => {
    setStep2Data(data);
    goTo(3);
  };

  const handleStep3Next = () => goTo(4);
  const handleStep3Skip = () => goTo(4);

  const handleConfirm = () => {
    const s1 = step1Data as Step1Data;
    const s2 = step2Data as Step2Data;

    mutate({
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
      <Step2AcademicProfile
        career={step1Data.career || ""}
        defaultValues={step2Data}
        onNext={handleStep2Next}
        onBack={() => goTo(1)}
      />
    );
  }

  if (step === 3) {
    return (
      <Step3MercadoPago
        onNext={handleStep3Next}
        onBack={() => goTo(2)}
        onSkip={handleStep3Skip}
      />
    );
  }

  return (
    <Step4Confirmation
      step1={step1Data as Step1Data}
      step2={step2Data as Step2Data}
      mpLinked={mpLinked}
      isPending={isPending}
      onConfirm={handleConfirm}
      onBack={() => goTo(3)}
    />
  );
}
