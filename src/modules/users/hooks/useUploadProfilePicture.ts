import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadMyProfilePicture } from "@/modules/users/api/profile-picture.api";
import type { Role } from "@/shared/types/role.type";

const PROFILE_QUERY_KEY: Record<Role, string> = {
  STUDENT: "myStudentProfile",
  TUTOR: "myTutorProfile",
};

/** Los errores de la API los muestra el interceptor de `httpClient`. */
export function useUploadProfilePicture(role: Role) {
  const queryClient = useQueryClient();
  const otherRole: Role = role === "STUDENT" ? "TUTOR" : "STUDENT";

  return useMutation({
    mutationKey: ["upload-profile-picture", role],
    mutationFn: (file: File) => uploadMyProfilePicture(role, file),
    onSuccess: (profile) => {
      queryClient.setQueryData([PROFILE_QUERY_KEY[role]], profile);
      // La foto se comparte entre los dos roles de una misma cuenta.
      void queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEY[otherRole]] });
      toast.success("Foto de perfil actualizada.");
    },
  });
}
