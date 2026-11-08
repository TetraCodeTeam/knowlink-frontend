import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider, type InfiniteData } from "@tanstack/react-query";
import { useMarkAllNotificationsAsRead } from "@/modules/notifications/hooks/useMarkAllNotificationsAsRead";
import { NOTIFICATION_QUERY_KEYS } from "@/modules/notifications/constants/notification-query-keys";
import { SUPPORT_UNREAD_COUNT_QUERY_KEY } from "@/modules/student/support/hooks/useSupportUnreadCount";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import type { PagedNotificationsResponse } from "@/modules/notifications/interfaces/responses/paged-notifications.interface";
import type { UnreadCountResponse } from "@/modules/notifications/interfaces/responses/unread-count.interface";
import type { SupportUnreadCountResponse } from "@/modules/student/support/interfaces/responses/support-unread-count.response";

vi.mock("@/modules/notifications/api/notifications.api", () => ({
  markAllNotificationsAsRead: vi.fn(),
}));

import { markAllNotificationsAsRead } from "@/modules/notifications/api/notifications.api";

const mockedMarkAll = vi.mocked(markAllNotificationsAsRead);

const UNREAD_KEY = [...NOTIFICATION_QUERY_KEYS.list("STUDENT"), "UNREAD"] as const;
const READ_KEY = [...NOTIFICATION_QUERY_KEYS.list("STUDENT"), "READ"] as const;

function makePage(notificationId: string, read: boolean): PagedNotificationsResponse {
  return {
    content: [
      {
        notificationId,
        type: "BOOKING_CONFIRMED",
        title: "Reserva confirmada",
        message: "Clase confirmada",
        referenceId: null,
        read,
        createdAt: "2026-10-20T10:00:00",
        expiresAt: null,
        actionStatus: "NONE",
      },
    ],
    page: 0,
    size: 20,
    totalElements: 1,
    totalPages: 1,
    hasNext: false,
  };
}

function seedCache(client: QueryClient) {
  client.setQueryData<InfiniteData<PagedNotificationsResponse>>(UNREAD_KEY, {
    pages: [makePage("n-1", false)],
    pageParams: [0],
  });
  client.setQueryData<InfiniteData<PagedNotificationsResponse>>(READ_KEY, {
    pages: [makePage("n-2", true)],
    pageParams: [0],
  });
  client.setQueryData<UnreadCountResponse>(NOTIFICATION_QUERY_KEYS.unreadCount("STUDENT"), {
    count: 1,
    otherRoleCount: 3,
  });
  client.setQueryData<SupportUnreadCountResponse>(SUPPORT_UNREAD_COUNT_QUERY_KEY, {
    unreadCount: 5,
  });
}

function renderWithClient(client: QueryClient) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return renderHook(() => useMarkAllNotificationsAsRead(), { wrapper });
}

describe("useMarkAllNotificationsAsRead — actualizacion optimista", () => {
  beforeEach(() => {
    mockedMarkAll.mockReset();
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

  it("deja todas como leidas y baja el contador preservando otherRoleCount", async () => {
    mockedMarkAll.mockResolvedValue(undefined);
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    seedCache(client);
    const { result } = renderWithClient(client);

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => {
      const unread = client.getQueryData<UnreadCountResponse>(
        NOTIFICATION_QUERY_KEYS.unreadCount("STUDENT")
      );
      expect(unread).toEqual({ count: 0, otherRoleCount: 3 });
    });

    const unreadList = client.getQueryData<InfiniteData<PagedNotificationsResponse>>(UNREAD_KEY);
    expect(unreadList?.pages[0].content[0].read).toBe(true);
    const readList = client.getQueryData<InfiniteData<PagedNotificationsResponse>>(READ_KEY);
    expect(readList?.pages[0].content[0].read).toBe(true);

    await waitFor(() => {
      expect(mockedMarkAll).toHaveBeenCalledTimes(1);
    });
  });

  it("restaura la lista y el contador si el servidor falla", async () => {
    mockedMarkAll.mockRejectedValue(new Error("server down"));
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    seedCache(client);
    const { result } = renderWithClient(client);

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    const unread = client.getQueryData<UnreadCountResponse>(
      NOTIFICATION_QUERY_KEYS.unreadCount("STUDENT")
    );
    expect(unread).toEqual({ count: 1, otherRoleCount: 3 });

    const unreadList = client.getQueryData<InfiniteData<PagedNotificationsResponse>>(UNREAD_KEY);
    expect(unreadList?.pages[0].content[0].read).toBe(false);
  });

  it("invalida la query de novedades de soporte al terminar", async () => {
    mockedMarkAll.mockResolvedValue(undefined);
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    seedCache(client);
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");
    const { result } = renderWithClient(client);

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: SUPPORT_UNREAD_COUNT_QUERY_KEY,
      });
    });
  });
});
