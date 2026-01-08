import { AppRoute } from "@/types/ui";

import UserHome from "@/pages/Dashboard/Home";
import AdminHome from "@/pages/Admin/Home";

import BingoGame from "@/pages/Games/Bingo";
import TopListGame from "@/pages/Games/TopList";

import Competitions from "@/pages/Admin/Core/Competitions";
import Teams from "@/pages/Admin/Core/Teams";
import Players from "@/pages/Admin/Core/Players";
import Managers from "@/pages/Admin/Core/Managers";
import Seasons from "@/pages/Admin/Core/Seasons";
import Transfers from "@/pages/Admin/Core/Transfers";

import PlayerStats from "@/pages/Admin/Statistics/PlayersStats";
import TeamStats from "@/pages/Admin/Statistics/TeamsStats";

import Continents from "@/pages/Admin/Areas/Continents";
import Countries from "@/pages/Admin/Areas/Countries";
import GameTypesPage from "@/pages/Admin/Games/GameTypes";
import GamesListPage from "@/pages/Admin/Games/GamesList";
import TopListPage from "@/pages/Admin/Games/TopListGame";
import Home from "@/pages/Main/Home";
import Multi from "@/pages/Dashboard/Multi";
import GuessThePlayerPage from "@/pages/Games/GuessThePlayer";

// =============================
// 🚀 MAIN ROUTES
// =============================
export const MainRoutes: AppRoute[] = [
  {
    path: "/",
    label: "Home",
    element: <Home />,
  },
  {
    path: "/",
    label: "Games",
    element: <Home />,
  },
  {
    path: "/",
    label: "Fans",
    element: <Home />,
  },
  {
    path: "/",
    label: "Contact Us",
    element: <Home />,
  },
  {
    path: "/",
    label: "About Us",
    element: <Home />,
  },
];
// =============================
// 🚀 USER ROUTES
// =============================
export const AppUserRoutes: AppRoute[] = [
  {
    path: "/dashboard",
    label: "Dashboard",
    element: <UserHome />,
  },
  {
    path: "/games/bingo",
    label: "Bingo",
    element: <BingoGame />,
  },
  {
    path: "/games/top-list",
    label: "Top List",
    element: <TopListGame />,
  },
    {
    path: "/games/guess-the-player",
    label: "Guess The Player",
    element: <GuessThePlayerPage />,
  },
  {
    path: "/multi",
    label: "Multi",
    element: <Multi />,
  },
];

// =============================
// 🚀 ADMIN ROUTES
// =============================
export const AppAdminRoutes: AppRoute[] = [
  {
    path: "/dashboard",
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
    path: "/admin/games/types/top-list",
    label: "Top List",
    element: <TopListPage />,
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
    path: "/admin/statistics/teams-stats",
    label: "Teams Stats",
    element: <TeamStats />,
  },
  {
    path: "/admin/statistics/players-stats",
    label: "Players Stats",
    element: <PlayerStats />,
  },
];
