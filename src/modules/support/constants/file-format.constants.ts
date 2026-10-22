import type { LucideIcon } from "lucide-react";
import { FileSpreadsheet, FileText, ImageIcon } from "lucide-react";
import type { FileFormat } from "@/modules/support/interfaces/file-format.type";

interface FileFormatMeta {
  label: string;
  icon: LucideIcon;
  bg: string;
  fg: string;
}

export const FILE_FORMAT_META: Record<FileFormat, FileFormatMeta> = {
  PDF: { label: "PDF", icon: FileText, bg: "#FCE4E4", fg: "#C62828" },
  PNG: { label: "PNG", icon: ImageIcon, bg: "#E6E8FB", fg: "#3F4BC4" },
  XLSX: { label: "XLSX", icon: FileSpreadsheet, bg: "#E4E6EC", fg: "#4B4F5C" },
};

export const ACCEPTED_FILE_FORMATS: FileFormat[] = ["PDF", "PNG", "XLSX"];
