import { useContext } from "react";
import { GuestGateContext, type GuestGate } from "@/modules/landing/hooks/guest-gate.context";

export function useGuestGate(): GuestGate {
  const gate = useContext(GuestGateContext);
  if (!gate) {
    throw new Error("useGuestGate debe usarse dentro de GuestGateProvider");
  }
  return gate;
}
