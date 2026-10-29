import type { ClaimStatus } from "@/modules/support/interfaces/claim-status.type";
import type { AdminListScope } from "@/modules/admin/types/admin-list-scope.type";

export type AdminSessionClaimStatusFilter = ClaimStatus | "ALL";

export type AdminSessionClaimScope = AdminListScope;

export interface AdminSessionClaimFilters {
  status: AdminSessionClaimStatusFilter;
  scope: AdminSessionClaimScope;
  page: number;
}
