import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AxiosResponse } from "axios";
import { rawHttpClient } from "@/shared/lib/httpClient";
import { getAdminNavigationBadges } from "@/modules/admin/navigation/api/admin-navigation.api";
import type { AdminNavigationBadgesResponse } from "@/modules/admin/navigation/interfaces/responses/admin-navigation-badges.response";

vi.mock("@/shared/lib/httpClient", () => ({
  rawHttpClient: { get: vi.fn() },
}));

const mockedGet = vi.mocked(rawHttpClient.get);

const BADGES: AdminNavigationBadgesResponse = {
  pendingMaterialReports: 3,
  pendingSessionClaims: 2,
};

describe("getAdminNavigationBadges", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("consulta el endpoint de badges del sidebar", async () => {
    mockedGet.mockResolvedValue({ data: BADGES } as AxiosResponse<AdminNavigationBadgesResponse>);

    await expect(getAdminNavigationBadges()).resolves.toEqual(BADGES);
    expect(mockedGet).toHaveBeenCalledWith("/api/v1/admin/navigation/badges");
  });

  it("propaga el error para que el sidebar oculte los contadores", async () => {
    mockedGet.mockRejectedValue(new Error("network"));

    await expect(getAdminNavigationBadges()).rejects.toThrow("network");
  });
});
