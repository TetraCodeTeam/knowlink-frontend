import { useCallback, useMemo, useState, type ReactNode } from "react";
import GuestPromptDialog from "@/modules/landing/components/GuestPromptDialog";
import type { GuestAction } from "@/modules/landing/constants/guest-actions.constants";
import { GuestGateContext } from "@/modules/landing/hooks/guest-gate.context";

interface GuestGateProviderProps {
  children: ReactNode;
}

/** Provee `requireAuth` y monta el aviso de Frankie, que se abre cuando un invitado intenta participar. */
export default function GuestGateProvider({ children }: GuestGateProviderProps) {
  const [action, setAction] = useState<GuestAction | null>(null);
  const requireAuth = useCallback((next: GuestAction) => setAction(next), []);
  const value = useMemo(() => ({ requireAuth }), [requireAuth]);

  return (
    <GuestGateContext.Provider value={value}>
      {children}
      <GuestPromptDialog action={action} onClose={() => setAction(null)} />
    </GuestGateContext.Provider>
  );
}
