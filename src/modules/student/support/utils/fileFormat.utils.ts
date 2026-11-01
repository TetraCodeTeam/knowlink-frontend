import { ACCEPTED_FILE_FORMATS } from "@/modules/support/constants/file-format.constants";
import type { FileFormat } from "@/modules/support/interfaces/file-format.type";

export function normalizeFileFormat(format: string): FileFormat {
  const normalized = format.toUpperCase();
  const match = ACCEPTED_FILE_FORMATS.find((accepted) => accepted === normalized);
  return match ?? "PDF";
}
