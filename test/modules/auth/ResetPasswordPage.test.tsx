import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import ResetPasswordPage from "@/modules/auth/pages/ResetPasswordPage";
import { resetPassword } from "@/modules/auth/api/auth.api";

vi.mock("@/modules/auth/api/auth.api", () => ({
  resetPassword: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const INVALID_LINK_MESSAGE = "Este enlace ya no es válido. Solicitá uno nuevo";

function LocationDisplay() {
  const location = useLocation();
  return <span data-testid="location">{location.pathname}</span>;
}

function renderPage(initialEntry: string) {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
          <Route path="/auth/login" element={<div>login</div>} />
          <Route path="/auth/forgot-password" element={<div>forgot</div>} />
        </Routes>
        <LocationDisplay />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

async function fillAndSubmit(newPassword: string, confirm: string) {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Nueva contraseña"), newPassword);
  await user.type(screen.getByLabelText("Confirmar nueva contraseña"), confirm);
  await user.click(screen.getByRole("button", { name: "Restablecer contraseña" }));
}

describe("ResetPasswordPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("CP-034.F13 - sin token en la URL: muestra el mensaje de enlace inválido y el botón para pedir otro", async () => {
    const user = userEvent.setup();
    renderPage("/auth/reset-password");

    expect(screen.getByText(INVALID_LINK_MESSAGE)).toBeInTheDocument();
    expect(screen.queryByLabelText("Nueva contraseña")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Solicitar nuevo enlace" }));
    expect(screen.getByTestId("location")).toHaveTextContent("/auth/forgot-password");
  });

  it("CP-034.F14 - contraseña débil: muestra el error y no llama a la API", async () => {
    renderPage("/auth/reset-password?token=abc");

    await fillAndSubmit("nueva#123", "nueva#123");

    expect(
      await screen.findByText("Usá mayúsculas, minúsculas y un carácter especial")
    ).toBeInTheDocument();
    expect(resetPassword).not.toHaveBeenCalled();
  });

  it("CP-034.F15 - contraseñas distintas: muestra el error y no llama a la API", async () => {
    renderPage("/auth/reset-password?token=abc");

    await fillAndSubmit("Nueva#123", "Nueva#124");

    expect(await screen.findByText("Las contraseñas no coinciden")).toBeInTheDocument();
    expect(resetPassword).not.toHaveBeenCalled();
  });

  it("CP-034.F16 - éxito: envía token + contraseñas y redirige al login (CA 5)", async () => {
    vi.mocked(resetPassword).mockResolvedValueOnce(undefined);
    renderPage("/auth/reset-password?token=abc-123");

    await fillAndSubmit("Nueva#123", "Nueva#123");

    await waitFor(() => expect(screen.getByTestId("location")).toHaveTextContent("/auth/login"));
    expect(resetPassword).toHaveBeenCalledWith({
      token: "abc-123",
      newPassword: "Nueva#123",
      confirmNewPassword: "Nueva#123",
    });
  });

  it("CP-034.F17 - 422 RESET_LINK_INVALID: reemplaza el formulario por el mensaje del CA 6", async () => {
    vi.mocked(resetPassword).mockRejectedValueOnce({
      response: {
        status: 422,
        data: { status: 422, message: INVALID_LINK_MESSAGE, detail: "RESET_LINK_INVALID" },
      },
    });
    renderPage("/auth/reset-password?token=usado");

    await fillAndSubmit("Nueva#123", "Nueva#123");

    expect(await screen.findByText(INVALID_LINK_MESSAGE)).toBeInTheDocument();
    expect(screen.queryByLabelText("Nueva contraseña")).not.toBeInTheDocument();
  });
});
