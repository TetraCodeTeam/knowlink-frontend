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
  ratingDeadline: "2026-10-21T11:00:00",
};

function renderDialog(onConfirm = vi.fn()) {
  render(
    <RateBookingDialog
      open
      detail={detail}
      role="STUDENT"
      isPending={false}
      onConfirm={onConfirm}
      onCancel={vi.fn()}
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
});
