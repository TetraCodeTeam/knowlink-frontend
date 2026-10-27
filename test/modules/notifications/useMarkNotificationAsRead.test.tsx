import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMarkNotificationAsRead } from "@/modules/notifications/hooks/useMarkNotificationAsRead";
import { NOTIFICATION_QUERY_KEYS } from "@/modules/notifications/constants/notification-query-keys";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import type { InfiniteData } from "@tanstack/react-query";
import type { PagedNotificationsResponse } from "@/modules/notifications/interfaces/responses/paged-notifications.interface";
import type { UnreadCountResponse } from "@/modules/notifications/interfaces/responses/unread-count.interface";

vi.mock("@/modules/notifications/api/notifications.api", () => ({
  markNotificationAsRead: vi.fn(),
}));

import { markNotificationAsRead } from "@/modules/notifications/api/notifications.api";

const mockedMarkRead = vi.mocked(markNotificationAsRead);

function makePage(): PagedNotificationsResponse {
  return {
    content: [
      {
        notificationId: "n-1",
        type: "BOOKING_CONFIRMED",
        title: "Reserva confirmada",
        message: "Clase confirmada",
        referenceId: null,
        read: false,
        createdAt: "2026-10-20T10:00:00",
        expiresAt: null,
        actionStatus: "NONE",
      },
      {
        notificationId: "n-2",
        type: "FUNDS_TRANSFERRED",
        title: "Pago acreditado. Sesión completada",
        message: "Fondos transferidos",
        referenceId: null,
        read: false,
        createdAt: "2026-10-20T09:00:00",
        expiresAt: null,
        actionStatus: "NONE",
      },
    ],
    page: 0,
    size: 20,
    totalElements: 2,
    totalPages: 1,
    hasNext: false,
  };
}

function seedCache(client: QueryClient) {
  client.setQueryData<InfiniteData<PagedNotificationsResponse>>(
    [...NOTIFICATION_QUERY_KEYS.list("STUDENT"), "UNREAD"],
    {
      pages: [makePage()],
      pageParams: [0],
    }
  );
  client.setQueryData<UnreadCountResponse>(NOTIFICATION_QUERY_KEYS.unreadCount("STUDENT"), {
    count: 2,
    otherRoleCount: 3,
  });
}

function renderWithClient(client: QueryClient) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return renderHook(() => useMarkNotificationAsRead(), { wrapper });
}

describe("useMarkNotificationAsRead — actualizacion optimista", () => {
  beforeEach(() => {
    mockedMarkRead.mockReset();
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

  it("baja el badge al instante y reconcilia con el servidor en exito", async () => {
    mockedMarkRead.mockResolvedValue(undefined);
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    seedCache(client);
    const { result } = renderWithClient(client);

    act(() => {
      result.current.mutate("n-1");
    });

    await waitFor(() => {
      const unread = client.getQueryData<UnreadCountResponse>(
        NOTIFICATION_QUERY_KEYS.unreadCount("STUDENT")
      );
      expect(unread?.count).toBe(1);
      expect(unread?.otherRoleCount).toBe(3);
    });

    const list = client.getQueryData<InfiniteData<PagedNotificationsResponse>>([
      ...NOTIFICATION_QUERY_KEYS.list("STUDENT"),
      "UNREAD",
    ]);
    expect(list?.pages[0].content[0].read).toBe(true);
    expect(list?.pages[0].content[1].read).toBe(false);

    await waitFor(() => {
      expect(mockedMarkRead).toHaveBeenCalledWith("n-1");
    });
  });

  it("restaura el snapshot del badge y de la lista si el servidor falla", async () => {
    mockedMarkRead.mockRejectedValue(new Error("server down"));
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    seedCache(client);
    const { result } = renderWithClient(client);

    act(() => {
      result.current.mutate("n-1");
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    const unread = client.getQueryData<UnreadCountResponse>(
      NOTIFICATION_QUERY_KEYS.unreadCount("STUDENT")
    );
    expect(unread?.count).toBe(2);

    const list = client.getQueryData<InfiniteData<PagedNotificationsResponse>>([
      ...NOTIFICATION_QUERY_KEYS.list("STUDENT"),
      "UNREAD",
    ]);
    expect(list?.pages[0].content[0].read).toBe(false);
  });
});
