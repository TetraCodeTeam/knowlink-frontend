export const REPORT_REASON_VALUES = [
  "INAPPROPRIATE_CONTENT",
  "FALSE_INFORMATION",
  "PLAGIARISM",
  "OTHER",
] as const;

export type ReportReason = (typeof REPORT_REASON_VALUES)[number];
