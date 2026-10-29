import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AxiosResponse } from "axios";
import { rawHttpClient } from "@/shared/lib/httpClient";
import { getDashboardSummary } from "@/modules/admin/home/api/admin-home.api";
import type { DashboardSummaryResponse } from "@/modules/admin/home/interfaces/responses/dashboard-summary.response";

vi.mock("@/shared/lib/httpClient", () => ({
  rawHttpClient: { get: vi.fn() },
}));

const mockedGet = vi.mocked(rawHttpClient.get);

const SUMMARY: DashboardSummaryResponse = {
  sessionClaims: {
    resolvedThisWeek: 11,
    resolvedDeltaPct: 12,
    newThisWeek: 9,
    oldestPendingDays: 4,
  },
  materialReports: {
    resolvedThisWeek: 11,
    resolvedDeltaPct: 12,
    newThisWeek: 9,
    pendingFiles: 1,
    pendingReports: 6,
  },
  performance: {
    avgResolutionHours: 3.8,
    avgResolutionDeltaPct: 18,
    unresolvedPct: 8.2,
    volumeSplit: { claimsPct: 58, reportsPct: 42 },
  },
};

describe("getDashboardSummary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("solicita el resumen con el rango indicado", async () => {
    mockedGet.mockResolvedValue({ data: SUMMARY } as AxiosResponse<DashboardSummaryResponse>);

    await expect(getDashboardSummary("MONTH")).resolves.toBe(SUMMARY);

    expect(mockedGet).toHaveBeenCalledWith("/api/v1/admin/dashboard/summary", {
      params: { range: "MONTH" },
    });
  });

  it("propaga el error para que la pantalla muestre su estado de reintento", async () => {
    mockedGet.mockRejectedValue(new Error("network"));

    await expect(getDashboardSummary("WEEK")).rejects.toThrow("network");
  });
});
