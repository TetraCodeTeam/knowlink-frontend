import type { AdminListScope } from "@/modules/admin/types/admin-list-scope.type";

export type AdminMaterialReportStatus = "PENDING" | "IN_REVIEW" | "REMOVED" | "DISMISSED";

export type AdminMaterialFileKind = "PDF" | "SPREADSHEET" | "OTHER";

export type AdminMaterialReportStatusFilter = AdminMaterialReportStatus | "ALL";

export type AdminMaterialReportScope = AdminListScope;

export interface AdminMaterialReportFilters {
  status: AdminMaterialReportStatusFilter;
  scope: AdminMaterialReportScope;
  page: number;
}
