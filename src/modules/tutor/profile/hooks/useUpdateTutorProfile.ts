import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateMyTutorProfile } from "@/modules/tutor/profile/api/updateMyTutorProfile";
import type { UpdateTutorProfileRequest } from "@/modules/users/interfaces/requests/edit-profile.interface";

export function useUpdateTutorProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-tutor-profile"],
    mutationFn: (data: UpdateTutorProfileRequest) => updateMyTutorProfile(data),
    onSuccess: (profile) => {
      queryClient.setQueryData(["myTutorProfile"], profile);
      toast.success("Datos personales actualizados correctamente.");
    },
  });
}
