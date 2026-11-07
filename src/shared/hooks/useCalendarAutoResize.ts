import { useEffect, useState, type RefObject } from "react";
import type FullCalendar from "@fullcalendar/react";

/**
 * FullCalendar solo recalcula su tamaño cuando cambia la ventana. Si cambia el ancho de su
 * contenedor sin que cambie la ventana (ej. al plegar o expandir el menú lateral), conserva el
 * ancho anterior y la grilla queda corta, con un hueco a la derecha.
 *
 * Devuelve una ref para el elemento que contiene al calendario: cada vez que ese elemento
 * cambia de tamaño, le pide al calendario que se redimensione. Es una ref por callback (y no
 * un `useRef`) porque el contenedor puede montarse después, ej. tras una pantalla de carga.
 */
export function useCalendarAutoResize(calendarRef: RefObject<FullCalendar | null>) {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!container || typeof ResizeObserver === "undefined") return;

    let frame = 0;
    const observer = new ResizeObserver(() => {
      // Plegar el menú anima el ancho: se agrupan los avisos para recalcular una vez por cuadro.
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => calendarRef.current?.getApi().updateSize());
    });
    observer.observe(container);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [container, calendarRef]);

  return setContainer;
}
