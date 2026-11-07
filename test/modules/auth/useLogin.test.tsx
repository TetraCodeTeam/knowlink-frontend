import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, useLocation } from "react-router-dom";
import { useLogin } from "@/modules/auth/hooks/useLogin";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import { useReactivationStore } from "@/modules/auth/hooks/useReactivationStore";
import { loginUser } from "@/modules/auth/api/auth.api";
import { ACCOUNT_DEACTIVATED_CODE } from "@/modules/auth/constants";
import type { AuthRole } from "@/shared/types/role.type";
import { toast } from "sonner";

vi.mock("@/modules/auth/api/auth.api", () => ({
  loginUser: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() },
}));

const CREDENTIALS = { email: "user@test.com", password: "password123" };

function LocationDisplay() {
  const location = useLocation();
  return <span data-testid="location">{location.pathname}</span>;
}

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/auth/login"]}>
          {children}
          <LocationDisplay />
        </MemoryRouter>
      </QueryClientProvider>
    );
  };
}

async function loginAs(role: AuthRole) {
  vi.mocked(loginUser).mockResolvedValueOnce({
    userId: "u-1",
    email: "user@test.com",
    fullName: "Test User",
    token: "token",
    role,
  });

  const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });

  await act(async () => {
    result.current.mutate(CREDENTIALS);
  });

  await waitFor(() => {
    expect(screen.getByTestId("location")).not.toHaveTextContent("/auth/login");
  });

  return screen.getByTestId("location").textContent;
}

async function rejectLogin(error: unknown) {
  vi.mocked(loginUser).mockRejectedValueOnce(error);

  const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });

  await act(async () => {
    result.current.mutate(CREDENTIALS);
  });
}

describe("useLogin - destino por rol", () => {
  beforeEach(() => {
    useAuthStore.setState({ isAuthenticated: false, authResponse: undefined });
    useReactivationStore.setState({ pendingCredentials: undefined });
    vi.clearAllMocks();
  });

  it("navega a /admin/home cuando el rol es ADMIN", async () => {
    expect(await loginAs("ADMIN")).toBe("/admin/home");
  });

  it("navega a /student/home cuando el rol es STUDENT", async () => {
    expect(await loginAs("STUDENT")).toBe("/student/home");
  });

  it("navega a /tutor/home cuando el rol es TUTOR", async () => {
    expect(await loginAs("TUTOR")).toBe("/tutor/home");
  });

  it("CP-001.01 - una cuenta desactivada navega a reactivar sin mostrar toast de error", async () => {
    const message = "Tu cuenta está desactivada. Podés reactivarla para volver a usar KnowLink.";
    await rejectLogin({
      isAxiosError: true,
      response: {
        status: 403,
        data: { status: 403, message, detail: ACCOUNT_DEACTIVATED_CODE },
      },
    });

    await waitFor(() =>
      expect(screen.getByTestId("location")).toHaveTextContent("/auth/reactivate")
    );
    expect(useReactivationStore.getState().pendingCredentials).toEqual(CREDENTIALS);
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("CP-001.02 - un 401 muestra el mensaje del backend y permanece en el login", async () => {
    const message = "Credenciales incorrectas";
    await rejectLogin({
      isAxiosError: true,
      response: { status: 401, data: { status: 401, message } },
    });

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith(message));
    expect(screen.getByTestId("location")).toHaveTextContent("/auth/login");
    expect(useReactivationStore.getState().pendingCredentials).toBeUndefined();
  });

  it("CP-001.02 - otros errores conservan el toast y no navegan", async () => {
    const message = "Ocurrió un error inesperado";
    await rejectLogin({
      isAxiosError: true,
      response: { status: 500, data: { status: 500, message } },
    });

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith(message));
    expect(screen.getByTestId("location")).toHaveTextContent("/auth/login");
  });

  it("CP-001.02 - un 403 sin ACCOUNT_DEACTIVATED conserva el comportamiento de error", async () => {
    const message = "No estás autorizado para acceder a este recurso.";
    await rejectLogin({
      isAxiosError: true,
      response: { status: 403, data: { status: 403, message, detail: "FORBIDDEN" } },
    });

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith(message));
    expect(screen.getByTestId("location")).toHaveTextContent("/auth/login");
  });
});
