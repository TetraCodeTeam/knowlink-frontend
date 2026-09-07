import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadStudentProfilePicture } from "@/modules/student/profile/api/student-profile.api";
import { toast } from "sonner";

export function useUploadStudentProfilePicture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadStudentProfilePicture(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myStudentProfile"] });
      toast.success("Foto de perfil actualizada correctamente");
    },
    onError: () => {
      toast.error("No se pudo subir la foto de perfil. Intentá de nuevo.");
    },
  });
}
