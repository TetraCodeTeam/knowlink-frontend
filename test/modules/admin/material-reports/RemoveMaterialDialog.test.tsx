import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import RemoveMaterialDialog from "@/modules/admin/material-reports/components/RemoveMaterialDialog";
import { removeMaterial } from "@/modules/admin/material-reports/api/admin-material-reports.api";

vi.mock("@/modules/admin/material-reports/api/admin-material-reports.api", () => ({
  getMaterialReports: vi.fn(),
  getMaterialReportDetail: vi.fn(),
  assignMaterialReport: vi.fn(),
  removeMaterial: vi.fn(),
  dismissMaterialReport: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const mockedRemove = vi.mocked(removeMaterial);
const mockedToast = vi.mocked(toast);

function backendError(message: string) {
  return { isAxiosError: true, response: { data: { message } } };
}

function renderDialog() {
  const onClose = vi.fn();
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  render(
    <QueryClientProvider client={client}>
      <RemoveMaterialDialog materialId="mat-1" open onClose={onClose} />
    </QueryClientProvider>
  );

  return { onClose };
}

describe("RemoveMaterialDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("valida el largo máximo del motivo", async () => {
    const { onClose } = renderDialog();

    fireEvent.change(screen.getByLabelText("Motivo (opcional)"), {
      target: { value: "a".repeat(501) },
    });
    fireEvent.click(screen.getByRole("button", { name: "Dar de baja" }));

    expect(
      await screen.findByText("El motivo no puede superar los 500 caracteres")
    ).toBeInTheDocument();
    expect(mockedRemove).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("envía el motivo recortado y cierra el diálogo", async () => {
    mockedRemove.mockResolvedValue(undefined);
    const { onClose } = renderDialog();

    fireEvent.change(screen.getByLabelText("Motivo (opcional)"), {
      target: { value: "  Contenido duplicado  " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Dar de baja" }));

    await waitFor(() => {
      expect(mockedRemove).toHaveBeenCalledWith("mat-1", { reason: "Contenido duplicado" });
    });
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(mockedToast.success).toHaveBeenCalled();
  });

  it("mantiene el diálogo abierto y muestra el message del backend", async () => {
    mockedRemove.mockRejectedValue(backendError("No autorizado para dar de baja"));
    const { onClose } = renderDialog();

    fireEvent.click(screen.getByRole("button", { name: "Dar de baja" }));

    await waitFor(() => {
      expect(mockedToast.error).toHaveBeenCalledWith("No autorizado para dar de baja");
    });
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
