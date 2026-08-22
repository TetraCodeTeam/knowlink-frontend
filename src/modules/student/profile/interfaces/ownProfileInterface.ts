
export type TutorRoleStatus = "ACTIVE" | "NEVER_REGISTERED" | "INACTIVE";
/**
 * HIPÓTESIS DE FORMA — no confirmada contra el backend.
 * Antes de conectar este componente a la API real, verificar cada campo
 * (nombres, opcionalidad, tipos) contra el DTO de Java o la respuesta
 * real en Network. En particular:
 * - ¿profilePictureUrl es null, undefined, o el campo directamente no
 *   viene en la respuesta cuando no hay foto cargada?
 * - ¿tutorRoleStatus es un campo propio o se infiere de otro lado
 *   (ej. presencia/ausencia de un objeto "tutorProfile" anidado)?
 */
export interface OwnProfileResponse {
  fullName: string;
  email: string;
  phoneNumber: string;
  university: string;
  major: string;
  profilePictureUrl?: string | null;
  tutorRoleStatus: TutorRoleStatus;
}