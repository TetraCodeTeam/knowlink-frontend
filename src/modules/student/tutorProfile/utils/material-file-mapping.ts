import { FileSpreadsheet, FileText, Image, type LucideIcon } from "lucide-react";
import type { FileType } from "@/modules/student/tutorProfile/interfaces/tutor.interface";

export const FILE_TYPE_ICON: Record<FileType, LucideIcon> = {
  PDF: FileText,
  XLSX: FileSpreadsheet,
  PNG: Image,
  DOCX: FileText,
  PPTX: FileText,
};