import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Alert, Box, Typography } from "@mui/material";
import BookingCard from "@/modules/student/booking/components/BookingCard";
import BookingCalendar from "@/modules/student/booking/components/BookingCalendar";
import AppButton from "@/shared/components/AppButton";
import type { BookingSlot } from "@/modules/student/booking/interfaces/bookingSlotType";
import { useBookingRealtime } from "@/modules/student/booking/hooks/useBookingRealtime";
import { useActiveHold } from "@/modules/student/booking/hooks/useActiveHold";
import { getCurrentWeekMonday, getWeekEnd, toDateStr } from "@/shared/utils/calendarDateUtils";
import { getErrorMessage } from "@/shared/utils/errors";
import type { ActiveHoldResponse } from "@/modules/student/booking/interfaces/responses/activeHold.interface";

const WEEKS_AHEAD = 3;

function toBookingSlot(hold: ActiveHoldResponse): BookingSlot {
  const start = new Date(hold.start);
  const end = new Date(hold.end);
  const durationHours = (end.getTime() - start.getTime()) / (60 * 60 * 1000);

  return {
    id: `${hold.timeSlotId}__${hold.start}__${hold.end}`,
    startIso: hold.start,
    endIso: hold.end,
    date: start.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" }),
    startTime: start.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
    endTime: end.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
    durationHours,
    expiresAt: hold.expiresAt,
  };
}

export default function BookingClassPage() {
  const { tutorId = "" } = useParams<{ tutorId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [slot, setSlot] = useState<BookingSlot | null>(null);

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

  const activeHoldBelongsHere =
    activeHoldData?.hasActiveHold && activeHoldData.hold?.tutorUserId === tutorId;
  const activeHoldElsewhere =
    activeHoldData?.hasActiveHold && activeHoldData.hold?.tutorUserId !== tutorId
      ? activeHoldData.hold
      : null;

  // Al entrar (o volver) a la pantalla, si hay un hold activo con ESTE
  // tutor, se reconstruye como si el alumno lo acabara de seleccionar —
  // mismo bloque, mismo timer, misma tarjeta de reserva ya lista. Sin esto,
  // recargar la página "perdía" visualmente una reserva que sigue vigente
  // del lado del servidor.
  useEffect(() => {
    if (activeHoldBelongsHere && activeHoldData?.hold && !slot) {
      setSlot(toBookingSlot(activeHoldData.hold));
    }
  }, [activeHoldBelongsHere, activeHoldData, slot]);

  const invalidateActiveHold = () => queryClient.invalidateQueries({ queryKey: ["active-hold"] });

  const handleSelectSlot = async (nextSlot: BookingSlot) => {
    try {
      const { expiresAt } = await holdSlot(nextSlot);
      setSlot({ ...nextSlot, expiresAt });
      invalidateActiveHold();
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
      invalidateActiveHold();
    }
  };

  const handleReserveBooking: NonNullable<
    Parameters<typeof BookingCard>[0]["onReserveBooking"]
  > = async (s, data) => {
    await reserveSlot(s, data);
    invalidateActiveHold();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 4 }}>
      {activeHoldElsewhere && (
        <Alert severity="info">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              gap: 2,
            }}
          >
            <Typography variant="body2">
              Tenés una selección de horario en curso con{" "}
              <strong>{activeHoldElsewhere.tutorFullName}</strong>.
            </Typography>
            <AppButton
              appVariant="outline"
              onClick={() => navigate(`/student/tutor/${activeHoldElsewhere.tutorUserId}/booking`)}
            >
              Ir a esa reserva
            </AppButton>
          </Box>
        </Alert>
      )}

      <Box sx={{ display: "flex", gap: 4, alignItems: "stretch" }}>
        <Box sx={{ flex: 1 }}>
          <BookingCalendar
            bookingSlots={bookingSlots}
            minimumNoticeMinutes={minimumNoticeMinutes}
            selectedSlot={slot}
            onSelectSlot={(nextSlot) => void handleSelectSlot(nextSlot)}
            onDeselectSlot={() => void handleDeselectSlot()}
            onViewedRangeChange={setViewedRange}
          />
        </Box>
        <BookingCard
          selectedSlot={slot}
          onReserveBooking={handleReserveBooking}
          onReleaseBooking={releaseSlot}
          onCancelSelectedSlot={() => setSlot(null)}
          tutorId={tutorId}
        />
      </Box>
    </Box>
  );
}
