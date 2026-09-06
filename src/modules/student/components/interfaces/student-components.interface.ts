import type { ReactNode } from "react";
import type { SubjectSummary, TutorSearchResult } from "../../interfaces/tutor-search-result.interface";

export interface SubjectResultCardProps {
  subject: SubjectSummary;
  onClick: () => void;
  highlighted?: boolean;
}

export interface TutorResultCardProps {
  tutor: TutorSearchResult;
  onClick: () => void;
}

export interface SearchModeToggleProps {
  value: "subjects" | "tutors";
  onChange: (mode: "subjects" | "tutors") => void;
}

export interface SearchResultsPanelProps {
  query: string;
  subjects: SubjectSummary[];
  tutors: TutorSearchResult[];
  loading: boolean;
  onSelectSubject: (name: string) => void;
  onSelectTutor: (tutorId: string) => void;
}

export interface SectionHeaderProps {
  icon: ReactNode;
  label: string;
}

export interface SubjectRowProps {
  subject: SubjectSummary;
  query: string;
  onClick: () => void;
}

export interface TutorRowProps {
  tutor: TutorSearchResult;
  query: string;
  onClick: () => void;
}
