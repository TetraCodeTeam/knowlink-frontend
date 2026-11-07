import type { ReactNode } from "react";
import FrankieEmptyState from "@/shared/frankie/FrankieEmptyState";
import type { FrankieAccessory, FrankieMood } from "@/shared/frankie/frankie.types";

interface EmptyStateProps {
  message: string;
  title?: string;
  /** Expresión de Frankie. Por defecto, tranquilo (no hay nada todavía). */
  mood?: FrankieMood;
  accessories?: FrankieAccessory[];
  action?: ReactNode;
}

/** Estado vacío genérico: Frankie acompaña al usuario y explica qué pasa. */
export default function EmptyState({
  message,
  title,
  mood = "sleepy",
  accessories,
  action,
}: EmptyStateProps) {
  return (
    <FrankieEmptyState
      mood={mood}
      accessories={accessories}
      title={title}
      message={message}
      action={action}
    />
  );
}
