import { useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { MessagesSquare, SearchX } from "lucide-react";
import AppButton from "@/shared/components/AppButton";
import CommunityEmptyState from "@/modules/community/components/CommunityEmptyState";
import CommunityHeader from "@/modules/community/components/CommunityHeader";
import CreatePostDialog from "@/modules/community/components/CreatePostDialog";
import FeaturedTutorsPanel from "@/modules/community/components/FeaturedTutorsPanel";
import FeedFiltersPanel from "@/modules/community/components/FeedFiltersPanel";
import MyPostsPanel from "@/modules/community/components/MyPostsPanel";
import PostCard from "@/modules/community/components/PostCard";
import PostComposerCard from "@/modules/community/components/PostComposerCard";
import { TOPBAR_HEIGHT } from "@/modules/student/components/StudentTopbar";
import { useCommunityViewer } from "@/modules/community/hooks/useCommunityViewer";
import { useCommunityFeed } from "@/modules/community/hooks/useCommunityFeed";
import { useFeedCounts } from "@/modules/community/hooks/useFeedCounts";
import { useFeedFilters } from "@/modules/community/hooks/useFeedFilters";
import {
  COMMUNITY_COLORS,
  cardSx,
  pageContentSx,
  pageSx,
  twoColumnSx,
} from "@/modules/community/styles/community.styles";
import type { PostType } from "@/modules/community/types/post-type.type";

export default function CommunityFeedPage() {
  const { filters, activeCount, setType, applyDraft, clear } = useFeedFilters();
  const { posts, isLoading, isError, hasNextPage, isFetchingNextPage, fetchNextPage, refetch } =
    useCommunityFeed(filters);
  const { counts } = useFeedCounts(filters);
  const { role } = useCommunityViewer();
  // El layout del alumno tiene topbar fija; el del tutor no.
  const minHeight = role === "STUDENT" ? `calc(100vh - ${TOPBAR_HEIGHT}px)` : "100vh";
  const [composeType, setComposeType] = useState<PostType | null>(null);

  return (
    <Box sx={{ ...pageSx, minHeight }}>
      <Box sx={pageContentSx}>
        <CommunityHeader />

        <Box sx={twoColumnSx}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, minWidth: 0 }}>
            <PostComposerCard onCompose={setComposeType} />

            {isLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress aria-label="Cargando publicaciones" />
              </Box>
            ) : isError ? (
              <Box sx={{ ...cardSx, textAlign: "center" }}>
                <Typography sx={{ color: COMMUNITY_COLORS.muted, mb: 1.5 }}>
                  No pudimos cargar las publicaciones de la comunidad.
                </Typography>
                <AppButton appVariant="soft" onClick={() => void refetch()}>
                  Reintentar
                </AppButton>
              </Box>
            ) : posts.length === 0 && activeCount > 0 ? (
              <CommunityEmptyState
                fill
                icon={<SearchX size={22} color="#5B6ED9" />}
                message="No se encontraron publicaciones para los filtros seleccionados."
                action={
                  <AppButton appVariant="soft" onClick={clear}>
                    Limpiar filtros
                  </AppButton>
                }
              />
            ) : posts.length === 0 ? (
              <CommunityEmptyState
                fill
                icon={<MessagesSquare size={22} color="#5B6ED9" />}
                message="Todavía no hay publicaciones en la comunidad. ¡Sé el primero en pedir ayuda o compartir un aporte!"
              />
            ) : (
              posts.map((post) => <PostCard key={post.postId} post={post} />)
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

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <FeedFiltersPanel
              filters={filters}
              counts={counts}
              activeCount={activeCount}
              onTypeChange={setType}
              onApply={applyDraft}
              onClear={clear}
            />
            <MyPostsPanel />
            <FeaturedTutorsPanel fill={posts.length === 0} />
          </Box>
        </Box>
      </Box>

      <CreatePostDialog
        open={composeType !== null}
        initialType={composeType ?? "HELP_REQUEST"}
        onClose={() => setComposeType(null)}
      />
    </Box>
  );
}
