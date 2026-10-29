import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RoutesProvider from "@/providers/RoutesProvider";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import type { AuthRole } from "@/shared/types/role.type";

vi.mock("@/routes/StudentRoutes", () => ({ default: () => null }));
vi.mock("@/routes/TutorRoutes", () => ({ default: () => null }));
vi.mock("@/routes/AuthRoutes", () => ({ default: () => null }));

function LocationDisplay() {
  const location = useLocation();
  return <span data-testid="location">{location.pathname}</span>;
}

function renderAt(path: string) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>
        <RoutesProvider />
        <LocationDisplay />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

function setSession(role: AuthRole | null) {
  if (!role) {
    useAuthStore.setState({ isAuthenticated: false, authResponse: undefined });
    return;
  }

  useAuthStore.setState({
    isAuthenticated: true,
    authResponse: {
      userId: "u-1",
      email: "user@test.com",
      fullName: "Test User",
      token: "token",
      role,
    },
  });
}

function currentPath() {
  return screen.getByTestId("location").textContent;
}

describe("RoutesProvider - control de acceso por rol", () => {
  beforeEach(() => {
    setSession(null);
  });

  it("redirige a un ADMIN autenticado de / a /admin/home", () => {
    setSession("ADMIN");
    renderAt("/");

    expect(currentPath()).toBe("/admin/home");
  });

  it("redirige a un ADMIN de /admin a /admin/home", () => {
    setSession("ADMIN");
    renderAt("/admin");

    expect(currentPath()).toBe("/admin/home");
  });

  it("redirige a un ADMIN de /student/home a /admin/home", () => {
    setSession("ADMIN");
    renderAt("/student/home");

    expect(currentPath()).toBe("/admin/home");
  });

  it("redirige a un STUDENT de /admin/home a /student/home", () => {
    setSession("STUDENT");
    renderAt("/admin/home");

    expect(currentPath()).toBe("/student/home");
  });

  it("redirige a un TUTOR de /admin/home a /tutor/home", () => {
    setSession("TUTOR");
    renderAt("/admin/home");

    expect(currentPath()).toBe("/tutor/home");
  });

  it("redirige a /auth/login cuando no hay sesión", () => {
    renderAt("/admin/home");

    expect(currentPath()).toBe("/auth/login");
  });

  it("redirige a /admin/home desde una ruta inexistente del admin", () => {
    setSession("ADMIN");
    renderAt("/admin/cualquier-cosa");

    expect(currentPath()).toBe("/admin/home");
  });
});
