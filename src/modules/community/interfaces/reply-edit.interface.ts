/** Cambios que el autor hace al editar una respuesta: texto y qué pasa con el adjunto. */
export interface ReplyEdit {
  content: string;
  /** Archivo nuevo: reemplaza al adjunto actual (o lo agrega si no había). */
  file: File | null;
  /** Quitar el adjunto actual sin reemplazarlo. */
  removeAttachment: boolean;
}
