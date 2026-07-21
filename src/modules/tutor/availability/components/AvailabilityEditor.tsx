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
import RepeatWeeklyConfirmDialog from "@/modules/tutor/availability/components/RepeatWeeklyConfirmDialog";
import { availabilityCalendarSx } from "@/modules/tutor/availability/styles/availabilityCalendarSx";
import { useAvailabilityDraft } from "@/modules/tutor/availability/hooks/useAvailabilityDraft";
import { isBeforeToday } from "@/modules/tutor/availability/utils/availability.utils";

const HEADER_TOOLBAR = { left: "prev,next", center: "title", right: "" };
const TITLE_FORMAT = { month: "short" as const, day: "numeric" as const };
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
    <Box sx={availabilityCalendarSx}>
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
        selectOverlap={false}
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2">Repetir horarios semanalmente</Typography>
          <Switch checked={effectiveRepeatWeekly} onChange={(_, val) => setRepeatWeekly(val)} />
        </Box>
        <AppButton
          appVariant="primary"
          onClick={requestSave}
          loading={isPending}
          disabled={!hasChanges}
        >
          ✓ Guardar
        </AppButton>
      </Box>

      <RepeatWeeklyConfirmDialog
        open={isConfirmDialogOpen}
        onConfirm={confirmSave}
        onCancel={cancelSave}
        isPending={isPending}
        weeksAhead={repeatWeeksAhead}
      />

      <AvailabilityInfoNote weeksAhead={repeatWeeksAhead} />
    </Box>
  );
}
