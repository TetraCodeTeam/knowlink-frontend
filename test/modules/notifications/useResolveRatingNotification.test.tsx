import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider, type InfiniteData } from "@tanstack/react-query";
import { useResolveRatingNotification } from "@/modules/notifications/hooks/useResolveRatingNotification";
import { NOTIFICATION_QUERY_KEYS } from "@/modules/notifications/constants/notification-query-keys";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import type { PagedNotificationsResponse } from "@/modules/notifications/interfaces/responses/paged-notifications.interface";
import type { UnreadCountResponse } from "@/modules/notifications/interfaces/responses/unread-count.interface";
import type { NotificationResponse } from "@/modules/notifications/interfaces/responses/notification.interface";

function makeNotification(overrides: Partial<NotificationResponse> = {}): NotificationResponse {
  return {
    notificationId: "n-1",
    type: "RATING_ENABLED",
    title: "Calificá tu sesión de Física 1",
    message: "Contanos cómo fue tu experiencia",
    referenceId: "b-1",
    read: false,
    createdAt: "2026-10-20T10:00:00",
    expiresAt: "2026-10-21T10:00:00",
    actionStatus: "PENDING",
    ...overrides,
  };
}

function makePage(content: NotificationResponse[]): PagedNotificationsResponse {
  return {
    content,
    page: 0,
    size: 20,
    totalElements: content.length,
    totalPages: 1,
    hasNext: false,
  };
}

const ALL_KEY = [...NOTIFICATION_QUERY_KEYS.list("STUDENT"), "ALL"];
const UNREAD_KEY = [...NOTIFICATION_QUERY_KEYS.list("STUDENT"), "UNREAD"];

function seed(client: QueryClient, all: NotificationResponse[], unread: NotificationResponse[]) {
  client.setQueryData<InfiniteData<PagedNotificationsResponse>>(ALL_KEY, {
    pages: [makePage(all)],
    pageParams: [0],
  });
  client.setQueryData<InfiniteData<PagedNotificationsResponse>>(UNREAD_KEY, {
    pages: [makePage(unread)],
    pageParams: [0],
  });
  client.setQueryData<UnreadCountResponse>(NOTIFICATION_QUERY_KEYS.unreadCount("STUDENT"), {
    count: 2,
    otherRoleCount: 3,
  });
}

function renderWithClient(client: QueryClient) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return renderHook(() => useResolveRatingNotification(), { wrapper });
}

describe("useResolveRatingNotification", () => {
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

  it("marca leida y completa la notificacion y baja el contador una sola vez", () => {
    const client = new QueryClient();
    const notification = makeNotification();
    seed(client, [notification], [notification]);
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");
    const { result } = renderWithClient(client);

    act(() => {
      result.current.resolve("b-1");
    });

    for (const key of [ALL_KEY, UNREAD_KEY]) {
      const data = client.getQueryData<InfiniteData<PagedNotificationsResponse>>(key);
      expect(data?.pages[0].content[0].read).toBe(true);
      expect(data?.pages[0].content[0].actionStatus).toBe("COMPLETED");
    }

    const unread = client.getQueryData<UnreadCountResponse>(
      NOTIFICATION_QUERY_KEYS.unreadCount("STUDENT")
    );
    expect(unread).toEqual({ count: 1, otherRoleCount: 3 });
    expect(invalidateSpy).not.toHaveBeenCalled();
  });

  it("no toca otras notificaciones ni el contador si ya estaba leida", () => {
    const client = new QueryClient();
    seed(
      client,
      [
        makeNotification({ read: true, actionStatus: "COMPLETED" }),
        makeNotification({ notificationId: "n-2", type: "BOOKING_CONFIRMED", referenceId: "b-2" }),
      ],
      []
    );
    const { result } = renderWithClient(client);

    act(() => {
      result.current.resolve("b-1");
    });

    const all = client.getQueryData<InfiniteData<PagedNotificationsResponse>>(ALL_KEY);
    expect(all?.pages[0].content[0]).toMatchObject({ read: true, actionStatus: "COMPLETED" });
    expect(all?.pages[0].content[1]).toMatchObject({
      read: false,
      actionStatus: "PENDING",
      type: "BOOKING_CONFIRMED",
    });

    const unread = client.getQueryData<UnreadCountResponse>(
      NOTIFICATION_QUERY_KEYS.unreadCount("STUDENT")
    );
    expect(unread?.count).toBe(2);
  });

  it("no hace nada si no hay notificaciones de esa reserva", () => {
    const client = new QueryClient();
    seed(client, [makeNotification({ referenceId: "b-9" })], []);
    const { result } = renderWithClient(client);

    act(() => {
      result.current.resolve("b-1");
    });

    const all = client.getQueryData<InfiniteData<PagedNotificationsResponse>>(ALL_KEY);
    expect(all?.pages[0].content[0].read).toBe(false);
    expect(all?.pages[0].content[0].actionStatus).toBe("PENDING");
  });
});
