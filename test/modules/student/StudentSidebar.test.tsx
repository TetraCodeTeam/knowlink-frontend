import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import StudentSidebar from "@/modules/student/components/StudentSidebar";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";

vi.mock("@/modules/notifications/api/notifications.api", () => ({
  getNotifications: vi.fn().mockResolvedValue({
    content: [],
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 1,
    hasNext: false,
  }),
  getUnreadCount: vi.fn().mockResolvedValue({ count: 0, otherRoleCount: 0 }),
  markNotificationAsRead: vi.fn(),
}));

function renderSidebar() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return render(
    <MemoryRouter>
      <StudentSidebar />
    </MemoryRouter>,
    { wrapper }
  );
}

describe("StudentSidebar - panel de notificaciones", () => {
  beforeEach(() => {
    useAuthStore.setState({
      isAuthenticated: true,
      authResponse: {
        userId: "u-1",
        email: "alumno@test.com",
        token: "token",
        role: "STUDENT",
      } as never,
    });
  });

  it("abre el panel, lo cierra con click fuera y devuelve el foco a la campana", () => {
    renderSidebar();

    const bell = screen.getByRole("button", { name: "Notificaciones" });
    fireEvent.click(bell);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    (document.activeElement as HTMLElement | null)?.blur();

    fireEvent.click(screen.getByTestId("notifications-backdrop"));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.activeElement).toBe(bell);
  });
});
