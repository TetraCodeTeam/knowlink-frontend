import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import DismissReportDialog from "@/modules/admin/material-reports/components/DismissReportDialog";
import { dismissMaterialReport } from "@/modules/admin/material-reports/api/admin-material-reports.api";

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

const mockedDismiss = vi.mocked(dismissMaterialReport);
const mockedToast = vi.mocked(toast);

function backendError(message: string) {
  return { isAxiosError: true, response: { data: { message } } };
}

function renderDialog() {
  const onClose = vi.fn();
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  render(
    <QueryClientProvider client={client}>
      <DismissReportDialog materialId="mat-1" open onClose={onClose} />
    </QueryClientProvider>
  );

  return { onClose };
}

describe("DismissReportDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("valida el largo máximo de la nota", async () => {
    const { onClose } = renderDialog();

    fireEvent.change(screen.getByLabelText("Nota interna (opcional)"), {
      target: { value: "a".repeat(501) },
    });
    fireEvent.click(screen.getByRole("button", { name: "Desestimar" }));

    expect(
      await screen.findByText("La nota no puede superar los 500 caracteres")
    ).toBeInTheDocument();
    expect(mockedDismiss).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("envía la nota y cierra el diálogo", async () => {
    mockedDismiss.mockResolvedValue(undefined);
    const { onClose } = renderDialog();

    fireEvent.change(screen.getByLabelText("Nota interna (opcional)"), {
      target: { value: "El archivo es legítimo" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Desestimar" }));

    await waitFor(() => {
      expect(mockedDismiss).toHaveBeenCalledWith("mat-1", { note: "El archivo es legítimo" });
    });
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(mockedToast.success).toHaveBeenCalled();
  });

  it("mantiene el diálogo abierto y muestra el message del backend", async () => {
    mockedDismiss.mockRejectedValue(backendError("La denuncia ya fue resuelta"));
    const { onClose } = renderDialog();

    fireEvent.click(screen.getByRole("button", { name: "Desestimar" }));

    await waitFor(() => {
      expect(mockedToast.error).toHaveBeenCalledWith("La denuncia ya fue resuelta");
    });
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
