import { Box, Skeleton, Typography } from "@mui/material";
import { Scale } from "lucide-react";
import AdminListEmptyState from "@/modules/admin/components/AdminListEmptyState";
import AdminPagination from "@/modules/admin/components/AdminPagination";
import SessionClaimListItem from "@/modules/admin/session-claims/components/SessionClaimListItem";
import {
  SESSION_CLAIM_LIST_NOUN,
  SESSION_CLAIM_MESSAGES,
} from "@/modules/admin/session-claims/constants/session-claims.constants";
import type { AdminSessionClaimListItem as AdminSessionClaimListItemResponse } from "@/modules/admin/session-claims/interfaces/responses/admin-session-claim-list-item.response";
import {
  listCardSx,
  listHeaderCountSx,
  listHeaderSx,
  listHeaderTitleSx,
  listSx,
  skeletonStackSx,
} from "@/modules/admin/styles/admin-list.styles";
import { ADMIN_TOKENS } from "@/modules/admin/styles/admin-tokens";

interface SessionClaimListProps {
  claims: AdminSessionClaimListItemResponse[];
  totalElements: number;
  page: number;
  pageSize: number;
  selectedClaimId: string | null;
  isLoading: boolean;
  onSelect: (claimId: string) => void;
  onPageChange: (page: number) => void;
}

export default function SessionClaimList({
  claims,
  totalElements,
  page,
  pageSize,
  selectedClaimId,
  isLoading,
  onSelect,
  onPageChange,
}: SessionClaimListProps) {
  return (
    <Box component="section" aria-label="Reclamos de sesiones" sx={listCardSx}>
      <Box sx={listHeaderSx}>
        <Typography component="h2" sx={listHeaderTitleSx}>
          Reclamos
        </Typography>
        <Typography sx={listHeaderCountSx}>
          {totalElements} {totalElements === 1 ? "reclamo" : SESSION_CLAIM_LIST_NOUN}
        </Typography>
      </Box>

      {isLoading && claims.length === 0 ? (
        <Box sx={skeletonStackSx} aria-label="Cargando reclamos">
          {Array.from({ length: pageSize }, (_, index) => (
            <Skeleton key={index} variant="rounded" height={96} />
          ))}
        </Box>
      ) : claims.length === 0 ? (
        <AdminListEmptyState
          message={SESSION_CLAIM_MESSAGES.emptyList}
          icon={<Scale size={38} color={ADMIN_TOKENS.slate400} aria-hidden="true" />}
        />
      ) : (
        <>
          <Box component="ul" sx={listSx}>
            {claims.map((claim) => (
              <SessionClaimListItem
                key={claim.claimId}
                claim={claim}
                selected={claim.claimId === selectedClaimId}
                onSelect={onSelect}
              />
            ))}
          </Box>

          <AdminPagination
            page={page}
            pageSize={pageSize}
            totalElements={totalElements}
            noun={SESSION_CLAIM_LIST_NOUN}
            onPageChange={onPageChange}
          />
        </>
      )}
    </Box>
  );
}
