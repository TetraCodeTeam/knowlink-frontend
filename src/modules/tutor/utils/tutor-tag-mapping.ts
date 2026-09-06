import type { Modality } from "@/modules/tutor/interfaces/tutor.interface";
import { LibraryBig, Monitor, ShieldCheck, type LucideIcon } from "lucide-react";

type TutorTag = {
  bg: string;
  color: string;
  fontSize?: string;
  icon?: LucideIcon;
};

export const TUTOR_SUBJECT_TAG: TutorTag = {
  bg: "#E0E0FA",
  color: "#494949",
  fontSize: "18px",
};

export const TUTOR_STATUS_DISPLAY_NAME = {
  VERIFIED: "Tutor Verificado",
} as const;

export type TutorStatusDisplay = (typeof TUTOR_STATUS_DISPLAY_NAME)[keyof typeof TUTOR_STATUS_DISPLAY_NAME];

export const TUTOR_STATUS: Record<TutorStatusDisplay, TutorTag> = {
  "Tutor Verificado": {
    bg: "#C7C8FF",
    color: "#3147C2",
    fontSize: "15px",
    icon: ShieldCheck,
  },
};

export const MODALITY_DISPLAY_NAME = {
  Presencial: "Presencial",
  Virtual: "Virtual",
} as const satisfies Record<Modality, string>;

export type ModalityDisplay =
  (typeof MODALITY_DISPLAY_NAME)[keyof typeof MODALITY_DISPLAY_NAME];

export const MODALITY: Record<ModalityDisplay, TutorTag> = {
  Presencial: {
    bg: "#E0E0FA",
    color: "#3A48AD",
    fontSize: "15px",
    icon: LibraryBig,
  },
  Virtual: {
    bg: "#E0E0FA",
    color: "#3A48AD",
    fontSize: "15px",
    icon: Monitor,
  },
};

export const PRICE_TAG: Record<"FREE" | "PAID", TutorTag> = {
  FREE: {
    bg: "#E5F8EA",
    color: "#1F7A3E",
    fontSize: "20px",
  },
  PAID: {
    bg: "#E0E0FA",
    color: "#3A48AD",
    fontSize: "20px",
  },
};

export const getSubjectDisplayName = (subject: string) => subject;
