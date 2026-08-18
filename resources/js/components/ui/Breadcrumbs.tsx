import React from 'react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
    label: string;
    path?: string;
    icon?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
    return (
        <nav className="flex items-center space-x-4">
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <div className="flex items-center group">
                        {item.path ? (
                            <Link
                                to={item.path}
                                className="flex items-center gap-2.5 text-white/40 hover:text-accent-cyan transition-all duration-300 py-1.5"
                            >
                                {item.icon && (
                                    <span className="material-symbols-outlined text-lg opacity-60 group-hover:opacity-100 transition-opacity">
                                        {item.icon}
                                    </span>
                                )}
                                <span className="tracking-[0.15em] uppercase text-xs font-black font-[500]">{item.label}</span>
                            </Link>
                        ) : (
                            <div className="flex items-center gap-2.5 text-accent-cyan hover:text-accent-cyan/80 transition-all duration-300 px-4 py-2 bg-white/5 rounded-xl border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.02)]">
                                {item.icon && (
                                    <span className="material-symbols-outlined text-lg text-accent-cyan">
                                        {item.icon}
                                    </span>
                                )}
                                <span className="tracking-[0.15em]  uppercase text-xs font-[500] font-black">{item.label}</span>
                            </div>
                        )}
                    </div>

                    {index < items.length - 1 && (
                        <div className="flex items-center justify-center">
                            <span className="material-symbols-outlined text-white/10 text-sm select-none">
                                arrow_forward_ios
                            </span>
                        </div>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};

export default Breadcrumbs;
