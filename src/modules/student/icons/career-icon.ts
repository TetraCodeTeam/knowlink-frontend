import type { LucideIcon } from "lucide-react";
import {
  LaptopMinimalCheck,
  Cpu,
  Wrench,
  FlaskConical,
  Building,
  Wheat,
  Sigma,
  BookOpen,
} from "lucide-react";

function normalizeCareerName(career: string): string {
  return career
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // saca tildes, así "civíl"/"civil" matchean igual.
}

const RAW_CAREER_ICONS: [string, LucideIcon][] = [
  ["Ingeniería en sistemas", LaptopMinimalCheck],
  ["Ingeniería electrónica", Cpu],
  ["Ingeniería Mecánica", Wrench],
  ["Ingeniería química", FlaskConical],
  ["Ingeniería civíl", Building],
  ["Administración rural", Wheat],
  ["Materias básicas", Sigma],
];

const CAREER_ICONS: Record<string, LucideIcon> = Object.fromEntries(
  RAW_CAREER_ICONS.map(([name, icon]) => [normalizeCareerName(name), icon])
);

/** Ícono de respaldo para carreras que todavía no están en el mapeo. */
const DEFAULT_CAREER_ICON = BookOpen;

export function getCareerIcon(career: string): LucideIcon {
  return CAREER_ICONS[normalizeCareerName(career)] ?? DEFAULT_CAREER_ICON;
}
