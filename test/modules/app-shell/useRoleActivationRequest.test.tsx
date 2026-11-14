import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  ROLE_ACTIVATION_STATE,
  useRoleActivationRequest,
} from "@/modules/app-shell/hooks/useRoleActivationRequest";

function Harness() {
  const request = useRoleActivationRequest();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div>
      <span data-testid="request">{request}</span>
      <span data-testid="state">{JSON.stringify(location.state)}</span>
      <button type="button" onClick={() => navigate("/profile", { state: ROLE_ACTIVATION_STATE })}>
        pedir activación
      </button>
      <button type="button" onClick={() => navigate("/profile", { state: { otra: true } })}>
        otro estado
      </button>
    </div>
  );
}

function renderHarness(initialEntry: string | { pathname: string; state?: unknown } = "/profile") {
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/profile" element={<Harness />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("useRoleActivationRequest", () => {
  it("sin pedido el contador queda en cero", () => {
    renderHarness();

    expect(screen.getByTestId("request")).toHaveTextContent("0");
  });

  it("un pedido que llega con la navegación sube el contador y se consume", async () => {
    renderHarness({ pathname: "/profile", state: ROLE_ACTIVATION_STATE });

    await waitFor(() => expect(screen.getByTestId("request")).toHaveTextContent("1"));
    // Se limpia el estado de la ubicación: recargar o volver atrás no reabre el diálogo.
    expect(screen.getByTestId("state")).toHaveTextContent("null");
  });

  it("estando ya en el perfil cada pedido vuelve a subir el contador", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: "pedir activación" }));
    await waitFor(() => expect(screen.getByTestId("request")).toHaveTextContent("1"));

    await user.click(screen.getByRole("button", { name: "pedir activación" }));
    await waitFor(() => expect(screen.getByTestId("request")).toHaveTextContent("2"));
  });

  it("ignora cualquier otro estado de navegación", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: "otro estado" }));

    await waitFor(() => expect(screen.getByTestId("state")).toHaveTextContent('{"otra":true}'));
    expect(screen.getByTestId("request")).toHaveTextContent("0");
  });
});
