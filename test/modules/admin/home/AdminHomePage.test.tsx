import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import AdminHomePage from "@/modules/admin/home/pages/AdminHomePage";
import { getDashboardSummary } from "@/modules/admin/home/api/admin-home.api";
import type { DashboardSummaryResponse } from "@/modules/admin/home/interfaces/responses/dashboard-summary.response";

vi.mock("@/modules/admin/home/api/admin-home.api", () => ({
  getDashboardSummary: vi.fn(),
}));

const mockedGetSummary = vi.mocked(getDashboardSummary);

const SUMMARY: DashboardSummaryResponse = {
  sessionClaims: {
    resolvedThisWeek: 11,
    resolvedDeltaPct: 12,
    newThisWeek: 9,
    oldestPendingDays: 4,
  },
  materialReports: {
    resolvedThisWeek: 7,
    resolvedDeltaPct: -5,
    newThisWeek: 3,
    pendingFiles: 1,
    pendingReports: 6,
  },
  performance: {
    avgResolutionHours: 3.8,
    avgResolutionDeltaPct: 18,
    unresolvedPct: 8.2,
    unresolvedLevel: "UNDER_CONTROL",
    volumeSplit: { claimsPct: 58, reportsPct: 42 },
  },
};

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/admin/home"]}>
        <AdminHomePage />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("AdminHomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra el skeleton mientras carga", () => {
    mockedGetSummary.mockReturnValue(new Promise<DashboardSummaryResponse>(() => {}));

    renderPage();

    expect(screen.getByText("Cargando resumen de moderación")).toBeInTheDocument();
    expect(screen.queryByText("Reclamo de sesiones")).not.toBeInTheDocument();
    expect(mockedGetSummary).toHaveBeenCalledWith("WEEK");
  });

  it("muestra el saludo, las dos colas y el panel con la semana seleccionada", async () => {
    mockedGetSummary.mockResolvedValue(SUMMARY);

    renderPage();

    expect(screen.getByRole("heading", { level: 1, name: "Hola, Admin" })).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "Reclamo de sesiones" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Denuncias de material" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Rendimiento y Salud del Servicio" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Esta semana" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByText("3.8h")).toBeInTheDocument();
  });

  it("muestra el error con Reintentar y conserva el saludo", async () => {
    mockedGetSummary.mockRejectedValue(new Error("network"));

    renderPage();

    expect(
      await screen.findByText("No pudimos cargar el resumen", {}, { timeout: 5000 })
    ).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Hola, Admin" })).toBeInTheDocument();
    expect(screen.queryByText("Reclamo de sesiones")).not.toBeInTheDocument();
  });

  it("recupera el resumen al reintentar", async () => {
    mockedGetSummary.mockRejectedValue(new Error("network"));

    renderPage();

    await screen.findByText("No pudimos cargar el resumen", {}, { timeout: 5000 });

    mockedGetSummary.mockResolvedValue(SUMMARY);
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));

    expect(
      await screen.findByText("Reclamo de sesiones", {}, { timeout: 5000 })
    ).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("solicita range=MONTH al cambiar de rango", async () => {
    mockedGetSummary.mockResolvedValue(SUMMARY);

    renderPage();

    await screen.findByRole("heading", { name: "Reclamo de sesiones" });
    fireEvent.click(screen.getByRole("button", { name: "30 días" }));

    await waitFor(() => expect(mockedGetSummary).toHaveBeenCalledWith("MONTH"));
    expect(screen.getByRole("button", { name: "30 días" })).toHaveAttribute("aria-pressed", "true");
  });

  it("mantiene las tarjetas mientras llega el resumen del nuevo rango", async () => {
    mockedGetSummary.mockResolvedValueOnce(SUMMARY);

    renderPage();

    await screen.findByRole("heading", { name: "Reclamo de sesiones" });

    mockedGetSummary.mockReturnValueOnce(new Promise<DashboardSummaryResponse>(() => {}));
    fireEvent.click(screen.getByRole("button", { name: "30 días" }));

    await waitFor(() => expect(mockedGetSummary).toHaveBeenCalledWith("MONTH"));
    expect(screen.getByText("Reclamo de sesiones")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Denuncias de material" })).toBeInTheDocument();
  });
});
