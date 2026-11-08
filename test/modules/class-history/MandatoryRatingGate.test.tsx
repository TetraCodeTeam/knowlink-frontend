import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosError, type AxiosResponse } from "axios";
import MandatoryRatingGate from "@/modules/class-history/components/MandatoryRatingGate";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import { RATING_GATE_QUERY_KEYS } from "@/modules/class-history/constants/ratingGate.constants";
import type { PendingRatingItem } from "@/modules/class-history/interfaces/responses/pending-ratings.interface";
import type { PendingRatingsResponse } from "@/modules/class-history/interfaces/responses/pending-ratings.interface";

vi.mock("@/modules/class-history/api/ratingGate.api", () => ({
  getPendingRatings: vi.fn(),
}));

vi.mock("@/modules/class-history/api/classHistory.api", () => ({
  rateBooking: vi.fn(),
}));

import { getPendingRatings } from "@/modules/class-history/api/ratingGate.api";
import { rateBooking } from "@/modules/class-history/api/classHistory.api";

const mockedGetPendingRatings = vi.mocked(getPendingRatings);
const mockedRateBooking = vi.mocked(rateBooking);

const SUBMIT_ERROR = "No pudimos registrar tu calificación. Revisá tu conexión e intentá de nuevo.";

function makeItem(overrides: Partial<PendingRatingItem> = {}): PendingRatingItem {
  return {
    bookingId: "b-1",
    raterRole: "STUDENT",
    subjectName: "Física 1",
    otherPartyFullName: "María Luz Juárez",
    sessionDate: "2026-10-20",
    startTime: "10:00:00",
    endTime: "11:00:00",
    ...overrides,
  };
}

function axiosError(status: number): AxiosError {
  const response = {
    status,
    statusText: "",
    headers: {},
    config: {} as never,
    data: {},
  } as AxiosResponse;

  return new AxiosError("request failed", "ERR_BAD_RESPONSE", undefined, undefined, response);
}

function renderGate() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );

  render(<MandatoryRatingGate />, { wrapper });

  return { client };
}

async function selectStarsAndSubmit(stars = 5) {
  const user = userEvent.setup();
  await user.click(await screen.findByRole("radio", { name: `${stars} estrellas` }));
  await user.click(screen.getByRole("button", { name: "Calificar" }));
  return user;
}

describe("MandatoryRatingGate", () => {
  beforeEach(() => {
    mockedGetPendingRatings.mockReset();
    mockedRateBooking.mockReset();
    useAuthStore.setState({
      isAuthenticated: true,
      authResponse: {
        userId: "u-1",
        email: "alumno@test.com",
        fullName: null,
        token: "token",
        role: "STUDENT",
      } as never,
    });
  });

  it("monta el formulario obligatorio usando el raterRole del pendiente", async () => {
    mockedGetPendingRatings.mockResolvedValue({
      blocking: [makeItem({ raterRole: "TUTOR" })],
      nextBlockAt: null,
    });
    renderGate();

    expect(await screen.findByText("Calificá tu sesión para continuar")).toBeInTheDocument();
    expect(
      screen.getByText("Para seguir usando KnowLink, tenés que calificar esta sesión.")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("¿Cómo fue tu experiencia con este alumno?")
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Cancelar" })).not.toBeInTheDocument();
  });

  it("muestra el contador cuando hay mas de una sesion pendiente", async () => {
    mockedGetPendingRatings.mockResolvedValue({
      blocking: [makeItem(), makeItem({ bookingId: "b-2" })],
      nextBlockAt: null,
    });
    renderGate();

    expect(await screen.findByText("Tenés 2 sesiones por calificar")).toBeInTheDocument();
  });

  it("al calificar muestra el exito, limpia el pendiente y recarga la lista", async () => {
    mockedGetPendingRatings
      .mockResolvedValueOnce({ blocking: [makeItem()], nextBlockAt: null })
      .mockResolvedValue({ blocking: [], nextBlockAt: null });
    mockedRateBooking.mockResolvedValue({} as never);
    const { client } = renderGate();

    const user = await selectStarsAndSubmit();

    expect(await screen.findByText("Calificación enviada")).toBeInTheDocument();
    expect(mockedRateBooking).toHaveBeenCalledWith("b-1", { score: 5, comment: null });

    await user.click(screen.getByRole("button", { name: "Cerrar" }));

    await waitFor(() => {
      expect(screen.queryByText("Calificación enviada")).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByText("Calificá tu sesión para continuar")).not.toBeInTheDocument();
    });
    expect(
      client.getQueryData<PendingRatingsResponse>(RATING_GATE_QUERY_KEYS.pending)
    ).toMatchObject({ blocking: [] });
    expect(mockedGetPendingRatings).toHaveBeenCalledTimes(2);
  });

  it("trata un 409 como ya calificada sin mostrar exito ni error", async () => {
    mockedGetPendingRatings
      .mockResolvedValueOnce({ blocking: [makeItem()], nextBlockAt: null })
      .mockResolvedValue({ blocking: [], nextBlockAt: null });
    mockedRateBooking.mockRejectedValue(axiosError(409));
    renderGate();

    await selectStarsAndSubmit();

    await waitFor(() => {
      expect(screen.queryByText("Calificá tu sesión para continuar")).not.toBeInTheDocument();
    });
    expect(screen.queryByText("Calificación enviada")).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("ante un error de envio muestra el mensaje inline y mantiene el formulario", async () => {
    mockedGetPendingRatings.mockResolvedValue({
      blocking: [makeItem()],
      nextBlockAt: null,
    });
    mockedRateBooking.mockRejectedValue(axiosError(500));
    renderGate();

    await selectStarsAndSubmit();

    expect(await screen.findByRole("alert")).toHaveTextContent(SUBMIT_ERROR);
    expect(screen.getByText("Calificá tu sesión para continuar")).toBeInTheDocument();
    expect(screen.queryByText("Calificación enviada")).not.toBeInTheDocument();
  });

  it("falla abierto cuando no puede consultar las pendientes", async () => {
    mockedGetPendingRatings.mockRejectedValue(new Error("network"));
    renderGate();

    await waitFor(() => {
      expect(mockedGetPendingRatings).toHaveBeenCalledTimes(1);
    });

    expect(screen.queryByText("Calificá tu sesión para continuar")).not.toBeInTheDocument();
  });
});
