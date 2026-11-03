import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { deleteMyAccount } from "@/modules/users/api/users.api";
import DeleteAccountDialog from "@/modules/users/components/DeleteAccountDialog";

vi.mock("@/modules/users/api/users.api", () => ({
  deleteMyAccount: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() },
}));

const mockedDelete = vi.mocked(deleteMyAccount);

const PASSWORD_REQUIRED = "La contraseña es requerida";

function renderDialog(onClose = vi.fn()) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <DeleteAccountDialog open onClose={onClose} />
      </MemoryRouter>
    </QueryClientProvider>
  );

  return { onClose };
}

function dialog() {
  return screen.getByRole("dialog");
}

function confirmButton() {
  return within(dialog()).getByRole("button", { name: "Eliminar definitivamente" });
}

function checkUnderstanding() {
  fireEvent.click(within(dialog()).getByRole("checkbox"));
}

describe("DeleteAccountDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("advierte que la acción es permanente y pide confirmación explícita", () => {
    renderDialog();

    expect(screen.getByText("¿Eliminar tu cuenta definitivamente?")).toBeInTheDocument();
    expect(screen.getByText(/Esta acción es permanente/)).toBeInTheDocument();
    expect(within(dialog()).getByRole("checkbox")).toBeInTheDocument();
  });

  it("sin tildar la confirmación explícita el botón queda deshabilitado", () => {
    renderDialog();

    expect(confirmButton()).toBeDisabled();
  });

  it("con la contraseña vacía muestra el error de validación y no llama a la API", async () => {
    renderDialog();

    checkUnderstanding();
    fireEvent.click(confirmButton());

    expect(await screen.findByText(PASSWORD_REQUIRED)).toBeInTheDocument();
    expect(mockedDelete).not.toHaveBeenCalled();
  });

  it("Cancelar cierra el diálogo sin eliminar la cuenta", () => {
    const { onClose } = renderDialog();

    checkUnderstanding();
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "Password123!" } });
    fireEvent.click(within(dialog()).getByRole("button", { name: "Cancelar" }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(mockedDelete).not.toHaveBeenCalled();
  });

  it("con la mutación en curso deshabilita ambos botones", async () => {
    mockedDelete.mockReturnValue(new Promise<void>(() => {}));
    renderDialog();

    checkUnderstanding();
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "Password123!" } });
    fireEvent.click(confirmButton());

    await waitFor(() => expect(confirmButton()).toBeDisabled());
    expect(within(dialog()).getByRole("button", { name: "Cancelar" })).toBeDisabled();
  });
});
