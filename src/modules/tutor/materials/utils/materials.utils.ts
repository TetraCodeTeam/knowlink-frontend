import { FileText, Image, FileSpreadsheet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FILE_TYPE_COLORS, FILE_TYPE_ICON_COLORS } from "@/modules/tutor/materials/constants/materials.constants";
import { ALLOWED_FORMATS } from "@/modules/tutor/materials/constants/materials.constants";

export function getFileIconAndColor(format: string): { icon: LucideIcon; bgColor: string; iconColor: string } {
    const map: Record<string, { icon: LucideIcon; bgColor: string; iconColor: string }> = {
        PDF: { icon: FileText, bgColor: FILE_TYPE_COLORS.PDF, iconColor: FILE_TYPE_ICON_COLORS.PDF },
        PNG: { icon: Image, bgColor: FILE_TYPE_COLORS.PNG, iconColor: FILE_TYPE_ICON_COLORS.PNG },
        XLSX: { icon: FileSpreadsheet, bgColor: FILE_TYPE_COLORS.XLSX, iconColor: FILE_TYPE_ICON_COLORS.XLSX },
    };
    return map[format.toUpperCase()] ?? { icon: FileText, bgColor: "#CCCCCC", iconColor: "#555555" };
}

export function isValidFormat(file: File): boolean {
    const ext = file.name.split(".").pop()?.toUpperCase() ?? "";
    return ALLOWED_FORMATS.includes(ext);
}

export function formatFileSize(bytes:number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}