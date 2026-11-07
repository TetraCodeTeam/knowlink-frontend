import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import NotificationsPanel from "@/modules/notifications/components/NotificationsPanel";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";

vi.mock("@/modules/notifications/api/notifications.api", () => ({
  getNotifications: vi.fn(),
  getUnreadCount: vi.fn(),
  markNotificationAsRead: vi.fn(),
  markAllNotificationsAsRead: vi.fn(),
}));

vi.mock("@/modules/notifications/hooks/useMarkAllNotificationsAsRead", () => ({
  useMarkAllNotificationsAsRead: () => ({ mutate: vi.fn(), isPending: true }),
}));

import { getNotifications, getUnreadCount } from "@/modules/notifications/api/notifications.api";

const mockedGetNotifications = vi.mocked(getNotifications);
const mockedGetUnreadCount = vi.mocked(getUnreadCount);

function renderPanel() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  render(
    <MemoryRouter>
      <NotificationsPanel open onClose={vi.fn()} sidebarWidth={120} />
    </MemoryRouter>,
    { wrapper }
  );
}

describe("NotificationsPanel — marcar todo como leido pendiente", () => {
  beforeEach(() => {
    mockedGetUnreadCount.mockResolvedValue({ count: 2, otherRoleCount: 0 });
    mockedGetNotifications.mockResolvedValue({
      content: [],
      page: 0,
      size: 20,
      totalElements: 0,
      totalPages: 1,
      hasNext: false,
    });
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

  it("deshabilita el boton mientras la mutacion esta pendiente", async () => {
    renderPanel();

    expect(await screen.findByRole("button", { name: "Marcar todo como leído" })).toBeDisabled();
  });
});
