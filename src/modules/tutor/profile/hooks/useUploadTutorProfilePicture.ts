import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadTutorProfilePicture } from "@/modules/tutor/profile/api/getMyTutorProfile";
import { toast } from "sonner";

export function useUploadTutorProfilePicture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadTutorProfilePicture(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myTutorProfile"] });
      toast.success("Foto de perfil actualizada correctamente");
    },
    onError: () => {
      toast.error("No se pudo subir la foto de perfil. Intentá de nuevo.");
    },
  });
}
