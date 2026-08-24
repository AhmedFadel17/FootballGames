import { configureEcho } from '@laravel/echo-react';

configureEcho({
  broadcaster: 'reverb',
});

import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "@/pages/AuthPages/SignIn";
import SignUp from "@/pages/AuthPages/SignUp";
import NotFound from "@/pages/OtherPage/NotFound";
import AppLayout from "@/layouts/DashboardLayout";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import { AppAdminRoutes, AppUserRoutes, GamesRoutes, MainRoutes } from "@/routes";
import { Toaster } from "react-hot-toast";
import MainLayout from "@/layouts/MainLayout";
import GameLayout from './layouts/GameLayout';
import { useAuth } from "react-oidc-context";
import AuthCallback from "@/pages/Auth/Callback";
import AdminRoute from './components/guards/AdminRoute';
import ProtectedRoute from './components/guards/ProtectedRoute';
import DashboardLayout from '@/layouts/DashboardLayout';

export default function App() {

  return (
    <>
      <Router>
        <Routes>

          <Route element={<MainLayout />}>
            {MainRoutes.map((route, index) => (
              <Route key={index} index={index === 0} path={route.path} element={route.element} />
            ))}
          </Route>

          {/* Dashboard Layout */}
          <Route element={<ProtectedRoute />}>

            <Route element={<DashboardLayout />}>
              {AppUserRoutes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
              <Route element={<GameLayout />}>
                {GamesRoutes.map((route, index) => (
                  <Route key={index} path={route.path} element={route.element} />
                ))}
              </Route>
            </Route>



            <Route element={<AdminRoute />}>
              <Route element={<DashboardLayout />}>
                {AppAdminRoutes.map((route, index) => (
                  <Route key={index} path={route.path} element={route.element} />
                ))}
              </Route>
            </Route>

          </Route>



          {/* Auth pages — shown when the user is not yet authenticated */}
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
