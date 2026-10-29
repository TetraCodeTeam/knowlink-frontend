import { useCallback, useRef } from "react";
import type { ChangeEvent } from "react";
import { Box, IconButton, InputBase, Tooltip, Typography } from "@mui/material";
import { Bold, Code, Italic, Paperclip, Sigma, Underline, X } from "lucide-react";
import { toast } from "sonner";
import { ATTACHMENT_ACCEPT } from "@/modules/community/constants/community.constants";
import { COMMUNITY_COLORS } from "@/modules/community/styles/community.styles";
import { formatFileSize } from "@/modules/community/utils/format-file-size";
import { validateAttachment } from "@/modules/community/utils/validate-attachment";

interface FormatAction {
  label: string;
  icon: typeof Bold;
  open: string;
  close: string;
}

const FORMAT_ACTIONS: FormatAction[] = [
  { label: "Negrita", icon: Bold, open: "**", close: "**" },
  { label: "Cursiva", icon: Italic, open: "*", close: "*" },
  { label: "Subrayado", icon: Underline, open: "__", close: "__" },
  { label: "Código", icon: Code, open: "`", close: "`" },
  { label: "Fórmula LaTeX", icon: Sigma, open: "$", close: "$" },
];

interface RichTextFieldProps {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  placeholder?: string;
  minRows?: number;
  disabled?: boolean;
  error?: string;
  ariaLabel: string;
  /** Si se pasa, la barra muestra "Adjuntar archivo" y el adjunto elegido. */
  file?: File | null;
  onFileChange?: (file: File | null) => void;
}

export default function RichTextField({
  value,
  onChange,
  maxLength,
  placeholder,
  minRows = 4,
  disabled = false,
  error,
  ariaLabel,
  file,
  onFileChange,
}: RichTextFieldProps) {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const overLimit = value.length > maxLength;

  const applyFormat = useCallback(
    (action: FormatAction) => {
      const element = inputRef.current;
      const start = element?.selectionStart ?? value.length;
      const end = element?.selectionEnd ?? value.length;
      const selected = value.slice(start, end);
      const next = `${value.slice(0, start)}${action.open}${selected}${action.close}${value.slice(end)}`;
      onChange(next);

      const cursorStart = start + action.open.length;
      const cursorEnd = cursorStart + selected.length;
      requestAnimationFrame(() => {
        element?.focus();
        element?.setSelectionRange(cursorStart, cursorEnd);
      });
    },
    [onChange, value]
  );

  const handleFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    event.target.value = "";
    if (!selected || !onFileChange) return;

    const problem = validateAttachment(selected);
    if (problem) {
      toast.error(problem);
      return;
    }
    onFileChange(selected);
  };

  return (
    <Box>
      <Box
        sx={{
          border: `1px solid ${error || overLimit ? "#D64545" : "#DCDDF0"}`,
          borderRadius: "10px",
          overflow: "hidden",
          bgcolor: "#FFFFFF",
          "&:focus-within": { borderColor: COMMUNITY_COLORS.primary },
        }}
      >
        <Box
          role="toolbar"
          aria-label="Formato del texto"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.25,
            px: 1,
            py: 0.5,
            bgcolor: COMMUNITY_COLORS.panel,
          }}
        >
          {FORMAT_ACTIONS.map((action) => (
            <Tooltip key={action.label} title={action.label}>
              <span>
                <IconButton
                  size="small"
                  aria-label={action.label}
                  disabled={disabled}
                  onClick={() => applyFormat(action)}
                  sx={{ color: COMMUNITY_COLORS.primaryDark }}
                >
                  <action.icon size={16} />
                </IconButton>
              </span>
            </Tooltip>
          ))}
          <Box sx={{ flex: 1 }} />
          {onFileChange ? (
            <>
              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept={ATTACHMENT_ACCEPT}
                onChange={handleFileSelected}
                data-testid="community-file-input"
              />
              <Box
                component="button"
                type="button"
                disabled={disabled}
                onClick={() => fileInputRef.current?.click()}
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
                  px: 1,
                  "&:disabled": { opacity: 0.5, cursor: "default" },
                }}
              >
                <Paperclip size={15} aria-hidden />
                Adjuntar archivo
              </Box>
            </>
          ) : null}
        </Box>

        <InputBase
          multiline
          fullWidth
          minRows={minRows}
          maxRows={14}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          inputRef={inputRef}
          inputProps={{ "aria-label": ariaLabel }}
          sx={{ px: 1.75, py: 1.25, fontSize: 15, alignItems: "flex-start" }}
        />

        {file ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              bgcolor: COMMUNITY_COLORS.panel,
              px: 1.75,
              py: 1,
            }}
          >
            <Paperclip size={16} color={COMMUNITY_COLORS.primaryDark} aria-hidden />
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography noWrap sx={{ fontSize: 13.5, fontWeight: 600 }}>
                {file.name}
              </Typography>
              <Typography sx={{ fontSize: 12, color: COMMUNITY_COLORS.subtle }}>
                {formatFileSize(file.size)}
              </Typography>
            </Box>
            <IconButton
              size="small"
              aria-label="Quitar archivo adjunto"
              disabled={disabled}
              onClick={() => onFileChange?.(null)}
            >
              <X size={16} />
            </IconButton>
          </Box>
        ) : null}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mt: 0.5 }}>
        <Typography sx={{ fontSize: 12.5, color: "#D64545" }} role={error ? "alert" : undefined}>
          {error ?? ""}
        </Typography>
        <Typography
          sx={{
            fontSize: 12.5,
            fontWeight: 600,
            color: overLimit ? "#D64545" : COMMUNITY_COLORS.primaryDark,
            whiteSpace: "nowrap",
          }}
          aria-live="polite"
        >
          {value.length} / {maxLength} car.
        </Typography>
      </Box>
    </Box>
  );
}
