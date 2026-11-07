/** Período para filtrar publicaciones. Cada extremo es `yyyy-MM-dd`; vacío = sin límite. */
export interface PostDateRange {
  from: string;
  to: string;
}
