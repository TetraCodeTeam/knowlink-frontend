import { toast } from "@/shared/lib/toast";
import {
  fetchMaterialBlob,
  getMaterialSignedUrl,
} from "@/shared/material-preview/api/materialPreview.api";
import type { PreviewableMaterial } from "@/shared/material-preview/interfaces/previewable-material.interface";
import {
  getDownloadFileName,
  getDownloadMime,
} from "@/shared/material-preview/utils/previewFormat";

/**
 * Baja el material como blob y lo guarda con `download`: una URL firmada abierta en
 * otra pestaña se previsualiza en el navegador en vez de guardarse.
 */
export const useMaterialDownload = () => {
  const downloadMaterial = async (material: PreviewableMaterial) => {
    try {
      const signedUrl = await getMaterialSignedUrl(material.id);
      if (!signedUrl) {
        toast.error("No se pudo descargar el material. Intentá de nuevo.");
        return;
      }
      const blob = await fetchMaterialBlob(signedUrl, getDownloadMime(material.format));
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = getDownloadFileName(material.title, material.format);
      anchor.style.display = "none";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "No se pudo descargar el material. Intentá de nuevo.";
      toast.error(message);
    }
  };

  return { downloadMaterial };
};
