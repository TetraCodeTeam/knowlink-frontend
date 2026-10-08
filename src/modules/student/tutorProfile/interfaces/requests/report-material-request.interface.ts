export type ReportReason = "INAPPROPRIATE_CONTENT" | "FALSE_INFORMATION" | "PLAGIARISM" | "OTHER";

export interface ReportMaterialRequest {
  reason: ReportReason;
  description?: string;
}
