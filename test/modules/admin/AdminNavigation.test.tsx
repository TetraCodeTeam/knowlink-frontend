import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import AdminLayout from "@/modules/admin/layouts/AdminLayout";
import { SIDEBAR_COLLAPSED_STORAGE_KEY } from "@/modules/app-shell/constants/navigation.constants";

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

function renderAdminLayout(path: string) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route element={<AdminLayout />}>
            <Route path="*" element={<LocationDisplay />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

function openLogoutDialog() {
  fireEvent.click(screen.getByRole("button", { name: "Menú de usuario" }));
  fireEvent.click(screen.getByRole("menuitem", { name: "Cerrar sesión" }));
  return screen.getByRole("dialog");
}

describe("Navegación del administrador", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    badgesState.current = undefined;
    // En jsdom no hay ancho de ventana: se fuerza el menú expandido para ver las etiquetas.
    window.localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, "false");
  });

  it("renderiza los ítems de navegación y el menú de usuario", () => {
    renderAdminLayout("/admin/home");

    expect(screen.getByRole("link", { name: "Inicio" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Denuncias" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Reclamos de sesiones" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Menú de usuario" })).toBeInTheDocument();
  });

  it("marca Inicio como activo en /admin/home", () => {
    renderAdminLayout("/admin/home");

    expect(screen.getByRole("link", { name: "Inicio" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Denuncias" })).not.toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  it("mantiene Denuncias activo en una ruta hija con query", () => {
    renderAdminLayout("/admin/material-reports?selected=abc");

    expect(screen.getByRole("link", { name: "Denuncias" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Inicio" })).not.toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  it("navega al hacer clic en un ítem", () => {
    renderAdminLayout("/admin/home");

    fireEvent.click(screen.getByRole("link", { name: "Reclamos de sesiones" }));

    expect(screen.getByTestId("location")).toHaveTextContent("/admin/session-claims");
  });

  it("muestra los contadores pendientes en los ítems con badge", () => {
    badgesState.current = { pendingMaterialReports: 3, pendingSessionClaims: 1 };
    renderAdminLayout("/admin/home");

    const reportsLink = screen.getByRole("link", { name: "Denuncias: 3 pendientes" });
    const claimsLink = screen.getByRole("link", { name: "Reclamos de sesiones: 1 pendiente" });

    expect(within(reportsLink).getByText("3")).toBeInTheDocument();
    expect(within(claimsLink).getByText("1")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Inicio" })).not.toHaveTextContent(/\d/);
  });

  it("oculta los contadores cuando el valor es 0", () => {
    badgesState.current = { pendingMaterialReports: 0, pendingSessionClaims: 0 };
    renderAdminLayout("/admin/home");

    expect(screen.getByRole("link", { name: "Denuncias" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Reclamos de sesiones" })).toBeInTheDocument();
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("abre el diálogo de logout desde el menú de usuario y confirma la salida", () => {
    renderAdminLayout("/admin/home");

    const dialog = openLogoutDialog();
    expect(within(dialog).getByText("¿Cerrar sesión?")).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole("button", { name: "Salir" }));

    expect(triggerLogout).toHaveBeenCalledTimes(1);
  });

  it("cancela el diálogo sin cerrar sesión", async () => {
    renderAdminLayout("/admin/home");

    const dialog = openLogoutDialog();
    fireEvent.click(within(dialog).getByRole("button", { name: "Cancelar" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(screen.getByTestId("location")).toHaveTextContent("/admin/home");
    expect(triggerLogout).not.toHaveBeenCalled();
  });
});
