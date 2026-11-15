import { useEffect, useState } from "react";

/**
 * Devuelve la hora actual en milisegundos y la renueva cada `intervalMs`, para que lo que se calcula
 * contra "ahora" (franjas que ya pasaron, la línea de "hasta acá ya pasó") avance solo con el reloj
 * aunque nadie toque la pantalla.
 *
 * También se renueva al volver a la pestaña: los navegadores frenan los temporizadores de las pestañas
 * ocultas, así que sin esto la pantalla quedaría con la hora de cuando se fue.
 */
export function useNow(intervalMs = 60_000): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const refresh = () => setNow(Date.now());
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") refresh();
    };

    const intervalId = setInterval(refresh, intervalMs);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [intervalMs]);

  return now;
}
