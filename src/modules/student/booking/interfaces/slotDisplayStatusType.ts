//estan separados porque past es un estado derivado de la fecha actual, no del estado del slot en sí
export type SlotStatus = "AVAILABLE" | "BLOCKED" | "RESERVED";

export type SlotDisplayStatus = SlotStatus | "PAST";
