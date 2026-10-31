import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, useLocation } from "react-router-dom";
import AdminSessionClaimsPage from "@/modules/admin/session-claims/pages/AdminSessionClaimsPage";
import {
  getSessionClaimDetail,
  getSessionClaims,
} from "@/modules/admin/session-claims/api/admin-session-claims.api";
import {
  makeSessionClaimDetail,
  makeSessionClaimListItem,
  makeSessionClaimListResponse,
} from "./fixtures";

vi.mock("@/modules/admin/session-claims/api/admin-session-claims.api", () => ({
  getSessionClaims: vi.fn(),
  getSessionClaimDetail: vi.fn(),
  assignSessionClaim: vi.fn(),
  getSessionClaimContactInfo: vi.fn(),
  resolveSessionClaim: vi.fn(),
}));

const mockedList = vi.mocked(getSessionClaims);
const mockedDetail = vi.mocked(getSessionClaimDetail);

function LocationDisplay() {
  const location = useLocation();
  return <span data-testid="location">{location.pathname + location.search}</span>;
}

function renderPage(entry = "/admin/session-claims") {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[entry]}>
        <AdminSessionClaimsPage />
        <LocationDisplay />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

const FOUR_CLAIMS = makeSessionClaimListResponse({
  content: Array.from({ length: 4 }, (_, index) =>
    makeSessionClaimListItem({
      claimId: `claim-${index + 1}`,
      subjectName: `Materia ${index + 1}`,
    })
  ),
  totalElements: 14,
});

describe("AdminSessionClaimsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedList.mockResolvedValue(FOUR_CLAIMS);
    mockedDetail.mockResolvedValue(makeSessionClaimDetail());
  });

  it("muestra la cabecera, el conteo, el listado paginado y el panel inicial", async () => {
    renderPage();

    expect(
      screen.getByRole("heading", { level: 1, name: "Reclamos de sesiones" })
    ).toBeInTheDocument();
    expect(screen.getByText(/Gestioná, auditá y mediá disputas/)).toBeInTheDocument();
    expect(await screen.findByText("Materia 1")).toBeInTheDocument();
    expect(screen.getByText(/Mostrando 1.4 de 14 reclamos/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Página 1" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(screen.getByRole("heading", { name: "Seleccioná un reclamo" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Pendiente/ })).toHaveTextContent("5");
    expect(mockedList).toHaveBeenCalledWith({
      status: "ALL",
      scope: "all",
      page: 1,
      size: 4,
    });
    expect(mockedDetail).not.toHaveBeenCalled();
  });

  it("sincroniza el filtro de estado con la URL y la consulta", async () => {
    renderPage();

    await screen.findByText("Materia 1");
    fireEvent.click(screen.getByRole("button", { name: /Pendiente/ }));

    await waitFor(() => {
      expect(screen.getByTestId("location")).toHaveTextContent(
        "/admin/session-claims?status=OPEN"
      );
    });
    expect(screen.getByRole("button", { name: /Pendiente/ })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    await waitFor(() => {
      expect(mockedList).toHaveBeenLastCalledWith({
        status: "OPEN",
        scope: "all",
        page: 1,
        size: 4,
      });
    });
  });

  it("sincroniza el filtro de asignación con la URL", async () => {
    renderPage();

    await screen.findByText("Materia 1");
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

    await screen.findByText("Materia 1");
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
    renderPage();

    await screen.findByText("Materia 1");
    const firstRow = screen.getByRole("listitem", { name: "Materia 1" });
    fireEvent.click(within(firstRow).getByRole("button", { name: "Revisar" }));

    await waitFor(() => {
      expect(screen.getByTestId("location")).toHaveTextContent("selected=claim-1");
    });
    expect(
      await screen.findByRole("heading", { name: "Detalle del reclamo" })
    ).toBeInTheDocument();
    expect(mockedDetail).toHaveBeenCalledWith("claim-1");
  });

  it("carga el detalle de un deep link", async () => {
    mockedDetail.mockResolvedValue(makeSessionClaimDetail({ claimId: "claim-9" }));

    renderPage("/admin/session-claims?selected=claim-9");

    expect(
      await screen.findByRole("heading", { name: "Detalle del reclamo" })
    ).toBeInTheDocument();
    expect(mockedDetail).toHaveBeenCalledWith("claim-9");
  });

  it("limpia la selección al cambiar de filtro", async () => {
    renderPage("/admin/session-claims?selected=claim-1");

    await screen.findByRole("heading", { name: "Detalle del reclamo" });
    fireEvent.click(screen.getByRole("button", { name: /Pendiente/ }));

    await waitFor(() => {
      expect(screen.getByTestId("location")).not.toHaveTextContent("selected=");
    });
  });

  it("muestra el estado vacío cuando no hay reclamos", async () => {
    mockedList.mockResolvedValue(
      makeSessionClaimListResponse({ content: [], totalElements: 0 })
    );

    renderPage();

    expect(
      await screen.findByText(/No hay reclamos para mostrar/)
    ).toBeInTheDocument();
  });

  it("muestra el error del listado con reintento", async () => {
    mockedList.mockRejectedValue(new Error("network"));

    renderPage();

    expect(
      await screen.findByText("No pudimos cargar los reclamos", {}, { timeout: 5000 })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reintentar" })).toBeInTheDocument();
  });
});