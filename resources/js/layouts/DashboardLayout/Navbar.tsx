import { useGetUserProfileQuery } from "@/store/apis";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate, Link, useLocation } from "react-router-dom";
// import NotificationsDropdown from "@/components/ui/NotificationsDropdown";
import { SidebarAdminRoutes, SidebarUserRoutes } from "@/routes/sidebar";

export default function DashboardNavbar({
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isAdmin
}: {
    isSidebarCollapsed: boolean;
    setIsSidebarCollapsed: (collapsed: boolean) => void;
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (open: boolean) => void;
    isAdmin: boolean;
}) {
    const auth = useAuth();
    const user = auth.user;

    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { data: profileData } = useGetUserProfileQuery();
    const profile = profileData?.data;



    const [isMobile, setIsMobile] = useState(false);
    const routes = isAdmin ? SidebarAdminRoutes : SidebarUserRoutes;

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        auth.signoutRedirect();
    };

    const handleMenuClick = () => {
        if (isMobile) {
            setIsMobileMenuOpen(!isMobileMenuOpen);
        } else {
            setIsSidebarCollapsed(!isSidebarCollapsed);
        }
    };

    const iconName = isMobile
        ? (isMobileMenuOpen ? 'close' : 'menu')
        : (isSidebarCollapsed ? 'menu' : 'menu_open');

    return (
        <header className={`sticky top-0 z-30 ${isAdmin ? "bg-surface-container/80" : "bg-dashboard-bg/80"} backdrop-blur-md border-b border-white/5`}>
            {/* Header Container */}
            <div className="h-20 px-6 md:px-10 flex items-center justify-between">

                {/* Left Section: Menu Toggle + Mobile Logo */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleMenuClick}
                        className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300 flex items-center justify-center outline-none"
                        aria-label="Toggle Sidebar"
                    >
                        <span className="material-symbols-outlined text-2xl">
                            {iconName}
                        </span>
                    </button>

                    {/* Logo visible only on mobile/tablet because sidebar is hidden */}
                    <div className="lg:hidden text-xl font-headline font-bold text-white tracking-tight flex items-center">
                        <div className='flex items-center gap-2 cursor-pointer' onClick={() => navigate('/')}>
                            <img src="/images/logo/logo.png" alt="logo" className='w-8 h-8' />
                            <div>
                                <span className='text-primary-light'>VidiMetrics</span>
                                <span className="text-primary">.Ai</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section: Notifications + User Menu */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-4 border-r border-white/5 pr-4">
                        {/* Notifications Dropdown */}
                        {/* <NotificationsDropdown user={user} /> */}


                    </div>

                    {/* User Dropdown */}
                    <Menu as="div" className="relative">
                        <Menu.Button className="flex items-center gap-4 p-1.5 outline-none">
                            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white/10 p-[2px] group-hover:border-primary/50 transition-all duration-300">
                                <img
                                    src={
                                        profile?.profilePictureUrl ||
                                        "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                                    }
                                    alt="Operator"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </div>
                        </Menu.Button>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="transform opacity-0 scale-95 -translate-y-2"
                            enterTo="transform opacity-100 scale-100 translate-y-0"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100 translate-y-0"
                            leaveTo="transform opacity-0 scale-95 -translate-y-2"
                        >
                            <Menu.Items className="absolute right-0 w-64 p-2 font-medium text-sm origin-top-right glass-card rounded-lg overflow-hidden focus:outline-none z-50 ring-1 ring-white/10 bg-surface-container-low">
                                <div className="p-3 border-b border-white/5">
                                    <div className="flex flex-col">
                                        <span className="text-base capitalize text-white truncate">
                                            {profile?.fullName}
                                        </span>
                                        <span className="text-sm text-white/40 truncate">
                                            {profile?.email}
                                        </span>
                                    </div>
                                </div>
                                <div className=" py-3">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={() => navigate("/dashboard/account?tab=profile")}
                                                className={`${active ? "bg-white/10 text-white" : "text-white/60"
                                                    } group flex w-full justify-between items-center rounded px-3 py-1 text-xs transition-all duration-200 uppercase tracking-widest`}
                                            >
                                                My Profile
                                                <span className="material-symbols-outlined text-lg opacity-60">
                                                    person
                                                </span>
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={() =>
                                                    navigate("/dashboard/account?tab=preferences")
                                                }
                                                className={`${active ? "bg-white/10 text-white" : "text-white/60"
                                                    } group flex w-full justify-between items-center rounded px-3 py-1 text-xs transition-all duration-200 uppercase tracking-widest`}
                                            >
                                                Settings
                                                <span className="material-symbols-outlined text-lg opacity-60">
                                                    settings
                                                </span>
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={handleLogout}
                                                className={`${active ? "bg-red-500 text-white" : "text-red-500/80"
                                                    } group flex justify-between w-full items-center rounded px-3 py-1 text-xs font-bold transition-all duration-200 uppercase tracking-widest`}
                                            >
                                                Logout
                                                <span className="material-symbols-outlined text-lg">
                                                    logout
                                                </span>
                                            </button>
                                        )}
                                    </Menu.Item>
                                </div>
                                <div className="border-t border-white/5 py-3">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={() => navigate("/privacy")}
                                                className={`${active ? "bg-white/10 text-white" : "text-white/60"
                                                    } group flex  w-full items-center rounded px-3 py-2 text-xs transition-all duration-200 uppercase tracking-widest`}
                                            >
                                                Privacy Policy
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={() => navigate("/terms")}
                                                className={`${active ? "bg-white/10 text-white" : "text-white/60"
                                                    } group flex justify-between w-full items-center rounded px-3 py-2 text-xs transition-all duration-200 uppercase tracking-widest`}
                                            >
                                                Terms of use
                                            </button>
                                        )}
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
            </div>

            {/* Mobile & Medium Overlay Menu */}
            {isMobile && isMobileMenuOpen && (
                <div className="lg:hidden bg-dashboard-bg border-t border-white/5 px-6 py-6 flex flex-col gap-6 animate-in fade-in slide-in-from-top-5 duration-200 overflow-y-auto max-h-[calc(100vh-5rem)]">

                    {/* Navigation Links */}
                    <nav className="flex flex-col gap-2">
                        {routes.map((route) => {
                            const isActive = pathname === route.path;
                            return (
                                <Link
                                    key={route.path}
                                    to={route.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-4 px-6 py-3 rounded-xl transition-all duration-300
                    ${isActive
                                            ? 'bg-accent-purple/10 text-white border border-accent-purple/20 shadow-[0_0_20px_rgba(138,43,226,0.1)]'
                                            : 'text-white/40 hover:bg-white/5 hover:text-white/80'}`}
                                >
                                    <span className={`material-symbols-outlined text-2xl ${isActive ? 'text-accent-purple' : ''}`}>
                                        {route.icon}
                                    </span>
                                    <span className="font-bold text-sm tracking-wide">{route.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            )}
        </header>
    );
}
