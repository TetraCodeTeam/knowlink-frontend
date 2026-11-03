import { useState } from "react";
import { Avatar, Box, Chip, Divider, IconButton, Typography } from "@mui/material";
import { Clock, DollarSign, ChevronDown, ChevronUp, Laptop2, MapPin } from "lucide-react";
import ModalityChip from "@/modules/tutor/profile/components/ModalityChip";
import { useBookingDetail } from "@/modules/class-history/hooks/useBookingDetail";
import {
  buildModalityMessage,
  formatDurationLabel,
  formatPriceLabel,
  formatTime,
} from "@/modules/class-history/utils/classHistory.utils";
import {
  cardContainerSx,
  timeColumnSx,
  timeTickSx,
} from "@/modules/class-history/styles/classHistoryStyles";
import type { BookingHistoryItem } from "@/modules/class-history/interfaces/responses/booking-history-item.interface";
import type { BookingRole } from "@/modules/class-history/types/booking-role.type";
import type { BookingHistoryCategory } from "@/modules/class-history/types/booking-history-category.type";
import VirtualLinkBox from "./VirtualLinkBox";
import CancelBookingFlow from "./CancelBookingFlow";
import StartClaimFlow from "@/modules/claim/components/StartClaimFlow";
import RateBookingFlow from "./RateBookingFlow";

interface ClassHistoryCardProps {
  item: BookingHistoryItem;
  role: BookingRole;
  category: BookingHistoryCategory;
}

export default function ClassHistoryCard({ item, role, category }: ClassHistoryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { detail, isLoading, isError } = useBookingDetail(item.bookingId, expanded);
  const showVirtualLinkBox = role === "TUTOR" && detail?.modality === "VIRTUAL";

  return (
    <Box sx={cardContainerSx}>
      <Box sx={{ display: "flex", alignItems: "flex-start" }}>
        <Box sx={timeColumnSx}>
          <Typography sx={{ fontSize: "0.85rem", fontWeight: 500, color: "#333" }}>
            {formatTime(item.startTime)}
          </Typography>
          <Box sx={timeTickSx} />
          <Typography sx={{ fontSize: "0.85rem", fontWeight: 500, color: "#333" }}>
            {formatTime(item.endTime)}
          </Typography>
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Typography sx={{ fontSize: "1.1rem", fontWeight: 700, color: "#1a1a2e" }}>
              {item.subjectName}
            </Typography>
            <IconButton
              size="small"
              onClick={() => setExpanded((e) => !e)}
              aria-label={expanded ? "Contraer detalle" : "Expandir detalle"}
            >
              {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </IconButton>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "8px 10px",
              mt: "6px",
            }}
          >
            <Avatar
              src={item.otherPartyProfilePictureUrl ?? undefined}
              sx={{ width: 32, height: 32, fontSize: "0.95rem" }}
            >
              {item.otherPartyFullName[0]?.toUpperCase()}
            </Avatar>
            <Typography sx={{ fontSize: "0.95rem", fontWeight: 400, color: "#333" }}>
              {item.otherPartyFullName}
            </Typography>
            <Box sx={{ ml: { sm: "6px" } }}>
              <ModalityChip modality={item.modality} size="sm" />
            </Box>
            {item.status === "NOT_CONFIRMED" && (
              <Chip
                size="small"
                label="No confirmada"
                sx={{
                  ml: "4px",
                  fontWeight: 600,
                  color: "#8A5300",
                  backgroundColor: "#FFF4E5",
                }}
              />
            )}
          </Box>
        </Box>
      </Box>

      {expanded && (
        <>
          <Divider sx={{ my: "10px" }} />
          {isLoading ? (
            <Typography sx={{ fontSize: "0.85rem", color: "#888" }}>Cargando detalle...</Typography>
          ) : isError || !detail ? (
            <Typography sx={{ fontSize: "0.85rem", color: "#c0392b" }}>
              No se pudo cargar el detalle. Intentá de nuevo.
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: { xs: "wrap", sm: "nowrap" },
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  gap: "12px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Clock size={16} color="#666" />
                    <Typography sx={{ fontSize: "0.85rem", color: "#333" }}>
                      {formatDurationLabel(detail.startTime, detail.endTime)} (
                      {formatTime(detail.startTime)} a {formatTime(detail.endTime)})
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <DollarSign size={16} color="#666" />
                    <Typography sx={{ fontSize: "0.85rem", color: "#333" }}>
                      {formatPriceLabel(detail.amount)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <Box sx={{ flexShrink: 0, mt: "2px" }}>
                      {detail.modality === "VIRTUAL" ? (
                        <Laptop2 size={16} color="#666" />
                      ) : (
                        <MapPin size={16} color="#666" />
                      )}
                    </Box>
                    <Typography
                      sx={{
                        fontSize: "0.85rem",
                        color: "#333",
                        flex: 1,
                        minWidth: 0,
                        wordBreak: "break-all",
                      }}
                    >
                      {buildModalityMessage(detail)}
                    </Typography>
                  </Box>
                </Box>

                {category === "RESERVED" && !showVirtualLinkBox && (
                  <CancelBookingFlow detail={detail} role={role} />
                )}
                {category === "COMPLETED" && !showVirtualLinkBox && (
                  <RateBookingFlow detail={detail} role={role} />
                )}
              </Box>

              {showVirtualLinkBox && (
                <VirtualLinkBox
                  bookingId={detail.bookingId}
                  virtualSessionLink={detail.virtualSessionLink}
                  sessionDate={detail.sessionDate}
                  startTime={detail.startTime}
                  editable={category === "RESERVED"}
                />
              )}

              {detail.status !== "CANCELLED" && (
                <StartClaimFlow
                  bookingId={detail.bookingId}
                  claimantRole={role}
                  sessionSummary={`${detail.subjectName} con ${detail.otherPartyFullName} · ${detail.sessionDate}`}
                />
              )}

              {category === "RESERVED" && showVirtualLinkBox && (
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: "6px" }}>
                  <CancelBookingFlow detail={detail} role={role} />
                </Box>
              )}
              {category === "COMPLETED" && showVirtualLinkBox && (
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: "6px" }}>
                  <RateBookingFlow detail={detail} role={role} />
                </Box>
              )}
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
