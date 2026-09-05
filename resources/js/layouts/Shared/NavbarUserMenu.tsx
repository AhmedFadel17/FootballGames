import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    LayoutDashboard,
    User as UserIcon,
    Users,
    LogOut,
    ChevronDown
} from 'lucide-react';

export interface UserProfile {
    id?: number | string;
    name?: string;
    email?: string;
    avatar?: string | null;
    coins?: number;
}

export interface NavbarUserMenuProps {
    user: UserProfile | null;
    onLogout?: () => void;
}

export const NavbarUserMenu: React.FC<NavbarUserMenuProps> = ({ user, onLogout }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = (): void => {
        setIsOpen(false);
        if (onLogout) {
            onLogout();
        }
    };

    return (
        <div className="relative flex items-center gap-2" ref={dropdownRef}>


            {/* Profile Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex items-center gap-2.5 p-1.5 pl-2 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/40 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
                <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-primary/10 border border-primary/30 flex items-center justify-center font-bold text-primary text-sm">
                    {user?.avatar ? (
                        <img
                            src={user.avatar}
                            alt={user.name || 'User Avatar'}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                    )}
                </div>

                <div className="hidden lg:flex flex-col text-left">
                    <span className="text-sm font-semibold text-on-surface leading-tight">
                        {user?.name || 'Player'}
                    </span>
                    <span className="text-[11px] font-medium text-primary leading-tight">
                        {user?.coins !== undefined ? `${user.coins.toLocaleString()} Coins` : 'Pro'}
                    </span>
                </div>

                <ChevronDown
                    className={`w-4 h-4 text-on-surface-variant transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                        }`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-surface-container-high border border-outline-variant/60 shadow-2xl shadow-black/60 py-2 z-50 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* User Info Header (Mobile/Tablet view) */}
                    <div className="px-4 py-2.5 border-b border-outline-variant/30 mb-1">
                        <p className="text-sm font-bold text-on-surface truncate">
                            {user?.name || 'User Profile'}
                        </p>
                        <p className="text-xs text-on-surface-variant truncate">
                            {user?.email || 'player@fotfun.com'}
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div className="px-1.5 space-y-0.5">
                        <Link
                            to="/dashboard"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-on-surface rounded-xl hover:bg-surface-bright hover:text-primary transition-colors"
                        >
                            <LayoutDashboard className="w-4 h-4 text-primary" />
                            <span>Dashboard</span>
                        </Link>

                        <Link
                            to="/profile"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-on-surface rounded-xl hover:bg-surface-bright hover:text-primary transition-colors"
                        >
                            <UserIcon className="w-4 h-4 text-tertiary" />
                            <span>Profile</span>
                        </Link>

                        <Link
                            to="/my-team"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-on-surface rounded-xl hover:bg-surface-bright hover:text-primary transition-colors"
                        >
                            <Users className="w-4 h-4 text-accent-cyan" />
                            <span>My Team</span>
                        </Link>
                    </div>

                    <div className="my-1.5 border-t border-outline-variant/30" />

                    {/* Logout Action */}
                    <div className="px-1.5">
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-secondary hover:text-white rounded-xl hover:bg-secondary/20 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};