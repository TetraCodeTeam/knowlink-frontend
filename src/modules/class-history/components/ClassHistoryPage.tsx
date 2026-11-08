import { useSearchParams } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import CategoryTabs from "@/modules/class-history/components/CategoryTabs";
import ClassDateGroup from "@/modules/class-history/components/ClassDateGroup";
import ClassHistoryEmptyState from "@/modules/class-history/components/ClassHistoryEmptyState";
import { useBookingHistory } from "@/modules/class-history/hooks/useBookingHistory";
import {
  groupByDate,
  parseHistoryCategory,
} from "@/modules/class-history/utils/classHistory.utils";
import AppButton from "@/shared/components/AppButton";
import { getPageMinHeight } from "@/shared/utils/page-height.utils";
import type { BookingHistoryCategory } from "@/modules/class-history/types/booking-history-category.type";
import type { BookingRole } from "@/modules/class-history/types/booking-role.type";

interface ClassHistoryPageProps {
  role: BookingRole;
}

export default function ClassHistoryPage({ role }: ClassHistoryPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = parseHistoryCategory(searchParams.get("category")) ?? "RESERVED";
  const { items, hasNext, goToNextPage, isLoading, isFetchingNextPage, isError } =
    useBookingHistory(role, category);

  const handleCategoryChange = (next: BookingHistoryCategory) =>
    setSearchParams({ category: next }, { replace: true });

  const dateGroups = groupByDate(items);
  const hasItems = items.length > 0;

  return (
    <Box
      sx={{
        p: { xs: "12px", md: "16px 32px" },
        display: "flex",
        flexDirection: "column",
        minHeight: getPageMinHeight(),
        boxSizing: "border-box",
      }}
    >
      <CategoryTabs activeCategory={category} onChange={handleCategoryChange} />

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: "48px" }}>
          <CircularProgress sx={{ color: "#4C5CB5" }} />
        </Box>
      ) : isError && !hasItems ? (
        <Box textAlign="center" py="48px">
          <Typography color="error">No se pudo cargar el historial de clases.</Typography>
        </Box>
      ) : !hasItems ? (
        <ClassHistoryEmptyState />
      ) : (
        <>
          {dateGroups.map((group) => (
            <ClassDateGroup key={group.sessionDate} group={group} role={role} category={category} />
          ))}

          {isError ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                mt: "12px",
              }}
            >
              <Typography color="error" sx={{ fontSize: "0.9rem" }}>
                No se pudieron cargar más clases.
              </Typography>
              <AppButton
                appVariant="outline"
                onClick={() => void goToNextPage()}
                loading={isFetchingNextPage}
              >
                Reintentar
              </AppButton>
            </Box>
          ) : (
            hasNext && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: "12px" }}>
                <AppButton
                  appVariant="outline"
                  onClick={() => void goToNextPage()}
                  loading={isFetchingNextPage}
                >
                  Cargar más
                </AppButton>
              </Box>
            )
          )}
        </>
      )}
    </Box>
  );
}
