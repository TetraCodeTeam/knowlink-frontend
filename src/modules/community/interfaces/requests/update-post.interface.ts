export interface UpdatePostRequest {
  title: string;
  content: string;
  /** Quita el adjunto actual. Si se envía un archivo nuevo, este lo reemplaza. */
  removeAttachment?: boolean;
}
