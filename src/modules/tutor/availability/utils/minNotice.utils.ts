import {
  MIN_NOTICE_PRESETS,
  UNIT_TO_MINUTES,
  type MinNoticeUnit,
} from "@/modules/tutor/availability/constants/minNotice.constants";

export function minutesToBestUnit(minutes: number): { unit: MinNoticeUnit; value: string } {
  if (minutes % 1440 === 0) return { unit: "DAYS", value: String(minutes / 1440) };
  if (minutes % 60 === 0) return { unit: "HOURS", value: String(minutes / 60) };
  return { unit: "MINUTES", value: String(minutes) };
}

export function customValueToMinutes(value: string, unit: MinNoticeUnit): number | null {
  const parsed = Number(value);
  if (value.trim() === "" || Number.isNaN(parsed) || parsed <= 0) return null;
  return Math.round(parsed * UNIT_TO_MINUTES[unit]);
}

export function findMatchingPreset(minutes: number | null) {
  return MIN_NOTICE_PRESETS.find((p) => p.minutes === minutes);
}
