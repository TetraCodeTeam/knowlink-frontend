import type { ReactNode } from "react";
import AppButton from "@/shared/components/AppButton";
import FrankieEmptyState from "@/shared/frankie/FrankieEmptyState";

interface FrankieErrorStateProps {
  /** Qué no se pudo cargar, en una frase ("No pudimos cargar tus publicaciones."). */
  message: ReactNode;
  title?: string;
  /** Si se pasa, se ofrece un botón para volver a intentar. */
  onRetry?: () => void;
  retryLabel?: string;
  compact?: boolean;
  fill?: boolean;
}

/**
 * Error de carga con Frankie: se hace cargo ("fue un tropiezo nuestro") y ofrece reintentar,
 * en lugar de dejar un texto rojo suelto.
 */
export default function FrankieErrorState({
  message,
  title = "Uy, tuvimos un tropiezo",
  onRetry,
  retryLabel = "Reintentar",
  compact = true,
  fill = false,
}: FrankieErrorStateProps) {
  return (
    <FrankieEmptyState
      mood="sad"
      size={190}
      compact={compact}
      fill={fill}
      title={title}
      message={message}
      action={
        onRetry ? (
          <AppButton appVariant="soft" onClick={onRetry}>
            {retryLabel}
          </AppButton>
        ) : undefined
      }
    />
  );
}
