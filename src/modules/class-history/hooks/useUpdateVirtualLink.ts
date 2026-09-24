import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateVirtualLink } from "@/modules/class-history/api/classHistory.api";
import type { VirtualSessionLinkRequest } from "@/modules/class-history/interfaces/requests/virtual-session-link.interface";

export function useUpdateVirtualLink(bookingId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["updateVirtualLink", bookingId],
    mutationFn: (data: VirtualSessionLinkRequest) => updateVirtualLink(bookingId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookingDetail", bookingId] });
      queryClient.invalidateQueries({ queryKey: ["bookingHistory"] });
    },
  });

  return {
    saveVirtualLink: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
}
