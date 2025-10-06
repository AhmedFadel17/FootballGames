import { useEffect, useRef, useState } from "react";

import { Link } from "react-router";
import { useSidebar } from "@/context/SidebarContext";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import NotificationDropdown from "@/components/header/NotificationDropdown";
import UserDropdown from "@/components/header/UserDropdown";
import { useAppSelector } from "@/store";
import { MainRoutes } from "@/routes";
import Button from "@/components/ui/button/Button";

const MainHeader: React.FC = () => {
    const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
    const appName = import.meta.env.VITE_APP_NAME ?? "FG";
    const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

    const handleToggle = () => {
        if (window.innerWidth >= 1024) {
            toggleSidebar();
        } else {
            toggleMobileSidebar();
        }
    };

    const toggleApplicationMenu = () => {
        setApplicationMenuOpen(!isApplicationMenuOpen);
    };

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "k") {
                event.preventDefault();
                inputRef.current?.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <header className="sticky top-0 justify-center flex w-full bg-primary text-white z-10">
            <div className="flex items-center justify-between px-6 md:px-0 py-8 w-full md:w-8/12">
                <div className="flex-1">
                    <Link to="/">
                        <div className="flex gap-4 items-center justify-start">

                            <img
                                src="./images/logo/logo-icon.svg"
                                alt="Logo"
                            />
                            <h4 className="font-[800] text-xl text-white uppercase">{appName}</h4>
                        </div>
                    </Link>
                </div>
                <div className="flex-none flex items-center gap-10 justify-around">
                    {MainRoutes.map((route, index) => (
                        <Link to={route.path} key={index}>
                            <span className="font-[500] text-md hover:text-secondary">{route.label}</span>
                        </Link>
                    ))}
                </div>
                <div className="flex-1 text-right">
                    <Link to="/dashboard">
                        <Button variant="outline">
                            Play Now
                        </Button>
                    </Link>
                </div>

            </div>
        </header>
    );
};

export default MainHeader;
