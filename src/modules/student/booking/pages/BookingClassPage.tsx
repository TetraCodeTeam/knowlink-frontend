import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Alert, Box } from "@mui/material";
import BookingCard from "@/modules/student/booking/components/BookingCard";
import BookingCalendar from "@/modules/student/booking/components/BookingCalendar";
import AppButton from "@/shared/components/AppButton";
import type {
  BookingSlot,
  SelectableSlot,
} from "@/modules/student/booking/interfaces/bookingSlotType";
import { useBookingRealtime } from "@/modules/student/booking/hooks/useBookingRealtime";
import { useActiveHold } from "@/modules/student/booking/hooks/useActiveHold";
import { getCurrentWeekMonday, getWeekEnd, toDateStr } from "@/shared/utils/calendarDateUtils";
import { getErrorMessage } from "@/shared/utils/errors";
import { studentPaths } from "@/routes/paths";
import { buildSelectableSlot } from "@/modules/student/booking/utils/bookingSlotFormat";
import type { ActiveHoldResponse } from "@/modules/student/booking/interfaces/responses/activeHold.interface";

const WEEKS_AHEAD = 3;

function toBookingSlot(hold: ActiveHoldResponse): BookingSlot {
  return {
    ...buildSelectableSlot(hold.timeSlotId, {
      start: new Date(hold.start),
      end: new Date(hold.end),
    }),
    expiresAt: hold.expiresAt,
  };
}

export default function BookingClassPage() {
  const { tutorId = "" } = useParams<{ tutorId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [slot, setSlot] = useState<BookingSlot | null>(null);
  const restoredForRef = useRef<string | null>(null);

  const currentMonday = useMemo(() => getCurrentWeekMonday(), []);
  const fixedFrom = toDateStr(currentMonday);
  const fixedTo = useMemo(() => {
    const rangeEnd = getWeekEnd(currentMonday);
    rangeEnd.setDate(rangeEnd.getDate() + WEEKS_AHEAD * 7);
    return toDateStr(rangeEnd);
  }, [currentMonday]);

  // Rango real a consultar: el fijo inicial, o el que abarque la semana que
  // el alumno esté mirando en este momento, lo que sea más amplio — mismo
  // criterio que ya usamos en useAvailabilityDraft del lado del tutor.
  const [viewedRange, setViewedRange] = useState({ start: fixedFrom, end: fixedTo });

  const from = viewedRange.start < fixedFrom ? viewedRange.start : fixedFrom;
  const to = viewedRange.end > fixedTo ? viewedRange.end : fixedTo;

  const { bookingSlots, minimumNoticeMinutes, holdSlot, reserveSlot, releaseSlot } =
    useBookingRealtime(tutorId, from, to);

  const { data: activeHoldData } = useActiveHold();

  const activeHoldElsewhere =
    activeHoldData?.hasActiveHold && activeHoldData.hold?.tutorUserId !== tutorId
      ? activeHoldData.hold
      : null;

  // Al entrar (o volver) a la pantalla, si hay un hold activo con ESTE
  // tutor y todavía no lo restauramos, se reconstruye como si el alumno lo
  // acabara de seleccionar — mismo bloque, mismo timer, misma tarjeta de
  // reserva ya lista. El restoredForRef evita que esto se repita en cada
  // refetch (por ejemplo, al invalidar la query tras seleccionar/liberar/
  // reservar) y "resucite" un hold que el propio usuario ya liberó o dejó
  // vencer en esta misma visita a la pantalla.
  useEffect(() => {
    const hold = activeHoldData?.hold;
    if (!hold || hold.tutorUserId !== tutorId) return;
    if (restoredForRef.current === tutorId) return;
    if (new Date(hold.expiresAt).getTime() <= Date.now()) return;

    restoredForRef.current = tutorId;
    setSlot(toBookingSlot(hold));
  }, [activeHoldData, tutorId]);

  // Sacamos el hold vencido/liberado del cache de inmediato (sin esperar el
  // round-trip del refetch) y además invalidamos, para que la próxima
  // lectura del hook ya no lo vea — evita la ventana donde el efecto de
  // arriba podría volver a restaurarlo mientras el refetch está en vuelo.
  const clearActiveHoldCache = () => {
    queryClient.setQueryData(["active-hold"], { hasActiveHold: false, hold: null });
    queryClient.invalidateQueries({ queryKey: ["active-hold"] });
  };

  const handleSelectSlot = async (nextSlot: SelectableSlot) => {
    try {
      const { expiresAt } = await holdSlot(nextSlot);
      // Marcamos esta selección como "ya restaurada" para este tutor, así el
      // useEffect no la vuelve a pisar cuando invalidateActiveHold dispare
      // un refetch — sin esto, el slot recién elegido a mano podía
      // reemplazarse por el que arma toBookingSlot() a partir del hold.
      restoredForRef.current = tutorId;
      setSlot({ ...nextSlot, expiresAt });
      queryClient.invalidateQueries({ queryKey: ["active-hold"] });
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(error, "No se pudo seleccionar este horario. Intentá nuevamente."),
        { id: "select-slot-error" }
      );
      setSlot(null);
    }
  };

  const handleDeselectSlot = async () => {
    if (!slot) return;
    try {
      await releaseSlot(slot);
    } catch {
      // liberar es best-effort — si falla igual limpiamos la selección local
    } finally {
      setSlot(null);
      clearActiveHoldCache();
    }
  };

  const handleReserveBooking: NonNullable<
    Parameters<typeof BookingCard>[0]["onReserveBooking"]
  > = async (s, data) => {
    await reserveSlot(s, data);
    clearActiveHoldCache();
  };

  // Cubre tanto el botón "Volver" de BookingCard como el vencimiento del
  // timer (BookingCard ya libera el hold internamente en ese caso) — antes
  // solo hacía setSlot(null), dejando el hold vencido cacheado en
  // ["active-hold"] hasta que staleTime lo refrescara solo.
  const handleCancelSelectedSlot = () => {
    setSlot(null);
    clearActiveHoldCache();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 4 }}>
      {activeHoldElsewhere && (
        <Alert
          severity="info"
          action={
            <AppButton
              appVariant="outline"
              onClick={() => navigate(studentPaths.bookingWithTutor(activeHoldElsewhere.tutorUserId))}
            >
              Ir a esa reserva
            </AppButton>
          }
        >
          Tenés una selección de horario en curso con{" "}
          <strong>{activeHoldElsewhere.tutorFullName}</strong>.
        </Alert>
      )}

      <Box sx={{ display: "flex", gap: 4, alignItems: "stretch" }}>
        <Box sx={{ flex: 1 }}>
          <BookingCalendar
            bookingSlots={bookingSlots}
            minimumNoticeMinutes={minimumNoticeMinutes}
            selectedSlot={slot}
            disabled={Boolean(activeHoldElsewhere)}
            onSelectSlot={(nextSlot) => void handleSelectSlot(nextSlot)}
            onDeselectSlot={() => void handleDeselectSlot()}
            onViewedRangeChange={setViewedRange}
          />
        </Box>
        <BookingCard
          selectedSlot={slot}
          onReserveBooking={handleReserveBooking}
          onReleaseBooking={releaseSlot}
          onCancelSelectedSlot={handleCancelSelectedSlot}
          tutorId={tutorId}
        />
      </Box>
    </Box>
  );
}
