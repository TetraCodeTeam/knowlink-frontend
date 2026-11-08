import { useState } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import RateBookingDialog from "@/modules/class-history/components/RateBookingDialog";
import RateBookingSuccessDialog from "@/modules/class-history/components/RateBookingSuccessDialog";
import { usePendingRatings } from "@/modules/class-history/hooks/usePendingRatings";
import { useRateBooking } from "@/modules/class-history/hooks/useRateBooking";
import { RATING_GATE_QUERY_KEYS } from "@/modules/class-history/constants/ratingGate.constants";
import { useResolveRatingNotification } from "@/modules/notifications/hooks/useResolveRatingNotification";
import type { PendingRatingItem } from "@/modules/class-history/interfaces/responses/pending-ratings.interface";
import type { PendingRatingsResponse } from "@/modules/class-history/interfaces/responses/pending-ratings.interface";
import type { RateBookingFormValues } from "@/modules/class-history/schemas/rateBooking.schema";

const SUBMIT_ERROR_MESSAGE =
  "No pudimos registrar tu calificación. Revisá tu conexión e intentá de nuevo.";

interface MandatoryRatingFormProps {
  item: PendingRatingItem;
  total: number;
  onRated: (item: PendingRatingItem) => void;
}

function MandatoryRatingForm({ item, total, onRated }: MandatoryRatingFormProps) {
  const { submitRating, isPending } = useRateBooking(item.bookingId);
  const { resolve } = useResolveRatingNotification();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const removeFromPendingCache = () => {
    queryClient.setQueryData<PendingRatingsResponse>(RATING_GATE_QUERY_KEYS.pending, (old) =>
      old
        ? {
            ...old,
            blocking: old.blocking.filter((entry) => entry.bookingId !== item.bookingId),
          }
        : old
    );
  };

  const handleConfirm = async ({ score, comment }: RateBookingFormValues) => {
    setErrorMessage(null);
    try {
      await submitRating({ score, comment: comment?.trim() || null });
      onRated(item);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        removeFromPendingCache();
        resolve(item.bookingId);
        void queryClient.invalidateQueries({ queryKey: RATING_GATE_QUERY_KEYS.pending });
        return;
      }
      setErrorMessage(SUBMIT_ERROR_MESSAGE);
    }
  };

  return (
    <RateBookingDialog
      open
      mandatory
      detail={item}
      role={item.raterRole}
      pendingCount={total}
      isPending={isPending}
      errorMessage={errorMessage}
      onConfirm={(values) => void handleConfirm(values)}
    />
  );
}

export default function MandatoryRatingGate() {
  const { current, total } = usePendingRatings();
  const [successFor, setSuccessFor] = useState<PendingRatingItem | null>(null);
  const { resolve } = useResolveRatingNotification();
  const queryClient = useQueryClient();

  const handleSuccessClose = () => {
    if (!successFor) return;

    const bookingId = successFor.bookingId;
    setSuccessFor(null);
    queryClient.setQueryData<PendingRatingsResponse>(RATING_GATE_QUERY_KEYS.pending, (old) =>
      old
        ? {
            ...old,
            blocking: old.blocking.filter((entry) => entry.bookingId !== bookingId),
          }
        : old
    );
    resolve(bookingId);
    void queryClient.invalidateQueries({ queryKey: ["bookingDetail", bookingId] });
    void queryClient.invalidateQueries({ queryKey: ["bookingHistory"] });
    void queryClient.invalidateQueries({ queryKey: RATING_GATE_QUERY_KEYS.pending });
  };

  if (successFor) {
    return (
      <RateBookingSuccessDialog open role={successFor.raterRole} onClose={handleSuccessClose} />
    );
  }

  if (!current) return null;

  return (
    <MandatoryRatingForm
      key={current.bookingId}
      item={current}
      total={total}
      onRated={setSuccessFor}
    />
  );
}
