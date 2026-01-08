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
  FaMagic,
  FaFlag,
  FaGlobeAfrica,
  FaThList,
  FaRegChartBar,
  FaHome
} from "react-icons/fa";
import { BiStats, BiWorld } from "react-icons/bi";
import { SiSecurityscorecard } from "react-icons/si";
import { IoBarChart, IoGameController } from "react-icons/io5";
import { VscTypeHierarchy } from "react-icons/vsc";
import { VscActivateBreakpoints } from "react-icons/vsc";

// =============================
// 🚀 USER SIDEBAR ROUTES
// =============================
export const SidebarUserRoutes: SidebarRoute[] = [
  {
    path: "/dashboard",
    label: "Home",
    icon: <FaTrophy size={18} />,
  },
  {
    path: "/games/bingo",
    label: "Bingo",
    icon: <FaMagic size={18} />,
  },
  {
    path: "/games/top-list",
    label: "Top List",
    icon: <FaListOl size={18} />,
  },
   {
    path: "/games/guess-the-player",
    label: "Guess The Player",
    icon: <VscActivateBreakpoints size={18} />,
  },
  {
    path: "/multi",
    label: "Multi",
    icon: <VscActivateBreakpoints size={18} />,
  },
  // {
  //   path: "/games/fantasy",
  //   label: "Fantasy League",
  //   icon: <FaGamepad size={18} />,
  // },
];

// =============================
// 🚀 ADMIN SIDEBAR ROUTES
// =============================
export const SidebarAdminRoutes: SidebarRoute[] = [
  {
    path: "/dashboard",
    label: "Home",
    icon: <FaHome size={18} />,
  },
  {
    path: "#",
    label: "Games",
    icon: <IoGameController size={18} />,
    subItems: [
      {
        path: "/admin/games/types",
        label: "Game Types",
        icon: <VscTypeHierarchy size={18} />,
      },
      {
        path: "/admin/games/list",
        label: "Games List",
        icon: <FaThList size={18} />,
      }
    ]
  },
  {
    path: "#",
    label: "Core",
    icon: <SiSecurityscorecard size={18} />,
    subItems: [
      {
        path: "/admin/seasons",
        label: "Seasons",
        icon: <FaCalendarAlt size={18} />,
      },
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
        path: "/admin/transfers",
        label: "Transfers",
        icon: <FaExchangeAlt size={18} />,
      },
    ]
  },
  {
    path: "#",
    label: "Areas",
    icon: <BiWorld size={18} />,
    subItems: [
      {
        path: "/admin/continents",
        label: "Continents",
        icon: <FaGlobeAfrica size={18} />,
      },
      {
        path: "/admin/countries",
        label: "Countries",
        icon: <FaFlag size={18} />,
      }
    ]
  },
  {
    path: "#",
    label: "Statistics",
    icon: <FaChartBar size={18} />,
    subItems: [
      {
        path: "/admin/statistics/teams-stats",
        label: "Teams Stats",
        icon: <IoBarChart size={18} />,
      },
      {
        path: "/admin/statistics/players-stats",
        label: "Players Stats",
        icon: <FaRegChartBar size={18} />,
      }
    ]
  },
];
