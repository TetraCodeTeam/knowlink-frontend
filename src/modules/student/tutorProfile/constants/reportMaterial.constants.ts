import type { ReportReason } from "@/modules/student/tutorProfile/interfaces/requests/report-material-request.interface";

interface ReportReasonOption {
  value: ReportReason;
  label: string;
}

// NOTE: only "PLAGIARISM" is confirmed by the backend contract. The other
// three values are inferred from the acceptance criteria's wording and must
// be confirmed with the backend team before this ships.
export const REPORT_REASON_OPTIONS: ReportReasonOption[] = [
  { value: "INAPPROPRIATE_CONTENT", label: "Contenido inapropiado" },
  { value: "FALSE_INFORMATION", label: "Información falsa" },
  { value: "PLAGIARISM", label: "Plagio" },
  { value: "OTHER", label: "Otro" },
];

export const MAX_OTHER_REASON_LENGTH = 200;
export const MAX_REPORT_COMMENT_LENGTH = 500;
export const REPORT_INFO_BOX_COLOR = "#FFBA7F";
