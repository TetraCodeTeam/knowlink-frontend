import type { FileFormat } from "@/modules/support/interfaces/file-format.type";

export interface MaterialReportingPolicy {
  acceptedFormats: FileFormat[];
  maxDescriptionLength: number;
  maxDefenseAttachments: number;
  maxDefenseAttachmentSizeBytes: number;
  permittedContentPolicy: string;
  reportReasons: Array<{ code: string; label: string; description: string }>;
  reviewProcess: string;
  upheldOutcome: string;
  dismissedOutcome: string;
  reporterNotification: string;
}
