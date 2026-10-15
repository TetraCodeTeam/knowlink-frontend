import { useQuery } from "@tanstack/react-query";
import { getClaimEligibility } from "@/modules/claim/api/claim.api";

export function useClaimEligibility(bookingId: string, enabled: boolean) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["claimEligibility", bookingId],
    queryFn: () => getClaimEligibility(bookingId),
    enabled,
    staleTime: 1000 * 30,
  });

  return { eligibility: data, isLoading, isError };
}
