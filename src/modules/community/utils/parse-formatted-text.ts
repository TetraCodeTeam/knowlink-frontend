export type FormattedSegmentKind =
  | "text"
  | "bold"
  | "italic"
  | "underline"
  | "code"
  | "math"
  | "codeBlock";

export interface FormattedSegment {
  kind: FormattedSegmentKind;
  value: string;
}

/**
 * Formato liviano que escribe el editor de la comunidad (se guarda como texto plano):
 * **negrita**, *cursiva*, __subrayado__, `código`, ```bloque de código```, $fórmula$ y \(fórmula\).
 * No hay HTML de por medio: el texto del usuario nunca se interpreta como marcado.
 */
const CODE_BLOCK_PATTERN = /```([\s\S]*?)```/g;
const INLINE_PATTERN =
  /(\*\*[^*\n]+\*\*|__[^_\n]+__|\*[^*\n]+\*|`[^`\n]+`|\$[^$\n]+\$|\\\([^\n]+?\\\))/g;

function parseInline(text: string): FormattedSegment[] {
  return text
    .split(INLINE_PATTERN)
    .filter((part) => part !== "")
    .map((part): FormattedSegment => {
      if (part.length > 4 && part.startsWith("**") && part.endsWith("**")) {
        return { kind: "bold", value: part.slice(2, -2) };
      }
      if (part.length > 4 && part.startsWith("__") && part.endsWith("__")) {
        return { kind: "underline", value: part.slice(2, -2) };
      }
      if (part.length > 2 && part.startsWith("*") && part.endsWith("*")) {
        return { kind: "italic", value: part.slice(1, -1) };
      }
      if (part.length > 2 && part.startsWith("`") && part.endsWith("`")) {
        return { kind: "code", value: part.slice(1, -1) };
      }
      if (part.length > 2 && part.startsWith("$") && part.endsWith("$")) {
        return { kind: "math", value: part.slice(1, -1) };
      }
      if (part.length > 4 && part.startsWith("\\(") && part.endsWith("\\)")) {
        return { kind: "math", value: part.slice(2, -2) };
      }
      return { kind: "text", value: part };
    });
}

export function parseFormattedText(text: string): FormattedSegment[] {
  const segments: FormattedSegment[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(CODE_BLOCK_PATTERN)) {
    const index = match.index ?? 0;
    segments.push(...parseInline(text.slice(lastIndex, index)));
    segments.push({ kind: "codeBlock", value: match[1].replace(/^\n|\n$/g, "") });
    lastIndex = index + match[0].length;
  }
  segments.push(...parseInline(text.slice(lastIndex)));
  return segments;
}
