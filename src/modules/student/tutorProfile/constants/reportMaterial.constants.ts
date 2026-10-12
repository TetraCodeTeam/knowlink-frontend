import type { ReportReason } from "@/modules/student/tutorProfile/types/report-reason.type";

interface ReportReasonOption {
  value: ReportReason;
  label: string;
}

export const REPORT_REASON_OPTIONS: ReportReasonOption[] = [
  { value: "INAPPROPRIATE_CONTENT", label: "Contenido inapropiado" },
  { value: "FALSE_INFORMATION", label: "Información falsa" },
  { value: "PLAGIARISM", label: "Plagio" },
  { value: "OTHER", label: "Otro" },
];

export const MAX_OTHER_REASON_LENGTH = 200;
export const MAX_REPORT_COMMENT_LENGTH = 500;
export const REPORT_INFO_BOX_COLOR = "#FFBA7F";
