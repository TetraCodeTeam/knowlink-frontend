import { Box, Skeleton } from "@mui/material";
import {
  cardsGridSx,
  skeletonStackSx,
  srOnlySx,
} from "@/modules/admin/home/styles/admin-home.styles";

export default function DashboardSkeleton() {
  return (
    <Box role="status" aria-live="polite">
      <Box sx={srOnlySx}>Cargando resumen de moderación</Box>

      <Box aria-hidden sx={skeletonStackSx}>
        <Box sx={cardsGridSx}>
          <Skeleton variant="rounded" height={340} />
          <Skeleton variant="rounded" height={340} />
        </Box>
        <Skeleton variant="rounded" height={280} />
      </Box>
    </Box>
  );
}
