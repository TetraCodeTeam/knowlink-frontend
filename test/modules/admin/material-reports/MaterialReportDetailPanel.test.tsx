import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MaterialReportDetailPanel from "@/modules/admin/material-reports/components/MaterialReportDetailPanel";
import { getMaterialReportDetail } from "@/modules/admin/material-reports/api/admin-material-reports.api";
import { makeMaterialReportDetail } from "./fixtures";

vi.mock("@/modules/admin/material-reports/api/admin-material-reports.api", () => ({
  getMaterialReports: vi.fn(),
  getMaterialReportDetail: vi.fn(),
  assignMaterialReport: vi.fn(),
  removeMaterial: vi.fn(),
  dismissMaterialReport: vi.fn(),
}));

const mockedDetail = vi.mocked(getMaterialReportDetail);

function renderPanel(materialId: string | null) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  return render(
    <QueryClientProvider client={client}>
      <MaterialReportDetailPanel materialId={materialId} />
    </QueryClientProvider>
  );
}

describe("MaterialReportDetailPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("invita a seleccionar un material y muestra las pautas", () => {
    renderPanel(null);

    expect(screen.getByRole("heading", { name: "Seleccioná un material" })).toBeInTheDocument();
    expect(screen.getByText(/Elegí un archivo de la lista/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Antes de resolver" })).toBeInTheDocument();

    const pautas = screen.getAllByRole("listitem");
    expect(pautas).toHaveLength(3);
    expect(mockedDetail).not.toHaveBeenCalled();
  });

  it("muestra la revisión previa de un archivo sin asignar", async () => {
    mockedDetail.mockResolvedValue(makeMaterialReportDetail());

    renderPanel("mat-1");

    expect(
      await screen.findByRole("heading", { name: "Detalle de la denuncia" })
    ).toBeInTheDocument();
    expect(screen.getByText("Revisión previa a la asignación")).toBeInTheDocument();
    expect(screen.getByText("Sin asignar")).toBeInTheDocument();
    expect(screen.getByText("Juana Pérez")).toBeInTheDocument();
    expect(screen.getByText(/30\.123\.456/)).toBeInTheDocument();
    expect(screen.getByText("4 denuncias asociadas")).toBeInTheDocument();
    expect(screen.getByText("Plagio")).toBeInTheDocument();
    expect(screen.getByText("Sin comentario del denunciante")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tomar solicitud" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Dar de baja" })).not.toBeInTheDocument();
  });

  it("muestra las acciones cuando la solicitud está asignada a mi cuenta", async () => {
    mockedDetail.mockResolvedValue(
      makeMaterialReportDetail({
        status: "IN_REVIEW",
        assignedToName: "Moderador Carlos V.",
        assignedToMe: true,
      })
    );

    renderPanel("mat-1");

    expect(
      await screen.findByRole("heading", { name: "En revisión por Moderador Carlos V." })
    ).toBeInTheDocument();
    expect(screen.getByText("Asignada")).toBeInTheDocument();
    expect(screen.getByText("Agrupadas por recurso")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dar de baja" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Desestimar" })).toBeInTheDocument();
  });

  it("deja la solicitud en solo lectura si la tomó otro admin", async () => {
    mockedDetail.mockResolvedValue(
      makeMaterialReportDetail({
        status: "IN_REVIEW",
        assignedToName: "Moderador Carlos V.",
        assignedToMe: false,
      })
    );

    renderPanel("mat-1");

    expect(
      await screen.findByText("Solo el administrador asignado puede resolver esta solicitud.")
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Dar de baja" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Desestimar" })).not.toBeInTheDocument();
  });

  it("muestra la resolución cerrada sin acciones", async () => {
    mockedDetail.mockResolvedValue(
      makeMaterialReportDetail({
        status: "DISMISSED",
        resolutionNote: "El material no infringe derechos de autor.",
      })
    );

    renderPanel("mat-1");

    expect(await screen.findByText("Desestimado")).toBeInTheDocument();
    expect(screen.getByText("Justificación del moderador:")).toBeInTheDocument();
    expect(screen.getByText("El material no infringe derechos de autor.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Dar de baja" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Tomar solicitud" })).not.toBeInTheDocument();
  });

  it("muestra el error del detalle y permite reintentar", async () => {
    mockedDetail.mockRejectedValue(new Error("network"));

    renderPanel("mat-1");

    expect(
      await screen.findByText("No pudimos cargar la denuncia", {}, { timeout: 5000 })
    ).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reintentar" })).toBeInTheDocument();
  });
});
