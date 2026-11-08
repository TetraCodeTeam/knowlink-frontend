import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, useLocation } from "react-router-dom";
import CategoryTabs from "@/modules/class-history/components/CategoryTabs";
import ClassHistoryCard from "@/modules/class-history/components/ClassHistoryCard";
import ClassHistoryPage from "@/modules/class-history/components/ClassHistoryPage";
import { useBookingHistory } from "@/modules/class-history/hooks/useBookingHistory";
import { CATEGORY_TABS } from "@/modules/class-history/constants/classHistory.constants";
import type { BookingHistoryItem } from "@/modules/class-history/interfaces/responses/booking-history-item.interface";

vi.mock("@/modules/class-history/hooks/useBookingDetail", () => ({
  useBookingDetail: () => ({ detail: null, isLoading: false, isError: false }),
}));

vi.mock("@/modules/class-history/hooks/useBookingHistory", () => ({
  useBookingHistory: vi.fn(() => ({
    items: [],
    hasNext: false,
    goToNextPage: vi.fn(),
    isLoading: false,
    isFetchingNextPage: false,
    isError: false,
  })),
}));

const mockedUseBookingHistory = vi.mocked(useBookingHistory);

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

function LocationProbe() {
  const location = useLocation();
  return <span data-testid="location-search">{location.search}</span>;
}

function renderHistoryPage(entry: string) {
  render(
    <MemoryRouter initialEntries={[entry]}>
      <ClassHistoryPage role="STUDENT" />
      <LocationProbe />
    </MemoryRouter>
  );
}

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

  it("renderiza las cinco pestanas y notifica el cambio de categoria", () => {
    const onChange = vi.fn();
    render(<CategoryTabs activeCategory="RESERVED" onChange={onChange} />);

    expect(screen.getAllByRole("button")).toHaveLength(5);

    fireEvent.click(screen.getByRole("button", { name: "No confirmadas" }));

    expect(onChange).toHaveBeenCalledWith("NOT_CONFIRMED");
  });
});

describe("historial de clases - categoria desde la URL", () => {
  beforeEach(() => {
    mockedUseBookingHistory.mockClear();
  });

  it("abre la pestana Canceladas cuando la URL trae category=CANCELLED", () => {
    renderHistoryPage("/student/classes?category=CANCELLED");

    expect(screen.getByRole("button", { name: "Canceladas" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(mockedUseBookingHistory).toHaveBeenCalledWith("STUDENT", "CANCELLED");
  });

  it("cae en Reservadas cuando el parametro de categoria es invalido", () => {
    renderHistoryPage("/student/classes?category=INVALID");

    expect(screen.getByRole("button", { name: "Reservadas" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(mockedUseBookingHistory).toHaveBeenCalledWith("STUDENT", "RESERVED");
  });

  it("actualiza la URL al hacer click en una pestana", () => {
    renderHistoryPage("/student/classes");

    fireEvent.click(screen.getByRole("button", { name: "No confirmadas" }));

    expect(screen.getByTestId("location-search")).toHaveTextContent("?category=NOT_CONFIRMED");
    expect(screen.getByRole("button", { name: "No confirmadas" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });
});
