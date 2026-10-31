import type { AdminSessionClaimFilters } from "@/modules/admin/types/admin-session-claim-filters.type";

export interface AdminSessionClaimListParams extends AdminSessionClaimFilters {
  size: number;
}
