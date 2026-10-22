import { useState } from "react";
import { Avatar, Box, Button, Divider, IconButton, Typography } from "@mui/material";
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
import CreateClaimDialog from "./CreateClaimDialog";
import { useClaimEligibility } from "@/modules/class-history/hooks/useClaimEligibility";

interface ClassHistoryCardProps {
  item: BookingHistoryItem;
  role: BookingRole;
  category: BookingHistoryCategory;
}

export default function ClassHistoryCard({ item, role, category }: ClassHistoryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isClaimDialogOpen, setIsClaimDialogOpen] = useState(false);
  const { detail, isLoading, isError } = useBookingDetail(item.bookingId, expanded);
  const {
    eligibility,
    isLoading: isEligibilityLoading,
    isError: isEligibilityError,
    refetch: refetchEligibility,
  } = useClaimEligibility(item.bookingId, expanded && category === "COMPLETED");
  const showVirtualLinkBox = role === "TUTOR" && detail?.modality === "VIRTUAL";

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
          {isLoading ? (
            <Typography sx={{ fontSize: "0.95rem", color: "#888" }}>Cargando detalle...</Typography>
          ) : isError || !detail ? (
            <Typography sx={{ fontSize: "0.95rem", color: "#c0392b" }}>
              No se pudo cargar el detalle. Intentá de nuevo.
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  gap: "16px",
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
                      sx={{
                        fontSize: "0.95rem",
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

              {category === "RESERVED" && showVirtualLinkBox && (
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: "6px" }}>
                  <CancelBookingFlow detail={detail} role={role} />
                </Box>
              )}

              {category === "COMPLETED" && (
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 1 }}
                >
                  {isEligibilityLoading ? (
                    <Typography sx={{ fontSize: "0.9rem", color: "#888" }}>
                      Verificando disponibilidad de reclamo...
                    </Typography>
                  ) : isEligibilityError ? (
                    <>
                      <Typography sx={{ fontSize: "0.9rem", color: "#c0392b" }}>
                        No se pudo verificar si podés reclamar.
                      </Typography>
                      <Button size="small" onClick={() => void refetchEligibility()}>
                        Reintentar
                      </Button>
                    </>
                  ) : eligibility?.canClaim ? (
                    <Button variant="outlined" onClick={() => setIsClaimDialogOpen(true)}>
                      Iniciar reclamo
                    </Button>
                  ) : (
                    <Typography sx={{ fontSize: "0.9rem", color: "#888" }}>
                      Esta sesión no admite un nuevo reclamo.
                    </Typography>
                  )}
                  {eligibility && (
                    <CreateClaimDialog
                      open={isClaimDialogOpen}
                      bookingId={item.bookingId}
                      eligibility={eligibility}
                      onClose={() => setIsClaimDialogOpen(false)}
                    />
                  )}
                </Box>
              )}
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
