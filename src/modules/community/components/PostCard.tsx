import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { MessageSquare, ThumbsUp } from "lucide-react";
import AppButton from "@/shared/components/AppButton";
import AttachmentView from "@/modules/community/components/AttachmentView";
import AuthorHeader from "@/modules/community/components/AuthorHeader";
import FeaturedReplyPreview from "@/modules/community/components/FeaturedReplyPreview";
import FormattedText from "@/modules/community/components/FormattedText";
import PostBadges from "@/modules/community/components/PostBadges";
import ReplyButton from "@/modules/community/components/ReplyButton";
import { useCommunityViewer } from "@/modules/community/hooks/useCommunityViewer";
import type { CommunityPost } from "@/modules/community/interfaces/responses/community-post.interface";
import {
  COMMUNITY_COLORS,
  cardSx,
  chipSx,
  linkSx,
} from "@/modules/community/styles/community.styles";

interface PostCardProps {
  post: CommunityPost;
  /** "feed" recorta el texto y enlaza al hilo; "detail" muestra la publicación completa. */
  variant?: "feed" | "detail";
  /** Solo en "detail": abre el diálogo para responder. */
  onReply?: () => void;
  /** Solo en "detail": acciones del autor (editar, resolver, eliminar), que reemplazan a "Responder". */
  ownerActions?: ReactNode;
}

const CLAMP_LINES = 5;

const titleSx = {
  display: "block",
  mt: 1.75,
  fontSize: 19,
  fontWeight: 700,
  lineHeight: 1.35,
  color: COMMUNITY_COLORS.text,
};

export default function PostCard({ post, variant = "feed", onReply, ownerActions }: PostCardProps) {
  const navigate = useNavigate();
  const { paths } = useCommunityViewer();
  const isDetail = variant === "detail";
  const isOpenHelpRequest = post.type === "HELP_REQUEST" && post.status === "OPEN";
  const isOpen = post.status === "OPEN";
  const threadPath = paths.post(post.postId);
  const repliesLabel = `${post.replyCount} ${post.replyCount === 1 ? "respuesta" : "respuestas"}`;

  const handleReply = () => {
    if (isDetail) {
      onReply?.();
      return;
    }
    navigate(threadPath, { state: { openReply: true } });
  };

  return (
    <Box
      component="article"
      aria-label={post.title}
      sx={{
        ...cardSx,
        ...(post.type === "SHARED_CONTENT" ? { borderTop: "3px solid #3F2FB5" } : {}),
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 1.5,
          flexWrap: "wrap",
        }}
      >
        <AuthorHeader author={post.author} createdAt={post.createdAt} />
        <PostBadges post={post} />
      </Box>

      {isDetail ? (
        <Typography component="h2" sx={titleSx}>
          {post.title}
        </Typography>
      ) : (
        <Typography component={Link} to={threadPath} sx={{ ...titleSx, ...linkSx }}>
          {post.title}
        </Typography>
      )}

      <FormattedText
        text={post.content}
        sx={
          isDetail
            ? { mt: 1 }
            : {
                mt: 1,
                display: "-webkit-box",
                WebkitLineClamp: CLAMP_LINES,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }
        }
      />

      {post.attachment ? <AttachmentView attachment={post.attachment} /> : null}

      {!isDetail && post.status === "RESOLVED" && post.featuredReply ? (
        <FeaturedReplyPreview featured={post.featuredReply} />
      ) : null}

      {isOpenHelpRequest ? (
        <Box sx={{ mt: 1.5 }}>
          <Box
            component="span"
            sx={{ ...chipSx, bgcolor: COMMUNITY_COLORS.warningBg, color: COMMUNITY_COLORS.warning }}
          >
            <Box component="span" aria-hidden sx={{ fontSize: 9 }}>
              ●
            </Box>
            Abierta · Esperando respuesta
          </Box>
        </Box>
      ) : null}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
          mt: 1.75,
          pt: 1.5,
          borderTop: `1px solid ${COMMUNITY_COLORS.border}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, color: COMMUNITY_COLORS.muted }}>
          {isDetail ? (
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, fontSize: 13.5 }}>
              <MessageSquare size={16} aria-hidden />
              {repliesLabel}
            </Box>
          ) : (
            <Box
              component={Link}
              to={`${threadPath}#respuestas`}
              aria-label={`Ver ${repliesLabel}`}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                fontSize: 13.5,
                color: "inherit",
                textDecoration: "none",
                "&:hover": { color: COMMUNITY_COLORS.primaryDark, textDecoration: "underline" },
              }}
            >
              <MessageSquare size={16} aria-hidden />
              {repliesLabel}
            </Box>
          )}
          {post.edited ? (
            <Box component="span" sx={{ fontSize: 12.5, color: COMMUNITY_COLORS.subtle }}>
              (editada)
            </Box>
          ) : null}
          {post.helpfulCount > 0 ? (
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                fontSize: 13.5,
                color: COMMUNITY_COLORS.primaryDark,
                fontWeight: 600,
              }}
            >
              <ThumbsUp size={16} aria-hidden />
              {post.helpfulCount} {post.helpfulCount === 1 ? "útil" : "útiles"}
            </Box>
          ) : null}
        </Box>

        {post.ownedByMe ? (
          isDetail ? (
            ownerActions ? (
              <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", justifyContent: "flex-end" }}>
                {ownerActions}
              </Box>
            ) : null
          ) : (
            <AppButton size="small" appVariant="soft" onClick={() => navigate(threadPath)}>
              Ver hilo
            </AppButton>
          )
        ) : isOpen ? (
          <ReplyButton onClick={handleReply} />
        ) : !isDetail ? (
          <AppButton size="small" appVariant="soft" onClick={() => navigate(threadPath)}>
            Ver hilo
          </AppButton>
        ) : null}
      </Box>
    </Box>
  );
}
