import { useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import CategoryTabs from "@/modules/class-history/components/CategoryTabs";
import ClassDateGroup from "@/modules/class-history/components/ClassDateGroup";
import ClassHistoryEmptyState from "@/modules/class-history/components/ClassHistoryEmptyState";
import { useBookingHistory } from "@/modules/class-history/hooks/useBookingHistory";
import { groupByDate } from "@/modules/class-history/utils/classHistory.utils";
import AppButton from "@/shared/components/AppButton";
import type { BookingHistoryCategory } from "@/modules/class-history/types/booking-history-category.type";
import type { BookingRole } from "@/modules/class-history/types/booking-role.type";

interface ClassHistoryPageProps {
  role: BookingRole;
}

export default function ClassHistoryPage({ role }: ClassHistoryPageProps) {
  const [category, setCategory] = useState<BookingHistoryCategory>("RESERVED");
  const { items, hasNext, goToNextPage, resetPage, isLoading, isFetching, isError } = useBookingHistory(
    role,
    category
  );

  const handleCategoryChange = (next: BookingHistoryCategory) => {
    setCategory(next);
    resetPage();
  };

  const dateGroups = groupByDate(items);

  return (
    <Box
      sx={{
        p: "28px 32px",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      <CategoryTabs activeCategory={category} onChange={handleCategoryChange} />

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: "48px" }}>
          <CircularProgress sx={{ color: "#4C5CB5" }} />
        </Box>
      ) : isError ? (
        <Box textAlign="center" py="48px">
          <Typography color="error">No se pudo cargar el historial de clases.</Typography>
        </Box>
      ) : items.length === 0 ? (
        <ClassHistoryEmptyState />
      ) : (
        <>
          {dateGroups.map((group) => (
            <ClassDateGroup key={group.sessionDate} group={group} role={role} category={category} />
          ))}

          {hasNext && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: "12px" }}>
              <AppButton appVariant="outline" onClick={goToNextPage} loading={isFetching}>
                Cargar más
              </AppButton>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}