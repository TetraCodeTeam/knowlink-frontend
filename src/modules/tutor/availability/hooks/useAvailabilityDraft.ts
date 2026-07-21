import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useAvailabilityBlocks } from "@/modules/tutor/availability/hooks/useAvailabilityBlocks";
import { useSaveAvailabilityBlocks } from "@/modules/tutor/availability/hooks/useSaveAvailabilityBlocks";
import {
  getCurrentWeekMonday,
  getWeekEnd,
  toDateStr,
  isBeforeToday,
  normalizeBlocks,
} from "@/modules/tutor/availability/utils/availability.utils";
import type { AvailabilityBlockRequest } from "@/modules/tutor/availability/api/availability.api";

interface DraftBlock {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
}

const FETCH_WEEKS_AHEAD = 12;

export function useAvailabilityDraft() {
  const currentMonday = useMemo(() => getCurrentWeekMonday(), []);

  const [viewedMonday, setViewedMonday] = useState(currentMonday);
  const viewedWeekEnd = useMemo(() => getWeekEnd(viewedMonday), [viewedMonday]);

  const fetchFrom = toDateStr(currentMonday);
  const fetchTo = useMemo(() => {
    const to = new Date(currentMonday);
    to.setDate(to.getDate() + FETCH_WEEKS_AHEAD * 7);
    return toDateStr(to);
  }, [currentMonday]);

  const { data: allBlocks, isLoading } = useAvailabilityBlocks(fetchFrom, fetchTo);
  const { mutate: save, isPending } = useSaveAvailabilityBlocks();

  const [draftBlocks, setDraftBlocks] = useState<DraftBlock[] | null>(null);
  const [repeatWeekly, setRepeatWeekly] = useState<boolean | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const viewedWeekStartStr = toDateStr(viewedMonday);
  const viewedWeekEndStr = toDateStr(viewedWeekEnd);

  // Bloques existentes SOLO de la semana que se está viendo (el resto del rango fetcheado
  // se usa nada más para saber si hay repetición activa en semanas futuras, no se muestra acá)
  const existingWeekBlocks = useMemo(
    () =>
      (allBlocks ?? []).filter((b) => b.date >= viewedWeekStartStr && b.date <= viewedWeekEndStr),
    [allBlocks, viewedWeekStartStr, viewedWeekEndStr]
  );

  const initialRepeatWeekly = existingWeekBlocks[0]?.repeatWeekly ?? false;
  const effectiveRepeatWeekly = repeatWeekly ?? initialRepeatWeekly;

  const blocks =
    draftBlocks ??
    existingWeekBlocks.map((b) => ({
      id: b.availabilityBlockId,
      date: b.date,
      startTime: b.startTime,
      endTime: b.endTime,
    }));

  const originalSignature = useMemo(
    () => normalizeBlocks(existingWeekBlocks),
    [existingWeekBlocks]
  );
  const currentSignature = useMemo(() => normalizeBlocks(blocks), [blocks]);

  const hasChanges =
    currentSignature !== originalSignature || effectiveRepeatWeekly !== initialRepeatWeekly;

  const events = useMemo(
    () =>
      blocks.map((b) => ({
        id: b.id,
        start: `${b.date}T${b.startTime}`,
        end: `${b.date}T${b.endTime}`,
        display: "block",
      })),
    [blocks]
  );

  function handleDatesSet(rangeStart: Date) {
    setViewedMonday((prev) => (toDateStr(prev) === toDateStr(rangeStart) ? prev : rangeStart));
    // al cambiar de semana, se descarta cualquier draft sin guardar de la semana anterior
    setDraftBlocks(null);
    setRepeatWeekly(null);
  }

  function selectAllow(selectInfo: { start: Date; end: Date }): boolean {
    return (
      selectInfo.start.toDateString() === new Date(selectInfo.end.getTime() - 1).toDateString()
    );
  }

  function addDraftBlock(start: Date, end: Date): boolean {
    if (isBeforeToday(start)) {
      toast.error("No podés configurar disponibilidad para días anteriores al actual.");
      return false;
    }

    const newBlock: DraftBlock = {
      id: crypto.randomUUID(),
      date: toDateStr(start),
      startTime: start.toTimeString().slice(0, 8),
      endTime: end.toTimeString().slice(0, 8),
    };

    setDraftBlocks([...blocks, newBlock]);
    return true;
  }

  function removeDraftBlock(blockId: string) {
    setDraftBlocks(blocks.filter((b) => b.id !== blockId));
  }

  function saveAvailability() {
    const payload: AvailabilityBlockRequest[] = blocks.map((b) => ({
      date: b.date,
      startTime: b.startTime,
      endTime: b.endTime,
      repeatWeekly: effectiveRepeatWeekly,
    }));

    save(
      { weekStart: viewedWeekStartStr, weekEnd: viewedWeekEndStr, blocks: payload },
      {
        onSuccess: () => {
          setDraftBlocks(null);
          setRepeatWeekly(null);
        },
      }
    );
  }

  function requestSave() {
    if (effectiveRepeatWeekly) {
      setIsConfirmDialogOpen(true);
      return;
    }
    saveAvailability();
  }

  function confirmSave() {
    setIsConfirmDialogOpen(false);
    saveAvailability();
  }

  function cancelSave() {
    setIsConfirmDialogOpen(false);
    setRepeatWeekly(null);
  }

  return {
    isLoading,
    isPending,
    currentMondayStr: toDateStr(currentMonday),
    events,
    hasChanges,
    effectiveRepeatWeekly,
    repeatWeeksAhead: FETCH_WEEKS_AHEAD,
    setRepeatWeekly,
    selectAllow,
    addDraftBlock,
    removeDraftBlock,
    handleDatesSet,
    isConfirmDialogOpen,
    requestSave,
    confirmSave,
    cancelSave,
  };
}
