import { SidebarRoute } from "@/types/ui";
import {
  FaTrophy,
  FaUsers,
  FaShieldAlt,
  FaUserCog,
  FaCalendarAlt,
  FaExchangeAlt,
  FaChartBar,
  FaGamepad,
  FaListOl,
  FaMagic
} from "react-icons/fa";

// =============================
// 🚀 USER SIDEBAR ROUTES
// =============================
export const SidebarUserRoutes: SidebarRoute[] = [
  {
    path: "/",
    label: "Dashboard",
    icon: <FaTrophy size={18} />,
  },
  {
    path: "/games/bingo",
    label: "Bingo",
    icon: <FaMagic size={18} />,
  },
  {
    path: "/games/top10",
    label: "Top 10",
    icon: <FaListOl size={18} />,
  },
  {
    path: "/games/fantasy",
    label: "Fantasy League",
    icon: <FaGamepad size={18} />,
  },
];

// =============================
// 🚀 ADMIN SIDEBAR ROUTES
// =============================
export const SidebarAdminRoutes: SidebarRoute[] = [
  {
    path: "/admin/competitions",
    label: "Competitions",
    icon: <FaTrophy size={18} />,
  },
  {
    path: "/admin/teams",
    label: "Teams",
    icon: <FaShieldAlt size={18} />,
  },
  {
    path: "/admin/players",
    label: "Players",
    icon: <FaUsers size={18} />,
  },
  {
    path: "/admin/managers",
    label: "Managers",
    icon: <FaUserCog size={18} />,
  },
  {
    path: "/admin/seasons",
    label: "Seasons",
    icon: <FaCalendarAlt size={18} />,
  },
  {
    path: "/admin/transfers",
    label: "Transfers",
    icon: <FaExchangeAlt size={18} />,
  },
  {
    path: "/admin/statistics",
    label: "Statistics",
    icon: <FaChartBar size={18} />,
  },
];
