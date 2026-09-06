import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: "notifications" | "complaints" | "requests";
}
