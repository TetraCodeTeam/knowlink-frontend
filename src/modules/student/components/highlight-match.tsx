import type { ReactNode } from "react";

/**
 * Devuelve `text` con la primera ocurrencia (case-insensitive) de `query`
 * envuelta en <strong>, tal como se ve en el mock (prefijo en negrita).
 */
export function highlightMatch(text: string, query: string): ReactNode {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return text;

  const matchIndex = text.toLowerCase().indexOf(trimmedQuery.toLowerCase());
  if (matchIndex === -1) return text;

  const before = text.slice(0, matchIndex);
  const match = text.slice(matchIndex, matchIndex + trimmedQuery.length);
  const after = text.slice(matchIndex + trimmedQuery.length);

  return (
    <>
      {before}
      <strong>{match}</strong>
      {after}
    </>
  );
}
