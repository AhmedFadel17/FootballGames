import { SidebarRoute } from "@/types/ui";
import {
  FaTrophy,
  FaUsers,
  FaShieldAlt,
  FaUserCog,
  FaCalendarAlt,
  FaListOl,
  FaMagic,
  FaFlag,
  FaGlobeAfrica,
  FaHome,
  FaFlask,
  FaBox
} from "react-icons/fa";
import { BiWorld } from "react-icons/bi";
import { SiSecurityscorecard } from "react-icons/si";
import { IoGameController } from "react-icons/io5";
import { VscActivateBreakpoints } from "react-icons/vsc";
import { BsFillGrid3X3GapFill, BsUiChecksGrid, BsListTask } from "react-icons/bs";
import { PiPathFill } from "react-icons/pi";

// =============================
// 🚀 USER SIDEBAR ROUTES
// =============================
export const SidebarUserRoutes: SidebarRoute[] = [
  {
    path: "/dashboard",
    label: "Home",
    icon: <FaHome size={18} />,
  },
  {
    path: "/games/bingo-football",
    label: "Bingo",
    icon: <BsFillGrid3X3GapFill size={18} />,
  },
  {
    path: "/games/player-career",
    label: "Player Career",
    icon: <PiPathFill size={18} />,
  },
  {
    path: "/games/football-grid",
    label: "Football Grid",
    icon: <BsUiChecksGrid size={18} />,
  },
  {
    path: "/games/top-list",
    label: "Top List",
    icon: <BsListTask size={18} />,
  },
  // {
  //   path: "/games/guess-the-player",
  //   label: "Guess The Player",
  //   icon: <VscActivateBreakpoints size={18} />,
  // },
  // {
  //   path: "/multi",
  //   label: "Multi",
  //   icon: <VscActivateBreakpoints size={18} />,
  // },
];

// =============================
// 🚀 ADMIN SIDEBAR ROUTES
// =============================
export const SidebarAdminRoutes: SidebarRoute[] = [
  {
    path: "/dashboard/admin",
    label: "Home",
    icon: <FaHome size={18} />,
  },
  {
    label: "Games",
    path: "dashboard/admin/games",
    icon: <IoGameController size={18} />,
  },
  {
    path: "#",
    label: "Core",
    icon: <SiSecurityscorecard size={18} />,
    subItems: [
      {
        path: "dashboard/admin/seasons",
        label: "Seasons",
        icon: <FaCalendarAlt size={18} />,
      },
      {
        path: "dashboard/admin/competitions",
        label: "Competitions",
        icon: <FaTrophy size={18} />,
      },
      {
        path: "dashboard/admin/teams",
        label: "Teams",
        icon: <FaShieldAlt size={18} />,
      },
      {
        path: "dashboard/admin/players",
        label: "Players",
        icon: <FaUsers size={18} />,
      },
      {
        path: "dashboard/admin/managers",
        label: "Managers",
        icon: <FaUserCog size={18} />,
      },
    ]
  },
  {
    path: "#",
    label: "Areas",
    icon: <BiWorld size={18} />,
    subItems: [
      {
        path: "dashboard/admin/continents",
        label: "Continents",
        icon: <FaGlobeAfrica size={18} />,
      },
      {
        path: "dashboard/admin/countries",
        label: "Countries",
        icon: <FaFlag size={18} />,
      }
    ]
  },
  {
    path: "#",
    label: "Packs",
    icon: <FaBox size={18} />,
    subItems: [
      {
        path: "dashboard/admin/powerups",
        label: "Powerups",
        icon: <FaFlask size={18} />,
      },
      {
        path: "dashboard/admin/cosmetics",
        label: "Cosmetics",
        icon: <FaMagic size={18} />,
      }
    ]
  },

];
