// Configuración pública del módulo de reservas (ej. tarifa de servicio).
// No cambia por tutor, así que se cachea de forma indefinida en la sesión.
import { useQuery } from "@tanstack/react-query";
import { getBookingConfig } from "@/modules/student/booking/api/booking.api";

export function useBookingConfig() {
  const { data } = useQuery({
    queryKey: ["booking-config"],
    queryFn: getBookingConfig,
    staleTime: Infinity,
  });

  return { serviceFeeRate: data?.serviceFeeRate ?? 0 };
}