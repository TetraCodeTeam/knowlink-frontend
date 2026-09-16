import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import type { WeeklyAgendaResponse } from "@/modules/tutor/availability/interfaces/responses/weekly-agenda.interface";
import { toDateStr } from "@/shared/utils/calendarDateUtils";

/**
 * Devuelve el lunes de la semana que contiene `date`.
 */
function getWeekStart(date: Date): Date {
  const result = new Date(date);
  const dow = result.getDay() === 0 ? 7 : result.getDay();
  result.setDate(result.getDate() - (dow - 1));
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * TODO: reemplazar por la llamada real una vez conectado el endpoint.
 * Debe vivir en `modules/tutor/availability/api/availability.api.ts`
 * como una función más (ej. `getWeeklyAgenda(weekStart: string)`),
 * respetando el flujo api/ -> hooks/ -> components/ del proyecto.
 *
 * La forma de los datos mockeados ya sigue el contrato esperado
 * (WeeklyAgendaResponse) para que no haya que tocar componentes ni
 * utils cuando se conecte el fetch real.
 */
async function fetchWeeklyAgendaMock(weekStart: string): Promise<WeeklyAgendaResponse> {
  return {
    weekStart,
    availabilityBlocks: [
      { id: "a1", dayOfWeek: 1, startTime: "09:00", endTime: "10:00" },
      { id: "a2", dayOfWeek: 3, startTime: "15:00", endTime: "16:30" },
      { id: "a3", dayOfWeek: 5, startTime: "13:30", endTime: "17:00" },
    ],
    bookedSessions: [
      {
        id: "b1",
        subjectName: "Análisis de Sistemas",
        studentName: "Juan Pérez",
        date: weekStart,
        startTime: "10:30",
        endTime: "11:30",
        modality: "VIRTUAL",
      },
      {
        id: "b2",
        subjectName: "Análisis de sistemas",
        studentName: "María Gómez",
        date: weekStart,
        startTime: "13:00",
        endTime: "14:00",
        modality: "IN_PERSON",
      },
      {
        id: "b3",
        subjectName: "Física 1",
        studentName: "Lucía Fernández",
        date: weekStart,
        startTime: "14:00",
        endTime: "15:00",
        modality: "VIRTUAL",
      },
    ],
  };
}

export function useWeeklyAgenda(initialDate: Date = new Date()) {
  const [referenceDate, setReferenceDate] = useState(initialDate);

  const weekStart = useMemo(() => getWeekStart(referenceDate), [referenceDate]);
  const weekStartIso = toDateStr(weekStart);

  const query = useQuery({
    queryKey: ["weekly-agenda", weekStartIso],
    queryFn: () => fetchWeeklyAgendaMock(weekStartIso),
  });

  const goToPreviousWeek = () => {
    setReferenceDate((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() - 7);
      return next;
    });
  };

  const goToNextWeek = () => {
    setReferenceDate((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + 7);
      return next;
    });
  };

  const goToToday = () => setReferenceDate(new Date());

  return {
    ...query,
    weekStart,
    goToPreviousWeek,
    goToNextWeek,
    goToToday,
  };
}
