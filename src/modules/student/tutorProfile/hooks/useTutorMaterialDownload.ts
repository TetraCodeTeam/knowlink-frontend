import { getMaterialDownloadUrl } from "@/modules/student/tutorProfile/api/getTutorProfile";

export const useTutorMaterialDownload = () => {
  const downloadMaterial = async (materialId: string) => {
    const downloadUrl = await getMaterialDownloadUrl(materialId);
    window.open(downloadUrl, "_blank", "noopener,noreferrer");
  };

  return { downloadMaterial };
};