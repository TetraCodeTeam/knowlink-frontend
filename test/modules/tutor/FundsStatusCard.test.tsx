import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import FundsStatusCard from "@/modules/tutor/statistics/components/FundsStatusCard";
import type { FundsStatus } from "@/modules/tutor/statistics/interfaces/responses/tutor-statistics.response";

const baseFunds: FundsStatus = {
  released: { amount: 970, sessions: 1 },
  pendingRelease: { amount: 1940, sessions: 2 },
  withheldByClaim: { amount: 3007, sessions: 1 },
  withheldClaimIds: ["claim-1"],
  commissionPercentage: 3,
};

function Destination() {
  const location = useLocation();
  return <div data-testid="destino">{`${location.pathname}${location.search}`}</div>;
}

function renderCard(funds: FundsStatus) {
  render(
    <MemoryRouter initialEntries={["/tutor/stats"]}>
      <Routes>
        <Route path="/tutor/stats" element={<FundsStatusCard funds={funds} />} />
        <Route path="/tutor/requests" element={<Destination />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("FundsStatusCard — fondos retenidos por reclamo", () => {
  it("con una sola sesión en disputa abre directamente el detalle de su reclamo", async () => {
    const user = userEvent.setup();
    renderCard(baseFunds);

    await user.click(screen.getByRole("button", { name: "Ver reclamo en Soporte" }));

    expect(screen.getByTestId("destino")).toHaveTextContent(
      "/tutor/requests?tab=claims&claim=claim-1"
    );
  });

  it("con varias sesiones en disputa lleva al listado, sin elegir un reclamo al azar", async () => {
    const user = userEvent.setup();
    renderCard({
      ...baseFunds,
      withheldByClaim: { amount: 6499, sessions: 2 },
      withheldClaimIds: ["claim-2", "claim-1"],
    });

    expect(
      screen.queryByRole("button", { name: "Ver reclamo en Soporte" })
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Ver en Soporte" }));

    expect(screen.getByTestId("destino")).toHaveTextContent("/tutor/requests?tab=claims");
    expect(screen.getByTestId("destino")).not.toHaveTextContent("claim=");
  });

  it("si el backend todavía no envía los reclamos, lleva al listado y no se rompe", async () => {
    const user = userEvent.setup();
    const withoutIds: FundsStatus = { ...baseFunds };
    delete withoutIds.withheldClaimIds;
    renderCard(withoutIds);

    await user.click(screen.getByRole("button", { name: "Ver en Soporte" }));

    expect(screen.getByTestId("destino")).toHaveTextContent("/tutor/requests?tab=claims");
    expect(screen.getByTestId("destino")).not.toHaveTextContent("claim=");
  });

  it("si faltan reclamos para alguna sesión no abre uno solo: lleva al listado", async () => {
    const user = userEvent.setup();
    renderCard({
      ...baseFunds,
      withheldByClaim: { amount: 6499, sessions: 2 },
      withheldClaimIds: ["claim-1"],
    });

    await user.click(screen.getByRole("button", { name: "Ver en Soporte" }));

    expect(screen.getByTestId("destino")).not.toHaveTextContent("claim=");
  });

  it("sin sesiones en disputa no ofrece ningún enlace a Soporte", () => {
    renderCard({ ...baseFunds, withheldByClaim: { amount: 0, sessions: 0 }, withheldClaimIds: [] });

    expect(screen.queryByRole("button", { name: /Soporte/ })).not.toBeInTheDocument();
    expect(screen.getByText("0 sesiones en disputa")).toBeInTheDocument();
  });
});
