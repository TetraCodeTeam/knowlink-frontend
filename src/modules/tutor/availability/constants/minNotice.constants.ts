export interface PresetOption {
  label: string;
  minutes: number;
}

export const MIN_NOTICE_PRESETS: PresetOption[] = [
  { label: "30 min", minutes: 30 },
  { label: "1 hora", minutes: 60 },
  { label: "2 horas", minutes: 120 },
  { label: "4 horas", minutes: 240 },
  { label: "1 día", minutes: 1440 },
];

export type MinNoticeUnit = "MINUTES" | "HOURS" | "DAYS";

export const UNIT_TO_MINUTES: Record<MinNoticeUnit, number> = {
  MINUTES: 1,
  HOURS: 60,
  DAYS: 1440,
};