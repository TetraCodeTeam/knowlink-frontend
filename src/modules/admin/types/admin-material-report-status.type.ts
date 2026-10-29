export type AdminMaterialReportStatus = "PENDING" | "IN_REVIEW" | "REMOVED" | "DISMISSED";

export type AdminMaterialFileKind = "PDF" | "SPREADSHEET" | "OTHER";

export type AdminMaterialReportStatusFilter = AdminMaterialReportStatus | "ALL";

export type AdminMaterialReportScope = "all" | "mine";

export interface AdminMaterialReportFilters {
  status: AdminMaterialReportStatusFilter;
  scope: AdminMaterialReportScope;
  page: number;
}