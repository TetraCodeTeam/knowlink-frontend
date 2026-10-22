import type { LucideIcon } from "lucide-react";
import { FileSpreadsheet, FileText, ImageIcon } from "lucide-react";
import type { FileFormat } from "@/modules/support/interfaces/file-format.type";
import { SUPPORT_COLORS } from "@/modules/support/constants/support-colors.constants";

interface FileFormatMeta {
  label: string;
  icon: LucideIcon;
  bg: string;
  fg: string;
}

export const FILE_FORMAT_META: Record<FileFormat, FileFormatMeta> = {
  PDF: { label: "PDF", icon: FileText, bg: SUPPORT_COLORS.redSoft, fg: SUPPORT_COLORS.red },
  PNG: { label: "PNG", icon: ImageIcon, bg: SUPPORT_COLORS.indigoSoft, fg: SUPPORT_COLORS.indigo },
  XLSX: {
    label: "XLSX",
    icon: FileSpreadsheet,
    bg: SUPPORT_COLORS.slateSoft,
    fg: SUPPORT_COLORS.slate,
  },
};

export const ACCEPTED_FILE_FORMATS: FileFormat[] = ["PDF", "PNG", "XLSX"];
