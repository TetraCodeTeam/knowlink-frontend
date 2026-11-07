/** Reglas del backend para la foto de perfil: JPG, PNG o WebP de hasta 5 MB. */
export const PROFILE_PICTURE_MAX_MB = 5;
export const PROFILE_PICTURE_ACCEPT = "image/jpeg,image/png,image/webp";

const ALLOWED_TYPES = PROFILE_PICTURE_ACCEPT.split(",");

/** Devuelve el mensaje de error para el usuario, o null si el archivo es válido. */
export function validateProfilePicture(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "La foto debe ser una imagen JPG, PNG o WebP.";
  }
  if (file.size > PROFILE_PICTURE_MAX_MB * 1024 * 1024) {
    return `La foto no puede superar los ${PROFILE_PICTURE_MAX_MB} MB.`;
  }
  return null;
}
