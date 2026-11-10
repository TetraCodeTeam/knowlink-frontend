import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { httpClient } from "@/shared/lib/httpClient";
import MaterialPreviewDialog from "@/shared/material-preview/components/MaterialPreviewDialog";
import type { PreviewableMaterial } from "@/shared/material-preview/interfaces/previewable-material.interface";

const SIGNED_URL = "https://storage.example.com/archivo?token=abc";
const createdBlobs: Blob[] = [];

function renderDialog(material: PreviewableMaterial | null) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MaterialPreviewDialog open onClose={vi.fn()} material={material} />
    </QueryClientProvider>
  );
}

describe("MaterialPreviewDialog", () => {
  beforeEach(() => {
    createdBlobs.length = 0;
    URL.createObjectURL = ((blob: Blob) => {
      createdBlobs.push(blob);
      return "blob:mock-url";
    }) as unknown as typeof URL.createObjectURL;
    URL.revokeObjectURL = vi.fn() as unknown as typeof URL.revokeObjectURL;

    // El archivo se pide con axios plano a la URL firmada; el Bearer no viaja.
    vi.spyOn(httpClient, "get").mockResolvedValue({ data: SIGNED_URL } as never);
    vi.spyOn(axios, "get").mockResolvedValue({
      data: new Blob(["<html></html>"], { type: "text/html" }),
    } as never);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("muestra un PDF en un iframe usando una URL blob", async () => {
    renderDialog({ id: "m-1", title: "Resumen de Algebra", format: "PDF" });

    const iframe = await screen.findByTitle("Vista previa de Resumen de Algebra");
    expect(iframe).toHaveAttribute("src", "blob:mock-url");

    expect(httpClient.get).toHaveBeenCalledWith("/api/v1/materials/m-1/download");
    expect(axios.get).toHaveBeenCalledWith(
      SIGNED_URL,
      expect.objectContaining({ responseType: "blob" })
    );
    expect(createdBlobs).toHaveLength(1);
    expect(createdBlobs[0].type).toBe("application/pdf");
  });

  it("muestra una imagen PNG completa", async () => {
    renderDialog({ id: "m-2", title: "Diagrama de flujo", format: "PNG" });

    const image = await screen.findByAltText("Diagrama de flujo");
    expect(image).toHaveAttribute("src", "blob:mock-url");
    expect(createdBlobs[0].type).toBe("image/png");
  });

  it("formato sin vista previa ofrece descargar sin pedir el archivo", () => {
    renderDialog({ id: "m-3", title: "Notas del curso", format: "XLSX" });

    expect(
      screen.getByText("No hay vista previa disponible para este formato.")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Descargar" })).toBeInTheDocument();
    expect(httpClient.get).not.toHaveBeenCalled();
    expect(axios.get).not.toHaveBeenCalled();
    expect(createdBlobs).toHaveLength(0);
  });

  it("muestra un indicador mientras carga el archivo", () => {
    vi.mocked(httpClient.get).mockReturnValue(new Promise(() => {}) as never);

    renderDialog({ id: "m-4", title: "Tardio", format: "PDF" });

    expect(screen.getByRole("progressbar", { name: "Cargando vista previa" })).toBeInTheDocument();
  });

  it("muestra error con Reintentar si la descarga falla", async () => {
    vi.mocked(httpClient.get).mockRejectedValueOnce(new Error("fallo de red"));

    renderDialog({ id: "m-5", title: "Archivo roto", format: "PDF" });

    const user = userEvent.setup();
    const retry = await screen.findByRole("button", { name: "Reintentar" });
    await user.click(retry);

    await waitFor(() => expect(httpClient.get).toHaveBeenCalledTimes(2));
    await screen.findByTitle("Vista previa de Archivo roto");
  });

  it("revoca la URL blob al cerrar el dialogo", async () => {
    const { unmount } = renderDialog({ id: "m-6", title: "Se cierra", format: "PDF" });

    await screen.findByTitle("Vista previa de Se cierra");
    unmount();

    expect(vi.mocked(URL.revokeObjectURL)).toHaveBeenCalledWith("blob:mock-url");
  });

  it("descarga desde el visor bajando el blob en vez de abrirlo en otra pestana", async () => {
    renderDialog({ id: "m-7", title: "Para bajar", format: "PDF" });
    await screen.findByTitle("Vista previa de Para bajar");

    const openSpy = vi.spyOn(window, "open");
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    await userEvent.setup().click(screen.getByRole("button", { name: "Descargar" }));

    await waitFor(() => expect(clickSpy).toHaveBeenCalledTimes(1));
    expect(openSpy).not.toHaveBeenCalled();
    expect(httpClient.get).toHaveBeenCalledWith("/api/v1/materials/m-7/download");
    expect(axios.get).toHaveBeenCalledWith(
      SIGNED_URL,
      expect.objectContaining({ responseType: "blob" })
    );
    // El MIME lo fija el formato del material, no el Content-Type de la respuesta.
    expect(createdBlobs).toHaveLength(2);
    expect(createdBlobs[1].type).toBe("application/pdf");
    expect(vi.mocked(URL.revokeObjectURL)).toHaveBeenCalledWith("blob:mock-url");
  });
});
