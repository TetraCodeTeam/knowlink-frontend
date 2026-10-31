import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateMyStudentProfile } from "@/modules/student/profile/api/student-profile.api";
import type { UpdateStudentProfileRequest } from "@/modules/users/interfaces/requests/edit-profile.interface";

export function useUpdateStudentProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-student-profile"],
    mutationFn: (data: UpdateStudentProfileRequest) => updateMyStudentProfile(data),
    onSuccess: (profile) => {
      queryClient.setQueryData(["myStudentProfile"], profile);
      toast.success("Datos personales actualizados correctamente.");
    },
  });
}
