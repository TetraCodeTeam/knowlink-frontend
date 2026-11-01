import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, useLocation } from "react-router-dom";
import AdminMaterialReportsPage from "@/modules/admin/material-reports/pages/AdminMaterialReportsPage";
import {
  getMaterialReportDetail,
  getMaterialReports,
} from "@/modules/admin/material-reports/api/admin-material-reports.api";
import {
  makeMaterialReportDetail,
  makeMaterialReportListItem,
  makeMaterialReportListResponse,
} from "./fixtures";

vi.mock("@/modules/admin/material-reports/api/admin-material-reports.api", () => ({
  getMaterialReports: vi.fn(),
  getMaterialReportDetail: vi.fn(),
  assignMaterialReport: vi.fn(),
  removeMaterial: vi.fn(),
  dismissMaterialReport: vi.fn(),
}));

const mockedList = vi.mocked(getMaterialReports);
const mockedDetail = vi.mocked(getMaterialReportDetail);

function LocationDisplay() {
  const location = useLocation();
  return <span data-testid="location">{location.pathname + location.search}</span>;
}

function renderPage(entry = "/admin/material-reports") {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[entry]}>
        <AdminMaterialReportsPage />
        <LocationDisplay />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

const FOUR_FILES = makeMaterialReportListResponse({
  content: Array.from({ length: 4 }, (_, index) =>
    makeMaterialReportListItem({
      materialId: `mat-${index + 1}`,
      fileName: `Archivo ${index + 1}.pdf`,
    })
  ),
  totalElements: 14,
});

describe("AdminMaterialReportsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedList.mockResolvedValue(FOUR_FILES);
    mockedDetail.mockResolvedValue(makeMaterialReportDetail());
  });

  it("muestra la cabecera, los filtros y el listado paginado", async () => {
    renderPage();

    expect(
      screen.getByRole("heading", { level: 1, name: "Denuncias de material" })
    ).toBeInTheDocument();
    expect(screen.getByText(/Revisá, auditá y resolvé reportes/)).toBeInTheDocument();
    expect(await screen.findByText("Archivo 1.pdf")).toBeInTheDocument();
    expect(screen.getByText("Mostrando 1–4 de 14 archivos")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Página 1" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(screen.getByRole("heading", { name: "Seleccioná un material" })).toBeInTheDocument();
    expect(mockedList).toHaveBeenCalledWith({
      status: "ALL",
      scope: "all",
      page: 1,
      size: 4,
    });
  });

  it("sincroniza el filtro de estado con la URL y la consulta", async () => {
    renderPage();

    await screen.findByText("Archivo 1.pdf");
    fireEvent.click(screen.getByRole("button", { name: /Pendiente/ }));

    await waitFor(() => {
      expect(screen.getByTestId("location")).toHaveTextContent(
        "/admin/material-reports?status=PENDING"
      );
    });
    expect(screen.getByRole("button", { name: /Pendiente/ })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    await waitFor(() => {
      expect(mockedList).toHaveBeenLastCalledWith({
        status: "PENDING",
        scope: "all",
        page: 1,
        size: 4,
      });
    });
  });

  it("sincroniza el filtro de asignación con la URL", async () => {
    renderPage();

    await screen.findByText("Archivo 1.pdf");
    fireEvent.click(screen.getByRole("button", { name: "Asignadas a mí" }));

    await waitFor(() => {
      expect(screen.getByTestId("location")).toHaveTextContent("scope=mine");
    });
    await waitFor(() => {
      expect(mockedList).toHaveBeenLastCalledWith({
        status: "ALL",
        scope: "mine",
        page: 1,
        size: 4,
      });
    });
  });

  it("cambia de página y lo refleja en la URL", async () => {
    renderPage();

    await screen.findByText("Archivo 1.pdf");
    fireEvent.click(screen.getByRole("button", { name: "Página 2" }));

    await waitFor(() => {
      expect(screen.getByTestId("location")).toHaveTextContent("page=2");
    });
    await waitFor(() => {
      expect(mockedList).toHaveBeenLastCalledWith({
        status: "ALL",
        scope: "all",
        page: 2,
        size: 4,
      });
    });
  });

  it("abre el detalle y guarda la selección en la URL", async () => {
    mockedDetail.mockResolvedValue(makeMaterialReportDetail({ materialId: "mat-1" }));
    renderPage();

    await screen.findByText("Archivo 1.pdf");
    const firstRow = screen.getByRole("listitem", { name: "Archivo 1.pdf" });
    fireEvent.click(within(firstRow).getByRole("button", { name: "Revisar denuncias" }));

    await waitFor(() => {
      expect(screen.getByTestId("location")).toHaveTextContent("selected=mat-1");
    });
    expect(
      await screen.findByRole("heading", { name: "Detalle de la denuncia" })
    ).toBeInTheDocument();
    expect(mockedDetail).toHaveBeenCalledWith("mat-1");
  });

  it("carga el detalle de un deep link", async () => {
    mockedDetail.mockResolvedValue(makeMaterialReportDetail({ materialId: "mat-9" }));
    renderPage("/admin/material-reports?selected=mat-9");

    expect(
      await screen.findByRole("heading", { name: "Detalle de la denuncia" })
    ).toBeInTheDocument();
    expect(mockedDetail).toHaveBeenCalledWith("mat-9");
  });

  it("muestra el estado vacío cuando no hay denuncias", async () => {
    mockedList.mockResolvedValue(makeMaterialReportListResponse({ content: [], totalElements: 0 }));
    renderPage();

    expect(
      await screen.findByText(/No hay denuncias de material para mostrar/)
    ).toBeInTheDocument();
  });

  it("muestra el error del listado con reintento", async () => {
    mockedList.mockRejectedValue(new Error("network"));
    renderPage();

    expect(
      await screen.findByText("No pudimos cargar las denuncias", {}, { timeout: 5000 })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reintentar" })).toBeInTheDocument();
  });
});
