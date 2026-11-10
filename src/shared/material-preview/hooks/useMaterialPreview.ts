import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchMaterialBlob,
  getMaterialSignedUrl,
} from "@/shared/material-preview/api/materialPreview.api";
import type { PreviewableMaterial } from "@/shared/material-preview/interfaces/previewable-material.interface";
import type { PreviewKind } from "@/shared/material-preview/utils/previewFormat";
import { getPreviewKind, PREVIEW_MIME } from "@/shared/material-preview/utils/previewFormat";

interface MaterialPreviewResult {
  objectUrl: string | null;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  kind: PreviewKind;
}

/**
 * Descarga el material como Blob y lo expone como URL `blob:` para el visor.
 * Son archivos de hasta 10 MB: no se cachean (staleTime y gcTime en 0) y la URL
 * se revoca al cambiar o al desmontar.
 */
export function useMaterialPreview(
  material: PreviewableMaterial | null,
  open: boolean
): MaterialPreviewResult {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  const id = material?.id ?? "";
  const kind = getPreviewKind(material?.format ?? "");
  const isEnabled = open && material !== null && kind !== "unsupported";
  const mimeType = kind === "pdf" ? PREVIEW_MIME.pdf : PREVIEW_MIME.image;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["material-preview", id],
    enabled: isEnabled,
    retry: false,
    staleTime: 0,
    gcTime: 0,
    queryFn: ({ signal }) =>
      getMaterialSignedUrl(id).then((url) => fetchMaterialBlob(url, mimeType, signal)),
  });

  useEffect(() => {
    if (!data) {
      setObjectUrl(null);
      return;
    }
    const url = URL.createObjectURL(data);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [data]);

  return {
    objectUrl,
    isLoading,
    isError,
    refetch: () => void refetch(),
    kind,
  };
}
