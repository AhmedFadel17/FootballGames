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
import TeamDetails from "@/pages/Admin/Core/Teams/TeamDetails";
import PlayerDetails from "@/pages/Admin/Core/Players/PlayerDetails";
import ManagerDetails from "@/pages/Admin/Core/Managers/ManagerDetails";
import CountryDetails from "@/pages/Admin/Areas/Countries/CountryDetails";
import PlayerCareerGame from "@/pages/Games/Career";
import GridGamePage from "@/pages/Games/Grid";
import HowToPlay from "@/pages/Main/HowToPlay";
import GlobalRanks from "@/pages/Main/Leaderboard";
import DailyChallenge from "@/pages/Main/DailyChallenge";
import TermsOfService from "@/pages/Main/Terms";
import PrivacyPolicy from "@/pages/Main/Privacy";
import Support from "@/pages/Main/Support";
import CosmeticsPage from "@/pages/Admin/Packs/Cosmetics";
import PowerupPage from "@/pages/Admin/Packs/Powerups";
import PacksPage from "@/pages/Admin/Packs/Packs";
import EventsPage from "@/pages/Admin/Packs/Events";
import PlayerCardsPage from "@/pages/Admin/Packs/PlayerCards";
import PackDropRulesPage from "@/pages/Admin/Packs/PackDropRules";
import StorePage from "@/pages/User/Store";
import MyTeamPage from "@/pages/User/MyTeam";

// =============================
// MAIN ROUTES
// =============================
export const MainRoutes: AppRoute[] = [
  {
    path: "/",
    label: "Home",
    element: <Home />,
  },
  {
    path: "/leaderboard",
    label: "Leaderboard",
    element: <GlobalRanks />,
  },
  {
    path: "/how-to-play",
    label: "How to Play",
    element: <HowToPlay />,
  },
  {
    path: "/daily-challenge",
    label: "Daily Challenge",
    element: <DailyChallenge />,
  },
  {
    path: "/terms",
    label: "Terms of Use",
    element: <TermsOfService />,
  },
  {
    path: "/privacy",
    label: "Privacy Policy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/contact",
    label: "Contact",
    element: <Support />,
  },
];
// =============================
// USER ROUTES
// =============================
export const AppUserRoutes: AppRoute[] = [
  {
    path: "/dashboard",
    label: "Dashboard",
    element: <UserHome />,
  },
  {
    path: "/games/bingo-football",
    label: "Bingo",
    element: <BingoGame />,
  },
  {
    path: "/games/player-career",
    label: "Player Career",
    element: <PlayerCareerGame />,
  },
  {
    path: "/games/football-grid",
    label: "Football Grid",
    element: <GridGamePage />,
  },
  {
    path: "/games/top-list",
    label: "Top List",
    element: <TopListGame />,
  },
  {
    path: "/store",
    label: "Store",
    element: <StorePage />,
  },
  {
    path: "/my-team",
    label: "My Team",
    element: <MyTeamPage />,
  },
];
// =============================
// GAMES ROUTES
// =============================
export const GamesRoutes: AppRoute[] = [


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
    path: "/dashboard/admin/teams/:id",
    label: "Team Details",
    element: <TeamDetails />,
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
  {
    path: "/dashboard/admin/powerups",
    label: "Powerups",
    element: <PowerupPage />,
  },
  {
    path: "/dashboard/admin/cosmetics",
    label: "Cosmetics",
    element: <CosmeticsPage />,
  },
  {
    path: "/dashboard/admin/packs",
    label: "Packs",
    element: <PacksPage />,
  },
  {
    path: "/dashboard/admin/events",
    label: "Events",
    element: <EventsPage />,
  },
  {
    path: "/dashboard/admin/player-cards",
    label: "Player Cards",
    element: <PlayerCardsPage />,
  },
  {
    path: "/dashboard/admin/pack-drop-rules",
    label: "Pack Drop Rules",
    element: <PackDropRulesPage />,
  },
];
