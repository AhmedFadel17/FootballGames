import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "@/pages/AuthPages/SignIn";
import SignUp from "@/pages/AuthPages/SignUp";
import NotFound from "@/pages/OtherPage/NotFound";
import AppLayout from "@/layouts/AppLayout";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import { AppUserRoutes, AppAdminRoutes } from "@/routes"
import { useEffect } from "react";
import Cookies from 'js-cookie';
import { useDispatch } from "react-redux";
import { guestLogin } from '@/store/slices/authSlice';
import { useAppDispatch, useAppSelector } from "@/store";

export default function App() {
   const dispatch = useAppDispatch();
    const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    // ✅ Auto guest login only if no token found
    if (!token && !Cookies.get('token')) {
      dispatch(guestLogin());
    }
  }, [dispatch, token]);
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            {AppUserRoutes.map((route,index) => (
              <Route key={index} index={index==0} path={route.path} element={route.element} />
            ))}
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
