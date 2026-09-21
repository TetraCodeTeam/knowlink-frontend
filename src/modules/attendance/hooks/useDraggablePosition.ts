import {
  MouseEvent as ReactMouseEvent,
  RefObject,
  TouchEvent as ReactTouchEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface Position {
  x: number;
  y: number;
}

interface UseDraggablePositionOptions {
  /** Posición inicial. Si se omite, arranca en (24, 24) — esquina
   * superior izquierda con un margen chico. */
  initialPosition?: Position;
  horizontalAnchor?: "left" | "right";
}

/**
 * Hook genérico para arrastre libre de un elemento con position:
 * fixed. Expone la posición
 * actual y los handlers a enganchar en el elemento que actúa de
 * "agarradera" (drag handle).
 *
 * Clampea la posición a los bordes del viewport en cada movimiento y
 * también al hacer resize de la ventana, para que el widget no quede
 * arrastrado fuera de la pantalla visible si el usuario achica el
 * navegador después de moverlo.
 */
export const useDraggablePosition = (
  elementRef: RefObject<HTMLElement | null>,
  options?: UseDraggablePositionOptions
) => {
  const [position, setPosition] = useState<Position>(options?.initialPosition ?? { x: 24, y: 24 });
  const [isDragging, setIsDragging] = useState(false);
  const horizontalAnchor = options?.horizontalAnchor ?? "left";

  // Guarda el offset entre el punto donde se hizo click/touch y la
  // esquina superior izquierda del elemento, para que el drag no
  // "salte" a centrar el elemento en el cursor al primer movimiento.
  const dragOffsetRef = useRef<Position>({ x: 0, y: 0 });

  const clampToViewport = useCallback(
    (next: Position): Position => {
      const el = elementRef.current;
      if (!el) return next;

      const { offsetWidth, offsetHeight } = el;
      const maxX = window.innerWidth - offsetWidth;
      const maxY = window.innerHeight - offsetHeight;

      return {
        x: Math.min(Math.max(next.x, 0), Math.max(maxX, 0)),
        y: Math.min(Math.max(next.y, 0), Math.max(maxY, 0)),
      };
    },
    [elementRef]
  );

  const getClientPoint = (event: MouseEvent | TouchEvent): Position => {
    if ("touches" in event) {
      const touch = event.touches[0] ?? event.changedTouches[0];
      return { x: touch.clientX, y: touch.clientY };
    }
    return { x: event.clientX, y: event.clientY };
  };

  const beginDrag = useCallback(
    (event: globalThis.MouseEvent | globalThis.TouchEvent) => {
      const el = elementRef.current;
      if (!el) return;

      const point = getClientPoint(event);
      const rect = el.getBoundingClientRect();
      dragOffsetRef.current = {
        x: point.x - rect.left,
        y: point.y - rect.top,
      };
      setIsDragging(true);
    },
    [elementRef]
  );

  const handleMouseDragStart = useCallback(
    (event: ReactMouseEvent<HTMLElement>) => beginDrag(event.nativeEvent),
    [beginDrag]
  );

  const handleTouchDragStart = useCallback(
    (event: ReactTouchEvent<HTMLElement>) => beginDrag(event.nativeEvent),
    [beginDrag]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (event: globalThis.MouseEvent | globalThis.TouchEvent) => {
      // Evita el scroll de la página en touch mientras se arrastra.
      if ("touches" in event) event.preventDefault();

      const el = elementRef.current;
      if (!el) return;

      const point = getClientPoint(event);
      const next = {
        x:
          horizontalAnchor === "right"
            ? window.innerWidth - (point.x - dragOffsetRef.current.x) - el.offsetWidth
            : point.x - dragOffsetRef.current.x,
        y: point.y - dragOffsetRef.current.y,
      };
      setPosition(clampToViewport(next));
    };

    const handleEnd = () => setIsDragging(false);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, clampToViewport, elementRef, horizontalAnchor]);

  // Re-clampea si la ventana cambia de tamaño con el widget ya movido,
  // para que no quede parcial o totalmente fuera de la vista.
  useEffect(() => {
    const handleResize = () => setPosition((prev) => clampToViewport(prev));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [clampToViewport]);

  return { position, isDragging, handleMouseDragStart, handleTouchDragStart };
};
