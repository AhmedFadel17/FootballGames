import { AppRoute } from "@/types/ui";
import { lazy } from "react";

const Home = lazy(() => import("@/pages/Dashboard/Home"));

const BingoGame = lazy(() => import("@/pages/Games/Bingo"));
const Top10Game = lazy(() => import("@/pages/Games/Top10"));

const Competitions = lazy(() => import("@/pages/Admin/Competitions"));
const Teams = lazy(() => import("@/pages/Admin/Teams"));
const Players = lazy(() => import("@/pages/Admin/Players"));
const Managers = lazy(() => import("@/pages/Admin/Managers"));
const Seasons = lazy(() => import("@/pages/Admin/Seasons"));
const Transfers = lazy(() => import("@/pages/Admin/Transfers"));
const Statistics = lazy(() => import("@/pages/Admin/Statistics"));

// =============================
// 🚀 USER ROUTES
// =============================
export const AppUserRoutes: AppRoute[] = [
  {
    path: "/",
    label: "Dashboard",
    element: <Home />,
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
    element: <Home />,
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
