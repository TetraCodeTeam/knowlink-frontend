import { describe, expect, it } from "vitest";
import { ADMIN_MATERIAL_REPORT_STATUS_META } from "@/modules/admin/material-reports/constants/material-report-status-meta";
import type { AdminMaterialReportStatus } from "@/modules/admin/types/admin-material-report-status.type";

const STATUSES: AdminMaterialReportStatus[] = ["PENDING", "IN_REVIEW", "REMOVED", "DISMISSED"];

describe("ADMIN_MATERIAL_REPORT_STATUS_META", () => {
  it("cubre todos los estados del admin", () => {
    expect(Object.keys(ADMIN_MATERIAL_REPORT_STATUS_META).sort()).toEqual([...STATUSES].sort());
  });

  it("define etiqueta, tono y franja para cada estado", () => {
    STATUSES.forEach((status) => {
      const meta = ADMIN_MATERIAL_REPORT_STATUS_META[status];

      expect(meta.label.length).toBeGreaterThan(0);
      expect(["warning", "info", "success", "danger"]).toContain(meta.tone);
      expect(meta.accent).toMatch(/^#[0-9A-F]{6}$/i);
    });
  });

  it("usa las etiquetas del diseño", () => {
    expect(ADMIN_MATERIAL_REPORT_STATUS_META.PENDING.label).toBe("Pendiente");
    expect(ADMIN_MATERIAL_REPORT_STATUS_META.IN_REVIEW.label).toBe("En revisión");
    expect(ADMIN_MATERIAL_REPORT_STATUS_META.REMOVED.label).toBe("Eliminado");
    expect(ADMIN_MATERIAL_REPORT_STATUS_META.DISMISSED.label).toBe("Desestimado");
  });
});
