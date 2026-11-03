import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import ReactivateAccountPage from "@/modules/auth/pages/ReactivateAccountPage";
import { reactivateAccount } from "@/modules/auth/api/auth.api";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import { useReactivationStore } from "@/modules/auth/hooks/useReactivationStore";
import { ACCOUNT_REACTIVATED_MESSAGE } from "@/modules/auth/constants";
import type { AuthResponse } from "@/modules/auth/interfaces/responses/auth.interface";
import { toast } from "sonner";

vi.mock("@/modules/auth/api/auth.api", () => ({
  reactivateAccount: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const CREDENTIALS = { email: "user@test.com", password: "password123" };

const AUTH_RESPONSE: AuthResponse = {
  userId: "u-1",
  email: "user@test.com",
  fullName: "Test User",
  token: "token",
  role: "STUDENT",
};

function LocationDisplay() {
  const location = useLocation();
  return <span data-testid="location">{location.pathname}</span>;
}

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/auth/reactivate"]}>
        <Routes>
          <Route path="/auth/reactivate" element={<ReactivateAccountPage />} />
          <Route path="/auth/login" element={<div>login</div>} />
          <Route path="/student/profile" element={<div>student profile</div>} />
        </Routes>
        <LocationDisplay />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

function setPendingCredentials() {
  useReactivationStore.setState({ pendingCredentials: CREDENTIALS });
}

describe("ReactivateAccountPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ isAuthenticated: false, authResponse: undefined });
    useReactivationStore.setState({ pendingCredentials: undefined });
  });

  it("CP-001.03 - sin credenciales pendientes redirige al login", async () => {
    renderPage();

    await waitFor(() => expect(screen.getByTestId("location")).toHaveTextContent("/auth/login"));
    expect(screen.queryByRole("button", { name: "Reactivar cuenta" })).not.toBeInTheDocument();
  });

  it("CP-001.04 - muestra el título, el texto y los botones", () => {
    setPendingCredentials();
    renderPage();

    expect(screen.getByRole("heading", { name: "Tu cuenta está desactivada" })).toBeInTheDocument();
    expect(screen.getByText("¿Querés reactivarla?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reactivar cuenta" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
  });

  it("CP-001.05 - Cancelar no llama a la API, limpia credenciales y vuelve al login", async () => {
    const user = userEvent.setup();
    setPendingCredentials();
    renderPage();

    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(reactivateAccount).not.toHaveBeenCalled();
    expect(useReactivationStore.getState().pendingCredentials).toBeUndefined();
    expect(screen.getByTestId("location")).toHaveTextContent("/auth/login");
  });

  it("CP-001.06 - reactivar con éxito inicia sesión, navega al destino del rol y muestra el toast", async () => {
    const user = userEvent.setup();
    vi.mocked(reactivateAccount).mockResolvedValueOnce(AUTH_RESPONSE);
    setPendingCredentials();
    renderPage();

    await user.click(screen.getByRole("button", { name: "Reactivar cuenta" }));

    await waitFor(() =>
      expect(screen.getByTestId("location")).toHaveTextContent("/student/profile")
    );
    expect(reactivateAccount).toHaveBeenCalledWith(CREDENTIALS);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().authResponse).toEqual(AUTH_RESPONSE);
    expect(useReactivationStore.getState().pendingCredentials).toBeUndefined();
    expect(toast.success).toHaveBeenCalledWith(ACCOUNT_REACTIVATED_MESSAGE);
  });

  it("CP-001.07 - un 401 muestra el error, limpia credenciales y vuelve al login", async () => {
    const user = userEvent.setup();
    const message = "Credenciales incorrectas";
    vi.mocked(reactivateAccount).mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 401, data: { status: 401, message } },
    });
    setPendingCredentials();
    renderPage();

    await user.click(screen.getByRole("button", { name: "Reactivar cuenta" }));

    await waitFor(() => expect(screen.getByTestId("location")).toHaveTextContent("/auth/login"));
    expect(toast.error).toHaveBeenCalledWith(message);
    expect(useReactivationStore.getState().pendingCredentials).toBeUndefined();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it("CP-001.07 - otro error muestra el mensaje del backend y no navega", async () => {
    const user = userEvent.setup();
    const message = "No pudimos reactivar tu cuenta";
    vi.mocked(reactivateAccount).mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 500, data: { status: 500, message } },
    });
    setPendingCredentials();
    renderPage();

    await user.click(screen.getByRole("button", { name: "Reactivar cuenta" }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith(message));
    expect(screen.getByTestId("location")).toHaveTextContent("/auth/reactivate");
  });

  it("CP-001.08 - mientras la mutación está pendiente ambos botones quedan deshabilitados", async () => {
    const user = userEvent.setup();
    let resolveReactivation: (value: AuthResponse) => void = () => {};
    vi.mocked(reactivateAccount).mockReturnValueOnce(
      new Promise<AuthResponse>((resolve) => {
        resolveReactivation = resolve;
      })
    );
    setPendingCredentials();
    renderPage();

    await user.click(screen.getByRole("button", { name: "Reactivar cuenta" }));

    expect(await screen.findByRole("button", { name: "Reactivando..." })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeDisabled();

    await act(async () => {
      resolveReactivation(AUTH_RESPONSE);
    });
    await waitFor(() =>
      expect(screen.getByTestId("location")).toHaveTextContent("/student/profile")
    );
  });
});
