import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Lleva la ventana arriba cada vez que se entra a una página nueva. React Router con `BrowserRouter` no
 * restablece el scroll, así que sin esto una página abre con el scroll de la anterior (por ejemplo, entrar a la
 * reserva desde el medio del feed).
 *
 * No actúa en dos casos: al volver o avanzar en el historial (`POP`, donde el navegador restaura la posición) y
 * cuando la URL trae un `#ancla`, que resuelve la propia página.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (hash || navigationType === "POP") return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash, navigationType]);

  return null;
}
