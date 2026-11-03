import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { deleteMyAccount } from "@/modules/users/api/users.api";
import { ACCOUNT_DELETED_MESSAGE, ACTIVE_BOOKINGS_BLOCK_MESSAGE } from "@/modules/users/constants";
import { useDeleteAccount } from "@/modules/users/hooks/useDeleteAccount";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";

vi.mock("@/modules/users/api/users.api", () => ({
  deleteMyAccount: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() },
}));

const mockedDelete = vi.mocked(deleteMyAccount);
const mockedToast = vi.mocked(toast);

const PASSWORD = "Password123!";

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

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/student/profile"]}>
        {children}
        <LocationDisplay />
      </MemoryRouter>
    </QueryClientProvider>
  );

  const { result } = renderHook(() => useDeleteAccount(), { wrapper });

  return { result, logoutSpy };
}

describe("useDeleteAccount", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("al eliminar limpia la sesión, navega al login y muestra un toast de éxito", async () => {
    mockedDelete.mockResolvedValue(undefined);
    const { result, logoutSpy } = setup();

    act(() => result.current.mutate(PASSWORD));

    await waitFor(() => expect(mockedToast.success).toHaveBeenCalledWith(ACCOUNT_DELETED_MESSAGE));
    expect(logoutSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("location")).toHaveTextContent("/auth/login");
    expect(mockedToast.error).not.toHaveBeenCalled();
  });

  it("ante un 401 expone el error de contraseña sin cerrar la sesión", async () => {
    mockedDelete.mockRejectedValue({
      isAxiosError: true,
      response: { status: 401, data: { status: 401, message: "Invalid credentials" } },
    });
    const { result, logoutSpy } = setup();

    act(() => result.current.mutate(PASSWORD));

    await waitFor(() => expect(result.current.passwordError).toBe("La contraseña es incorrecta"));
    expect(result.current.blockedMessage).toBeNull();
    expect(logoutSpy).not.toHaveBeenCalled();
    expect(screen.getByTestId("location")).toHaveTextContent("/student/profile");
  });

  it("ante un 409 por reservas activas expone el mensaje del backend sin desloguear", async () => {
    mockedDelete.mockRejectedValue({
      isAxiosError: true,
      response: {
        status: 409,
        data: {
          status: 409,
          message: ACTIVE_BOOKINGS_BLOCK_MESSAGE,
          detail: "ACCOUNT_HAS_ACTIVE_BOOKINGS",
        },
      },
    });
    const { result, logoutSpy } = setup();

    act(() => result.current.mutate(PASSWORD));

    await waitFor(() => expect(result.current.blockedMessage).toBe(ACTIVE_BOOKINGS_BLOCK_MESSAGE));
    expect(result.current.passwordError).toBeNull();
    expect(logoutSpy).not.toHaveBeenCalled();
  });

  it("ante un 409 por obligaciones pendientes expone el mensaje del backend", async () => {
    const backendMessage =
      "No podés dar de baja tu cuenta con pagos o reclamos pendientes de resolución.";
    mockedDelete.mockRejectedValue({
      isAxiosError: true,
      response: {
        status: 409,
        data: {
          status: 409,
          message: backendMessage,
          detail: "ACCOUNT_HAS_PENDING_OBLIGATIONS",
        },
      },
    });
    const { result } = setup();

    act(() => result.current.mutate(PASSWORD));

    await waitFor(() => expect(result.current.blockedMessage).toBe(backendMessage));
  });

  it("ante un 400 expone el mensaje de validación en el campo de contraseña", async () => {
    mockedDelete.mockRejectedValue({
      isAxiosError: true,
      response: {
        status: 400,
        data: { status: 400, message: "La contraseña es requerida", detail: "VALIDATION_ERROR" },
      },
    });
    const { result } = setup();

    act(() => result.current.mutate(""));

    await waitFor(() => expect(result.current.passwordError).toBe("La contraseña es requerida"));
    expect(result.current.blockedMessage).toBeNull();
  });
  it("ante un 403 muestra un toast y no desloguea", async () => {
    mockedDelete.mockRejectedValue({
      isAxiosError: true,
      response: { status: 403, data: { status: 403, message: "Forbidden" } },
    });
    const { result, logoutSpy } = setup();

    act(() => result.current.mutate(PASSWORD));

    await waitFor(() =>
      expect(mockedToast.error).toHaveBeenCalledWith("Esta cuenta no puede eliminarse desde acá.")
    );
    expect(logoutSpy).not.toHaveBeenCalled();
  });

  it("ante otro error muestra el mensaje del backend", async () => {
    mockedDelete.mockRejectedValue({
      isAxiosError: true,
      response: {
        status: 500,
        data: { status: 500, message: "No pudimos procesar la solicitud" },
      },
    });
    const { result, logoutSpy } = setup();

    act(() => result.current.mutate(PASSWORD));

    await waitFor(() =>
      expect(mockedToast.error).toHaveBeenCalledWith("No pudimos procesar la solicitud")
    );
    expect(logoutSpy).not.toHaveBeenCalled();
  });

  it("reset limpia el mensaje de bloqueo y el error de contraseña", async () => {
    mockedDelete.mockRejectedValue({
      isAxiosError: true,
      response: {
        status: 409,
        data: {
          status: 409,
          message: ACTIVE_BOOKINGS_BLOCK_MESSAGE,
          detail: "ACCOUNT_HAS_ACTIVE_BOOKINGS",
        },
      },
    });
    const { result } = setup();

    act(() => result.current.mutate(PASSWORD));
    await waitFor(() => expect(result.current.blockedMessage).toBe(ACTIVE_BOOKINGS_BLOCK_MESSAGE));

    act(() => result.current.reset());

    expect(result.current.blockedMessage).toBeNull();
    expect(result.current.passwordError).toBeNull();
  });
});
