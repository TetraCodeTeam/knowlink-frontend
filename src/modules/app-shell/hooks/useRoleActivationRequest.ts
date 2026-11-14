import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/** Estado de navegación con el que el menú del avatar le pide al perfil que abra la activación del otro rol. */
export const ROLE_ACTIVATION_STATE = { activateRole: true } as const;

interface RoleActivationLocationState {
  activateRole?: boolean;
}

/**
 * Del lado del perfil: devuelve un contador que sube cada vez que el menú del avatar pidió activar el otro rol.
 *
 * Sin esto, "Activar rol de…" solo navegaba al perfil: si ya se estaba ahí (en otra pestaña, o con la tarjeta
 * fuera de pantalla) no cambiaba nada y parecía que no pasaba nada. Cada tarjeta de rol reacciona al contador
 * abriendo su diálogo de activación.
 *
 * El pedido se consume al leerlo (se limpia el estado de la ubicación), así recargar o volver atrás no reabre el diálogo.
 */
export function useRoleActivationRequest(): number {
  const location = useLocation();
  const navigate = useNavigate();
  const [request, setRequest] = useState(0);
  const requested = (location.state as RoleActivationLocationState | null)?.activateRole === true;

  useEffect(() => {
    if (!requested) return;
    setRequest((current) => current + 1);
    navigate(location.pathname, { replace: true, state: null });
  }, [requested, location.pathname, navigate]);

  return request;
}
