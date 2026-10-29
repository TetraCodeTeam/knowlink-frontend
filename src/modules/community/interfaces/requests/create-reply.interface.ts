export interface CreateReplyRequest {
  content: string;
  /** Solo aplica a respuestas de un tutor; si se omite, el backend incluye la tarjeta. */
  includeBookingCard?: boolean;
  bookingCardQuestion?: string;
}
