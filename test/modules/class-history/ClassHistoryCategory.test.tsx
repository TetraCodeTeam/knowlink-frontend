import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ClassHistoryCard from "@/modules/class-history/components/ClassHistoryCard";
import { CATEGORY_TABS } from "@/modules/class-history/constants/classHistory.constants";
import type { BookingHistoryItem } from "@/modules/class-history/interfaces/responses/booking-history-item.interface";

vi.mock("@/modules/class-history/hooks/useBookingDetail", () => ({
  useBookingDetail: () => ({ detail: null, isLoading: false, isError: false }),
}));

const notConfirmedItem: BookingHistoryItem = {
  bookingId: "booking-1",
  otherPartyFullName: "María Luz Juárez",
  otherPartyProfilePictureUrl: null,
  subjectName: "Física 1",
  sessionDate: "2026-10-20",
  startTime: "10:00:00",
  endTime: "11:00:00",
  modality: "VIRTUAL",
  status: "NOT_CONFIRMED",
};

describe("historial de clases - no confirmadas", () => {
  it("expone la pestana No confirmadas separada de Canceladas", () => {
    const notConfirmedTab = CATEGORY_TABS.find((tab) => tab.category === "NOT_CONFIRMED");
    const cancelledTab = CATEGORY_TABS.find((tab) => tab.category === "CANCELLED");

    expect(notConfirmedTab?.label).toBe("No confirmadas");
    expect(cancelledTab?.label).toBe("Canceladas");
    expect(CATEGORY_TABS.map((tab) => tab.category)).not.toContain(undefined);
  });

  it("muestra el estado No confirmada en la tarjeta", () => {
    render(<ClassHistoryCard item={notConfirmedItem} role="STUDENT" category="NOT_CONFIRMED" />);

    expect(screen.getByText("No confirmada")).toBeInTheDocument();
  });
});
