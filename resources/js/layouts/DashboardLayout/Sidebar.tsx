import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SidebarUserRoutes, SidebarAdminRoutes } from '@/routes/sidebar';
import { ChevronDownIcon } from '@/icons';

interface SubNavItem {
    label: string;
    path: string;
    icon?: React.ReactNode;
}

interface NavItem {
    label: string;
    path?: string;
    icon?: React.ReactNode;
    subItems?: SubNavItem[];
}

interface NavGroup {
    group: string;
    items: NavItem[];
}

type SidebarRoute = NavItem | NavGroup;

interface SidebarProps {
    isCollapsed: boolean;
    isAdmin: boolean;
}

export default function Sidebar({ isCollapsed, isAdmin }: SidebarProps) {
    const [isHovered, setIsHovered] = useState(false);
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const appName = import.meta.env.VITE_APP_NAME;

    // Sidebar expands when not collapsed OR when mouse hovers over it
    const isExpanded = !isCollapsed || isHovered;

    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
    const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
    const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const routes: SidebarRoute[] = isAdmin ? SidebarAdminRoutes : SidebarUserRoutes;

    const isActive = useCallback(
        (path?: string) => Boolean(path && pathname === path),
        [pathname]
    );

    // Auto-expand parent submenu if active path matches a sub-item
    useEffect(() => {
        let activeKey: string | null = null;

        const checkItems = (items: NavItem[], prefix: string) => {
            items.forEach((nav, idx) => {
                const key = `${prefix}${idx}`;
                if (nav.subItems?.some((sub) => isActive(sub.path))) {
                    activeKey = key;
                }
            });
        };

        routes.forEach((route, groupIdx) => {
            if ('group' in route) {
                checkItems(route.items, `group-${groupIdx}-item-`);
            } else {
                checkItems([route], 'item-');
            }
        });

        if (activeKey) {
            setOpenSubmenu(activeKey);
        }
    }, [pathname, isActive, routes]);

    // Recalculate heights dynamically for smooth accordion transitions
    useEffect(() => {
        if (openSubmenu && subMenuRefs.current[openSubmenu]) {
            setSubMenuHeight((prev) => ({
                ...prev,
                [openSubmenu]: subMenuRefs.current[openSubmenu]?.scrollHeight || 0,
            }));
        }
    }, [openSubmenu]);

    const handleSubmenuToggle = (key: string) => {
        setOpenSubmenu((prevKey) => (prevKey === key ? null : key));
    };

    const renderIcon = (icon?: React.ReactNode) => {
        if (!icon) return null;
        if (typeof icon === 'string') {
            return <span className="material-symbols-outlined text-xl">{icon}</span>;
        }
        return icon;
    };

    const renderNavItem = (nav: NavItem, key: string) => {
        const hasSubItems = Boolean(nav.subItems && nav.subItems.length > 0);
        const isSubOpen = openSubmenu === key;
        const isParentActive =
            isActive(nav.path) ||
            nav.subItems?.some((sub) => isActive(sub.path));

        return (
            <li key={key} className="flex flex-col">
                {hasSubItems ? (
                    <button
                        type="button"
                        onClick={() => handleSubmenuToggle(key)}
                        className={`flex items-center rounded-xl transition-all duration-300 group w-full ${!isExpanded
                            ? 'justify-center px-0 py-3 gap-0'
                            : 'px-4 py-2.5 gap-3.5'
                            } ${isParentActive
                                ? 'bg-accent-purple/15 text-white border border-accent-purple/30 shadow-[0_0_15px_rgba(138,43,226,0.15)]'
                                : 'text-white/60 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <span
                            className={`flex-shrink-0 flex items-center justify-center transition-colors ${isParentActive
                                ? 'text-accent-purple'
                                : 'group-hover:text-white'
                                }`}
                        >
                            {renderIcon(nav.icon)}
                        </span>

                        <span
                            className={`font-semibold text-[13px] tracking-wide text-left flex-1 transition-all duration-300 overflow-hidden whitespace-nowrap ${!isExpanded ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'
                                }`}
                        >
                            {nav.label}
                        </span>

                        {isExpanded && (
                            <ChevronDownIcon
                                className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${isSubOpen ? 'rotate-180 text-white' : 'text-white/40'
                                    }`}
                            />
                        )}
                    </button>
                ) : (
                    nav.path && (
                        <Link
                            to={nav.path}
                            className={`flex items-center rounded-xl transition-all duration-300 group ${!isExpanded
                                ? 'justify-center px-0 py-3 gap-0'
                                : 'px-4 py-2.5 gap-3.5'
                                } ${isParentActive
                                    ? 'bg-accent-purple/15 text-white border border-accent-purple/30 shadow-[0_0_15px_rgba(138,43,226,0.15)]'
                                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <span
                                className={`flex-shrink-0 flex items-center justify-center transition-colors ${isParentActive
                                    ? 'text-accent-purple'
                                    : 'group-hover:text-white'
                                    }`}
                            >
                                {renderIcon(nav.icon)}
                            </span>

                            <span
                                className={`font-semibold text-[13px] tracking-wide transition-all duration-300 overflow-hidden whitespace-nowrap ${!isExpanded
                                    ? 'w-0 opacity-0 hidden'
                                    : 'w-auto opacity-100 flex-1'
                                    }`}
                            >
                                {nav.label}
                            </span>

                            {isParentActive && isExpanded && (
                                <div className="ml-auto w-1.5 h-5 bg-accent-purple rounded-full shadow-[0_0_10px_#8a2be2]"></div>
                            )}
                        </Link>
                    )
                )}

                {/* Submenu Container */}
                {hasSubItems && isExpanded && (
                    <div
                        ref={(el) => {
                            subMenuRefs.current[key] = el;
                        }}
                        className="overflow-hidden transition-all duration-300 ease-in-out"
                        style={{
                            height: isSubOpen ? `${subMenuHeight[key] || 0}px` : '0px',
                        }}
                    >
                        <ul className="mt-1 space-y-1 ml-5 pl-3 border-l border-white/10">
                            {nav.subItems?.map((subItem) => {
                                const isSubActive = isActive(subItem.path);
                                return (
                                    <li key={subItem.path}>
                                        <Link
                                            to={subItem.path}
                                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${isSubActive
                                                ? 'text-accent-purple bg-accent-purple/10 font-semibold'
                                                : 'text-white/50 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            {subItem.icon && (
                                                <span className="flex-shrink-0">
                                                    {renderIcon(subItem.icon)}
                                                </span>
                                            )}
                                            <span className="whitespace-nowrap">
                                                {subItem.label}
                                            </span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </li>
        );
    };

    return (
        <aside
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`h-screen fixed left-0 top-0 z-40 ${isAdmin ? 'bg-surface-container' : 'bg-dashboard-bg'
                } border-r border-white/5 flex flex-col py-6 overflow-y-auto transition-all duration-300 ease-in-out hidden lg:flex ${!isExpanded ? 'w-20' : 'w-72'
                }`}
        >
            {/* Logo Header */}
            <div
                className={`mb-6 transition-all duration-300 ${!isExpanded ? 'px-4' : 'px-6'
                    }`}
            >
                <div
                    className={`flex items-center gap-3 cursor-pointer ${!isExpanded ? 'justify-center w-full' : ''
                        }`}
                    onClick={() => navigate('/')}
                >
                    <img src="/images/logo/fotfun.png" alt="Logo" className="rounded-xl w-10 h-10 object-contain" />

                    <div
                        className={`flex font-headline gap-x-2 font-bold text-xl transition-all duration-300 overflow-hidden ${!isExpanded ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'
                            }`}
                    >
                        <span className="font-headline font-black italic tracking-tighter text-xl md:text-2xl pr-1 text-primary uppercase">{appName}</span>

                    </div>
                </div>
            </div>

            {/* Navigation Section */}
            <nav
                className={`flex-1 space-y-5 transition-all duration-300 ${!isExpanded ? 'px-2' : 'px-4'
                    }`}
            >
                {routes.map((route, groupIdx) => {
                    // Grouped route header and items
                    if ('group' in route) {
                        return (
                            <div key={route.group || groupIdx} className="space-y-1.5">
                                {isExpanded && route.group && (
                                    <div className="px-3 pt-2 text-[11px] font-bold tracking-wider text-white/30 uppercase select-none">
                                        {route.group}
                                    </div>
                                )}
                                <ul className="space-y-1">
                                    {route.items.map((item, itemIdx) =>
                                        renderNavItem(
                                            item,
                                            `group-${groupIdx}-item-${itemIdx}`
                                        )
                                    )}
                                </ul>
                            </div>
                        );
                    }

                    // Flat standard item
                    return (
                        <ul key={`item-${groupIdx}`} className="space-y-1">
                            {renderNavItem(route, `item-${groupIdx}`)}
                        </ul>
                    );
                })}
            </nav>
        </aside>
    );
}