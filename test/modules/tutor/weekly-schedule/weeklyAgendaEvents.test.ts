import { describe, expect, it } from "vitest";

import type { BookedSessionResponse } from "@/modules/tutor/weekly-schedule/interfaces/responses/weekly-agenda.interface";
import { mapBookedSessionsToEvents } from "@/modules/tutor/weekly-schedule/utils/weeklyAgendaEvents.utils";
import { toDateStr } from "@/shared/utils/calendarDateUtils";

function buildSession(
  overrides: Partial<BookedSessionResponse> & Pick<BookedSessionResponse, "date">
): BookedSessionResponse {
  return {
    id: "booking-1",
    subjectName: "Fisicoquímica",
    studentName: "Juan Perez",
    startTime: "18:00",
    endTime: "19:00",
    modality: "VIRTUAL",
    ...overrides,
  };
}

function dateDaysFromNow(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toDateStr(date);
}

describe("mapBookedSessionsToEvents", () => {
  it("clasifica como pasada una sesión cuya fecha y hora ya pasaron", () => {
    const [event] = mapBookedSessionsToEvents([
      buildSession({ id: "past-1", date: dateDaysFromNow(-1), endTime: "23:59" }),
    ]);

    expect(event?.classNames).toEqual(["fc-block-booked-past"]);
    expect(event?.extendedProps?.isPast).toBe(true);
  });

  it("clasifica como vigente una sesión futura", () => {
    const [event] = mapBookedSessionsToEvents([
      buildSession({ id: "future-1", date: dateDaysFromNow(1), startTime: "08:00", endTime: "09:00" }),
    ]);

    expect(event?.classNames).toEqual(["fc-block-booked-current"]);
    expect(event?.extendedProps?.isPast).toBe(false);
  });

  it("expone id, título, rango horario y datos del alumno", () => {
    const date = dateDaysFromNow(2);
    const [event] = mapBookedSessionsToEvents([
      buildSession({
        id: "booking-42",
        date,
        subjectName: "Balances de Masa y Energía",
      }),
    ]);

    expect(event).toMatchObject({
      id: "booked-booking-42",
      title: "Balances de Masa y Energía",
      start: `${date}T18:00`,
      end: `${date}T19:00`,
      extendedProps: {
        kind: "booked",
        studentName: "Juan Perez",
        timeRangeLabel: "18:00 - 19:00",
      },
    });
  });

  it("devuelve un evento por cada sesión del historial", () => {
    const date = dateDaysFromNow(-3);
    const events = mapBookedSessionsToEvents([
      buildSession({ id: "a", date }),
      buildSession({ id: "b", date }),
    ]);

    expect(events).toHaveLength(2);
    expect(events.map((event) => event.id)).toEqual(["booked-a", "booked-b"]);
  });
});