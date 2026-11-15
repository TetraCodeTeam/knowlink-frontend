import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBookingCalendar } from "@/modules/student/booking/api/booking.api";
import { BOOKING_CALENDAR_REFRESH_INTERVAL_MS } from "@/modules/student/booking/constants/bookingRefresh.constants";

interface UseBookingSlotsOptions {
  /**
   * Congela la actualización automática. Se usa mientras el alumno tiene un horario seleccionado:
   * el calendario ya está bloqueado y no conviene que cambie bajo la reserva que está confirmando.
   * Al volver a `false` se pide el calendario de inmediato.
   */
  paused?: boolean;
}

export function useBookingSlots(
  tutorId: string,
  from: string,
  to: string,
  { paused = false }: UseBookingSlotsOptions = {}
) {
  const query = useQuery({
    queryKey: ["booking-calendar", tutorId, from, to],
    queryFn: async () => {
      const calendar = await getBookingCalendar(tutorId, from, to);
      return { slots: calendar.slots, minimumNoticeMinutes: calendar.minimumNoticeMinutes ?? 0 };
    },
    enabled: Boolean(tutorId),
    // El backend recorta los bloques de hoy que ya empezaron, así que lo que devuelve cambia solo con
    // el paso del tiempo. Se vuelve a pedir cada minuto (solo con la pestaña visible), al volver a la
    // pestaña y al entrar a la pantalla, aunque el dato "fresco" de la caché siga sin vencer.
    refetchInterval: paused ? false : BOOKING_CALENDAR_REFRESH_INTERVAL_MS,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: paused ? false : "always",
    refetchOnMount: "always",
    // Un fallo de red en una actualización en segundo plano no debe llenar de avisos la pantalla: el
    // alumno ya ve el último calendario. El primer error de carga sí se sigue avisando.
    meta: { silentWhenCached: true },
  });

  const { refetch } = query;
  const wasPausedRef = useRef(paused);
  useEffect(() => {
    // Terminó la selección (se liberó, venció o se reservó): el calendario pudo quedar viejo.
    if (wasPausedRef.current && !paused) void refetch({ cancelRefetch: false });
    wasPausedRef.current = paused;
  }, [paused, refetch]);

  return query;
}
