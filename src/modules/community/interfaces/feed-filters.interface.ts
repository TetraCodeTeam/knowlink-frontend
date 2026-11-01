import type { FeedPeriod } from "@/modules/community/types/feed-period.type";
import type { PostStatus } from "@/modules/community/types/post-status.type";
import type { PostType } from "@/modules/community/types/post-type.type";

/** Filtros del feed (US-59). `null` y lista vacía significan "sin filtrar por ese criterio". */
export interface FeedFilters {
  type: PostType | null;
  period: FeedPeriod;
  careerId: string | null;
  subjectIds: string[];
  status: PostStatus | null;
}

/** Filtros que se editan en el panel y se confirman con "Aplicar filtros"; el tipo se aplica al instante. */
export type FeedFiltersDraft = Omit<FeedFilters, "type">;
