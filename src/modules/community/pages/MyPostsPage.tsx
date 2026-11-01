import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, CircularProgress, TextField, Typography } from "@mui/material";
import {
  ArrowLeft,
  CircleCheck,
  Eye,
  FolderOpen,
  MessageSquare,
  Pencil,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import AppButton from "@/shared/components/AppButton";
import AppConfirmDialog from "@/shared/components/AppConfirmDialog";
import CommunityEmptyState from "@/modules/community/components/CommunityEmptyState";
import EditPostDialog from "@/modules/community/components/EditPostDialog";
import {
  POST_TYPE_SHORT_LABEL,
  POST_TYPE_STYLE,
} from "@/modules/community/constants/post-type-config";
import { useCommunityViewer } from "@/modules/community/hooks/useCommunityViewer";
import { useDeletePost } from "@/modules/community/hooks/useDeletePost";
import { useMyPosts } from "@/modules/community/hooks/useMyPosts";
import { useResolvePost } from "@/modules/community/hooks/useResolvePost";
import type { CommunityPost } from "@/modules/community/interfaces/responses/community-post.interface";
import {
  COMMUNITY_COLORS,
  backLinkSx,
  cardSx,
  chipSx,
  pageContentSx,
  pageSx,
} from "@/modules/community/styles/community.styles";
import { formatRelativeTime } from "@/modules/community/utils/format-relative-time";

type PendingAction = { kind: "resolve" | "delete"; post: CommunityPost };

export default function MyPostsPage() {
  const navigate = useNavigate();
  const { paths } = useCommunityViewer();
  const [date, setDate] = useState("");
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [editing, setEditing] = useState<CommunityPost | null>(null);
  const { posts, isLoading, isError, hasNextPage, isFetchingNextPage, fetchNextPage, refetch } =
    useMyPosts(date);
  const { resolvePost, isPending: isResolving } = useResolvePost();
  const { deletePost, isPending: isDeleting } = useDeletePost();

  const handleConfirm = async () => {
    if (!pending) return;
    try {
      if (pending.kind === "resolve") {
        await resolvePost(pending.post.postId);
      } else {
        await deletePost(pending.post.postId);
      }
    } catch {
      // El interceptor de httpClient ya mostró el motivo.
    } finally {
      setPending(null);
    }
  };

  return (
    <Box sx={pageSx}>
      <Box sx={pageContentSx}>
        <Box component={Link} to={paths.home} sx={backLinkSx}>
          <ArrowLeft size={16} aria-hidden />
          Volver a la Comunidad
        </Box>

        <Box
          component="header"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            bgcolor: COMMUNITY_COLORS.panel,
            borderRadius: "14px",
            px: 2.5,
            py: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              aria-hidden
              sx={{
                width: 56,
                height: 56,
                borderRadius: "14px",
                bgcolor: "#4F46E5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FolderOpen size={28} color="#FFFFFF" />
            </Box>
            <Box>
              <Typography
                component="h1"
                sx={{ fontSize: 28, fontWeight: 800, color: COMMUNITY_COLORS.text }}
              >
                Mis publicaciones
              </Typography>
              <Typography sx={{ fontSize: 14.5, color: COMMUNITY_COLORS.muted }}>
                Consultas realizadas y aportes compartidos en la comunidad universitaria
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextField
              type="date"
              size="small"
              label="Seleccionar fecha"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ bgcolor: "#FFFFFF", borderRadius: 1 }}
            />
            {date ? (
              <AppButton size="small" appVariant="outline" onClick={() => setDate("")}>
                Limpiar
              </AppButton>
            ) : null}
          </Box>
        </Box>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress aria-label="Cargando tus publicaciones" />
          </Box>
        ) : isError ? (
          <Box sx={{ ...cardSx, textAlign: "center" }}>
            <Typography sx={{ color: COMMUNITY_COLORS.muted, mb: 1.5 }}>
              No pudimos cargar tus publicaciones.
            </Typography>
            <AppButton appVariant="soft" onClick={() => void refetch()}>
              Reintentar
            </AppButton>
          </Box>
        ) : posts.length === 0 ? (
          <CommunityEmptyState
            icon={<FolderOpen size={22} color="#5B6ED9" />}
            message={
              date
                ? "No publicaste nada en la fecha seleccionada."
                : "Todavía no realizaste ninguna publicación en la comunidad."
            }
          />
        ) : (
          <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 2 }}>
            {posts.map((post) => {
              const typeStyle = POST_TYPE_STYLE[post.type];
              const canResolve = post.type === "HELP_REQUEST" && post.status === "OPEN";
              return (
                <Box component="li" key={post.postId} sx={cardSx}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap" }}
                    >
                      <Box
                        component="span"
                        sx={{ ...chipSx, bgcolor: "#E8EAFB", color: COMMUNITY_COLORS.primaryDark }}
                      >
                        {post.subject.name}
                      </Box>
                      <Box
                        component="span"
                        sx={{ ...chipSx, bgcolor: typeStyle.bg, color: typeStyle.color }}
                      >
                        {POST_TYPE_SHORT_LABEL[post.type]}
                      </Box>
                      {post.status === "RESOLVED" ? (
                        <Box
                          component="span"
                          sx={{
                            ...chipSx,
                            bgcolor: COMMUNITY_COLORS.successBg,
                            color: COMMUNITY_COLORS.success,
                          }}
                        >
                          <CircleCheck size={13} aria-hidden />
                          Resuelto
                        </Box>
                      ) : null}
                      <Typography sx={{ fontSize: 13, color: COMMUNITY_COLORS.subtle }}>
                        · {post.status === "RESOLVED" ? "Cerrada" : "Publicado"}{" "}
                        {formatRelativeTime(
                          post.status === "RESOLVED" && post.resolvedAt
                            ? post.resolvedAt
                            : post.createdAt
                        ).toLowerCase()}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        color: COMMUNITY_COLORS.muted,
                        fontSize: 14,
                      }}
                    >
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 0.6,
                          color: COMMUNITY_COLORS.primaryDark,
                          fontWeight: 600,
                        }}
                      >
                        <ThumbsUp size={15} aria-hidden />
                        {post.helpfulCount} {post.helpfulCount === 1 ? "útil" : "útiles"}
                      </Box>
                      <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.6 }}>
                        <MessageSquare size={15} aria-hidden />
                        {post.replyCount} {post.replyCount === 1 ? "respuesta" : "respuestas"}
                      </Box>
                    </Box>
                  </Box>

                  <Typography sx={{ fontSize: 18, fontWeight: 700, mt: 1.25 }}>
                    {post.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 14.5,
                      color: COMMUNITY_COLORS.muted,
                      mt: 0.5,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      wordBreak: "break-word",
                    }}
                  >
                    {post.content}
                  </Typography>

                  {post.status === "RESOLVED" && post.featuredReply ? (
                    <Box
                      component="span"
                      sx={{
                        ...chipSx,
                        mt: 1.25,
                        bgcolor: COMMUNITY_COLORS.successBg,
                        color: COMMUNITY_COLORS.success,
                        border: "1px solid #A8E3C3",
                      }}
                    >
                      <CircleCheck size={13} aria-hidden />
                      Respuesta destacada
                      {post.featuredReply.author.role === "TUTOR" ? " de tutor" : ""} aceptada (
                      {post.featuredReply.author.fullName})
                    </Box>
                  ) : null}

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 1.5,
                      mt: 1.5,
                      pt: 1.25,
                      borderTop: `1px solid ${COMMUNITY_COLORS.border}`,
                    }}
                  >
                    <AppButton
                      size="small"
                      appVariant="outline"
                      startIcon={<Eye size={16} />}
                      onClick={() => navigate(paths.post(post.postId))}
                    >
                      Ver en comunidad
                    </AppButton>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {canResolve ? (
                        <AppButton
                          size="small"
                          appVariant="soft"
                          startIcon={<CircleCheck size={16} />}
                          onClick={() => setPending({ kind: "resolve", post })}
                        >
                          Marcar como resuelta
                        </AppButton>
                      ) : null}
                      {post.status === "OPEN" ? (
                        <AppButton
                          size="small"
                          appVariant="outline"
                          startIcon={<Pencil size={16} />}
                          onClick={() => setEditing(post)}
                        >
                          Editar
                        </AppButton>
                      ) : null}
                      <AppButton
                        size="small"
                        appVariant="soft-danger"
                        startIcon={<Trash2 size={16} />}
                        onClick={() => setPending({ kind: "delete", post })}
                      >
                        Eliminar
                      </AppButton>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}

        {hasNextPage ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <AppButton
              appVariant="soft"
              loading={isFetchingNextPage}
              onClick={() => void fetchNextPage()}
            >
              Ver más publicaciones
            </AppButton>
          </Box>
        ) : null}
      </Box>

      {editing ? <EditPostDialog post={editing} open onClose={() => setEditing(null)} /> : null}

      <AppConfirmDialog
        open={pending !== null}
        title={pending?.kind === "resolve" ? "¿Marcar como resuelta?" : "¿Eliminar la publicación?"}
        message={
          pending?.kind === "resolve"
            ? 'Se destacará la respuesta con más marcas "Esto me sirvió" y el hilo dejará de aceptar nuevas respuestas.'
            : "Se eliminará junto con sus respuestas. Esta acción no se puede deshacer."
        }
        severity={pending?.kind === "resolve" ? "warning" : "danger"}
        confirmLabel={pending?.kind === "resolve" ? "Marcar como resuelta" : "Eliminar"}
        onConfirm={() => void handleConfirm()}
        onCancel={() => setPending(null)}
        isPending={isResolving || isDeleting}
      />
    </Box>
  );
}
