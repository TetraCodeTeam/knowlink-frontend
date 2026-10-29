import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import { ArrowLeft, CircleAlert, CircleCheck, Info, Pencil, Trash2 } from "lucide-react";
import AppButton from "@/shared/components/AppButton";
import AppConfirmDialog from "@/shared/components/AppConfirmDialog";
import EditPostDialog from "@/modules/community/components/EditPostDialog";
import PostCard from "@/modules/community/components/PostCard";
import ReplyCard from "@/modules/community/components/ReplyCard";
import ReplyDialog from "@/modules/community/components/ReplyDialog";
import { isReplyBlocked } from "@/modules/community/utils/is-reply-blocked";
import { useCommunityPost } from "@/modules/community/hooks/useCommunityPost";
import { useCommunityViewer } from "@/modules/community/hooks/useCommunityViewer";
import { useDeletePost } from "@/modules/community/hooks/useDeletePost";
import { useDeleteReply } from "@/modules/community/hooks/useDeleteReply";
import { useResolvePost } from "@/modules/community/hooks/useResolvePost";
import { useToggleHelpful } from "@/modules/community/hooks/useToggleHelpful";
import { useUpdateReply } from "@/modules/community/hooks/useUpdateReply";
import type { ReplyEdit } from "@/modules/community/interfaces/reply-edit.interface";
import type { CommunityReply } from "@/modules/community/interfaces/responses/community-reply.interface";
import {
  COMMUNITY_COLORS,
  backLinkSx,
  cardSx,
  chipSx,
  pageContentSx,
  pageSx,
  sectionTitleSx,
} from "@/modules/community/styles/community.styles";

const REPLIES_ANCHOR = "respuestas";

interface ThreadLocationState {
  openReply?: boolean;
}

type PendingConfirm =
  | { kind: "resolve" }
  | { kind: "delete-post" }
  | { kind: "delete-reply"; replyId: string };

export default function PostThreadPage() {
  const { postId = "" } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { paths } = useCommunityViewer();
  const { detail, isLoading, isError } = useCommunityPost(postId);

  const [isReplyOpen, setIsReplyOpen] = useState(
    (location.state as ThreadLocationState | null)?.openReply === true
  );
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [pendingConfirm, setPendingConfirm] = useState<PendingConfirm | null>(null);

  const { toggleHelpful, pendingReplyId } = useToggleHelpful(postId);
  const { updateReply, isPending: isSaving } = useUpdateReply(postId);
  const { deleteReply, isPending: isDeletingReply } = useDeleteReply(postId);
  const { resolvePost, isPending: isResolving } = useResolvePost();
  const { deletePost, isPending: isDeletingPost } = useDeletePost();

  // "N respuestas" enlaza a #respuestas: una vez cargado el hilo, se baja a esa sección.
  const hasDetail = detail !== undefined;
  useEffect(() => {
    if (!hasDetail || location.hash !== `#${REPLIES_ANCHOR}`) return;
    document.getElementById(REPLIES_ANCHOR)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hasDetail, location.hash]);

  const backLink = (
    <Box component={Link} to={paths.home} sx={backLinkSx}>
      <ArrowLeft size={16} aria-hidden />
      Volver a la Comunidad
    </Box>
  );

  if (isLoading) {
    return (
      <Box sx={{ ...pageSx, display: "flex", justifyContent: "center", pt: 10 }}>
        <CircularProgress aria-label="Cargando publicación" />
      </Box>
    );
  }

  if (isError || !detail) {
    return (
      <Box sx={pageSx}>
        <Box sx={pageContentSx}>
          {backLink}
          <Box sx={{ ...cardSx, textAlign: "center", color: COMMUNITY_COLORS.muted }}>
            La publicación no existe o fue eliminada.
          </Box>
        </Box>
      </Box>
    );
  }

  const { post, replies } = detail;
  const isOpen = post.status === "OPEN";
  const canResolve = post.ownedByMe && post.type === "HELP_REQUEST" && isOpen;
  // El autor puede contestarle a quienes respondieron; el backend lo habilita recién cuando hay una respuesta ajena.
  const canReplyToReplies = post.ownedByMe && isOpen && !isReplyBlocked(post);

  const ownerActions = (
    <>
      {isOpen ? (
        <AppButton
          size="small"
          appVariant="outline"
          startIcon={<Pencil size={16} />}
          onClick={() => setIsEditOpen(true)}
        >
          Editar publicación
        </AppButton>
      ) : null}
      {canResolve ? (
        <AppButton
          size="small"
          appVariant="soft"
          startIcon={<CircleCheck size={16} />}
          onClick={() => setPendingConfirm({ kind: "resolve" })}
        >
          Marcar como resuelta
        </AppButton>
      ) : null}
      <AppButton
        size="small"
        appVariant="soft-danger"
        startIcon={<Trash2 size={16} />}
        onClick={() => setPendingConfirm({ kind: "delete-post" })}
      >
        Eliminar publicación
      </AppButton>
    </>
  );

  const handleToggleHelpful = (reply: CommunityReply) => {
    void toggleHelpful({ replyId: reply.replyId, markedByMe: reply.markedHelpfulByMe }).catch(
      () => {
        // El interceptor de httpClient ya mostró el motivo.
      }
    );
  };

  const handleSaveEdit = async (replyId: string, edit: ReplyEdit) => {
    await updateReply({ replyId, edit });
    setEditingReplyId(null);
  };

  const handleConfirm = async () => {
    if (!pendingConfirm) return;
    try {
      if (pendingConfirm.kind === "resolve") {
        await resolvePost(postId);
      } else if (pendingConfirm.kind === "delete-reply") {
        await deleteReply(pendingConfirm.replyId);
      } else {
        await deletePost(postId);
        setPendingConfirm(null);
        navigate(paths.home, { replace: true });
        return;
      }
      setPendingConfirm(null);
    } catch {
      setPendingConfirm(null);
    }
  };

  const confirmCopy = {
    resolve: {
      title: "¿Marcar como resuelta?",
      message:
        'Se destacará la respuesta con más marcas "Esto me sirvió" y el hilo dejará de aceptar nuevas respuestas.',
      label: "Marcar como resuelta",
      severity: "warning" as const,
    },
    "delete-post": {
      title: "¿Eliminar la publicación?",
      message: "Se eliminará junto con sus respuestas. Esta acción no se puede deshacer.",
      label: "Eliminar",
      severity: "danger" as const,
    },
    "delete-reply": {
      title: "¿Eliminar tu respuesta?",
      message: "Esta acción no se puede deshacer.",
      label: "Eliminar",
      severity: "danger" as const,
    },
  };
  const copy = pendingConfirm ? confirmCopy[pendingConfirm.kind] : confirmCopy.resolve;

  return (
    <Box sx={pageSx}>
      <Box sx={pageContentSx}>
        {backLink}

        <Box sx={{ display: "grid", gap: 1.5 }}>
          <PostCard
            post={post}
            variant="detail"
            onReply={() => setIsReplyOpen(true)}
            ownerActions={ownerActions}
          />

          {post.type === "HELP_REQUEST" && isOpen ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.25,
                border: "1px solid #F0C9B3",
                borderRadius: "10px",
                bgcolor: "#FFFAF6",
                px: 2,
                py: 1.5,
                fontSize: 13,
                color: COMMUNITY_COLORS.muted,
              }}
            >
              <CircleAlert
                size={16}
                color="#A8480E"
                style={{ flexShrink: 0, marginTop: 2 }}
                aria-hidden
              />
              <span>
                Recordá que las respuestas en la comunidad deben ser{" "}
                <strong>explicaciones conceptuales breves y pedagógicas</strong>. Para resolución
                paso a paso de guías completas o preparación de parciales, reservá una clase
                personalizada con un tutor verificado.
              </span>
            </Box>
          ) : null}
        </Box>

        <Box
          id={REPLIES_ANCHOR}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            flexWrap: "wrap",
            scrollMarginTop: 88,
          }}
        >
          <Typography component="h2" sx={sectionTitleSx}>
            Respuestas del campus
          </Typography>
          <Box
            component="span"
            sx={{ ...chipSx, bgcolor: "#3727C9", color: "#FFFFFF", borderRadius: "10px" }}
          >
            {replies.length}
          </Box>
        </Box>

        {!isOpen ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              bgcolor: COMMUNITY_COLORS.successBg,
              color: COMMUNITY_COLORS.success,
              borderRadius: "10px",
              px: 2,
              py: 1.25,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <Info size={16} aria-hidden />
            Esta consulta fue marcada como resuelta y ya no acepta nuevas respuestas.
          </Box>
        ) : null}

        {replies.length === 0 ? (
          <Box sx={{ ...cardSx, textAlign: "center", color: COMMUNITY_COLORS.muted }}>
            Todavía no hay respuestas.{" "}
            {isOpen
              ? post.ownedByMe
                ? "Cuando alguien responda, vas a poder contestarle."
                : "¡Sé el primero en ayudar!"
              : ""}
          </Box>
        ) : (
          <Box sx={{ display: "grid", gap: 2 }}>
            {replies.map((reply) => (
              <ReplyCard
                key={reply.replyId}
                reply={reply}
                isHelpfulPending={pendingReplyId === reply.replyId}
                isSaving={isSaving}
                isEditing={editingReplyId === reply.replyId}
                isEditLocked={editingReplyId !== null && editingReplyId !== reply.replyId}
                onToggleHelpful={handleToggleHelpful}
                onStartEdit={setEditingReplyId}
                onCancelEdit={() => setEditingReplyId(null)}
                onSaveEdit={handleSaveEdit}
                onDelete={(replyId) => setPendingConfirm({ kind: "delete-reply", replyId })}
                onReply={
                  canReplyToReplies && !reply.ownedByMe ? () => setIsReplyOpen(true) : undefined
                }
              />
            ))}
          </Box>
        )}
      </Box>

      <ReplyDialog
        open={isReplyOpen && isOpen && !isReplyBlocked(post)}
        postId={postId}
        postTitle={post.title}
        onClose={() => setIsReplyOpen(false)}
      />

      <EditPostDialog post={post} open={isEditOpen} onClose={() => setIsEditOpen(false)} />

      <AppConfirmDialog
        open={pendingConfirm !== null}
        title={copy.title}
        message={copy.message}
        severity={copy.severity}
        confirmLabel={copy.label}
        onConfirm={() => void handleConfirm()}
        onCancel={() => setPendingConfirm(null)}
        isPending={isResolving || isDeletingPost || isDeletingReply}
      />
    </Box>
  );
}
