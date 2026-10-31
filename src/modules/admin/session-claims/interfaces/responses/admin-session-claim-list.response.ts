import type { AdminSessionClaimListItem } from "@/modules/admin/session-claims/interfaces/responses/admin-session-claim-list-item.response";
import type { AdminSessionClaimStatusCounts } from "@/modules/admin/session-claims/interfaces/responses/admin-session-claim-status-counts.response";

export interface AdminSessionClaimListResponse {
  content: AdminSessionClaimListItem[];
  page: number;
  size: number;
  totalElements: number;
  statusCounts: AdminSessionClaimStatusCounts;
}
