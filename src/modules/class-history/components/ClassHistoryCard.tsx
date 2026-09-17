import { useState } from "react";
import { Avatar, Box, Divider, IconButton, Typography } from "@mui/material";
import { Clock, DollarSign, ChevronDown, ChevronUp, Laptop2, MapPin } from "lucide-react";
import ModalityChip from "@/modules/tutor/profile/components/ModalityChip";
import { useBookingDetail } from "@/modules/class-history/hooks/useBookingDetail";
import { buildModalityMessage, formatDurationLabel, formatPriceLabel, formatTime, } from "@/modules/class-history/utils/classHistory.utils";
import { cardContainerSx, timeColumnSx, timeTickSx } from "@/modules/class-history/styles/classHistoryStyles";
import type { BookingHistoryItem } from "@/modules/class-history/interfaces/responses/booking-history-item.interface";
import type { BookingRole } from "@/modules/class-history/types/booking-role.type";
import type { BookingHistoryCategory } from "@/modules/class-history/types/booking-history-category.type";
import VirtualLinkBox from "./VirtualLinkBox";

interface ClassHistoryCardProps {
  item: BookingHistoryItem;
  role: BookingRole;
  category: BookingHistoryCategory;
}

export default function ClassHistoryCard({ item, role, category }: ClassHistoryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { detail, isLoading } = useBookingDetail(item.bookingId, expanded);

  return (
    <Box sx={cardContainerSx}>
      <Box sx={{ display: "flex", alignItems: "flex-start" }}>
        <Box sx={timeColumnSx}>
          <Typography sx={{ fontSize: "0.95rem", fontWeight: 500, color: "#333" }}>
            {formatTime(item.startTime)}
          </Typography>
          <Box sx={timeTickSx} />
          <Typography sx={{ fontSize: "0.95rem", fontWeight: 500, color: "#333" }}>
            {formatTime(item.endTime)}
          </Typography>
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Typography sx={{ fontSize: "1.4rem", fontWeight: 700, color: "#1a1a2e" }}>
              {item.subjectName}
            </Typography>
            <IconButton
              size="small"
              onClick={() => setExpanded((e) => !e)}
              aria-label={expanded ? "Contraer detalle" : "Expandir detalle"}
            >
              {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: "12px", mt: "10px" }}>
            <Avatar
              src={item.otherPartyProfilePictureUrl ?? undefined}
              sx={{ width: 40, height: 40, fontSize: "1.1rem" }}
            >
              {item.otherPartyFullName[0]?.toUpperCase()}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 400, color: "#333" }}>
              {item.otherPartyFullName}
            </Typography>
            <Box sx={{ ml: "10px" }}>
              <ModalityChip modality={item.modality} size="sm" />
            </Box>
          </Box>
        </Box>
      </Box>

      {expanded && (
        <>
          <Divider sx={{ my: "16px" }} />
          {isLoading || !detail ? (
            <Typography sx={{ fontSize: "0.95rem", color: "#888" }}>Cargando detalle...</Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Clock size={18} color="#666" />
                <Typography sx={{ fontSize: "0.95rem", color: "#333" }}>
                  {formatDurationLabel(detail.startTime, detail.endTime)} (
                  {formatTime(detail.startTime)} a {formatTime(detail.endTime)})
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <DollarSign size={18} color="#666" />
                <Typography sx={{ fontSize: "0.95rem", color: "#333" }}>
                  {formatPriceLabel(detail.amount)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <Box sx={{ flexShrink: 0, mt: "2px" }}>
                  {detail.modality === "VIRTUAL" ? (
                    <Laptop2 size={18} color="#666" />
                  ) : (
                    <MapPin size={18} color="#666" />
                  )}
                </Box>
                <Typography
                  sx={{ fontSize: "0.95rem", color: "#333", flex: 1, minWidth: 0, wordBreak: "break-all" }}
                >
                  {buildModalityMessage(detail)}
                </Typography>
              </Box>

              {role === "TUTOR" && detail.modality === "VIRTUAL" && (
                <VirtualLinkBox
                  bookingId={detail.bookingId}
                  virtualSessionLink={detail.virtualSessionLink}
                  sessionDate={detail.sessionDate}
                  startTime={detail.startTime}
                  editable={category === "RESERVED"}
                />
              )}
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
