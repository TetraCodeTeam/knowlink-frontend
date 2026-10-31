/** Devuelve el sustantivo en singular o plural según la cantidad. */
export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}
