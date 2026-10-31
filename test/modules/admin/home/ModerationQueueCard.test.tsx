import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import ModerationQueueCard from "@/modules/admin/home/components/ModerationQueueCard";
import type { MaterialReportsQueueSummary } from "@/modules/admin/home/interfaces/responses/material-reports-queue-summary.response";
import type { SessionClaimsQueueSummary } from "@/modules/admin/home/interfaces/responses/session-claims-queue-summary.response";

const CLAIMS: SessionClaimsQueueSummary = {
  resolvedThisWeek: 11,
  resolvedDeltaPct: 12,
  newThisWeek: 9,
  oldestPendingDays: 4,
};

const REPORTS: MaterialReportsQueueSummary = {
  resolvedThisWeek: 7,
  resolvedDeltaPct: -5,
  newThisWeek: 3,
  pendingFiles: 1,
  pendingReports: 6,
};

function LocationDisplay() {
  const location = useLocation();

  return <span data-testid="location">{location.pathname}</span>;
}

function renderCard(card: ReactNode) {
  return render(
    <MemoryRouter initialEntries={["/admin/home"]}>
      {card}
      <LocationDisplay />
    </MemoryRouter>
  );
}

describe("ModerationQueueCard", () => {
  it("muestra la variante de reclamos con sus KPIs y su pill", () => {
    renderCard(<ModerationQueueCard variant="claims" summary={CLAIMS} />);

    const card = screen.getByRole("article", { name: "Reclamo de sesiones" });

    expect(within(card).getByText("Conflictos entre tutores y alumnos")).toBeInTheDocument();
    expect(card).toHaveTextContent("La más antigua espera hace 4 días");
    expect(within(card).getByText("11")).toBeInTheDocument();
    expect(within(card).getByText("+12%")).toBeInTheDocument();
    expect(within(card).getByText("9")).toBeInTheDocument();
    expect(within(card).getByText("pendientes")).toBeInTheDocument();
  });

  it("muestra la variante de denuncias con reportes y archivos", () => {
    renderCard(<ModerationQueueCard variant="reports" summary={REPORTS} />);

    const card = screen.getByRole("article", { name: "Denuncias de material" });

    expect(card).toHaveTextContent("Infracciones de copyright y guías indebidas");
    expect(card).toHaveTextContent("1 archivo con 6 reportes sin revisar");
    expect(within(card).getByText("-5%")).toBeInTheDocument();
  });

  it("avisa cuando no hay reclamos pendientes", () => {
    renderCard(
      <ModerationQueueCard variant="claims" summary={{ ...CLAIMS, oldestPendingDays: null }} />
    );

    const card = screen.getByRole("article", { name: "Reclamo de sesiones" });

    expect(card).toHaveTextContent("No hay reclamos pendientes");
  });

  it("avisa cuando no hay denuncias sin revisar", () => {
    renderCard(
      <ModerationQueueCard
        variant="reports"
        summary={{ ...REPORTS, pendingFiles: 0, pendingReports: 0 }}
      />
    );

    const card = screen.getByRole("article", { name: "Denuncias de material" });

    expect(card).toHaveTextContent("No hay denuncias sin revisar");
  });

  it("no muestra delta cuando no hay base de comparación", () => {
    renderCard(
      <ModerationQueueCard variant="claims" summary={{ ...CLAIMS, resolvedDeltaPct: null }} />
    );

    expect(screen.queryByText("+12%")).not.toBeInTheDocument();
  });

  it("navega a la cola de reclamos", () => {
    renderCard(<ModerationQueueCard variant="claims" summary={CLAIMS} />);

    fireEvent.click(screen.getByRole("button", { name: "Ir a la cola" }));

    expect(screen.getByTestId("location")).toHaveTextContent("/admin/session-claims");
  });

  it("navega a la cola de denuncias", () => {
    renderCard(<ModerationQueueCard variant="reports" summary={REPORTS} />);

    fireEvent.click(screen.getByRole("button", { name: "Ir a la cola" }));

    expect(screen.getByTestId("location")).toHaveTextContent("/admin/material-reports");
  });
});
