import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ClassHistoryCard from "@/modules/class-history/components/ClassHistoryCard";
import type { BookingHistoryDetail } from "@/modules/class-history/interfaces/responses/booking-history-detail.interface";
import type { BookingHistoryItem } from "@/modules/class-history/interfaces/responses/booking-history-item.interface";
import type { BookingHistoryCategory } from "@/modules/class-history/types/booking-history-category.type";
import type { BookingRole } from "@/modules/class-history/types/booking-role.type";

const detailState = vi.hoisted(() => ({ detail: undefined as BookingHistoryDetail | undefined }));

vi.mock("@/modules/class-history/hooks/useBookingDetail", () => ({
  useBookingDetail: () => ({
    detail: detailState.detail,
    isLoading: false,
    isError: false,
  }),
}));

// StartClaimFlow pide la elegibilidad de reclamo al montar: sin este mock el
// test dispararia una request real a la API.
vi.mock("@/modules/claim/hooks/useClaimEligibility", () => ({
  useClaimEligibility: () => ({ eligibility: undefined, isLoading: false, isError: false }),
}));

const item: BookingHistoryItem = {
  bookingId: "booking-1",
  otherPartyFullName: "María Luz Juárez",
  otherPartyProfilePictureUrl: null,
  subjectName: "Física 1",
  sessionDate: "2026-10-20",
  startTime: "10:00:00",
  endTime: "11:00:00",
  modality: "VIRTUAL",
  status: "BOOKED",
};

function makeDetail(overrides: Partial<BookingHistoryDetail> = {}): BookingHistoryDetail {
  return {
    bookingId: "booking-1",
    otherPartyFullName: "María Luz Juárez",
    otherPartyProfilePictureUrl: null,
    subjectName: "Física 1",
    sessionDate: "2026-10-20",
    startTime: "10:00:00",
    endTime: "11:00:00",
    modality: "VIRTUAL",
    status: "BOOKED",
    amount: 15000,
    topic: "Repaso de UML",
    virtualSessionLink: "https://meet.example.com/abc",
    address: null,
    createdAt: "2026-10-15T10:00:00",
    ratingStatus: "PENDING",
    ...overrides,
  };
}

function renderCard(
  role: BookingRole = "TUTOR",
  category: BookingHistoryCategory = "RESERVED",
  detail: BookingHistoryDetail = makeDetail()
) {
  detailState.detail = detail;

  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );

  render(<ClassHistoryCard item={item} role={role} category={category} />, { wrapper });
  fireEvent.click(screen.getByRole("button", { name: "Expandir detalle" }));
}

describe("ClassHistoryCard - tema a tratar", () => {
  it("muestra al tutor el tema que escribio el alumno al reservar", () => {
    renderCard("TUTOR");

    expect(screen.getByText("Tema a tratar")).toBeInTheDocument();
    expect(screen.getByText("“Repaso de UML”")).toBeInTheDocument();
  });

  // Decision del punto 3 del spec: la fila es visible para ambos roles. Es la
  // misma card y el alumno ve el texto que el mismo escribio al reservar.
  it("tambien lo muestra al alumno (STUDENT)", () => {
    renderCard("STUDENT");

    expect(screen.getByText("Tema a tratar")).toBeInTheDocument();
    expect(screen.getByText("“Repaso de UML”")).toBeInTheDocument();
  });

  it.each(["", "   ", null])(
    "no muestra la fila cuando topic=%j (vacio, solo espacios o null)",
    (topic) => {
      renderCard("TUTOR", "RESERVED", makeDetail({ topic: topic as string }));

      expect(screen.queryByText("Tema a tratar")).not.toBeInTheDocument();
    }
  );

  it("muestra el tema como texto literal sin interpretar el HTML del alumno", () => {
    renderCard("TUTOR", "RESERVED", makeDetail({ topic: "<b>hola</b>" }));

    expect(screen.getByText("Tema a tratar")).toBeInTheDocument();
    expect(screen.getByText("“<b>hola</b>”")).toBeInTheDocument();
    expect(document.querySelector("b")).toBeNull();
  });

  it("convive el tema con el cuadro del enlace de videollamada", () => {
    renderCard("TUTOR", "RESERVED");

    expect(screen.getByText("Tema a tratar")).toBeInTheDocument();
    expect(screen.getByText("Enlace de la videollamada para el alumno")).toBeInTheDocument();
  });
});
