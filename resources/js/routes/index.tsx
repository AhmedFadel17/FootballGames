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


import Continents from "@/pages/Admin/Areas/Continents";
import Countries from "@/pages/Admin/Areas/Countries";
import GamesListPage from "@/pages/Admin/Games/GamesList";
import Home from "@/pages/Main/Home";
import Multi from "@/pages/Dashboard/Multi";
import GuessThePlayerPage from "@/pages/Games/GuessThePlayer";
import CompetitionDetails from "@/pages/Admin/Core/Competitions/CompetitionDetails";
import CompetitionSeasonDetails from "@/pages/Admin/Core/Competitions/CompetitionSeasonDetails";
import PlayerDetails from "@/pages/Admin/Core/Players/PlayerDetails";
import ManagerDetails from "@/pages/Admin/Core/Managers/ManagerDetails";
import CountryDetails from "@/pages/Admin/Areas/Countries/CountryDetails";

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
];
// =============================
// 🚀 GAMES ROUTES
// =============================
export const GamesRoutes: AppRoute[] = [
  {
    path: "/games/bingo-football",
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
    path: "/lobby",
    label: "Lobby",
    element: <Multi />,
  },
];
// =============================
// 🚀 ADMIN ROUTES
// =============================
export const AppAdminRoutes: AppRoute[] = [
  {
    path: "/dashboard/admin",
    label: "Dashboard",
    element: <AdminHome />,
  },
  {
    path: "/dashboard/admin/continents",
    label: "Continents",
    element: <Continents />,
  },
  {
    path: "/dashboard/admin/countries",
    label: "Countries",
    element: <Countries />,
  },
  {
    path: "/dashboard/admin/countries/:id",
    label: "Country Details",
    element: <CountryDetails />,
  },
  {
    path: "/dashboard/admin/games",
    label: "Games List",
    element: <GamesListPage />,
  },

  {
    path: "/dashboard/admin/competitions",
    label: "Competitions",
    element: <Competitions />,
  },
  {
    path: "/dashboard/admin/competitions/:id",
    label: "Competition Details",
    element: <CompetitionDetails />,
  },
  {
    path: "/dashboard/admin/competition-seasons/:id",
    label: "Competition Season Details",
    element: <CompetitionSeasonDetails />,
  },
  {
    path: "/dashboard/admin/teams",
    label: "Teams",
    element: <Teams />,
  },
  {
    path: "/dashboard/admin/players",
    label: "Players",
    element: <Players />,
  },
  {
    path: "/dashboard/admin/players/:id",
    label: "Player Details",
    element: <PlayerDetails />,
  },
  {
    path: "/dashboard/admin/managers",
    label: "Managers",
    element: <Managers />,
  },
  {
    path: "/dashboard/admin/managers/:id",
    label: "Manager Details",
    element: <ManagerDetails />,
  },
  {
    path: "/dashboard/admin/seasons",
    label: "Seasons",
    element: <Seasons />,
  },

];
