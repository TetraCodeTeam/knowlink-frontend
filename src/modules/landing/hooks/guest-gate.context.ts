import { createContext } from "react";
import type { GuestAction } from "@/modules/landing/constants/guest-actions.constants";

export interface GuestGate {
  /** Muestra el aviso de Frankie explicando que esa acción requiere una cuenta. */
  requireAuth: (action: GuestAction) => void;
}

export const GuestGateContext = createContext<GuestGate | null>(null);
