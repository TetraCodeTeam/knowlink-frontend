import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import NotificationsPanel from "@/modules/notifications/components/NotificationsPanel";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import type { PagedNotificationsResponse } from "@/modules/notifications/interfaces/responses/paged-notifications.interface";

vi.mock("@/modules/notifications/api/notifications.api", () => ({
  getNotifications: vi.fn(),
  getUnreadCount: vi.fn(),
  markNotificationAsRead: vi.fn(),
}));

import { getNotifications, getUnreadCount } from "@/modules/notifications/api/notifications.api";

const mockedGetNotifications = vi.mocked(getNotifications);
const mockedGetUnreadCount = vi.mocked(getUnreadCount);

function makePage(content: PagedNotificationsResponse["content"]): PagedNotificationsResponse {
  return {
    content,
    page: 0,
    size: 20,
    totalElements: content.length,
    totalPages: 1,
    hasNext: false,
  };
}

const sampleNotification: PagedNotificationsResponse["content"][number] = {
  notificationId: "n-1",
  type: "BOOKING_CONFIRMED",
  title: "Reserva confirmada",
  message: "Pedro López reservó Análisis de Sistemas",
  referenceId: "b-1",
  read: false,
  createdAt: "2026-10-20T10:00:00",
};

function renderPanel(props: Partial<Parameters<typeof NotificationsPanel>[0]> = {}) {
  const onClose = vi.fn();
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  render(
    <MemoryRouter>
      <NotificationsPanel open onClose={onClose} sidebarWidth={120} {...props} />
    </MemoryRouter>,
    { wrapper }
  );
  return { onClose };
}

describe("NotificationsPanel", () => {
  beforeEach(() => {
    mockedGetNotifications.mockReset();
    mockedGetUnreadCount.mockReset();
    mockedGetUnreadCount.mockResolvedValue({ count: 4 });
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

  it("no renderiza nada cuando esta cerrado", () => {
    mockedGetNotifications.mockResolvedValue(makePage([sampleNotification]));
    renderPanel({ open: false });

    expect(screen.queryByText("Notificaciones")).not.toBeInTheDocument();
  });

  it("muestra el header con el contador de sin leer y el boton colapsar", async () => {
    mockedGetNotifications.mockResolvedValue(makePage([sampleNotification]));
    renderPanel();

    expect(screen.getByText("Notificaciones")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("4")).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: "Colapsar panel" })).toBeInTheDocument();
  });

  it("consulta la pestaña No Leído por defecto y muestra los items", async () => {
    mockedGetNotifications.mockResolvedValue(makePage([sampleNotification]));
    renderPanel();

    await waitFor(() => {
      expect(mockedGetNotifications).toHaveBeenCalledWith({ page: 0, size: 20, status: "UNREAD" });
    });
    expect(await screen.findByText("Reserva confirmada")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "No Leído" })).toHaveAttribute("aria-selected", "true");
  });

  it("cambia a la pestaña Leído y consulta con el filtro READ", async () => {
    const user = userEvent.setup();
    mockedGetNotifications.mockResolvedValue(makePage([]));
    renderPanel();

    await user.click(screen.getByRole("tab", { name: "Leído" }));

    await waitFor(() => {
      expect(mockedGetNotifications).toHaveBeenCalledWith({ page: 0, size: 20, status: "READ" });
    });
    expect(screen.getByRole("tab", { name: "Leído" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "No Leído" })).toHaveAttribute("aria-selected", "false");
  });

  it("cierra el panel al hacer click en colapsar", async () => {
    const user = userEvent.setup();
    mockedGetNotifications.mockResolvedValue(makePage([]));
    const { onClose } = renderPanel();

    await user.click(screen.getByRole("button", { name: "Colapsar panel" }));

    expect(onClose).toHaveBeenCalled();
  });

  it("cierra el panel al hacer click fuera (backdrop)", () => {
    mockedGetNotifications.mockResolvedValue(makePage([]));
    const { onClose } = renderPanel();

    fireEvent.click(screen.getByTestId("notifications-backdrop"));

    expect(onClose).toHaveBeenCalled();
  });

  it("limita el chip de sin leer a 99+ y conserva el total real en el aria-label", async () => {
    mockedGetUnreadCount.mockResolvedValue({ count: 150 });
    mockedGetNotifications.mockResolvedValue(makePage([]));
    renderPanel();

    await waitFor(() => {
      expect(screen.getByText("99+")).toBeInTheDocument();
    });
    expect(screen.getByLabelText("150 notificaciones sin leer")).toBeInTheDocument();
  });

  it("no muestra el banner de modo Alumno (pendiente de otherRoleCount)", async () => {
    useAuthStore.setState({
      isAuthenticated: true,
      authResponse: {
        userId: "u-2",
        email: "tutor@test.com",
        token: "token",
        role: "TUTOR",
      } as never,
    });
    mockedGetNotifications.mockResolvedValue(makePage([]));
    renderPanel();

    await waitFor(() => {
      expect(mockedGetNotifications).toHaveBeenCalled();
    });
    expect(screen.queryByText("Tenés novedades en modo Alumno")).not.toBeInTheDocument();
  });
});
