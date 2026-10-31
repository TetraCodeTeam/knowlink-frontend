import type { AdminMaterialFileKind } from "@/modules/admin/types/admin-material-report-status.type";
import type { AdminMaterialReportDetailResponse } from "@/modules/admin/material-reports/interfaces/responses/admin-material-report-detail.response";
import type { AdminMaterialReportItem } from "@/modules/admin/material-reports/interfaces/responses/admin-material-report-item.response";
import type { AdminMaterialReportListItem } from "@/modules/admin/material-reports/interfaces/responses/admin-material-report-list-item.response";
import type { AdminMaterialReportListResponse } from "@/modules/admin/material-reports/interfaces/responses/admin-material-report-list.response";

/**
 * Tipos del contrato real del backend (`docs/admin/admin-frontend-contract.md`).
 *
 * La UI se diseñó sobre un contrato propuesto que agrupaba los reportes por
 * `materialId`; el backend agrupa por caso (`caseId`). El mapper traduce el
 * envelope real (`{ page, statusCounts }`) al modelo de vista de la pantalla.
 */
export interface ApiAssignedAdmin {
  adminId: string;
  fullName: string;
}

export interface ApiMaterialReportCase {
  caseId: string;
  materialId: string;
  fileName: string;
  materialType: string;
  subjectName: string;
  tutorName: string;
  reportsCount: number;
  status: AdminMaterialReportListItem["status"];
  openedAt: string;
  assignedAdmin: ApiAssignedAdmin | null;
  assignedToMe: boolean;
  resolvedAt: string | null;
  resolutionNote: string | null;
}

export interface ApiPagedMaterialReportCases {
  content: ApiMaterialReportCase[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

export interface ApiMaterialReportListResponse {
  page: ApiPagedMaterialReportCases;
  statusCounts: AdminMaterialReportListResponse["statusCounts"];
}

export interface ApiMaterialReportItem {
  reason: string;
  reportedAt: string;
  description: string | null;
}

export interface ApiMaterialReportDetailResponse {
  summary: ApiMaterialReportCase;
  tutor: {
    fullName: string;
    career: string;
    dni: string;
    institutionalId: string;
  };
  material: {
    fileName: string;
    materialType: string;
    sizeInBytes: number | null;
    uploadedAt: string;
  };
  reports: ApiMaterialReportItem[];
  permissions: {
    canTake: boolean;
    canResolve: boolean;
  };
}

const REASON_LABELS: Record<string, string> = {
  INAPPROPRIATE_CONTENT: "Contenido inapropiado",
  FALSE_INFORMATION: "Información falsa",
  PLAGIARISM: "Plagio",
  OTHER: "Otro",
};

function toFileKind(materialType: string): AdminMaterialFileKind {
  if (materialType === "PDF") return "PDF";
  if (materialType === "XLSX") return "SPREADSHEET";
  return "OTHER";
}

export function mapMaterialReportCase(api: ApiMaterialReportCase): AdminMaterialReportListItem {
  return {
    // El backend identifica el caso con `caseId`: es el id que viaja en la URL.
    materialId: api.caseId,
    fileName: api.fileName,
    fileKind: toFileKind(api.materialType),
    subjectName: api.subjectName,
    tutorName: api.tutorName,
    reportsCount: api.reportsCount,
    status: api.status,
    lastReportedAt: api.openedAt,
    assignedToName: api.assignedAdmin?.fullName ?? null,
    assignedToMe: api.assignedToMe,
    resolutionNote: api.resolutionNote,
  };
}

export function mapMaterialReportList(
  api: ApiMaterialReportListResponse
): AdminMaterialReportListResponse {
  return {
    content: api.page.content.map(mapMaterialReportCase),
    page: api.page.page,
    size: api.page.size,
    totalElements: api.page.totalElements,
    statusCounts: api.statusCounts,
  };
}

export function mapMaterialReportDetail(
  api: ApiMaterialReportDetailResponse
): AdminMaterialReportDetailResponse {
  return {
    ...mapMaterialReportCase(api.summary),
    tutor: {
      fullName: api.tutor.fullName,
      career: api.tutor.career,
      nationalId: api.tutor.dni,
      institutionalFileNumber: api.tutor.institutionalId,
    },
    reports: api.reports.map(mapMaterialReportItem),
  };
}

function mapMaterialReportItem(api: ApiMaterialReportItem): AdminMaterialReportItem {
  return {
    reason: REASON_LABELS[api.reason] ?? api.reason,
    reportedAt: api.reportedAt,
    comment: api.description,
  };
}
