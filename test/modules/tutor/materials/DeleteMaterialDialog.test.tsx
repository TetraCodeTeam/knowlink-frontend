import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { deleteMaterial } from "@/modules/tutor/materials/api/materials.api";
import DeleteMaterialDialog from "@/modules/tutor/materials/components/DeleteMaterialDialog";
import { makeMaterial } from "./fixtures";

vi.mock("@/modules/tutor/materials/api/materials.api", () => ({
  getMaterialsBySubject: vi.fn(),
  uploadMaterial: vi.fn(),
  deleteMaterial: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const mockedDelete = vi.mocked(deleteMaterial);

function apiError(status: number) {
  return { isAxiosError: true, response: { status, data: { status, message: "", detail: "" } } };
}

function renderDialog(material = makeMaterial()) {
  const onClose = vi.fn();
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const invalidateSpy = vi.spyOn(client, "invalidateQueries");

  render(
    <QueryClientProvider client={client}>
      <DeleteMaterialDialog material={material} open onClose={onClose} />
    </QueryClientProvider>
  );

  return { onClose, invalidateSpy };
}

describe("DeleteMaterialDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra el nombre del material con su extensión en el mensaje", () => {
    renderDialog();

    expect(
      screen.getByText(
        "¿Estás seguro de que querés eliminar permanentemente Resumen Unidad 3 - Derivadas.pdf?"
      )
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Eliminar" })).toBeInTheDocument();
  });

  it("cancelar cierra el diálogo sin llamar a la API", () => {
    const { onClose } = renderDialog();

    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(mockedDelete).not.toHaveBeenCalled();
  });

  it("confirmar elimina el material y cierra el diálogo", async () => {
    mockedDelete.mockResolvedValue(undefined);
    const { onClose } = renderDialog();

    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));

    await waitFor(() => expect(mockedDelete).toHaveBeenCalledWith("mat-1"));
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it("deshabilita ambos botones mientras la request está en curso", async () => {
    mockedDelete.mockReturnValue(new Promise(() => {}));
    renderDialog();

    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));

    await waitFor(() => expect(screen.getByRole("button", { name: "Eliminar" })).toBeDisabled());
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeDisabled();
  });

  it("ante un 409 cierra el diálogo y refresca el listado", async () => {
    mockedDelete.mockRejectedValue(apiError(409));
    const { onClose, invalidateSpy } = renderDialog();

    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["materials"] });
  });

  it("ante un 502 deja el diálogo abierto para reintentar", async () => {
    mockedDelete.mockRejectedValue(apiError(502));
    const { onClose } = renderDialog();

    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Eliminar" })).not.toBeDisabled()
    );
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
