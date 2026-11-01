import { useRef } from "react";
import type { ChangeEvent } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { Paperclip, Undo2, X } from "lucide-react";
import { toast } from "sonner";
import { ATTACHMENT_ACCEPT } from "@/modules/community/constants/community.constants";
import type { CommunityAttachment } from "@/modules/community/interfaces/responses/community-attachment.interface";
import { COMMUNITY_COLORS, chipSx } from "@/modules/community/styles/community.styles";
import { formatFileSize } from "@/modules/community/utils/format-file-size";
import { validateAttachment } from "@/modules/community/utils/validate-attachment";

interface AttachmentEditorProps {
  /** Adjunto que tiene hoy la respuesta, si lo hay. */
  current: CommunityAttachment | null;
  /** Archivo nuevo elegido (reemplaza al actual). */
  file: File | null;
  /** El adjunto actual está marcado para quitarse. */
  removeCurrent: boolean;
  disabled?: boolean;
  onFileChange: (file: File | null) => void;
  onRemoveCurrentChange: (remove: boolean) => void;
}

const rowSx = {
  display: "flex",
  alignItems: "center",
  gap: 1.25,
  bgcolor: COMMUNITY_COLORS.panel,
  borderRadius: "10px",
  px: 1.5,
  py: 1,
};

/** Agregar, reemplazar o quitar el adjunto de una respuesta que se está editando. */
export default function AttachmentEditor({
  current,
  file,
  removeCurrent,
  disabled = false,
  onFileChange,
  onRemoveCurrentChange,
}: AttachmentEditorProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const hasAttachment = file !== null || (current !== null && !removeCurrent);

  const handleSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    event.target.value = "";
    if (!selected) return;

    const problem = validateAttachment(selected);
    if (problem) {
      toast.error(problem);
      return;
    }
    onFileChange(selected);
  };

  const renderStatus = () => {
    if (file) {
      return (
        <Box sx={rowSx}>
          <Paperclip size={16} color={COMMUNITY_COLORS.primaryDark} aria-hidden />
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography noWrap sx={{ fontSize: 13.5, fontWeight: 600 }}>
              {file.name}
            </Typography>
            <Typography sx={{ fontSize: 12, color: COMMUNITY_COLORS.subtle }}>
              {formatFileSize(file.size)}
              {current ? " · reemplaza al archivo actual" : ""}
            </Typography>
          </Box>
          <Box component="span" sx={{ ...chipSx, bgcolor: "#E4E1FA", color: "#3F2FB5" }}>
            Nuevo
          </Box>
          <IconButton
            size="small"
            aria-label="Descartar el archivo nuevo"
            disabled={disabled}
            onClick={() => onFileChange(null)}
          >
            <X size={16} />
          </IconButton>
        </Box>
      );
    }

    if (current && removeCurrent) {
      return (
        <Box sx={{ ...rowSx, bgcolor: "#FFF4F4" }}>
          <Typography sx={{ flex: 1, fontSize: 13.5, color: "#B91C1C" }}>
            Se quitará el archivo adjunto ({current.fileName}) al guardar.
          </Typography>
          <Box
            component="button"
            type="button"
            disabled={disabled}
            onClick={() => onRemoveCurrentChange(false)}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              border: "none",
              bgcolor: "transparent",
              color: COMMUNITY_COLORS.primaryDark,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Undo2 size={14} aria-hidden />
            Deshacer
          </Box>
        </Box>
      );
    }

    if (current) {
      return (
        <Box sx={rowSx}>
          <Paperclip size={16} color={COMMUNITY_COLORS.primaryDark} aria-hidden />
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography noWrap sx={{ fontSize: 13.5, fontWeight: 600 }}>
              {current.fileName}
            </Typography>
            <Typography sx={{ fontSize: 12, color: COMMUNITY_COLORS.subtle }}>
              {formatFileSize(current.sizeInBytes)}
            </Typography>
          </Box>
          <IconButton
            size="small"
            aria-label="Quitar el archivo adjunto"
            disabled={disabled}
            onClick={() => onRemoveCurrentChange(true)}
          >
            <X size={16} />
          </IconButton>
        </Box>
      );
    }

    return null;
  };

  return (
    <Box sx={{ display: "grid", gap: 1, mt: 1.25 }}>
      {renderStatus()}
      <input
        ref={inputRef}
        type="file"
        hidden
        accept={ATTACHMENT_ACCEPT}
        onChange={handleSelected}
        data-testid="reply-edit-file-input"
      />
      <Box
        component="button"
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.75,
          justifySelf: "start",
          border: "none",
          bgcolor: "transparent",
          color: COMMUNITY_COLORS.primaryDark,
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          p: 0,
          "&:disabled": { opacity: 0.5, cursor: "default" },
        }}
      >
        <Paperclip size={15} aria-hidden />
        {hasAttachment ? "Cambiar archivo" : "Adjuntar archivo"}
      </Box>
    </Box>
  );
}
