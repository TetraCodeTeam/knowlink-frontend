import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, useLocation } from "react-router-dom";
import { useLogin } from "@/modules/auth/hooks/useLogin";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import { loginUser } from "@/modules/auth/api/auth.api";
import type { AuthRole } from "@/shared/types/role.type";

vi.mock("@/modules/auth/api/auth.api", () => ({
  loginUser: vi.fn(),
}));

function LocationDisplay() {
  const location = useLocation();
  return <span data-testid="location">{location.pathname}</span>;
}

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/auth/login"]}>
          {children}
          <LocationDisplay />
        </MemoryRouter>
      </QueryClientProvider>
    );
  };
}

async function loginAs(role: AuthRole) {
  vi.mocked(loginUser).mockResolvedValueOnce({
    userId: "u-1",
    email: "user@test.com",
    fullName: "Test User",
    token: "token",
    role,
  });

  const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });

  await act(async () => {
    result.current.mutate({ email: "user@test.com", password: "password123" });
  });

  await waitFor(() => {
    expect(screen.getByTestId("location")).not.toHaveTextContent("/auth/login");
  });

  return screen.getByTestId("location").textContent;
}

describe("useLogin - destino por rol", () => {
  beforeEach(() => {
    useAuthStore.setState({ isAuthenticated: false, authResponse: undefined });
    vi.clearAllMocks();
  });

  it("navega a /admin/home cuando el rol es ADMIN", async () => {
    expect(await loginAs("ADMIN")).toBe("/admin/home");
  });

  it("conserva el destino de STUDENT", async () => {
    expect(await loginAs("STUDENT")).toBe("/student/profile");
  });

  it("conserva el destino de TUTOR", async () => {
    expect(await loginAs("TUTOR")).toBe("/tutor/profile");
  });
});
