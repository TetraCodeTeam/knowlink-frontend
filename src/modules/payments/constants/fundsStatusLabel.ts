import type { FundsStatus } from "@/modules/payments/types/funds";

export const fundsStatusLabel: Record<FundsStatus, string> = {
  HELD: "Retenido",
  SUSPENDED_BY_CLAIM: "Suspendido por reclamo",
  RELEASED_TO_TUTOR: "Liberado al tutor",
  REFUNDED_TO_STUDENT: "Devuelto al alumno",
};

export const fundsStatusColor: Record<FundsStatus, "warning" | "error" | "success" | "info"> = {
  HELD: "info",
  SUSPENDED_BY_CLAIM: "warning",
  RELEASED_TO_TUTOR: "success",
  REFUNDED_TO_STUDENT: "error",
};