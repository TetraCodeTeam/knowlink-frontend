import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { deactivateMyAccount } from "@/modules/users/api/users.api";
import { ACCOUNT_NOT_ACTIVE } from "@/modules/users/constants";
import { useDeactivateAccount } from "@/modules/users/hooks/useDeactivateAccount";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";

vi.mock("@/modules/users/api/users.api", () => ({
  deactivateMyAccount: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() },
}));

const mockedDeactivate = vi.mocked(deactivateMyAccount);
const mockedToast = vi.mocked(toast);

function LocationDisplay() {
  const location = useLocation();
  return <span data-testid="location">{location.pathname}</span>;
}

function setup() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const logoutSpy = vi.fn();
  useAuthStore.setState({ logout: logoutSpy });
  const onBlockedByBookings = vi.fn();

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/student/profile"]}>
        {children}
        <LocationDisplay />
      </MemoryRouter>
    </QueryClientProvider>
  );

  const { result } = renderHook(() => useDeactivateAccount({ onBlockedByBookings }), {
    wrapper,
  });

  return { result, logoutSpy, onBlockedByBookings };
}

describe("useDeactivateAccount", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("al desactivar limpia la sesión, navega al login y muestra un toast de éxito", async () => {
    mockedDeactivate.mockResolvedValue(undefined);
    const { result, logoutSpy } = setup();

    act(() => result.current.mutate());

    await waitFor(() =>
      expect(mockedToast.success).toHaveBeenCalledWith(
        "Tu cuenta fue desactivada. Podés volver cuando quieras."
      )
    );
    expect(logoutSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("location")).toHaveTextContent("/auth/login");
    expect(mockedToast.error).not.toHaveBeenCalled();
  });

  it("ante un 401 limpia la sesión y navega al login sin toast de error", async () => {
    mockedDeactivate.mockRejectedValue({
      isAxiosError: true,
      response: { status: 401, data: { status: 401, message: "No autorizado" } },
    });
    const { result, logoutSpy } = setup();

    act(() => result.current.mutate());

    await waitFor(() => expect(logoutSpy).toHaveBeenCalledTimes(1));
    expect(screen.getByTestId("location")).toHaveTextContent("/auth/login");
    expect(mockedToast.error).not.toHaveBeenCalled();
  });

  it("ante ACCOUNT_NOT_ACTIVE limpia la sesión y navega al login", async () => {
    mockedDeactivate.mockRejectedValue({
      isAxiosError: true,
      response: {
        status: 409,
        data: { status: 409, message: "La cuenta ya no está activa", detail: ACCOUNT_NOT_ACTIVE },
      },
    });
    const { result, logoutSpy } = setup();

    act(() => result.current.mutate());

    await waitFor(() => expect(logoutSpy).toHaveBeenCalledTimes(1));
    expect(screen.getByTestId("location")).toHaveTextContent("/auth/login");
    expect(mockedToast.error).not.toHaveBeenCalled();
  });

  it("ante otro error muestra el mensaje del backend", async () => {
    mockedDeactivate.mockRejectedValue({
      isAxiosError: true,
      response: {
        status: 403,
        data: { status: 403, message: "No podés realizar esta acción" },
      },
    });
    const { result, logoutSpy } = setup();

    act(() => result.current.mutate());

    await waitFor(() =>
      expect(mockedToast.error).toHaveBeenCalledWith("No podés realizar esta acción")
    );
    expect(logoutSpy).not.toHaveBeenCalled();
  });
});
