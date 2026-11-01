import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { toast } from "sonner";
import ForgotPasswordPage from "@/modules/auth/pages/ForgotPasswordPage";
import { requestPasswordReset } from "@/modules/auth/api/auth.api";

vi.mock("@/modules/auth/api/auth.api", () => ({
  requestPasswordReset: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/auth/forgot-password"]}>
        <ForgotPasswordPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("ForgotPasswordPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("CP-034.F10 - email inválido: muestra error y no llama a la API", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText("Correo electrónico"), "abc");
    await user.click(screen.getByRole("button", { name: "Enviar enlace" }));

    expect(await screen.findByText("El email no es válido")).toBeInTheDocument();
    expect(requestPasswordReset).not.toHaveBeenCalled();
  });

  it("CP-034.F11 - éxito: muestra el mensaje genérico exacto del CA 2", async () => {
    vi.mocked(requestPasswordReset).mockResolvedValueOnce(undefined);
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText("Correo electrónico"), "ana@test.com");
    await user.click(screen.getByRole("button", { name: "Enviar enlace" }));

    expect(
      await screen.findByText("Si el correo existe, recibirás un enlace de recuperación")
    ).toBeInTheDocument();
    expect(requestPasswordReset).toHaveBeenCalledWith("ana@test.com");
    expect(screen.getByRole("link", { name: "Volver al login" })).toHaveAttribute(
      "href",
      "/auth/login"
    );
  });

  it("CP-034.F12 - error de red: toast de error y NO muestra el mensaje de éxito", async () => {
    vi.mocked(requestPasswordReset).mockRejectedValueOnce(new Error("network"));
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText("Correo electrónico"), "ana@test.com");
    await user.click(screen.getByRole("button", { name: "Enviar enlace" }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(1));
    expect(
      screen.queryByText("Si el correo existe, recibirás un enlace de recuperación")
    ).not.toBeInTheDocument();
  });
});
