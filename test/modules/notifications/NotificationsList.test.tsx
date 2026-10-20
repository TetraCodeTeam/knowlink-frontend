import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import NotificationsList from "@/modules/notifications/components/NotificationsList";
import type { PagedNotificationsResponse } from "@/modules/notifications/interfaces/responses/paged-notifications.interface";

vi.mock("@/modules/notifications/api/notifications.api", () => ({
  getNotifications: vi.fn(),
  getUnreadCount: vi.fn(),
  markNotificationAsRead: vi.fn(),
}));

import { getNotifications } from "@/modules/notifications/api/notifications.api";

const mockedGetNotifications = vi.mocked(getNotifications);

function makePage(overrides: Partial<PagedNotificationsResponse> = {}): PagedNotificationsResponse {
  return {
    content: [
      {
        notificationId: "n-1",
        type: "BOOKING_CONFIRMED",
        message: "Clase confirmada",
        referenceId: null,
        read: false,
        createdAt: "2026-10-20T10:00:00",
      },
    ],
    page: 0,
    size: 20,
    totalElements: 1,
    totalPages: 1,
    hasNext: false,
    ...overrides,
  };
}

function renderList(onClose = vi.fn()) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  render(
    <MemoryRouter>
      <NotificationsList onClose={onClose} />
    </MemoryRouter>,
    { wrapper }
  );
  return { onClose };
}

describe("NotificationsList", () => {
  beforeEach(() => {
    mockedGetNotifications.mockReset();
  });

  it("muestra skeletons mientras carga y no muestra contenido", () => {
    mockedGetNotifications.mockReturnValue(new Promise(() => {}));
    renderList();
    expect(screen.queryByText("Clase confirmada")).not.toBeInTheDocument();
    expect(screen.queryByText("No pudimos cargar tus notificaciones.")).not.toBeInTheDocument();
  });

  it("muestra mensaje de error con boton Reintentar si falla la carga", async () => {
    const user = userEvent.setup();
    mockedGetNotifications.mockRejectedValueOnce(new Error("fallo"));
    mockedGetNotifications.mockResolvedValueOnce(makePage());
    renderList();

    await waitFor(() => {
      expect(screen.getByText("No pudimos cargar tus notificaciones.")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Reintentar" }));

    await waitFor(() => {
      expect(screen.getByText("Clase confirmada")).toBeInTheDocument();
    });
  });

  it("muestra estado vacio cuando no hay notificaciones", async () => {
    mockedGetNotifications.mockResolvedValue(makePage({ content: [], totalElements: 0 }));
    renderList();

    await waitFor(() => {
      expect(screen.getByText("No tenés notificaciones")).toBeInTheDocument();
    });
  });

  it("lista las notificaciones recibidas", async () => {
    mockedGetNotifications.mockResolvedValue(makePage());
    renderList();

    await waitFor(() => {
      expect(screen.getByText("Clase confirmada")).toBeInTheDocument();
    });
  });

  it("muestra el boton Cargar mas cuando hay siguiente pagina", async () => {
    mockedGetNotifications.mockResolvedValue(makePage({ hasNext: true, totalPages: 2 }));
    renderList();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Cargar más" })).toBeInTheDocument();
    });
  });
});
