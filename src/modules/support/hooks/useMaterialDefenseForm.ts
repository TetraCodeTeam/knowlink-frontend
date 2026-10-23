import { useState, type ChangeEvent, type FormEvent } from "react";
import { useSubmitMaterialDefense } from "@/modules/support/hooks/useSupportDetailMutations";
import type { MaterialReportingPolicy } from "@/modules/support/interfaces/responses/material-reporting-policy.response";

const DEFAULT_MAX_ATTACHMENTS = 5;
const DEFAULT_MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;
export const DEFAULT_MAX_DESCRIPTION_LENGTH = 2000;
const ALLOWED_EXTENSIONS = ["pdf", "png", "xlsx"];

export function useMaterialDefenseForm(
  materialId: string,
  policy: MaterialReportingPolicy | undefined
) {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [filesError, setFilesError] = useState("");
  const mutation = useSubmitMaterialDefense(materialId);

  const maxDescriptionLength = policy?.maxDescriptionLength ?? DEFAULT_MAX_DESCRIPTION_LENGTH;

  const reset = () => {
    setDescription("");
    setFiles([]);
    setFilesError("");
  };

  const closeEditor = () => {
    setIsEditing(false);
    reset();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    const maxAttachments = policy?.maxDefenseAttachments ?? DEFAULT_MAX_ATTACHMENTS;
    const maxSize = policy?.maxDefenseAttachmentSizeBytes ?? DEFAULT_MAX_ATTACHMENT_BYTES;
    const hasInvalidFile = selectedFiles.some((file) => {
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
      return !ALLOWED_EXTENSIONS.includes(extension) || file.size > maxSize;
    });

    const error =
      selectedFiles.length > maxAttachments
        ? `Podés adjuntar hasta ${maxAttachments} archivos.`
        : hasInvalidFile
          ? "Los archivos deben ser PDF, PNG o XLSX y respetar el tamaño máximo permitido."
          : "";

    setFilesError(error);
    setFiles(error ? [] : selectedFiles);
    if (error) event.target.value = "";
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate(
      { description: description.trim(), files },
      {
        onSuccess: () => {
          reset();
          closeEditor();
        },
      }
    );
  };

  return {
    isEditing,
    description,
    files,
    filesError,
    maxDescriptionLength,
    isPending: mutation.isPending,
    openEditor: () => setIsEditing(true),
    closeEditor,
    setDescription,
    handleFileChange,
    handleSubmit,
  };
}
