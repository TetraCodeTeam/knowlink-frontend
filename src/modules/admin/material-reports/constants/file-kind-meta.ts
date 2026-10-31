import { File, FileSpreadsheet, FileText, type LucideIcon } from "lucide-react";
import { ADMIN_TOKENS } from "@/modules/admin/styles/admin-tokens";
import type { AdminMaterialFileKind } from "@/modules/admin/types/admin-material-report-status.type";

interface FileKindMeta {
  label: string;
  icon: LucideIcon;
  bg: string;
  fg: string;
}

export const FILE_KIND_META: Record<AdminMaterialFileKind, FileKindMeta> = {
  PDF: {
    label: "PDF",
    icon: FileText,
    bg: ADMIN_TOKENS.rose50,
    fg: ADMIN_TOKENS.rose700,
  },
  SPREADSHEET: {
    label: "Planilla",
    icon: FileSpreadsheet,
    bg: ADMIN_TOKENS.emerald50,
    fg: ADMIN_TOKENS.emerald700,
  },
  OTHER: {
    label: "Adjunto",
    icon: File,
    bg: ADMIN_TOKENS.slate50,
    fg: ADMIN_TOKENS.slate600,
  },
};
