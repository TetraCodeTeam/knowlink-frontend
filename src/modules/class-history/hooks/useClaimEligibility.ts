import { useQuery } from "@tanstack/react-query";
import { getClaimEligibility } from "@/modules/class-history/api/claims.api";

export function useClaimEligibility(bookingId: string, enabled: boolean) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["claimEligibility", bookingId],
    queryFn: () => getClaimEligibility(bookingId),
    enabled,
    staleTime: 1000 * 30,
  });

  return { eligibility: data, isLoading, isError, refetch };
}
