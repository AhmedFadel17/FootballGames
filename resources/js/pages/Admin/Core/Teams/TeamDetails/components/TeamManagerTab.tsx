import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Manager, ManagerTeamPeriod } from '@/types';

interface TeamManagerTabProps {
    currentManager?: Manager;
    managerPeriods: ManagerTeamPeriod[];
}

export default function TeamManagerTab({ currentManager, managerPeriods }: TeamManagerTabProps) {
    const navigate = useNavigate();

    return (
        <div className="space-y-8">
            {/* Current Head Coach Spotlight Card */}
            <div className="space-y-4">
                <h3 className="text-xl font-headline font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-accent-cyan">sports</span>
                    Current Head Coach
                </h3>

                {currentManager ? (
                    <div
                        onClick={() => navigate(`/dashboard/admin/managers/${currentManager.id}`)}
                        className="glass-card rounded-2xl p-6 border border-accent-cyan/30 hover:border-accent-cyan/60 bg-gradient-to-r from-accent-cyan/10 via-white/5 to-transparent transition-all duration-300 cursor-pointer group flex flex-col md:flex-row items-center justify-between gap-6"
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-20 h-20 rounded-2xl bg-white/5 p-1 border border-white/10 shrink-0 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
                                {currentManager.img_src ? (
                                    <img
                                        src={currentManager.img_src}
                                        alt={currentManager.name}
                                        className="w-full h-full object-cover rounded-xl"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <span className="material-symbols-outlined text-4xl text-white/30">
                                        sports
                                    </span>
                                )}
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-accent-cyan bg-accent-cyan/10 px-2.5 py-0.5 rounded-full border border-accent-cyan/20">
                                        Active Manager
                                    </span>
                                </div>

                                <h4 className="text-xl font-bold text-white group-hover:text-accent-cyan transition-colors">
                                    {currentManager.name}
                                </h4>

                                {currentManager.country && (
                                    <div className="flex items-center gap-2 text-xs text-white/60">
                                        {currentManager.country.img_src && (
                                            <img
                                                src={currentManager.country.img_src}
                                                alt={currentManager.country.name}
                                                className="w-4 h-3 object-cover rounded-sm"
                                            />
                                        )}
                                        <span>{currentManager.country.name}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs font-semibold text-white/70 bg-white/5 px-4 py-2 rounded-xl border border-white/10 flex items-center gap-1.5 group-hover:bg-accent-cyan group-hover:text-[#0b0e17] transition-all">
                                View Profile
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="glass-card rounded-2xl p-8 text-center border border-white/5 space-y-2 text-white/40">
                        <span className="material-symbols-outlined text-3xl text-white/20">sports</span>
                        <p className="text-sm">No manager currently assigned to this team.</p>
                    </div>
                )}
            </div>

            {/* Manager History / Periods */}
            <div className="space-y-4">
                <h3 className="text-xl font-headline font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-purple-400">history</span>
                    Manager History & Periods
                </h3>

                {managerPeriods.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {managerPeriods.map((period) => {
                            const mgr = period.manager;
                            const isCurrent = !period.end_date;

                            return (
                                <div
                                    key={period.id}
                                    onClick={() => mgr && navigate(`/dashboard/admin/managers/${mgr.id}`)}
                                    className={`glass-card rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between space-y-4 ${
                                        mgr ? 'cursor-pointer group hover:border-purple-400/40' : ''
                                    } ${isCurrent ? 'border-accent-cyan/30 bg-accent-cyan/5' : 'border-white/10'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-xl bg-white/5 p-1 border border-white/10 shrink-0 flex items-center justify-center overflow-hidden">
                                            {mgr?.img_src ? (
                                                <img
                                                    src={mgr.img_src}
                                                    alt={mgr.name}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            ) : (
                                                <span className="material-symbols-outlined text-2xl text-white/30">
                                                    sports
                                                </span>
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors truncate">
                                                {mgr?.name || `Manager #${period.manager_id}`}
                                            </h4>
                                            {mgr?.country && (
                                                <div className="flex items-center gap-1.5 text-xs text-white/50 mt-1">
                                                    {mgr.country.img_src && (
                                                        <img
                                                            src={mgr.country.img_src}
                                                            alt={mgr.country.name}
                                                            className="w-3.5 h-2.5 object-cover rounded-sm"
                                                        />
                                                    )}
                                                    <span className="truncate">{mgr.country.name}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-white/50">
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-xs text-purple-400">
                                                calendar_month
                                            </span>
                                            {period.start_date ? new Date(period.start_date).getFullYear() : 'N/A'} — {period.end_date ? new Date(period.end_date).getFullYear() : 'Present'}
                                        </span>

                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                            isCurrent
                                                ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20'
                                                : 'bg-white/5 text-white/40'
                                        }`}>
                                            {isCurrent ? 'Current' : 'Former'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="glass-card rounded-2xl p-8 text-center border border-white/5 space-y-2 text-white/40">
                        <span className="material-symbols-outlined text-3xl text-white/20">history</span>
                        <p className="text-sm">No manager history records logged for this team.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
