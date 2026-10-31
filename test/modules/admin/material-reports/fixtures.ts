import type { AdminMaterialReportDetailResponse } from "@/modules/admin/material-reports/interfaces/responses/admin-material-report-detail.response";
import type { AdminMaterialReportListItem } from "@/modules/admin/material-reports/interfaces/responses/admin-material-report-list-item.response";
import type { AdminMaterialReportListResponse } from "@/modules/admin/material-reports/interfaces/responses/admin-material-report-list.response";

export function makeMaterialReportListItem(
  overrides: Partial<AdminMaterialReportListItem> = {}
): AdminMaterialReportListItem {
  return {
    materialId: "mat-1",
    fileName: "Guía de integrales.pdf",
    fileKind: "PDF",
    subjectName: "Análisis Matemático",
    tutorName: "Silvina Rubio",
    reportsCount: 4,
    status: "PENDING",
    lastReportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    assignedToName: null,
    assignedToMe: false,
    resolutionNote: null,
    ...overrides,
  };
}

export function makeMaterialReportDetail(
  overrides: Partial<AdminMaterialReportDetailResponse> = {}
): AdminMaterialReportDetailResponse {
  return {
    ...makeMaterialReportListItem(),
    tutor: {
      fullName: "Juana Pérez",
      career: "Licenciatura en Sistemas",
      nationalId: "30.123.456",
      institutionalFileNumber: "12345",
    },
    reports: [
      {
        reason: "Plagio",
        reportedAt: "2026-10-27T18:20:00.000Z",
        comment: "Es una copia de otra guía",
      },
      {
        reason: "Contenido inapropiado",
        reportedAt: "2026-10-26T10:00:00.000Z",
        comment: null,
      },
    ],
    ...overrides,
  };
}

export function makeMaterialReportListResponse(
  overrides: Partial<AdminMaterialReportListResponse> = {}
): AdminMaterialReportListResponse {
  return {
    content: [makeMaterialReportListItem()],
    page: 0,
    size: 4,
    totalElements: 1,
    statusCounts: { pending: 1, inReview: 2, removed: 3, dismissed: 4 },
    ...overrides,
  };
}
