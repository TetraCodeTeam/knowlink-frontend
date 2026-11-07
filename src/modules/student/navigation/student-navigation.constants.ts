import { AlertTriangle, BookOpenCheck, House, SquarePen, Trophy } from "lucide-react";
import type { NavigationConfig } from "@/modules/app-shell/interfaces/navigation.interface";
import { getCommunityPaths } from "@/modules/community/utils/community-paths";
import { studentPaths } from "@/routes/paths";

const community = getCommunityPaths("STUDENT");
const COMMUNITY_THREAD_PREFIX = "/student/community/posts/";

export const STUDENT_NAVIGATION: NavigationConfig = {
  ariaLabel: "Navegación del alumno",
  homePath: community.home,
  theme: {
    topbarBg: "#FFFFFF",
    topbarBorder: "#F0EEFE",
    sidebarBg: "#FFFFFF",
    sidebarBorder: "#F0EEFE",
    contentBg: "#F4F3FB",
    brandText: "#1A1A2E",
    itemText: "#3F4CAE",
    groupTitle: "#8A8AA3",
    itemHoverBg: "#F4F3FB",
    itemActiveBg: "#5865C8",
    itemActiveText: "#FFFFFF",
    divider: "#E8E8F0",
    actionColor: "#3F4CAE",
    actionHoverBg: "#F4F3FB",
    avatarBg: "#5865C8",
    avatarText: "#FFFFFF",
  },
  groups: [
    {
      items: [
        {
          label: "Inicio",
          path: community.home,
          icon: House,
          // Inicio es el feed de la comunidad: el hilo de una publicación lo mantiene activo.
          isActive: (pathname) =>
            pathname === community.home || pathname.startsWith(COMMUNITY_THREAD_PREFIX),
        },
      ],
    },
    {
      title: "Aprendizaje",
      items: [{ label: "Mis clases", path: studentPaths.classes, icon: BookOpenCheck }],
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
        label: "Mis reclamos",
        path: "/student/complaints",
        icon: AlertTriangle,
        badge: "complaints",
      },
    ],
  },
};
