import type { LucideIcon } from "lucide-react";
import { SUPPORT_COLORS } from "@/modules/support/constants/support-colors.constants";
import {
  BadgeX,
  CircleCheck,
  FileType,
  Flag,
  Info,
  ListChecks,
  ShieldCheck,
  Siren,
} from "lucide-react";

export interface FileRuleItem {
  id: string;
  icon: LucideIcon;
  iconColor: string;
  title: string;
  text: string;
}

export interface FileRuleSection {
  id: string;
  icon: LucideIcon;
  title: string;
  body?: string;
  highlighted?: boolean;
  showFormats?: boolean;
  items?: FileRuleItem[];
}

export const FILE_RULES_SECTIONS: FileRuleSection[] = [
  {
    id: "allowed-content",
    icon: ShieldCheck,
    title: "1. Contenido permitido",
    highlighted: true,
    body:
      "El material académico cargado en KnowLink debe ser de autoría propia del tutor o contar " +
      "con los derechos necesarios para su distribución. No está permitido subir material " +
      "protegido por derechos de autor de terceros, contenido plagiado, ni archivos que no " +
      "guarden relación directa con la materia a la que se asocian.",
  },
  {
    id: "accepted-formats",
    icon: FileType,
    title: "2. Formatos aceptados",
    body: "Solo se permite la carga de archivos en formato PNG, PDF, XLSX, JPG o JPEG.",
    showFormats: true,
  },
  {
    id: "report-reasons",
    icon: Flag,
    title: "3. Motivos de denuncia",
    body:
      "Un alumno con acceso al material puede denunciarlo por: contenido inapropiado, plagio, " +
      "información falsa, u otro motivo detallado en la descripción del reporte.",
  },
  {
    id: "review-process",
    icon: Siren,
    title: "4. Proceso de revisión",
    body:
      "Toda denuncia es evaluada por el equipo administrativo según criterios de propiedad " +
      "intelectual y pertinencia académica del contenido con la materia asociada. Un mismo " +
      "archivo puede recibir múltiples denuncias, que se consolidan en una sola revisión.",
  },
  {
    id: "review-result",
    icon: ListChecks,
    title: "5. Resultado de la revisión",
    items: [
      {
        id: "infraction-confirmed",
        icon: BadgeX,
        iconColor: SUPPORT_COLORS.red,
        title: "Confirmación de infracción",
        text:
          "Si se confirma el incumplimiento, el material se da de baja de forma inmediata y " +
          "deja de estar disponible para todos los alumnos. El tutor que lo cargó recibe una " +
          "notificación indicando que fue retirado por incumplimiento de esta normativa.",
      },
      {
        id: "dismissed",
        icon: CircleCheck,
        iconColor: SUPPORT_COLORS.indigo,
        title: "Desestimación",
        text:
          "Si la denuncia no es procedente, el material permanece disponible y la denuncia " +
          "se archiva.",
      },
      {
        id: "reporter-notification",
        icon: Info,
        iconColor: SUPPORT_COLORS.slate,
        title: "Notificación a denunciantes",
        text:
          "En ambos casos, el usuario que realizó la denuncia recibe una notificación con el " +
          "resultado de su reporte.",
      },
    ],
  },
];
