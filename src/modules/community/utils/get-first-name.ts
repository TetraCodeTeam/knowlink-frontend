const TITLE_PATTERN = /^(prof|profe|lic|ing|dr|dra|mg|esp)\.?$/i;

/** Primer nombre sin tratamiento: "Prof. Julián Méndez" → "Julián". */
export function getFirstName(fullName: string): string {
  const words = fullName.split(/\s+/).filter(Boolean);
  return words.find((word) => !TITLE_PATTERN.test(word)) ?? fullName;
}
