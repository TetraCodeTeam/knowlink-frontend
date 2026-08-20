//hook para manejar la interacción con los bloques de disponibilidad en el calendario de reservas, incluyendo la selección y previsualización de ventanas de reserva.
import { useCallback, useMemo, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import {
  getReservationWindows,
  getWindowAtRelativePosition,
} from "@/modules/student/booking/utils/reservationWindowUtils";
import type { AvailabilityBlockContentProps } from "@/modules/student/booking/interfaces/bookingComponentPropsType";
import type { ReservationWindow } from "@/modules/student/booking/interfaces/reservationWindowType";

type UseAvailabilityBlockInteractionProps = Pick<
  AvailabilityBlockContentProps,
  "blockStart" | "blockEnd" | "selectedWindow" | "locked" | "onHoverWindow" | "onSelectWindow"
  | "unavailableWindows"
>;

export function useAvailabilityBlockInteraction({
  blockStart,
  blockEnd,
  selectedWindow,
  unavailableWindows,
  locked,
  onHoverWindow,
  onSelectWindow,
}: UseAvailabilityBlockInteractionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<ReservationWindow | null>(null);
  const didDragRef = useRef(false);
  const [hoveredWindow, setHoveredWindow] = useState<ReservationWindow | null>(null);
  const [previewWindow, setPreviewWindow] = useState<ReservationWindow | null>(null);
  const [isInvalidDrag, setIsInvalidDrag] = useState(false);

  const windows = useMemo(() => getReservationWindows(blockStart, blockEnd), [blockStart, blockEnd]);

  const isUnavailable = useCallback(
    (window: ReservationWindow) =>
      unavailableWindows.some(
        (unavailable) =>
          unavailable.start.getTime() === window.start.getTime() &&
          unavailable.end.getTime() === window.end.getTime()
      ),
    [unavailableWindows]
  );

  const getSelectionPreview = useCallback(
    (startWindow: ReservationWindow, endWindow: ReservationWindow): ReservationWindow | null => {
      const start = new Date(Math.min(startWindow.start.getTime(), endWindow.start.getTime()));
      const end = new Date(Math.max(startWindow.end.getTime(), endWindow.end.getTime()));
      const durationMinutes = (end.getTime() - start.getTime()) / (60 * 1000);

      return durationMinutes % 60 === 0 ? { start, end } : null;
    },
    []
  );

  const handleMouseMove = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (locked || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const relativeY = (event.clientY - rect.top) / rect.height;
      const candidate = getWindowAtRelativePosition(windows, relativeY);
      const hovered = candidate && !isUnavailable(candidate) ? candidate : null;

      setHoveredWindow(hovered);
      if (dragStartRef.current && hovered) {
        didDragRef.current = hovered.start.getTime() !== dragStartRef.current.start.getTime();
        const preview = getSelectionPreview(dragStartRef.current, hovered);
        setPreviewWindow(preview);
        setIsInvalidDrag(didDragRef.current && preview === null);
      }
      onHoverWindow(hovered);
    },
    [getSelectionPreview, isUnavailable, locked, onHoverWindow, windows]
  );

  const handleMouseLeave = useCallback(() => {
    if (locked) return;

    setHoveredWindow(null);
    dragStartRef.current = null;
    didDragRef.current = false;
    setPreviewWindow(null);
    setIsInvalidDrag(false);
    onHoverWindow(null);
  }, [locked, onHoverWindow]);

  const handleMouseDown = useCallback(() => {
    if (!locked) {
      dragStartRef.current = hoveredWindow;
      didDragRef.current = false;
      setIsInvalidDrag(false);
    }
  }, [hoveredWindow, locked]);

  const handleMouseUp = useCallback(() => {
    if (locked || !dragStartRef.current || !hoveredWindow || !didDragRef.current) return;

    const selection = getSelectionPreview(dragStartRef.current, hoveredWindow);
    dragStartRef.current = null;
    setPreviewWindow(null);
    setIsInvalidDrag(false);
    if (selection) onSelectWindow(selection);
  }, [getSelectionPreview, hoveredWindow, locked, onSelectWindow]);

  const handleClick = useCallback(() => {
    if (locked) return;
    if (didDragRef.current) {
      didDragRef.current = false;
      return;
    }
    if (hoveredWindow && !previewWindow) onSelectWindow(hoveredWindow);
    didDragRef.current = false;
  }, [hoveredWindow, locked, onSelectWindow, previewWindow]);

  const highlightedWindow = selectedWindow ?? (locked ? null : previewWindow ?? hoveredWindow);
  const highlightIndex = highlightedWindow
    ? windows.findIndex((window) => window.start.getTime() === highlightedWindow.start.getTime())
    : -1;

  return {
    containerRef,
    windows,
    highlightedWindow,
    highlightIndex,
    isInvalidDrag,
    isDimmedByLock: locked && selectedWindow === null,
    handleMouseMove,
    handleMouseLeave,
    handleMouseDown,
    handleMouseUp,
    handleClick,
  };
}
