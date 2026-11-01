import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useResetPassword } from "@/modules/auth/hooks/useResetPassword";
import { resetPassword } from "@/modules/auth/api/auth.api";

vi.mock("@/modules/auth/api/auth.api", () => ({
  resetPassword: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

function LocationDisplay() {
  const location = useLocation();
  return <span data-testid="location">{location.pathname}</span>;
}

function Wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/auth/reset-password"]}>
        {children}
        <LocationDisplay />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

const payload = { token: "t-1", newPassword: "Nueva#123", confirmNewPassword: "Nueva#123" };

function axiosError(status: number, data: { message: string; detail?: string }) {
  return { response: { status, data: { status, ...data } } };
}

describe("useResetPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("CP-034.F7 - éxito: avisa y redirige al login", async () => {
    vi.mocked(resetPassword).mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useResetPassword(), { wrapper: Wrapper });

    await act(async () => {
      result.current.mutate(payload);
    });

    await waitFor(() => expect(screen.getByTestId("location")).toHaveTextContent("/auth/login"));
    expect(resetPassword).toHaveBeenCalledWith(payload);
    expect(toast.success).toHaveBeenCalledTimes(1);
  });

  it("CP-034.F8 - 422 RESET_LINK_INVALID: no muestra toast (la página muestra el panel) y no redirige", async () => {
    vi.mocked(resetPassword).mockRejectedValueOnce(
      axiosError(422, {
        message: "Este enlace ya no es válido. Solicitá uno nuevo",
        detail: "RESET_LINK_INVALID",
      })
    );
    const { result } = renderHook(() => useResetPassword(), { wrapper: Wrapper });

    await act(async () => {
      result.current.mutate(payload);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).not.toHaveBeenCalled();
    expect(screen.getByTestId("location")).toHaveTextContent("/auth/reset-password");
  });

  it("CP-034.F9 - otro error: muestra el mensaje del backend en un toast", async () => {
    vi.mocked(resetPassword).mockRejectedValueOnce(
      axiosError(400, { message: "Las contraseñas no coinciden", detail: "PASSWORDS_MISMATCH" })
    );
    const { result } = renderHook(() => useResetPassword(), { wrapper: Wrapper });

    await act(async () => {
      result.current.mutate(payload);
    });

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Las contraseñas no coinciden"));
  });
});
