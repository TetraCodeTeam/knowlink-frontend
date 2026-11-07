import {
  BarChart3,
  BookOpenCheck,
  CalendarClock,
  House,
  MessageCircleQuestion,
  SquarePen,
  Trophy,
} from "lucide-react";
import type { NavigationConfig } from "@/modules/app-shell/interfaces/navigation.interface";
import { getCommunityPaths } from "@/modules/community/utils/community-paths";
import { tutorPaths } from "@/routes/paths";

const community = getCommunityPaths("TUTOR");
const COMMUNITY_THREAD_PREFIX = "/tutor/community/posts/";

export const TUTOR_NAVIGATION: NavigationConfig = {
  ariaLabel: "Navegación del tutor",
  homePath: community.home,
  theme: {
    topbarBg: "#4C5CB5",
    topbarBorder: "rgba(255, 255, 255, 0.14)",
    sidebarBg: "#4C5CB5",
    sidebarBorder: "rgba(255, 255, 255, 0.14)",
    contentBg: "#E6E4F2",
    brandText: "#FFFFFF",
    logoBg: "#FFFFFF",
    itemText: "#FFFFFF",
    groupTitle: "rgba(255, 255, 255, 0.62)",
    itemHoverBg: "rgba(255, 255, 255, 0.1)",
    itemActiveBg: "rgba(199, 200, 255, 0.34)",
    itemActiveText: "#FFFFFF",
    divider: "rgba(255, 255, 255, 0.24)",
    actionColor: "#FFFFFF",
    actionHoverBg: "rgba(255, 255, 255, 0.14)",
    avatarBg: "rgba(255, 255, 255, 0.22)",
    avatarText: "#FFFFFF",
  },
  groups: [
    {
      items: [
        {
          label: "Inicio",
          path: community.home,
          icon: House,
          isActive: (pathname) =>
            pathname === community.home || pathname.startsWith(COMMUNITY_THREAD_PREFIX),
        },
      ],
    },
    {
      title: "Tutoría",
      items: [
        { label: "Mi agenda", path: "/tutor/availability", icon: CalendarClock },
        { label: "Mis clases", path: tutorPaths.classes, icon: BookOpenCheck },
        { label: "Estadísticas", path: "/tutor/stats", icon: BarChart3 },
      ],
    },
    {
      title: "Comunidad",
      items: [
        { label: "Mis publicaciones", path: community.myPosts, icon: SquarePen },
        { label: "Podio de tutores", path: community.podium, icon: Trophy },
      ],
    },
  ],
  footerGroup: {
    title: "Ayuda",
    items: [
      {
        label: "Soporte y solicitudes",
        path: "/tutor/requests",
        icon: MessageCircleQuestion,
        badge: "requests",
      },
    ],
  },
};
