import { useState } from "react";
import axios from "axios";
import ReportMaterialButton from "@/modules/student/tutorProfile/components/ReportMaterialButton";
import ReportMaterialDialog from "@/modules/student/tutorProfile/components/ReportMaterialDialog";
import ReportMaterialSuccessDialog from "@/modules/student/tutorProfile/components/ReportMaterialSuccessDialog";
import ReportMaterialAlreadyReportedDialog from "@/modules/student/tutorProfile/components/ReportMaterialAlreadyReportedDialog";
import { useReportMaterial } from "@/modules/student/tutorProfile/hooks/useReportMaterial";
import {
  hasReportedMaterial,
  markMaterialAsReported,
} from "@/modules/student/tutorProfile/utils/reportedMaterials.storage";
import type { ReportMaterialFormValues } from "@/modules/student/tutorProfile/schemas/reportMaterial.schema";
import type { ReportReason } from "@/modules/student/tutorProfile/interfaces/requests/report-material-request.interface";

interface ReportMaterialFlowProps {
  materialId: string;
  materialTitle: string;
}

type ReportMaterialStep = "closed" | "reporting" | "success" | "already-reported";

function buildDescription(values: ReportMaterialFormValues): string | undefined {
  const parts: string[] = [];
  if (values.reason === "OTHER" && values.otherReasonText?.trim()) {
    parts.push(values.otherReasonText.trim());
  }
  if (values.comment?.trim()) {
    parts.push(values.comment.trim());
  }
  return parts.length > 0 ? parts.join(" — ") : undefined;
}

export default function ReportMaterialFlow({ materialId, materialTitle }: ReportMaterialFlowProps) {
  const [step, setStep] = useState<ReportMaterialStep>("closed");
  const { submitReport, isPending } = useReportMaterial(materialId);

  const handleOpen = () => {
    if (hasReportedMaterial(materialId)) {
      setStep("already-reported");
      return;
    }
    setStep("reporting");
  };

  const handleConfirm = async (values: ReportMaterialFormValues) => {
    try {
      await submitReport({
        reason: values.reason as ReportReason,
        description: buildDescription(values),
      });
      markMaterialAsReported(materialId);
      setStep("success");
    } catch (err: unknown) {
      const status = axios.isAxiosError(err) ? err.response?.status : undefined;
      if (status === 409) {
        // 409 is the documented "already reported" conflict for this material.
        markMaterialAsReported(materialId);
        setStep("already-reported");
        return;
      }
      // Other errors (network, 5xx, validation): the httpClient interceptor
      // already showed an error toast; keep the report dialog open to retry.
    }
  };

  return (
    <>
      <ReportMaterialButton
        materialTitle={materialTitle}
        alreadyReported={hasReportedMaterial(materialId)}
        onClick={handleOpen}
      />

      <ReportMaterialDialog
        open={step === "reporting"}
        materialTitle={materialTitle}
        isPending={isPending}
        onConfirm={(values) => void handleConfirm(values)}
        onCancel={() => setStep("closed")}
      />

      <ReportMaterialSuccessDialog open={step === "success"} onClose={() => setStep("closed")} />

      <ReportMaterialAlreadyReportedDialog
        open={step === "already-reported"}
        onClose={() => setStep("closed")}
      />
    </>
  );
}
