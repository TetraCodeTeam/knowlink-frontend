import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import NotificationItem from "@/modules/notifications/components/NotificationItem";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import type { NotificationResponse } from "@/modules/notifications/interfaces/responses/notification.interface";

const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => navigateMock };
});

function makeNotification(overrides: Partial<NotificationResponse> = {}): NotificationResponse {
  return {
    notificationId: "n-1",
    type: "BOOKING_CONFIRMED",
    message: "Tu clase fue confirmada",
    referenceId: "b-1",
    read: false,
    createdAt: "2026-10-20T15:14:00",
    ...overrides,
  };
}

function render_item(
  notification: NotificationResponse,
  onMarkAsRead = vi.fn(),
  onClose = vi.fn()
) {
  render(
    <MemoryRouter>
      <NotificationItem notification={notification} onMarkAsRead={onMarkAsRead} onClose={onClose} />
    </MemoryRouter>
  );
  return { onMarkAsRead, onClose };
}

describe("NotificationItem", () => {
  beforeEach(() => {
    navigateMock.mockReset();
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

  it("marca como leida al hacer click en una no leida y navega", async () => {
    const user = userEvent.setup();
    const { onMarkAsRead, onClose } = render_item(makeNotification());

    await user.click(screen.getByRole("button"));

    expect(onMarkAsRead).toHaveBeenCalledWith("n-1");
    expect(navigateMock).toHaveBeenCalledWith("/student/classes");
    expect(onClose).toHaveBeenCalled();
  });

  it("no envia PATCH al hacer click en una ya leida", async () => {
    const user = userEvent.setup();
    const { onMarkAsRead } = render_item(makeNotification({ read: true }));

    await user.click(screen.getByRole("button"));

    expect(onMarkAsRead).not.toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith("/student/classes");
  });

  it("marca como leida pero no navega cuando el tipo no tiene ruta para el rol", async () => {
    const user = userEvent.setup();
    const { onMarkAsRead, onClose } = render_item(
      makeNotification({ type: "SUBJECT_VALIDATION_UPDATED" })
    );

    await user.click(screen.getByRole("button"));

    expect(onMarkAsRead).toHaveBeenCalledWith("n-1");
    expect(navigateMock).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it("anuncia No leida en el aria-label cuando no esta leida", () => {
    render_item(makeNotification());
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-label",
      expect.stringContaining("No leída")
    );
  });

  it("anuncia Leida en el aria-label cuando esta leida", () => {
    render_item(makeNotification({ read: true }));
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-label",
      expect.stringContaining("Leída")
    );
  });

  it("es operable con teclado Enter", async () => {
    const user = userEvent.setup();
    const { onMarkAsRead } = render_item(makeNotification());

    await user.tab();
    await user.keyboard("{Enter}");

    expect(onMarkAsRead).toHaveBeenCalledWith("n-1");
  });
});
