import { beforeEach, describe, expect, it, vi } from "vitest";
import { AxiosError, type AxiosResponse } from "axios";

vi.mock("@/shared/lib/toast", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() },
}));

import { toast } from "@/shared/lib/toast";
import { queryClient } from "@/shared/lib/queryClient";

function axiosError(status: number, data: Record<string, unknown> = {}): AxiosError {
  const response = {
    status,
    statusText: "",
    headers: {},
    config: {} as never,
    data,
  } as AxiosResponse;

  return new AxiosError("request failed", "ERR_BAD_RESPONSE", undefined, undefined, response);
}

function getRetryOption() {
  return queryClient.getDefaultOptions().queries?.retry as (
    failureCount: number,
    error: unknown
  ) => boolean;
}

describe("queryClient y el bloqueo por calificacion", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("no reintenta un 423 RATING_REQUIRED", () => {
    const retry = getRetryOption();
    expect(retry(0, axiosError(423, { detail: "RATING_REQUIRED" }))).toBe(false);
  });

  it("reintenta una sola vez los errores comunes", () => {
    const retry = getRetryOption();
    expect(retry(0, axiosError(500))).toBe(true);
    expect(retry(1, axiosError(500))).toBe(false);
  });

  it("no muestra snackbar cuando el error es 423 RATING_REQUIRED", async () => {
    await expect(
      queryClient.fetchQuery({
        queryKey: ["test", "rating-required"],
        queryFn: () => Promise.reject(axiosError(423, { detail: "RATING_REQUIRED" })),
        retry: false,
      })
    ).rejects.toBeTruthy();

    expect(toast.error).not.toHaveBeenCalled();
  });

  it("respeta el meta silent de la consulta", async () => {
    await expect(
      queryClient.fetchQuery({
        queryKey: ["test", "silent"],
        queryFn: () => Promise.reject(axiosError(500, { message: "Falla" })),
        meta: { silent: true },
        retry: false,
      })
    ).rejects.toBeTruthy();

    expect(toast.error).not.toHaveBeenCalled();
  });

  it("muestra el mensaje del backend en errores comunes", async () => {
    await expect(
      queryClient.fetchQuery({
        queryKey: ["test", "generic"],
        queryFn: () => Promise.reject(axiosError(500, { message: "Falla del servidor" })),
        retry: false,
      })
    ).rejects.toBeTruthy();

    expect(toast.error).toHaveBeenCalledWith("Falla del servidor");
  });
});
