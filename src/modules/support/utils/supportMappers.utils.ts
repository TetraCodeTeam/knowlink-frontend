import { ACCEPTED_FILE_FORMATS } from "@/modules/support/constants/file-format.constants";
import type { FileFormat } from "@/modules/support/interfaces/file-format.type";
import type {
  TutorSupportData,
  TutorSupportDto,
} from "@/modules/support/interfaces/responses/tutor-support.response";

function describeClaimReason(reason: string): string {
  switch (reason) {
    case "STUDENT_COULD_NOT_ATTEND":
      return "El alumno no pudo asistir a la sesión";
    case "TUTOR_COULD_NOT_ATTEND":
      return "El tutor no pudo asistir a la sesión";
    case "I_COULD_NOT_ATTEND":
      return "No pude asistir a la sesión";
    default:
      return reason;
  }
}

function normalizeFileFormat(format: string): FileFormat {
  const normalized = format.toUpperCase();
  const match = ACCEPTED_FILE_FORMATS.find((accepted) => accepted === normalized);
  if (match) return match;
  throw new Error(`Formato de material no reconocido: ${format}`);
}

export function mapTutorSupport(data: TutorSupportDto): TutorSupportData {
  return {
    summary: data.summary,
    claims: data.sessionClaims.map((claim) => ({
      id: claim.claimId,
      subjectName: claim.subjectName,
      studentName: claim.studentName,
      sessionDate: claim.sessionDate,
      reason: describeClaimReason(claim.reason),
      status: claim.status,
      resolvedAt: claim.status === "RESOLVED" ? claim.updatedAt.slice(0, 10) : null,
      hasUnseenUpdate: false,
    })),
    materials: data.reportedMaterials.map((material) => ({
      id: material.materialId,
      fileName: material.originalFileName || material.name,
      fileFormat: normalizeFileFormat(material.format),
      subjectName: material.subjectName,
      reportCount: material.reportCount,
      status: material.status,
      hasUnseenUpdate: false,
    })),
  };
}
