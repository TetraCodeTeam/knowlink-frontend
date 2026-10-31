import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import AdminSidebar from "@/modules/admin/components/AdminSidebar";

const { triggerLogout, badgesState } = vi.hoisted(() => ({
  triggerLogout: vi.fn(),
  badgesState: {
    current: undefined as
      | { pendingMaterialReports: number; pendingSessionClaims: number }
      | undefined,
  },
}));

vi.mock("@/modules/auth/logout/hooks/useLogout", () => ({
  useLogout: () => ({ triggerLogout, isPending: false }),
}));

vi.mock("@/modules/admin/navigation/hooks/useAdminNavigationBadges", () => ({
  useAdminNavigationBadges: () => ({ badges: badgesState.current }),
}));

function LocationDisplay() {
  const location = useLocation();
  return <span data-testid="location">{location.pathname}</span>;
}

function renderSidebar(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AdminSidebar />
      <LocationDisplay />
    </MemoryRouter>
  );
}

describe("AdminSidebar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    badgesState.current = undefined;
  });

  it("renderiza los ítems de navegación y Salir", () => {
    renderSidebar("/admin/home");

    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Denuncias" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Reclamos de sesiones" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salir" })).toBeInTheDocument();
  });

  it("marca Home como activo en /admin/home", () => {
    renderSidebar("/admin/home");

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Denuncias" })).not.toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  it("mantiene Denuncias activo en una ruta hija con query", () => {
    renderSidebar("/admin/material-reports?selected=abc");

    expect(screen.getByRole("link", { name: "Denuncias" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current", "page");
  });

  it("navega al hacer clic en un ítem", () => {
    renderSidebar("/admin/home");

    fireEvent.click(screen.getByRole("link", { name: "Reclamos de sesiones" }));

    expect(screen.getByTestId("location")).toHaveTextContent("/admin/session-claims");
  });

  it("muestra los contadores pendientes en los ítems con badge", () => {
    badgesState.current = { pendingMaterialReports: 3, pendingSessionClaims: 1 };
    renderSidebar("/admin/home");

    const reportsLink = screen.getByRole("link", { name: "Denuncias: 3 pendientes" });
    const claimsLink = screen.getByRole("link", { name: "Reclamos de sesiones: 1 pendiente" });

    expect(within(reportsLink).getByText("3")).toBeInTheDocument();
    expect(within(claimsLink).getByText("1")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveTextContent(/\d/);
  });

  it("oculta los contadores cuando el valor es 0", () => {
    badgesState.current = { pendingMaterialReports: 0, pendingSessionClaims: 0 };
    renderSidebar("/admin/home");

    expect(screen.getByRole("link", { name: "Denuncias" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Reclamos de sesiones" })).toBeInTheDocument();
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("abre el diálogo de logout y confirma la salida", () => {
    renderSidebar("/admin/home");

    fireEvent.click(screen.getByRole("button", { name: "Salir" }));

    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("¿Cerrar sesión?")).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole("button", { name: "Salir" }));

    expect(triggerLogout).toHaveBeenCalledTimes(1);
  });

  it("cancela el diálogo sin cerrar sesión", async () => {
    renderSidebar("/admin/home");

    fireEvent.click(screen.getByRole("button", { name: "Salir" }));

    const dialog = screen.getByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: "Cancelar" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(screen.getByTestId("location")).toHaveTextContent("/admin/home");
    expect(triggerLogout).not.toHaveBeenCalled();
  });
});
