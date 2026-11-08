import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RateBookingDialog from "@/modules/class-history/components/RateBookingDialog";
import type { BookingHistoryDetail } from "@/modules/class-history/interfaces/responses/booking-history-detail.interface";

const detail: BookingHistoryDetail = {
  bookingId: "b-1",
  otherPartyFullName: "María Luz Juárez",
  otherPartyProfilePictureUrl: null,
  subjectName: "Física 1",
  sessionDate: "2026-10-20",
  startTime: "10:00:00",
  endTime: "11:00:00",
  modality: "VIRTUAL",
  status: "COMPLETED",
  amount: 15000,
  topic: "Repaso",
  virtualSessionLink: "https://meet.example.com/abc",
  address: null,
  createdAt: "2026-10-15T10:00:00",
  ratingStatus: "PENDING",
};

function renderDialog(
  onConfirm = vi.fn(),
  props: Partial<ComponentProps<typeof RateBookingDialog>> = {}
) {
  render(
    <RateBookingDialog
      open
      detail={detail}
      role="STUDENT"
      isPending={false}
      onConfirm={onConfirm}
      onCancel={vi.fn()}
      {...props}
    />
  );
  return { onConfirm };
}

describe("RateBookingDialog", () => {
  it("mantiene Enviar deshabilitado hasta elegir un puntaje", async () => {
    const user = userEvent.setup();
    renderDialog();

    const submit = screen.getByRole("button", { name: "Enviar" });
    expect(submit).toBeDisabled();

    await user.click(screen.getByRole("radio", { name: "5 estrellas" }));
    expect(submit).toBeEnabled();
  });

  it("permite enviar sin comentario", async () => {
    const user = userEvent.setup();
    const { onConfirm } = renderDialog();

    await user.click(screen.getByRole("radio", { name: "5 estrellas" }));
    await user.click(screen.getByRole("button", { name: "Enviar" }));

    expect(onConfirm).toHaveBeenCalledWith({ score: 5, comment: "" }, expect.anything());
  });

  it("envia el comentario cuando se completa", async () => {
    const user = userEvent.setup();
    const { onConfirm } = renderDialog();

    await user.click(screen.getByRole("radio", { name: "4 estrellas" }));
    await user.type(screen.getByRole("textbox"), "Muy buena clase");
    await user.click(screen.getByRole("button", { name: "Enviar" }));

    expect(onConfirm).toHaveBeenCalledWith(
      { score: 4, comment: "Muy buena clase" },
      expect.anything()
    );
  });

  describe("modo obligatorio", () => {
    it("muestra el titulo, la descripcion y un unico boton Calificar", async () => {
      const user = userEvent.setup();
      renderDialog(vi.fn(), { mandatory: true, onCancel: undefined });

      expect(screen.getByText("Calificá tu sesión para continuar")).toBeInTheDocument();
      expect(
        screen.getByText("Para seguir usando KnowLink, tenés que calificar esta sesión.")
      ).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Cancelar" })).not.toBeInTheDocument();

      const submit = screen.getByRole("button", { name: "Calificar" });
      expect(submit).toBeDisabled();

      await user.click(screen.getByRole("radio", { name: "5 estrellas" }));
      expect(submit).toBeEnabled();
    });

    it("no se cierra con Escape", async () => {
      const user = userEvent.setup();
      renderDialog(vi.fn(), { mandatory: true, onCancel: undefined });

      await user.keyboard("{Escape}");

      expect(screen.getByText("Calificá tu sesión para continuar")).toBeInTheDocument();
    });

    it("muestra el contador de sesiones pendientes cuando hay mas de una", () => {
      renderDialog(vi.fn(), { mandatory: true, pendingCount: 2 });

      expect(screen.getByText("Tenés 2 sesiones por calificar")).toBeInTheDocument();
    });

    it("muestra el error inline con role alert", () => {
      renderDialog(vi.fn(), {
        mandatory: true,
        errorMessage: "No pudimos registrar tu calificación.",
      });

      expect(screen.getByRole("alert")).toHaveTextContent("No pudimos registrar tu calificación.");
    });
  });
});
