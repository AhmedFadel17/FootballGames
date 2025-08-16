import { AppRoute } from "@/types/ui";

import UserHome from "@/pages/Dashboard/Home";
import AdminHome from "@/pages/Admin/Home";

import BingoGame from "@/pages/Games/Bingo";
import Top10Game from "@/pages/Games/Top10";

import Competitions from "@/pages/Admin/Competitions";
import Teams from "@/pages/Admin/Teams";
import Players from "@/pages/Admin/Players";
import Managers from "@/pages/Admin/Managers";
import Seasons from "@/pages/Admin/Seasons";
import Transfers from "@/pages/Admin/Transfers";
import Statistics from "@/pages/Admin/Statistics";

import Continents from "@/pages/Admin/Areas/Continents";
import Countries from "@/pages/Admin/Areas/Countries";
import GameTypesPage from "@/pages/Admin/Games/GameTypes";
import GamesListPage from "@/pages/Admin/Games/GamesList";

// =============================
// 🚀 USER ROUTES
// =============================
export const AppUserRoutes: AppRoute[] = [
  {
    path: "/",
    label: "Dashboard",
    element: <UserHome />,
  },
  {
    path: "/games/bingo",
    label: "Bingo",
    element: <BingoGame />,
  },
  {
    path: "/games/top10",
    label: "Top 10",
    element: <Top10Game />,
  },

];

// =============================
// 🚀 ADMIN ROUTES
// =============================
export const AppAdminRoutes: AppRoute[] = [
  {
    path: "/",
    label: "Dashboard",
    element: <AdminHome />,
  },
  {
    path: "/admin/continents",
    label: "Continents",
    element: <Continents />,
  },
  {
    path: "/admin/countries",
    label: "Countries",
    element: <Countries />,
  },
  {
    path: "/admin/games/types",
    label: "Game Types",
    element: <GameTypesPage />,
  },
  {
    path: "/admin/games/list",
    label: "Games List",
    element: <GamesListPage />,
  },
  {
    path: "/admin/competitions",
    label: "Competitions",
    element: <Competitions />,
  },
  {
    path: "/admin/teams",
    label: "Teams",
    element: <Teams />,
  },
  {
    path: "/admin/players",
    label: "Players",
    element: <Players />,
  },
  {
    path: "/admin/managers",
    label: "Managers",
    element: <Managers />,
  },
  {
    path: "/admin/seasons",
    label: "Seasons",
    element: <Seasons />,
  },
  {
    path: "/admin/transfers",
    label: "Transfers",
    element: <Transfers />,
  },
  {
    path: "/admin/statistics",
    label: "Statistics",
    element: <Statistics />,
  },
];
