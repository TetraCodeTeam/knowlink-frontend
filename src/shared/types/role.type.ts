export const ROLE_VALUES = ["TUTOR", "STUDENT"] as const;

export type Role = (typeof ROLE_VALUES)[number];

export const AUTH_ROLE_VALUES = [...ROLE_VALUES, "ADMIN"] as const;

export type AuthRole = (typeof AUTH_ROLE_VALUES)[number];