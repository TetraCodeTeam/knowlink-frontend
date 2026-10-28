import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import NotificationItem from "@/modules/notifications/components/NotificationItem";
import { formatNotificationDate } from "@/modules/notifications/utils/format-notification-date";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import { useRatingPopupStore } from "@/modules/class-history/hooks/useRatingPopupStore";
import { useClaimPopupStore } from "@/modules/claim/hooks/useClaimPopupStore";
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
    title: "Reserva confirmada",
    message: "Tu clase fue confirmada",
    referenceId: "b-1",
    read: false,
    createdAt: "2026-10-20T15:14:00",
    expiresAt: null,
    actionStatus: "NONE",
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
    useRatingPopupStore.setState({ bookingId: null });
    useClaimPopupStore.setState({ bookingId: null });
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

  it("muestra el titulo en negrita y el mensaje debajo", () => {
    render_item(makeNotification());

    expect(screen.getByText("Reserva confirmada")).toBeInTheDocument();
    expect(screen.getByText("Tu clase fue confirmada")).toBeInTheDocument();
    expect(screen.getByText("Ver →")).toBeInTheDocument();
  });

  it("usa el mensaje como titulo cuando title es null", () => {
    render_item(makeNotification({ title: null }));

    expect(screen.getByText("Tu clase fue confirmada")).toBeInTheDocument();
    expect(screen.queryByText("Reserva confirmada")).not.toBeInTheDocument();
  });

  it("muestra la fecha y hora formateadas en es-AR", () => {
    render_item(makeNotification());

    const expectedDate = formatNotificationDate("2026-10-20T15:14:00").replace(/\s+/g, " ");
    expect(screen.getByText(expectedDate)).toBeInTheDocument();
  });

  it("destaca visualmente la notificacion no leida", () => {
    render_item(makeNotification());

    expect(screen.getByRole("button")).toHaveStyle({ backgroundColor: "#F4F3FB" });
    expect(screen.getByText("Reserva confirmada")).toHaveStyle({ fontWeight: "600" });
  });

  it("renderiza la notificacion leida sin destacar", () => {
    render_item(makeNotification({ read: true }));

    expect(screen.getByRole("button")).toHaveStyle({ backgroundColor: "#FFFFFF" });
    expect(screen.getByText("Reserva confirmada")).toHaveStyle({ fontWeight: "400" });
  });

  it("abre el popup de calificacion para RATING_ENABLED sin navegar", async () => {
    const user = userEvent.setup();
    const { onClose } = render_item(
      makeNotification({
        type: "RATING_ENABLED",
        title: "Calificá tu sesión de Física 1",
        message: "Contanos cómo fue tu experiencia",
        referenceId: "b-9",
        actionStatus: "PENDING",
      })
    );

    await user.click(screen.getByRole("button"));

    expect(useRatingPopupStore.getState().bookingId).toBe("b-9");
    expect(navigateMock).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
    expect(screen.getByText("Calificar →")).toBeInTheDocument();
  });

  it("abre el popup de reclamo para SESSION_COMPLETED sin navegar", async () => {
    const user = userEvent.setup();
    render_item(
      makeNotification({
        type: "SESSION_COMPLETED",
        title: "Tu sesión de Física 1 finalizó",
        message: "Si hubo algún inconveniente con la asistencia, tenés 24 horas para reclamarlo.",
        referenceId: "b-7",
      })
    );

    await user.click(screen.getByRole("button"));

    expect(useClaimPopupStore.getState().bookingId).toBe("b-7");
    expect(navigateMock).not.toHaveBeenCalled();
    expect(screen.getByText("Reclamar →")).toBeInTheDocument();
  });

  it("muestra Ya calificaste y atenua la fila cuando la notificacion esta completada", () => {
    const { onMarkAsRead } = render_item(
      makeNotification({
        type: "RATING_ENABLED",
        title: "Calificá tu sesión de Física 1",
        message: "Contanos cómo fue tu experiencia",
        referenceId: "b-9",
        actionStatus: "COMPLETED",
      })
    );

    expect(screen.getByText("Ya calificaste")).toBeInTheDocument();
    expect(screen.queryByText("Calificar →")).not.toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveStyle({ opacity: "0.7" });
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-label",
      expect.stringContaining("Ya calificaste.")
    );
    expect(onMarkAsRead).not.toHaveBeenCalled();
  });

  it("muestra Venció el plazo cuando la notificacion expiro", () => {
    render_item(
      makeNotification({
        type: "RATING_ENABLED",
        title: "Calificá tu sesión de Física 1",
        message: "Contanos cómo fue tu experiencia",
        referenceId: "b-9",
        actionStatus: "EXPIRED",
      })
    );

    expect(screen.getByText("Venció el plazo")).toBeInTheDocument();
    expect(screen.queryByText("Calificar →")).not.toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveStyle({ opacity: "0.7" });
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-label",
      expect.stringContaining("Venció el plazo para calificar.")
    );
  });

  it("abre el popup al tocar una notificacion completada", async () => {
    const user = userEvent.setup();
    render_item(
      makeNotification({
        type: "RATING_ENABLED",
        title: "Calificá tu sesión de Física 1",
        message: "Contanos cómo fue tu experiencia",
        referenceId: "b-9",
        actionStatus: "COMPLETED",
      })
    );

    await user.click(screen.getByRole("button"));

    expect(useRatingPopupStore.getState().bookingId).toBe("b-9");
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("abre el popup al tocar una notificacion vencida", async () => {
    const user = userEvent.setup();
    render_item(
      makeNotification({
        type: "RATING_ENABLED",
        title: "Calificá tu sesión de Física 1",
        message: "Contanos cómo fue tu experiencia",
        referenceId: "b-9",
        actionStatus: "EXPIRED",
      })
    );

    await user.click(screen.getByRole("button"));

    expect(useRatingPopupStore.getState().bookingId).toBe("b-9");
    expect(navigateMock).not.toHaveBeenCalled();
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
