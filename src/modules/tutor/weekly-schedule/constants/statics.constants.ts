/**
 * Paleta por tipo de estadística en las tarjetas de resumen (US-52).
 * Cada estadística tiene su propio color: azul para "esta semana",
 * verde para "disponibilidad", naranja para "próxima clase".
 */
export type AgendaStatKind = "confirmedBookings" | "availability" | "nextSession";

interface AgendaStatColorTokens {
  dot: string;
  iconBg: string;
  iconColor: string;
  chipBg: string;
}

export const AGENDA_STAT_COLOR: Record<AgendaStatKind, AgendaStatColorTokens> = {
  confirmedBookings: {
    dot: "#5B6ED9",
    iconBg: "rgba(91, 110, 217, 0.12)",
    iconColor: "#5B6ED9",
    chipBg: "rgba(91, 110, 217, 0.08)",
  },
  availability: {
    dot: "#2FA86A",
    iconBg: "rgba(47, 168, 106, 0.12)",
    iconColor: "#2FA86A",
    chipBg: "rgba(47, 168, 106, 0.08)",
  },
  nextSession: {
    dot: "#E88A2E",
    iconBg: "rgba(232, 138, 46, 0.12)",
    iconColor: "#E88A2E",
    chipBg: "rgba(232, 138, 46, 0.08)",
  },
};