import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteMaterial } from "@/modules/tutor/materials/api/materials.api";
import { useDeleteMaterial } from "@/modules/tutor/materials/hooks/useDeleteMaterial";
import { makeMaterial } from "./fixtures";

vi.mock("@/modules/tutor/materials/api/materials.api", () => ({
  getMaterialsBySubject: vi.fn(),
  uploadMaterial: vi.fn(),
  deleteMaterial: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const mockedDelete = vi.mocked(deleteMaterial);
const mockedToast = vi.mocked(toast);

function apiError(status: number) {
  return { isAxiosError: true, response: { status, data: { status, message: "", detail: "" } } };
}

function setup() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const invalidateSpy = vi.spyOn(client, "invalidateQueries");
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );

  return { invalidateSpy, wrapper };
}

describe("useDeleteMaterial", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("elimina el material, muestra el toast y refresca el listado", async () => {
    mockedDelete.mockResolvedValue(undefined);
    const { invalidateSpy, wrapper } = setup();
    const { result } = renderHook(() => useDeleteMaterial(), { wrapper });

    await act(async () => {
      await result.current.deleteMaterial(makeMaterial().id);
    });

    expect(mockedDelete).toHaveBeenCalledWith("mat-1");
    expect(mockedToast.success).toHaveBeenCalledWith("Material eliminado correctamente.");
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["materials"] });
  });

  it("invalida el listado ante un 404 sin duplicar el toast de error", async () => {
    mockedDelete.mockRejectedValue(apiError(404));
    const { invalidateSpy, wrapper } = setup();
    const { result } = renderHook(() => useDeleteMaterial(), { wrapper });

    await act(async () => {
      await expect(result.current.deleteMaterial("mat-1")).rejects.toBeTruthy();
    });

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["materials"] });
    expect(mockedToast.error).not.toHaveBeenCalled();
  });

  it("invalida el listado ante un 409 sin duplicar el toast de error", async () => {
    mockedDelete.mockRejectedValue(apiError(409));
    const { invalidateSpy, wrapper } = setup();
    const { result } = renderHook(() => useDeleteMaterial(), { wrapper });

    await act(async () => {
      await expect(result.current.deleteMaterial("mat-1")).rejects.toBeTruthy();
    });

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["materials"] });
    expect(mockedToast.error).not.toHaveBeenCalled();
  });

  it("no invalida el listado ante un 502 y deja el error al interceptor", async () => {
    mockedDelete.mockRejectedValue(apiError(502));
    const { invalidateSpy, wrapper } = setup();
    const { result } = renderHook(() => useDeleteMaterial(), { wrapper });

    await act(async () => {
      await expect(result.current.deleteMaterial("mat-1")).rejects.toBeTruthy();
    });

    expect(invalidateSpy).not.toHaveBeenCalled();
    expect(mockedToast.error).not.toHaveBeenCalled();
  });
});
