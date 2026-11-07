import { useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import AppButton from "@/shared/components/AppButton";
import FrankieErrorState from "@/shared/frankie/FrankieErrorState";
import CommunityEmptyState from "@/modules/community/components/CommunityEmptyState";
import CommunityHeader from "@/modules/community/components/CommunityHeader";
import CreatePostDialog from "@/modules/community/components/CreatePostDialog";
import FeaturedTutorsPanel from "@/modules/community/components/FeaturedTutorsPanel";
import FrankieDailyMessage from "@/modules/community/components/FrankieDailyMessage";
import FeedFiltersPanel from "@/modules/community/components/FeedFiltersPanel";
import MyPostsPanel from "@/modules/community/components/MyPostsPanel";
import PostCard from "@/modules/community/components/PostCard";
import PostComposerCard from "@/modules/community/components/PostComposerCard";
import { useCommunityFeed } from "@/modules/community/hooks/useCommunityFeed";
import { useFeedCounts } from "@/modules/community/hooks/useFeedCounts";
import { useFeedFilters } from "@/modules/community/hooks/useFeedFilters";
import {
  cardSx,
  pageContentSx,
  pageSx,
  twoColumnSx,
} from "@/modules/community/styles/community.styles";
import type { PostType } from "@/modules/community/types/post-type.type";
import { getPageMinHeight } from "@/shared/utils/page-height.utils";

export default function CommunityFeedPage() {
  const { filters, activeCount, setType, applyDraft, clear } = useFeedFilters();
  const { posts, isLoading, isError, hasNextPage, isFetchingNextPage, fetchNextPage, refetch } =
    useCommunityFeed(filters);
  const { counts } = useFeedCounts(filters);
  const [composeType, setComposeType] = useState<PostType | null>(null);

  return (
    <Box sx={{ ...pageSx, minHeight: getPageMinHeight() }}>
      <Box sx={pageContentSx}>
        <CommunityHeader />

        <Box sx={twoColumnSx}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, minWidth: 0 }}>
            <PostComposerCard onCompose={setComposeType} />
            <FrankieDailyMessage />

            {isLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress aria-label="Cargando publicaciones" />
              </Box>
            ) : isError ? (
              <Box sx={cardSx}>
                <FrankieErrorState
                  message="No pudimos cargar las publicaciones de la comunidad."
                  onRetry={() => void refetch()}
                />
              </Box>
            ) : posts.length === 0 && activeCount > 0 ? (
              <CommunityEmptyState
                fill
                mood="thinking"
                accessories={["magnifier"]}
                title="No encontramos publicaciones"
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
                mood="happy"
                accessories={["sparkles"]}
                title="Acá todavía no pasó nada"
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

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, minWidth: 0 }}>
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
