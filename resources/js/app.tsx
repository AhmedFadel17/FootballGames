import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "@/pages/AuthPages/SignIn";
import SignUp from "@/pages/AuthPages/SignUp";
import NotFound from "@/pages/OtherPage/NotFound";
import AppLayout from "@/layouts/AppLayout";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import { AppUserRoutes } from "@/routes"
import { Toaster } from "react-hot-toast";

export default function App() {

  return (
    <>
      <Router>
        <ScrollToTop />
              <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            {AppUserRoutes.map((route,index) => (
              <Route key={index} index={index==0} path={route.path} element={route.element} />
            ))}
          </Route>

          {/* Auth Layout */}
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
