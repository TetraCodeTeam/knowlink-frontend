import { useCallback, useMemo, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type {
  DateSelectArg,
  DateSpanApi,
  EventClickArg,
  DayHeaderContentArg,
  DayCellContentArg,
  DatesSetArg,
} from "@fullcalendar/core";
import { Box, Switch, Typography } from "@mui/material";
import AvailabilityInfoNote from "@/modules/tutor/availability/components/AvailabilityInfoNote";
import AppButton from "@/shared/components/AppButton";
import AvailabilityDayHeader from "@/modules/tutor/availability/components/AvailabilityDayHeader";
import AvailabilityLegend from "@/modules/tutor/availability/components/AvailabilityLegend";
import AvailabilityWeekCustomizationBanner from "@/modules/tutor/availability/components/AvailabilityWeekCustomizationBanner";
import { calendarBaseSx } from "@/shared/styles/calendarBaseSx";
import { useAvailabilityDraft } from "@/modules/tutor/availability/hooks/useAvailabilityDraft";
import { isBeforeToday } from "@/shared/utils/calendarDateUtils";
import AppConfirmDialog from "@/shared/components/AppConfirmDialog";
import { Trash2 } from "lucide-react";

const HEADER_TOOLBAR = { left: "prev,next", center: "title", right: "" };
const TITLE_FORMAT = { month: "short" as const, day: "numeric" as const, year: "numeric" as const };
const SLOT_LABEL_FORMAT = {
  hour: "2-digit" as const,
  minute: "2-digit" as const,
  hour12: false as const,
};
const PLUGINS = [timeGridPlugin, interactionPlugin];

export default function AvailabilityEditor() {
  const calendarRef = useRef<FullCalendar>(null);

  const {
    isLoading,
    isPending,
    currentMondayStr,
    events,
    hasChanges,
    effectiveRepeatWeekly,
    repeatWeeksAhead,
    setRepeatWeekly,
    selectAllow,
    addDraftBlock,
    removeDraftBlock,
    handleDatesSet,
    isConfirmDialogOpen,
    requestSave,
    confirmSave,
    cancelSave,
    isWeekCustomized,
    isRemovingCustomization,
    removeWeekCustomization,
    isClearConfirmOpen,
    requestClearWeek,
    confirmClearWeek,
    cancelClearWeek,
    isInheritedRepeat,
  } = useAvailabilityDraft();

  const validRange = useMemo(() => ({ start: currentMondayStr }), [currentMondayStr]);

  const handleSelect = useCallback(
    (info: DateSelectArg) => {
      const added = addDraftBlock(info.start, info.end);
      if (!added) {
        calendarRef.current?.getApi().unselect();
      }
    },
    [addDraftBlock]
  );

  const handleEventClick = useCallback(
    (info: EventClickArg) => {
      removeDraftBlock(info.event.id);
    },
    [removeDraftBlock]
  );

  const handleDatesSetInternal = useCallback(
    (arg: DatesSetArg) => handleDatesSet(arg.start),
    [handleDatesSet]
  );

  const dayHeaderContent = useCallback(
    (arg: DayHeaderContentArg) => <AvailabilityDayHeader date={arg.date} />,
    []
  );

  const dayCellClassNames = useCallback(
    (arg: DayCellContentArg) => (isBeforeToday(arg.date) ? ["fc-past-day"] : []),
    []
  );

  const handleSelectAllow = useCallback((info: DateSpanApi) => selectAllow(info), [selectAllow]);

  if (isLoading) return null;

  return (
    <Box sx={calendarBaseSx}>
      <AvailabilityLegend />

      <FullCalendar
        ref={calendarRef}
        plugins={PLUGINS}
        initialView="timeGridWeek"
        initialDate={currentMondayStr}
        validRange={validRange}
        headerToolbar={HEADER_TOOLBAR}
        titleFormat={TITLE_FORMAT}
        datesSet={handleDatesSetInternal}
        dayHeaderContent={dayHeaderContent}
        dayCellClassNames={dayCellClassNames}
        allDaySlot={false}
        slotMinTime="08:00:00"
        slotMaxTime="23:00:00"
        slotDuration="00:30:00"
        slotLabelInterval="01:00:00"
        slotLabelFormat={SLOT_LABEL_FORMAT}
        selectable
        selectAllow={handleSelectAllow}
        selectOverlap={(event) => event.display === "background"}
        eventOverlap={false}
        select={handleSelect}
        events={events}
        eventClick={handleEventClick}
        eventColor="#5B6ED9"
        eventBorderColor="#5B6ED9"
        height={600}
        locale="es"
        firstDay={1}
      />

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 2 }}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body1">Repetir horarios semanalmente</Typography>
            <Switch checked={effectiveRepeatWeekly} onChange={(_, val) => setRepeatWeekly(val)} />
          </Box>
          {isInheritedRepeat && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: "block", mt: 0.5 }}
            >
              Este horario se repite porque configuraste repetición en una semana anterior.
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 1.5 }}>
          <AppButton
            appVariant="soft-danger"
            onClick={requestClearWeek}
            disabled={events.length === 0}
            loading={isPending}
            startIcon={<Trash2 size={16} />}
          >
            Borrar todo
          </AppButton>
          <AppButton
            appVariant="primary"
            onClick={requestSave}
            loading={isPending}
            disabled={!hasChanges}
          >
            ✓ Guardar
          </AppButton>
        </Box>
      </Box>

      <AppConfirmDialog
        open={isConfirmDialogOpen}
        title="Confirmar repetición semanal"
        message={`Activaste "Repetir horarios semanalmente". Este horario se va a repetir automáticamente durante las próximas ${repeatWeeksAhead} semanas, salvo en las semanas donde ya hayas configurado un horario distinto - esas quedan como están. ¿Querés continuar?`}
        severity="warning"
        onConfirm={confirmSave}
        onCancel={cancelSave}
        isPending={isPending}
      />

      <AppConfirmDialog
        open={isClearConfirmOpen}
        title="¿Borrar todos los bloques de esta semana?"
        message="Se van a eliminar todos los horarios disponibles que configuraste para esta semana. Esta acción no se puede deshacer."
        severity="danger"
        confirmLabel="Borrar todo"
        onConfirm={confirmClearWeek}
        onCancel={cancelClearWeek}
        isPending={isPending}
      />
      {isWeekCustomized && (
        <AvailabilityWeekCustomizationBanner
          onRestore={removeWeekCustomization}
          isPending={isRemovingCustomization}
        />
      )}

      <AvailabilityInfoNote weeksAhead={repeatWeeksAhead} />
    </Box>
  );
}
