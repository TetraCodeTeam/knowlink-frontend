import type { PodiumBadge } from "@/modules/community/types/podium-badge.type";

interface PodiumBadgeStyle {
  label: string;
  caption: string;
  accent: string;
  accentSoft: string;
  buttonBg: string;
  buttonHoverBg: string;
}

export const PODIUM_BADGE_STYLE: Record<PodiumBadge, PodiumBadgeStyle> = {
  GOLD: {
    label: "Oro",
    caption: "1º puesto universitario",
    accent: "#F5B820",
    accentSoft: "#FFF6D9",
    buttonBg: "#5B6ED9",
    buttonHoverBg: "#3451d1",
  },
  SILVER: {
    label: "Plata",
    caption: "Tutor destacado plata",
    accent: "#8E9AAF",
    accentSoft: "#EEF1F6",
    buttonBg: "#1F7A6B",
    buttonHoverBg: "#17594F",
  },
  BRONZE: {
    label: "Bronce",
    caption: "Tutor destacado bronce",
    accent: "#B4540A",
    accentSoft: "#FCEBDD",
    buttonBg: "#B4540A",
    buttonHoverBg: "#8F4208",
  },
};
