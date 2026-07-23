export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export const DAY_LABELS: Record<number, string> = {
  0: "DO",
  1: "LU",
  2: "MA",
  3: "MI",
  4: "JU",
  5: "VI",
  6: "SA",
};