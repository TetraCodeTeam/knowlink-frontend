import { useState, type ChangeEvent, type FormEvent } from "react";
import { useSubmitMaterialDefense } from "@/modules/support/hooks/useSupportDetailMutations";
import {
  ACCEPTED_FILE_FORMATS,
  FILE_FORMAT_MIME_TYPES,
} from "@/modules/support/constants/file-format.constants";
import type { FileFormat } from "@/modules/support/interfaces/file-format.type";
import type { MaterialReportingPolicy } from "@/modules/support/interfaces/responses/material-reporting-policy.response";

const DEFAULT_MAX_ATTACHMENTS = 5;
const DEFAULT_MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;
export const DEFAULT_MAX_DESCRIPTION_LENGTH = 2000;

function isValidDefenseFile(file: File, maxSize: number, allowedFormats: FileFormat[]): boolean {
  const extension = file.name.split(".").pop()?.toUpperCase() ?? "";
  const format = allowedFormats.find((allowed) => allowed === extension);
  return (
    format !== undefined &&
    file.size > 0 &&
    file.size <= maxSize &&
    FILE_FORMAT_MIME_TYPES[format] === file.type
  );
}

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
  const acceptedFormats = (policy?.acceptedFormats ?? ACCEPTED_FILE_FORMATS).filter(
    (format) => format in FILE_FORMAT_MIME_TYPES
  );
  const acceptAttribute = acceptedFormats.map((format) => `.${format.toLowerCase()}`).join(",");
  const acceptedFormatsLabel = acceptedFormats.join(", ");

  const reset = () => {
    setDescription("");
    setFiles([]);
    setFilesError("");
  };

  const closeEditor = () => setIsEditing(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    const maxAttachments = policy?.maxDefenseAttachments ?? DEFAULT_MAX_ATTACHMENTS;
    const maxSize = policy?.maxDefenseAttachmentSizeBytes ?? DEFAULT_MAX_ATTACHMENT_BYTES;
    const hasInvalidFile = selectedFiles.some(
      (file) => !isValidDefenseFile(file, maxSize, acceptedFormats)
    );

    const error =
      selectedFiles.length > maxAttachments
        ? `Podés adjuntar hasta ${maxAttachments} archivos.`
        : hasInvalidFile
          ? `Los archivos deben ser ${acceptedFormatsLabel} válidos, no estar vacíos y respetar el tamaño máximo permitido.`
          : "";

    setFilesError(error);
    setFiles(error ? [] : selectedFiles);
    if (error) event.target.value = "";
  };

  const canSubmit = description.trim().length > 0 || files.length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
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
    canSubmit,
    acceptAttribute,
    isPending: mutation.isPending,
    openEditor: () => setIsEditing(true),
    closeEditor,
    setDescription,
    handleFileChange,
    handleSubmit,
  };
}
