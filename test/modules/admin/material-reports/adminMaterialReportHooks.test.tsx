import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  assignMaterialReport,
  dismissMaterialReport,
  removeMaterial,
} from "@/modules/admin/material-reports/api/admin-material-reports.api";
import { useAssignMaterialReport } from "@/modules/admin/material-reports/hooks/useAssignMaterialReport";
import { useDismissMaterialReport } from "@/modules/admin/material-reports/hooks/useDismissMaterialReport";
import { useRemoveMaterial } from "@/modules/admin/material-reports/hooks/useRemoveMaterial";
import { adminQueryKeys } from "@/modules/admin/constants/admin-query-keys";

vi.mock("@/modules/admin/material-reports/api/admin-material-reports.api", () => ({
  getMaterialReports: vi.fn(),
  getMaterialReportDetail: vi.fn(),
  assignMaterialReport: vi.fn(),
  removeMaterial: vi.fn(),
  dismissMaterialReport: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const mockedAssign = vi.mocked(assignMaterialReport);
const mockedRemove = vi.mocked(removeMaterial);
const mockedDismiss = vi.mocked(dismissMaterialReport);
const mockedToast = vi.mocked(toast);

function backendError(message: string) {
  return { isAxiosError: true, response: { data: { message } } };
}

function setup() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const invalidateSpy = vi.spyOn(client, "invalidateQueries");
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );

  return { invalidateSpy, wrapper };
}

function expectMaterialReportInvalidations(
  invalidateSpy: ReturnType<typeof setup>["invalidateSpy"],
  materialId: string
) {
  expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: adminQueryKeys.materialReportsBase });
  expect(invalidateSpy).toHaveBeenCalledWith({
    queryKey: adminQueryKeys.materialReports.detail(materialId),
  });
  expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: adminQueryKeys.dashboardBase });
}

describe("hooks de resolución de denuncias", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("toma la solicitud e invalida lista, detalle y dashboard", async () => {
    mockedAssign.mockResolvedValue(undefined);
    const { invalidateSpy, wrapper } = setup();
    const { result } = renderHook(() => useAssignMaterialReport("mat-1"), { wrapper });

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedAssign).toHaveBeenCalledWith("mat-1");
    expect(mockedToast.success).toHaveBeenCalled();
    expectMaterialReportInvalidations(invalidateSpy, "mat-1");
  });

  it("avisa el 409 y refresca el estado real cuando otro admin tomó la solicitud", async () => {
    mockedAssign.mockRejectedValue(
      backendError("La solicitud ya fue tomada por otro administrador.")
    );
    const { invalidateSpy, wrapper } = setup();
    const { result } = renderHook(() => useAssignMaterialReport("mat-1"), { wrapper });

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mockedToast.error).toHaveBeenCalledWith(
      "La solicitud ya fue tomada por otro administrador."
    );
    await waitFor(() => expectMaterialReportInvalidations(invalidateSpy, "mat-1"));
  });

  it("da de baja el material e invalida las claves del admin", async () => {
    mockedRemove.mockResolvedValue(undefined);
    const { invalidateSpy, wrapper } = setup();
    const { result } = renderHook(() => useRemoveMaterial("mat-1"), { wrapper });

    act(() => {
      result.current.mutate({ reason: "Duplicado" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedRemove).toHaveBeenCalledWith("mat-1", { reason: "Duplicado" });
    expect(mockedToast.success).toHaveBeenCalled();
    expectMaterialReportInvalidations(invalidateSpy, "mat-1");
  });

  it("desestima la denuncia y muestra el error del backend", async () => {
    mockedDismiss.mockRejectedValue(backendError("La denuncia ya fue resuelta"));
    const { wrapper } = setup();
    const { result } = renderHook(() => useDismissMaterialReport("mat-1"), { wrapper });

    act(() => {
      result.current.mutate({ note: "Sin infracción" });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mockedDismiss).toHaveBeenCalledWith("mat-1", { note: "Sin infracción" });
    expect(mockedToast.error).toHaveBeenCalledWith("La denuncia ya fue resuelta");
  });
});
