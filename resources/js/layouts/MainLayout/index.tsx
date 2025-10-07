import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import { Navigate, Outlet, useNavigate } from "react-router";
import MainHeader from "./MainHeader";
import AppFooter from "../Shared/AppFooter";


const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen xl:flex">
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${isMobileOpen ? "ml-0" : ""}`}
      >
        <MainHeader />
        <div className=" mx-auto max-w-(--breakpoint-2xl) ">
          <Outlet />
        </div>
        <AppFooter/>
      </div>
    </div>
  );
};

const MainLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default MainLayout;
