import { getMaterialDownloadUrl } from "@/modules/student/tutorProfile/api/getTutorProfile";
import { toast } from "sonner";

export const useTutorMaterialDownload = () => {
  const downloadMaterial = async (materialId: string) => {
    try {
      const downloadUrl = await getMaterialDownloadUrl(materialId);
      if (!downloadUrl) {
        toast.error("No se pudo descargar el material. Intentá de nuevo.");
        return;
      }
      window.open(downloadUrl, "_blank", "noopener,noreferrer");
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "No se pudo descargar el material. Intentá de nuevo.";
      toast.error(message);
    }
  };

  return { downloadMaterial };
};
