import { Box, Divider, Typography } from "@mui/material";
import { dateHeaderSx, dateBadgeSx } from "@/modules/class-history/styles/classHistoryStyles";
import { formatClassCountBadge, formatDateHeader } from "@/modules/class-history/utils/classHistory.utils";
import ClassHistoryCard from "@/modules/class-history/components/ClassHistoryCard";
import type { DateGroup } from "@/modules/class-history/utils/classHistory.utils";
import type { BookingRole } from "@/modules/class-history/types/booking-role.type";
import type { BookingHistoryCategory } from "@/modules/class-history/types/booking-history-category.type";

interface ClassDateGroupProps {
  group: DateGroup;
  role: BookingRole;
  category: BookingHistoryCategory;
}

export default function ClassDateGroup({ group, role, category }: ClassDateGroupProps) {
  return (
    <Box sx={{ mb: "28px" }}>
      <Box sx={dateHeaderSx}>
        <Typography sx={{ fontSize: "1.1rem", fontWeight: 600, color: "#1a1a2e", whiteSpace: "nowrap" }}>
          {formatDateHeader(group.sessionDate)}
        </Typography>
        <Divider sx={{ flex: 1 }} />
        <Typography variant="subtitle1" sx={dateBadgeSx}>
          {formatClassCountBadge(group.items.length)}
        </Typography>
      </Box>

      {group.items.map((item) => (
        <ClassHistoryCard key={item.bookingId} item={item} role={role} category={category} />
      ))}
    </Box>
  );
}