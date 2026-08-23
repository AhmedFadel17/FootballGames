import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetPlayerByIdQuery } from '@/store/apis';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { ErrorScreen, LoadingScreen } from '@/components/ui/Feedback/StatusScreens';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { PlayerPosition, PlayerPreferredFoot } from '@/types/enums';
import PlayerStatsTable from './components/PlayerStatsTable';
import PlayerCareerSummaryTable from './components/PlayerCareerSummaryTable';

export default function PlayerDetails() {
    const { id: playerIdStr } = useParams<{ id: string }>();
    const playerId = parseInt(playerIdStr || '') || 0;
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<'career' | 'stats' | 'career_summary' | 'transfers'>('career');

    const { data: playerResponse, isLoading, isError } = useGetPlayerByIdQuery(playerId);
    const player = playerResponse?.data;

    if (isLoading) return <LoadingScreen message="Loading Player Profile..." accentColor="cyan" />;
    if (isError || !player) return <ErrorScreen title="Player Not Found" message="Unable to retrieve player details." />;

    const positionLabel = typeof player.position === 'number'
        ? PlayerPosition[player.position]
        : String(player.position || 'Unknown');

    const footLabel = typeof player.preferred_foot === 'number'
        ? PlayerPreferredFoot[player.preferred_foot]
        : String(player.preferred_foot || 'N/A');

    const teamPeriods = player.team_periods || [];
    const stats = player.career_season_stats || [];
    const transfers = player.transfers || [];
    const careerSummaries = player.career_summaries || [];

    return (
        <div className="space-y-8 pb-20 antialiased text-[#dae2fd]">
            {/* Breadcrumbs */}
            <Breadcrumbs items={[
                { label: 'Home', path: '/dashboard/admin' },
                { label: 'Players', path: '/dashboard/admin/players' },
                { label: player.name, path: `/dashboard/admin/players/${player.id}` },
            ]} />

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <PageHeader
                    chipText={`${player.country?.name || 'International'} • ${positionLabel}`}
                    titlePrefix={`${player.name} `}
                    gradientText=" Profile"
                    description="Detailed career overview, season performance statistics, and transfer history."
                />
                <Button
                    variant="outline"
                    onClick={() => navigate('/admin/players')}
                    className="shrink-0 flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back to Players
                </Button>
            </div>

            {/* Hero / Profile Spotlight Card */}
            <div className="glass-card rounded-3xl p-8 lg:p-10 border border-white/10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-br from-white/5 via-dashboard-bg/80 to-accent-cyan/5">
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent-cyan/10 blur-[100px] pointer-events-none" />

                <div className="flex flex-col md:flex-row items-center gap-6 relative z-10 w-full md:w-auto">
                    {/* Player Image Avatar */}
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-white/5 p-2 border border-white/10 shrink-0 flex items-center justify-center shadow-2xl relative overflow-hidden group">
                        {player.img_src ? (
                            <img
                                src={player.img_src}
                                alt={player.name}
                                className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                        ) : (
                            <span className="material-symbols-outlined text-5xl text-white/30">sports_soccer</span>
                        )}
                    </div>

                    <div className="text-center md:text-left space-y-2">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                            <span className="text-xs font-black uppercase tracking-wider text-accent-cyan bg-accent-cyan/10 px-3 py-1 rounded-full border border-accent-cyan/20">
                                {positionLabel}
                            </span>
                            {player.rating > 0 && (
                                <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                                    Rating {player.rating}
                                </span>
                            )}
                        </div>

                        <h1 className="text-3xl lg:text-4xl font-headline font-bold text-white tracking-tight">
                            {player.name}
                        </h1>
                        {player.fullname && player.fullname !== player.name && (
                            <p className="text-white/50 text-sm font-medium">{player.fullname}</p>
                        )}

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-white/60 pt-2">
                            {player.country && (
                                <div className="flex items-center gap-1.5">
                                    {player.country.img_src && (
                                        <img src={player.country.img_src} alt={player.country.name} className="w-4 h-3 object-cover rounded-sm" />
                                    )}
                                    <span>{player.country.name}</span>
                                </div>
                            )}
                            {player.date_of_birth && (
                                <div className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm text-accent-cyan">cake</span>
                                    <span>{new Date(player.date_of_birth).toLocaleDateString()}</span>
                                </div>
                            )}
                            {player.height_cm > 0 && (
                                <div className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm text-accent-cyan">height</span>
                                    <span>{player.height_cm} cm</span>
                                </div>
                            )}
                            {player.weight_kg > 0 && (
                                <div className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm text-accent-cyan">fitness_center</span>
                                    <span>{player.weight_kg} kg</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Key Metrics Column */}
                <div className="relative z-10 grid grid-cols-2 gap-4 w-full md:w-auto shrink-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-white/10 md:pl-8">
                    <div className="glass-card p-4 rounded-2xl border border-white/5 text-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-1">Market Value</span>
                        <span className="text-lg font-black text-amber-400">
                            {player.market_value ? `€${(player.market_value / 1000000).toFixed(1)}M` : 'N/A'}
                        </span>
                    </div>

                    <div className="glass-card p-4 rounded-2xl border border-white/5 text-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-1">Preferred Foot</span>
                        <span className="text-lg font-bold text-white capitalize">{footLabel}</span>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                <button
                    onClick={() => setActiveTab('career')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'career'
                        ? 'bg-accent-cyan text-[#0b0e17] shadow-lg shadow-accent-cyan/20'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5'
                        }`}
                >
                    <span className="material-symbols-outlined text-base">shield</span>
                    Career Clubs ({teamPeriods.length})
                </button>
                <button
                    onClick={() => setActiveTab('career_summary')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'career_summary'
                        ? 'bg-accent-cyan text-[#0b0e17] shadow-lg shadow-accent-cyan/20'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5'
                        }`}
                >
                    <span className="material-symbols-outlined text-base">query_stats</span>
                    Career Summary ({careerSummaries.length})
                </button>
                <button
                    onClick={() => setActiveTab('stats')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'stats'
                        ? 'bg-accent-cyan text-[#0b0e17] shadow-lg shadow-accent-cyan/20'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5'
                        }`}
                >
                    <span className="material-symbols-outlined text-base">query_stats</span>
                    Season Stats ({stats.length})
                </button>

                <button
                    onClick={() => setActiveTab('transfers')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'transfers'
                        ? 'bg-accent-cyan text-[#0b0e17] shadow-lg shadow-accent-cyan/20'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5'
                        }`}
                >
                    <span className="material-symbols-outlined text-base">swap_horiz</span>
                    Transfers ({transfers.length})
                </button>
            </div>

            {/* Tab 1: Career Team Periods */}
            {activeTab === 'career' && (
                <div className="space-y-4">
                    {teamPeriods.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {teamPeriods.map((period) => (
                                <div key={period.id} className="glass-card p-5 rounded-2xl border border-white/10 hover:border-accent-cyan/30 transition-all flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white/5 p-2 border border-white/10 shrink-0 flex items-center justify-center">
                                            {period.team?.img_src ? (
                                                <img src={period.team.img_src} alt={period.team.name} className="w-full h-full object-contain" />
                                            ) : (
                                                <span className="material-symbols-outlined text-white/30 text-xl">shield</span>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm">{period.team?.name || `Team #${period.team_id}`}</h4>
                                            <p className="text-xs text-white/50 mt-0.5">
                                                {period.start_date || 'Unknown'} — {period.is_current ? 'Present' : (period.end_date || 'N/A')}
                                            </p>
                                        </div>
                                    </div>
                                    {period.is_loan && (
                                        <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                                            Loan
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="glass-card rounded-2xl p-12 text-center border border-white/5 text-white/40">
                            No team career records recorded yet.
                        </div>
                    )}
                </div>
            )}
            {activeTab === 'career_summary' && (
                <div>
                    <PlayerCareerSummaryTable summaries={careerSummaries} />
                </div>
            )}

            {/* Tab 2: Season Stats */}
            {activeTab === 'stats' && (
                <div>
                    <PlayerStatsTable stats={stats} />
                </div>
            )}

            {/* Tab 3: Transfers */}
            {activeTab === 'transfers' && (
                <div>
                    {transfers.length > 0 ? (
                        <div className="glass-card rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-sm">
                                    <thead>
                                        <tr className="bg-white/5 text-[11px] font-black uppercase tracking-wider text-white/40 border-b border-white/10">
                                            <th className="py-4 px-6">Date</th>
                                            <th className="py-4 px-6">From Team</th>
                                            <th className="py-4 px-6">To Team</th>
                                            <th className="py-4 px-4 text-center">Type</th>
                                            <th className="py-4 px-6 text-right">Fee</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {transfers.map((tr) => (
                                            <tr key={tr.id} className="hover:bg-white/5 transition-colors">
                                                <td className="py-4 px-6 text-white/80">
                                                    {tr.transfer_date ? new Date(tr.transfer_date).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="py-4 px-6 font-semibold text-white">{tr.from_team?.name || 'Free Agent / Unknown'}</td>
                                                <td className="py-4 px-6 font-semibold text-accent-cyan">{tr.to_team?.name || 'Unknown'}</td>
                                                <td className="py-4 px-4 text-center">
                                                    <span className="text-xs font-bold text-white/70 bg-white/5 px-2.5 py-1 rounded-full border border-white/10 capitalize">
                                                        {String(tr.transfer_type || 'Transfer')}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-right font-bold text-amber-400">
                                                    {tr.fee_eur ? `€${tr.fee_eur.toLocaleString()}` : 'Free / Undisclosed'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="glass-card rounded-2xl p-12 text-center border border-white/5 text-white/40">
                            No transfer history recorded for this player yet.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
