import type { Modalidad } from "@/modules/tutor/interfaces/tutor.interface";

type TutorTagColor = {
  bg: string;
  color: string;
};

export const TUTOR_SUBJECT_TAG_COLOR: TutorTagColor = {
  bg: "#E0E0FA",
  color: "#494949",
};

export const TUTOR_STATUS_DISPLAY_NAME = {
  VERIFIED: "Tutor Verificado",
} as const;

export type TutorStatusDisplay = (typeof TUTOR_STATUS_DISPLAY_NAME)[keyof typeof TUTOR_STATUS_DISPLAY_NAME];

export const TUTOR_STATUS_COLORS: Record<TutorStatusDisplay, TutorTagColor> = {
  "Tutor Verificado": {
    bg: "#E5F8EA",
    color: "#1F7A3E",
  },
};

export const MODALITY_DISPLAY_NAME: Record<Modalidad, string> = {
  Presencial: "Presencial",
  Virtual: "Virtual",
};

export type ModalityDisplay = (typeof MODALITY_DISPLAY_NAME)[Modalidad];

export const MODALITY_COLORS: Record<ModalityDisplay, TutorTagColor> = {
  Presencial: {
    bg: "#FFF1DE",
    color: "#A66300",
  },
  Virtual: {
    bg: "#ECE8FF",
    color: "#5D48B8",
  },
};

export const getSubjectDisplayName = (subject: string) => subject;
