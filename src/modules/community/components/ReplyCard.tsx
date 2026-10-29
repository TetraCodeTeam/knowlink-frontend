import { useState } from "react";
import { Box, IconButton, InputBase, Tooltip, Typography } from "@mui/material";
import { Lightbulb, Pencil, Reply, Trash2 } from "lucide-react";
import AppButton from "@/shared/components/AppButton";
import AttachmentEditor from "@/modules/community/components/AttachmentEditor";
import AttachmentView from "@/modules/community/components/AttachmentView";
import AuthorHeader from "@/modules/community/components/AuthorHeader";
import BookingCtaCard from "@/modules/community/components/BookingCtaCard";
import FormattedText from "@/modules/community/components/FormattedText";
import { REPLY_MAX_LENGTH } from "@/modules/community/constants/community.constants";
import { useCommunityViewer } from "@/modules/community/hooks/useCommunityViewer";
import type { ReplyEdit } from "@/modules/community/interfaces/reply-edit.interface";
import type { CommunityReply } from "@/modules/community/interfaces/responses/community-reply.interface";
import { COMMUNITY_COLORS, cardSx, chipSx } from "@/modules/community/styles/community.styles";

interface ReplyCardProps {
  reply: CommunityReply;
  isHelpfulPending: boolean;
  isSaving: boolean;
  /** Esta respuesta es la que se está editando. */
  isEditing: boolean;
  /** Hay otra respuesta en edición: solo una puede editarse a la vez. */
  isEditLocked: boolean;
  onToggleHelpful: (reply: CommunityReply) => void;
  onStartEdit: (replyId: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: (replyId: string, edit: ReplyEdit) => Promise<void>;
  onDelete: (replyId: string) => void;
  /** Si se pasa, la respuesta ofrece "Responder" (el autor de la publicación contesta a quienes lo ayudaron). */
  onReply?: () => void;
}

export default function ReplyCard({
  reply,
  isHelpfulPending,
  isSaving,
  isEditing,
  isEditLocked,
  onToggleHelpful,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
  onReply,
}: ReplyCardProps) {
  const { paths } = useCommunityViewer();
  const [draft, setDraft] = useState(reply.content);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [removeCurrent, setRemoveCurrent] = useState(false);
  const draftInvalid = draft.trim().length === 0 || draft.length > REPLY_MAX_LENGTH;

  const bookingPath =
    reply.bookingCard && !reply.ownedByMe && paths.booking
      ? paths.booking(reply.author.userId)
      : null;

  const startEditing = () => {
    setDraft(reply.content);
    setNewFile(null);
    setRemoveCurrent(false);
    onStartEdit(reply.replyId);
  };

  const saveEdit = async () => {
    try {
      await onSaveEdit(reply.replyId, {
        content: draft,
        file: newFile,
        removeAttachment: removeCurrent,
      });
    } catch {
      // El interceptor de httpClient ya mostró el motivo; se conserva el borrador.
    }
  };

  return (
    <Box
      component="article"
      aria-label={`Respuesta de ${reply.author.fullName}`}
      sx={{
        ...cardSx,
        ...(reply.featured ? { border: `1.5px solid #8FD6B0`, bgcolor: "#FBFFFC" } : {}),
      }}
    >
      {reply.featured ? (
        <Box
          component="span"
          sx={{
            ...chipSx,
            mb: 1.25,
            bgcolor: "#0B4A2E",
            color: "#FFFFFF",
            textTransform: "none",
          }}
        >
          Respuesta destacada
        </Box>
      ) : null}

      <AuthorHeader author={reply.author} createdAt={reply.createdAt} showRoleLabel />

      <Box sx={{ mt: 1.5 }}>
        {isEditing ? (
          <Box>
            <InputBase
              multiline
              fullWidth
              minRows={3}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              disabled={isSaving}
              inputProps={{ "aria-label": "Editar respuesta" }}
              sx={{
                border: `1px solid ${draftInvalid ? "#D64545" : "#DCDDF0"}`,
                borderRadius: "10px",
                px: 1.5,
                py: 1,
                fontSize: 15,
              }}
            />
            <Typography
              sx={{
                mt: 0.5,
                fontSize: 12.5,
                color: draftInvalid ? "#D64545" : COMMUNITY_COLORS.subtle,
              }}
            >
              {draft.length} / {REPLY_MAX_LENGTH} car.
            </Typography>

            <AttachmentEditor
              current={reply.attachment}
              file={newFile}
              removeCurrent={removeCurrent}
              disabled={isSaving}
              onFileChange={setNewFile}
              onRemoveCurrentChange={setRemoveCurrent}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1.5 }}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <AppButton
                  size="small"
                  appVariant="outline"
                  disabled={isSaving}
                  onClick={onCancelEdit}
                >
                  Cancelar
                </AppButton>
                <AppButton
                  size="small"
                  loading={isSaving}
                  disabled={draftInvalid}
                  onClick={saveEdit}
                >
                  Guardar
                </AppButton>
              </Box>
            </Box>
          </Box>
        ) : (
          <>
            <FormattedText text={reply.content} />
            {reply.edited ? (
              <Typography sx={{ fontSize: 12, color: COMMUNITY_COLORS.subtle, mt: 0.5 }}>
                (editada)
              </Typography>
            ) : null}
          </>
        )}
      </Box>

      {reply.attachment && !isEditing ? <AttachmentView attachment={reply.attachment} /> : null}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
          flexWrap: "wrap",
          mt: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <Tooltip title={reply.ownedByMe ? "No podés marcar tu propia respuesta" : ""}>
            <span>
              <Box
                component="button"
                type="button"
                disabled={reply.ownedByMe || isHelpfulPending}
                aria-pressed={reply.markedHelpfulByMe}
                onClick={() => onToggleHelpful(reply)}
                sx={{
                  ...chipSx,
                  border: "none",
                  cursor: "pointer",
                  px: 1.5,
                  py: 0.6,
                  fontSize: 13,
                  bgcolor: reply.markedHelpfulByMe ? "#D7D3F7" : "#EEEBFC",
                  color: "#3F2FB5",
                  "&:disabled": { cursor: "default", opacity: reply.ownedByMe ? 0.75 : 0.6 },
                  "&:hover:not(:disabled)": { bgcolor: "#D7D3F7" },
                }}
              >
                <Lightbulb
                  size={15}
                  aria-hidden
                  fill={reply.markedHelpfulByMe ? "#F5B820" : "none"}
                  color={reply.markedHelpfulByMe ? "#B7860B" : "#3F2FB5"}
                />
                Esto me sirvió
                <Box component="span" sx={{ fontWeight: 400 }}>
                  · {reply.helpfulCount} {reply.helpfulCount === 1 ? "voto" : "votos"}
                </Box>
              </Box>
            </span>
          </Tooltip>
          {onReply && !isEditing ? (
            <AppButton
              size="small"
              appVariant="outline"
              startIcon={<Reply size={14} />}
              onClick={onReply}
            >
              Responder
            </AppButton>
          ) : null}
        </Box>

        {reply.ownedByMe && !isEditing ? (
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <Tooltip
              title={
                isEditLocked
                  ? "Terminá de editar tu otra respuesta antes de editar esta"
                  : "Editar respuesta"
              }
            >
              <span>
                <IconButton
                  size="small"
                  aria-label="Editar respuesta"
                  disabled={isEditLocked}
                  onClick={startEditing}
                >
                  <Pencil size={16} />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Eliminar respuesta">
              <IconButton
                size="small"
                aria-label="Eliminar respuesta"
                onClick={() => onDelete(reply.replyId)}
                sx={{ color: "#B91C1C" }}
              >
                <Trash2 size={16} />
              </IconButton>
            </Tooltip>
          </Box>
        ) : null}
      </Box>

      {reply.bookingCard && bookingPath ? (
        <BookingCtaCard
          tutor={reply.author}
          question={reply.bookingCard.question}
          bookingPath={bookingPath}
        />
      ) : null}
    </Box>
  );
}
