import { useMemo, useState } from "react";
import { useMinNoticeMinutes } from "@/modules/tutor/availability/hooks/use-min-notice-minutes";
import { useUpdateMinNoticeMinutes } from "@/modules/tutor/availability/hooks/use-update-min-notice-minutes";
import { MIN_NOTICE_PRESETS, type MinNoticeUnit } from "@/modules/tutor/availability/constants/min-notice.constants";
import { minutesToBestUnit, customValueToMinutes, findMatchingPreset } from "@/modules/tutor/availability/utils/min-notice.utils";

export type MinNoticeSelection = number | "OTHER" | null;

export function useMinNoticeDraft() {
  const { data, isLoading } = useMinNoticeMinutes();
  const { mutate: updateMinNotice, isPending } = useUpdateMinNoticeMinutes();

  const initialMinutes = data?.minNoticeMinutes ?? null;
  const matchingPreset = findMatchingPreset(initialMinutes);
  const initialSelection: MinNoticeSelection = matchingPreset
    ? matchingPreset.minutes
    : initialMinutes != null
      ? "OTHER"
      : null;

  const initialCustom = useMemo(
    () =>
      !matchingPreset && initialMinutes != null
        ? minutesToBestUnit(initialMinutes)
        : { unit: "HOURS" as MinNoticeUnit, value: "" },
    [matchingPreset, initialMinutes]
  );

  const [selection, setSelection] = useState<MinNoticeSelection | undefined>(undefined);
  const [customValue, setCustomValue] = useState<string | undefined>(undefined);
  const [customUnit, setCustomUnit] = useState<MinNoticeUnit | undefined>(undefined);

  const effectiveSelection = selection !== undefined ? selection : initialSelection;
  const effectiveCustomValue = customValue !== undefined ? customValue : initialCustom.value;
  const effectiveCustomUnit = customUnit !== undefined ? customUnit : initialCustom.unit;

  const hasChanges = useMemo(() => {
    if (effectiveSelection !== initialSelection) return true;
    if (effectiveSelection === "OTHER") {
      return effectiveCustomValue !== initialCustom.value || effectiveCustomUnit !== initialCustom.unit;
    }
    return false;
  }, [effectiveSelection, effectiveCustomValue, effectiveCustomUnit, initialSelection, initialCustom]);

  const isSaveDisabled =
    !hasChanges ||
    (effectiveSelection === "OTHER" && customValueToMinutes(effectiveCustomValue, effectiveCustomUnit) === null);

  function selectPreset(minutes: number) {
    setSelection(effectiveSelection === minutes ? null : minutes);
  }

  function selectOther() {
    setSelection(effectiveSelection === "OTHER" ? null : "OTHER");
  }

  function save() {
    const minutes =
      effectiveSelection === "OTHER"
        ? customValueToMinutes(effectiveCustomValue, effectiveCustomUnit)
        : effectiveSelection;

    if (effectiveSelection === "OTHER" && minutes === null) return;

    updateMinNotice(minutes, {
      onSuccess: () => {
        setSelection(undefined);
        setCustomValue(undefined);
        setCustomUnit(undefined);
      },
    });
  }

  return {
    isLoading,
    isPending,
    presets: MIN_NOTICE_PRESETS,
    effectiveSelection,
    effectiveCustomValue,
    effectiveCustomUnit,
    isSaveDisabled,
    selectPreset,
    selectOther,
    setCustomValue,
    setCustomUnit,
    save,
  };
}