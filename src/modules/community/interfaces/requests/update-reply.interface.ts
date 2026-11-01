export interface UpdateReplyRequest {
  content: string;
  /** Quita el adjunto actual. Si se envía un archivo nuevo, este lo reemplaza. */
  removeAttachment?: boolean;
}
