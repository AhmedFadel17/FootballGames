import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetManagerByIdQuery } from '@/store/apis';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { ErrorScreen, LoadingScreen } from '@/components/ui/Feedback/StatusScreens';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';

export default function ManagerDetails() {
    const { id: managerIdStr } = useParams<{ id: string }>();
    const managerId = parseInt(managerIdStr || '') || 0;
    const navigate = useNavigate();

    const { data: managerResponse, isLoading, isError } = useGetManagerByIdQuery(managerId);
    const manager = managerResponse?.data;

    if (isLoading) return <LoadingScreen message="Loading Manager Profile..." accentColor="purple" />;
    if (isError || !manager) return <ErrorScreen title="Manager Not Found" message="Unable to retrieve manager details." />;

    const teamPeriods = manager.team_periods || [];

    return (
        <div className="space-y-8 pb-20 antialiased text-[#dae2fd]">
            {/* Breadcrumbs */}
            <Breadcrumbs items={[
                { label: 'Home', path: '/dashboard/admin' },
                { label: 'Managers', path: '/dashboard/admin/managers' },
                { label: manager.name, path: `/dashboard/admin/managers/${manager.id}` },
            ]} />

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <PageHeader
                    chipText={`${manager.country?.name || 'International'} • Head Coach`}
                    titlePrefix={`${manager.name} `}
                    gradientText=" Overview"
                    description="Comprehensive breakdown of managerial history, managed teams, and career periods."
                />
                <Button
                    variant="outline"
                    onClick={() => navigate('/admin/managers')}
                    className="shrink-0 flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back to Managers
                </Button>
            </div>

            {/* Hero / Spotlight Card */}
            <div className="glass-card rounded-3xl p-8 lg:p-10 border border-white/10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-br from-white/5 via-dashboard-bg/80 to-accent-purple/5">
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent-purple/10 blur-[100px] pointer-events-none" />

                <div className="flex flex-col md:flex-row items-center gap-6 relative z-10 w-full md:w-auto">
                    {/* Manager Avatar */}
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-white/5 p-2 border border-white/10 shrink-0 flex items-center justify-center shadow-2xl relative overflow-hidden group">
                        {manager.img_src ? (
                            <img
                                src={manager.img_src}
                                alt={manager.name}
                                className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                        ) : (
                            <span className="material-symbols-outlined text-5xl text-white/30">sports</span>
                        )}
                    </div>

                    <div className="text-center md:text-left space-y-2">
                        <span className="text-xs font-black uppercase tracking-wider text-accent-cyan bg-accent-cyan/10 px-3 py-1 rounded-full border border-accent-cyan/20">
                            Manager / Head Coach
                        </span>

                        <h1 className="text-3xl lg:text-4xl font-headline font-bold text-white tracking-tight">
                            {manager.name}
                        </h1>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-white/60 pt-2">
                            {manager.country && (
                                <div className="flex items-center gap-1.5">
                                    {manager.country.img_src && (
                                        <img src={manager.country.img_src} alt={manager.country.name} className="w-4 h-3 object-cover rounded-sm" />
                                    )}
                                    <span>{manager.country.name}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm text-accent-cyan">star</span>
                                <span>Popularity: {manager.popularity ?? 0}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="relative z-10 flex items-center gap-4 w-full md:w-auto shrink-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-white/10 md:pl-8">
                    <div className="glass-card p-5 rounded-2xl border border-white/5 text-center min-w-[120px]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-1">Clubs Managed</span>
                        <span className="text-2xl font-black text-accent-cyan">{teamPeriods.length}</span>
                    </div>
                </div>
            </div>

            {/* Career / Managed Teams Section */}
            <div className="space-y-6">
                <h3 className="text-2xl font-headline font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-accent-cyan">history_edu</span>
                    Managerial History & Teams
                </h3>

                {teamPeriods.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {teamPeriods.map((period) => (
                            <div
                                key={period.id}
                                className="glass-card rounded-2xl p-6 border border-white/10 hover:border-accent-cyan/30 transition-all duration-300 flex flex-col justify-between space-y-4 group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-xl bg-white/5 p-2 border border-white/10 shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                        {period.team?.img_src ? (
                                            <img src={period.team.img_src} alt={period.team.name} className="w-full h-full object-contain filter drop-shadow" />
                                        ) : (
                                            <span className="material-symbols-outlined text-white/30 text-2xl">shield</span>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-white group-hover:text-accent-cyan transition-colors">
                                            {period.team?.name || `Team #${period.team_id}`}
                                        </h4>
                                        {period.team?.abbr && (
                                            <span className="text-xs font-semibold text-accent-cyan bg-accent-cyan/10 px-2 py-0.5 rounded border border-accent-cyan/20 inline-block mt-1">
                                                {period.team.abbr}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/50">
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm text-accent-cyan">date_range</span>
                                        {period.start_date ? new Date(period.start_date).getFullYear() : 'N/A'} — {period.end_date ? new Date(period.end_date).getFullYear() : 'Present'}
                                    </span>
                                    <span className="font-bold text-white/80">
                                        {!period.end_date ? 'Current Manager' : 'Completed'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-card rounded-2xl p-12 text-center border border-white/5 space-y-3 text-white/40">
                        <span className="material-symbols-outlined text-4xl text-white/20">shield</span>
                        <p className="text-sm">No managed team periods recorded for this manager.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
