import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getWeeklyAgenda } from "@/modules/tutor/weekly-schedule/api/weekly-agenda.api";
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

export function useWeeklyAgenda(initialDate: Date = new Date()) {
  const [referenceDate, setReferenceDate] = useState(initialDate);

  const weekStart = useMemo(() => getWeekStart(referenceDate), [referenceDate]);
  const weekStartIso = toDateStr(weekStart);
  const weekEnd = useMemo(() => {
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 6);
    return end;
  }, [weekStart]);
  const weekEndIso = toDateStr(weekEnd);

  const query = useQuery({
    queryKey: ["weekly-agenda", weekStartIso, weekEndIso],
    queryFn: () => getWeeklyAgenda(weekStartIso, weekEndIso),
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
