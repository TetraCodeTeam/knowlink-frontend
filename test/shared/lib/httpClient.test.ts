import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";

vi.mock("@/shared/lib/toast", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() },
}));

import { toast } from "@/shared/lib/toast";
import { httpClient } from "@/shared/lib/httpClient";
import { queryClient } from "@/shared/lib/queryClient";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";

const originalAdapter = httpClient.defaults.adapter;

function axiosError(status: number, data: Record<string, unknown> = {}): AxiosError {
  const response = {
    status,
    statusText: "",
    headers: {},
    config: {} as InternalAxiosRequestConfig,
    data,
  } as AxiosResponse;

  return new AxiosError("request failed", "ERR_BAD_RESPONSE", undefined, undefined, response);
}

function rejectWith(error: unknown) {
  httpClient.defaults.adapter = () => Promise.reject(error);
}

function futureToken(): string {
  const payload = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 }));
  return `header.${payload}.signature`;
}

beforeEach(() => {
  vi.clearAllMocks();
  useAuthStore.setState({ isAuthenticated: false, authResponse: undefined });
});

afterEach(() => {
  httpClient.defaults.adapter = originalAdapter;
  vi.restoreAllMocks();
});

describe("httpClient ante un 423 RATING_REQUIRED", () => {
  it("invalida las calificaciones pendientes sin mostrar snackbar", async () => {
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    rejectWith(axiosError(423, { status: 423, message: "", detail: "RATING_REQUIRED" }));

    await expect(httpClient.get("/api/v1/bookings/b-1")).rejects.toBeTruthy();

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["ratingGate", "pending"] });
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("sigue mostrando el snackbar con otros errores", async () => {
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    rejectWith(axiosError(500, { status: 500, message: "Falla del servidor" }));

    await expect(httpClient.get("/api/v1/bookings/b-1")).rejects.toBeTruthy();

    expect(toast.error).toHaveBeenCalledWith("Falla del servidor");
    expect(invalidateSpy).not.toHaveBeenCalled();
  });

  it("desloguea al usuario ante un 401", async () => {
    useAuthStore.setState({
      isAuthenticated: true,
      authResponse: {
        userId: "u-1",
        email: "alumno@test.com",
        fullName: null,
        token: futureToken(),
        role: "STUDENT",
      },
    });
    rejectWith(axiosError(401, { status: 401, message: "No autorizado" }));

    await expect(httpClient.get("/api/v1/bookings/b-1")).rejects.toBeTruthy();

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
