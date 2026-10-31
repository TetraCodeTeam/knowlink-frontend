import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SessionClaimDetailPanel from "@/modules/admin/session-claims/components/SessionClaimDetailPanel";
import {
  assignSessionClaim,
  getSessionClaimDetail,
} from "@/modules/admin/session-claims/api/admin-session-claims.api";
import { makeSessionClaimDetail } from "./fixtures";

vi.mock("@/modules/admin/session-claims/api/admin-session-claims.api", () => ({
  getSessionClaims: vi.fn(),
  getSessionClaimDetail: vi.fn(),
  assignSessionClaim: vi.fn(),
  getSessionClaimContactInfo: vi.fn(),
  resolveSessionClaim: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const mockedDetail = vi.mocked(getSessionClaimDetail);
const mockedAssign = vi.mocked(assignSessionClaim);

function renderPanel(claimId: string | null) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  return render(
    <QueryClientProvider client={client}>
      <SessionClaimDetailPanel claimId={claimId} />
    </QueryClientProvider>
  );
}

describe("SessionClaimDetailPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("invita a seleccionar un reclamo y muestra las pautas", () => {
    renderPanel(null);

    expect(screen.getByRole("heading", { name: "Seleccioná un reclamo" })).toBeInTheDocument();
    expect(screen.getByText(/Elegí un reclamo de la lista/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Antes de resolver" })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(mockedDetail).not.toHaveBeenCalled();
  });

  it("muestra el reclamo sin tomar con sus mensajes y sin formulario de resolución", async () => {
    mockedDetail.mockResolvedValue(makeSessionClaimDetail());

    renderPanel("claim-1");

    expect(
      await screen.findByRole("heading", { name: "Detalle del reclamo" })
    ).toBeInTheDocument();
    expect(screen.getByText("Revisión previa a la asignación")).toBeInTheDocument();
    expect(screen.getByText("Monto retenido")).toBeInTheDocument();
    expect(screen.getByText(/\$\s?8\.000/)).toBeInTheDocument();
    expect(screen.getByText(/Esperé conectada 20 minutos/)).toBeInTheDocument();
    expect(screen.getByText(/Tuve un problema con el transporte/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tomar solicitud" })).toBeInTheDocument();
    expect(screen.queryByRole("radio", { name: "Alumno" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Confirmar resolución" })).not.toBeInTheDocument();
  });

  it("toma la solicitud y la envía al backend", async () => {
    mockedDetail.mockResolvedValue(makeSessionClaimDetail());
    mockedAssign.mockResolvedValue(undefined);

    renderPanel("claim-1");

    fireEvent.click(await screen.findByRole("button", { name: "Tomar solicitud" }));

    await waitFor(() => expect(mockedAssign).toHaveBeenCalledWith("claim-1"));
  });

  it("muestra el formulario cuando el reclamo está asignado a mi cuenta", async () => {
    mockedDetail.mockResolvedValue(
      makeSessionClaimDetail({
        status: "IN_REVIEW",
        assignedToName: "Moderador Carlos V.",
        assignedToMe: true,
      })
    );

    renderPanel("claim-1");

    expect(
      await screen.findByRole("heading", { name: "En revisión por Moderador Carlos V." })
    ).toBeInTheDocument();
    expect(screen.getByText("Solicitud asignada a tu moderación")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Consultar datos de contacto" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Alumno" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Tutor" })).toBeInTheDocument();
    expect(screen.getByLabelText(/Justificación/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirmar resolución" })).toBeInTheDocument();
  });

  it("deja el reclamo en solo lectura si lo tomó otro admin", async () => {
    mockedDetail.mockResolvedValue(
      makeSessionClaimDetail({
        status: "IN_REVIEW",
        assignedToName: "Moderador Laura P.",
        assignedToMe: false,
      })
    );

    renderPanel("claim-1");

    expect(
      await screen.findByText("Solo el administrador asignado puede resolver este reclamo.")
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Consultar datos de contacto" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Confirmar resolución" })
    ).not.toBeInTheDocument();
  });

  it("muestra la resolución cerrada en solo lectura", async () => {
    mockedDetail.mockResolvedValue(
      makeSessionClaimDetail({
        status: "RESOLVED",
        resolutionJustification: "Se verificó la asistencia del alumno.",
      })
    );

    renderPanel("claim-1");

    expect(await screen.findByText("Reclamo resuelto")).toBeInTheDocument();
    expect(screen.getByText("Justificación del administrador:")).toBeInTheDocument();
    expect(screen.getByText("Se verificó la asistencia del alumno.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Tomar solicitud" })).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Consultar datos de contacto" })
    ).not.toBeInTheDocument();
  });

  it("muestra el error del detalle y permite reintentar", async () => {
    mockedDetail.mockRejectedValue(new Error("network"));

    renderPanel("claim-1");

    expect(
      await screen.findByText("No pudimos cargar el reclamo", {}, { timeout: 5000 })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reintentar" })).toBeInTheDocument();
  });
});