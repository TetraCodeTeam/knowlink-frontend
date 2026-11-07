import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, useLocation } from "react-router-dom";
import { toast } from "@/shared/lib/toast";
import { deactivateMyAccount, deleteMyAccount } from "@/modules/users/api/users.api";
import AccountManagementSection from "@/modules/users/components/AccountManagementSection";
import { ACCOUNT_DELETED_MESSAGE, ACTIVE_BOOKINGS_BLOCK_MESSAGE } from "@/modules/users/constants";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";

vi.mock("@/modules/users/api/users.api", () => ({
  deactivateMyAccount: vi.fn(),
  deleteMyAccount: vi.fn(),
}));

vi.mock("@/shared/lib/toast", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() },
}));

const mockedDeactivate = vi.mocked(deactivateMyAccount);
const mockedDelete = vi.mocked(deleteMyAccount);
const mockedToast = vi.mocked(toast);

const PASSWORD = "Password123!";
const WRONG_PASSWORD = "La contraseña es incorrecta";

function LocationDisplay() {
  const location = useLocation();
  return <span data-testid="location">{location.pathname}</span>;
}

function renderSection() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const logoutSpy = vi.fn();
  useAuthStore.setState({ logout: logoutSpy });

  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/student/profile"]}>
        <AccountManagementSection classesPath="/student/classes" />
        <LocationDisplay />
      </MemoryRouter>
    </QueryClientProvider>
  );

  return { logoutSpy };
}

function openDeactivateDialog() {
  fireEvent.click(screen.getByRole("button", { name: "Desactivar cuenta" }));
  return screen.getByRole("dialog");
}

function openDeleteDialog() {
  fireEvent.click(screen.getByRole("button", { name: "Eliminar cuenta" }));
  return screen.getByRole("dialog");
}

function confirmDeactivation() {
  fireEvent.click(
    within(screen.getByRole("dialog")).getByRole("button", { name: "Desactivar cuenta" })
  );
}

function fillDeleteForm({ password = PASSWORD, check = true } = {}) {
  if (check) {
    fireEvent.click(within(screen.getByRole("dialog")).getByRole("checkbox"));
  }
  if (password) {
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: password } });
  }
}

function submitDelete() {
  fireEvent.click(
    within(screen.getByRole("dialog")).getByRole("button", { name: "Eliminar definitivamente" })
  );
}

function cancelDialog() {
  fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Cancelar" }));
}

function bookingsConflict() {
  return {
    isAxiosError: true,
    response: {
      status: 409,
      data: {
        status: 409,
        message: ACTIVE_BOOKINGS_BLOCK_MESSAGE,
        detail: "ACCOUNT_HAS_ACTIVE_BOOKINGS",
      },
    },
  };
}

describe("AccountManagementSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("abre la confirmación de desactivación sin llamar a la API", () => {
    renderSection();

    openDeactivateDialog();

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(mockedDeactivate).not.toHaveBeenCalled();
  });

  it("Cancelar cierra la confirmación de desactivación sin llamar a la API", async () => {
    renderSection();

    openDeactivateDialog();
    cancelDialog();

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(mockedDeactivate).not.toHaveBeenCalled();
  });

  it("confirmar la desactivación llama a la API una sola vez", async () => {
    mockedDeactivate.mockResolvedValue(undefined);
    renderSection();

    openDeactivateDialog();
    confirmDeactivation();

    await waitFor(() => expect(mockedDeactivate).toHaveBeenCalledTimes(1));
  });

  it("ante un 409 por reservas activas muestra el mensaje exacto y navega a mis clases", async () => {
    mockedDeactivate.mockRejectedValue(bookingsConflict());
    const { logoutSpy } = renderSection();

    openDeactivateDialog();
    confirmDeactivation();

    expect(await screen.findByText(ACTIVE_BOOKINGS_BLOCK_MESSAGE)).toBeInTheDocument();
    expect(logoutSpy).not.toHaveBeenCalled();
    expect(mockedToast.error).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Ir a mis clases" }));

    expect(screen.getByTestId("location")).toHaveTextContent("/student/classes");
  });

  it("abre el diálogo de eliminación sin llamar a la API", () => {
    renderSection();

    openDeleteDialog();

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(mockedDelete).not.toHaveBeenCalled();
  });

  it("Cancelar no elimina la cuenta y al reabrir el formulario queda limpio", async () => {
    mockedDelete.mockRejectedValue(bookingsConflict());
    renderSection();

    openDeleteDialog();
    fillDeleteForm();
    submitDelete();

    expect(await screen.findByText(ACTIVE_BOOKINGS_BLOCK_MESSAGE)).toBeInTheDocument();

    cancelDialog();
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());

    openDeleteDialog();

    expect(screen.getByLabelText("Contraseña")).toHaveValue("");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(mockedDelete).toHaveBeenCalledTimes(1);
  });

  it("confirmar el borrado llama a la API, limpia la sesión, navega al login y avisa", async () => {
    mockedDelete.mockResolvedValue(undefined);
    const { logoutSpy } = renderSection();

    openDeleteDialog();
    fillDeleteForm();
    submitDelete();

    await waitFor(() => expect(mockedDelete).toHaveBeenCalledTimes(1));
    expect(mockedDelete.mock.calls[0][0]).toBe(PASSWORD);
    expect(logoutSpy).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.getByTestId("location")).toHaveTextContent("/auth/login"));
    expect(mockedToast.success).toHaveBeenCalledWith(ACCOUNT_DELETED_MESSAGE);
  });

  it("ante un 409 por reservas activas muestra el mensaje, no desloguea y deja el diálogo abierto", async () => {
    mockedDelete.mockRejectedValue(bookingsConflict());
    const { logoutSpy } = renderSection();

    openDeleteDialog();
    fillDeleteForm();
    submitDelete();

    expect(await screen.findByText(ACTIVE_BOOKINGS_BLOCK_MESSAGE)).toBeInTheDocument();
    expect(logoutSpy).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(mockedToast.error).not.toHaveBeenCalled();
  });

  it("ante un 401 muestra el error en el campo y no cierra la sesión", async () => {
    mockedDelete.mockRejectedValue({
      isAxiosError: true,
      response: { status: 401, data: { status: 401, message: "Invalid credentials" } },
    });
    const { logoutSpy } = renderSection();

    openDeleteDialog();
    fillDeleteForm();
    submitDelete();

    expect(await screen.findByText(WRONG_PASSWORD)).toBeInTheDocument();
    expect(logoutSpy).not.toHaveBeenCalled();
    expect(screen.getByTestId("location")).toHaveTextContent("/student/profile");
  });

  it("con la mutación en curso deshabilita el botón de confirmar", async () => {
    mockedDelete.mockReturnValue(new Promise<void>(() => {}));
    renderSection();

    openDeleteDialog();
    fillDeleteForm();
    submitDelete();

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Eliminar definitivamente" })).toBeDisabled()
    );
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeDisabled();
  });
});
