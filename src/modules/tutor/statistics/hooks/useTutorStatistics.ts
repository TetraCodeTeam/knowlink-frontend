import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTutorStatistics } from "@/modules/tutor/statistics/api/tutor-statistics.api";
import type { TutorStatisticsParams } from "@/modules/tutor/statistics/interfaces/requests/tutor-statistics.request";

export const TUTOR_STATISTICS_QUERY_KEY = "tutorStatistics";

export function useTutorStatistics(params: TutorStatisticsParams) {
  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: [TUTOR_STATISTICS_QUERY_KEY, params.period, params.from, params.to],
    queryFn: () => getTutorStatistics(params),
    // Los datos cambian con cada resultado de sesión, cancelación o calificación (criterio 9):
    // nunca se sirven desde caché al volver a la pantalla.
    staleTime: 0,
    refetchOnMount: "always",
    // Mantiene el panel anterior mientras carga el nuevo período, sin parpadeos.
    placeholderData: keepPreviousData,
  });

  return { statistics: data, isLoading, isFetching, isError, refetch };
}
