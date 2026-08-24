import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetCompetitionSeasonByIdQuery, useGetCompetitionSeasonStandingsQuery } from '@/store/apis';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { ErrorScreen, LoadingScreen } from '@/components/ui/Feedback/StatusScreens';
import { PageHeader } from '@/components/ui/PageHeader';
import Button from '@/components/ui/Buttons/Button';
import EditWinnerModal from '../CompetitionDetails/components/EditWinnerModal';

export default function CompetitionSeasonDetails() {
    const { id: seasonIdStr } = useParams<{ id: string }>();
    const seasonId = parseInt(seasonIdStr || '') || 0;
    const navigate = useNavigate();

    const [isEditWinnerOpen, setIsEditWinnerOpen] = useState(false);

    const { data: seasonResponse, isLoading, isError } = useGetCompetitionSeasonByIdQuery(seasonId);
    const { data: standingsResponse, isLoading: isStandingsLoading } = useGetCompetitionSeasonStandingsQuery(seasonId);

    const competitionSeason = seasonResponse?.data;
    const standings = standingsResponse?.data || [];

    if (isLoading || isStandingsLoading) return <LoadingScreen message="Loading Competition Season details..." accentColor="purple" />;
    if (isError || !competitionSeason) return <ErrorScreen title="Season Not Found" message="Unable to retrieve season details." />;

    const { competition, season, winner_team } = competitionSeason;

    return (
        <div className="space-y-10 pb-20 antialiased text-[#dae2fd]">
            {/* Breadcrumbs */}
            <Breadcrumbs items={[
                { label: 'Home', path: '/dashboard/admin' },
                { label: 'Competitions', path: '/dashboard/admin/competitions' },
                { label: competition?.name || 'Competition', path: `/dashboard/admin/competitions/${competition?.id}` },
                { label: season?.name || `Season #${seasonId}` }
            ]} />

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <PageHeader
                    chipText={`${competition?.country?.name || 'Global'} • ${season?.name || 'Season Details'}`}
                    titlePrefix={`${competition?.name || 'Competition'} `}
                    gradientText={`${season?.name || ''}`}
                    description="Comprehensive breakdown of season winner, participating teams, and standings."
                />
                <Button
                    variant="outline"
                    onClick={() => navigate(`/dashboard/admin/competitions/${competition?.id}`)}
                    className="shrink-0 flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back to Competition
                </Button>
            </div>

            {/* Hero / Header Spotlight */}
            <div className="glass-card rounded-3xl p-8 lg:p-10 border border-white/10 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-gradient-to-br from-white/5 via-dashboard-bg/80 to-accent-purple/5">
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent-cyan/10 blur-[100px] pointer-events-none"></div>

                <div className="relative z-10 space-y-4 max-w-2xl">
                    <div className="flex items-center gap-3">
                        {competition?.img_src && (
                            <img src={competition.img_src} alt={competition.name} className="w-10 h-10 object-contain filter drop-shadow" />
                        )}
                        <span className="text-sm font-bold text-accent-cyan tracking-wider uppercase">
                            {competition?.name}
                        </span>
                    </div>

                    <h1 className="text-4xl lg:text-5xl font-headline font-bold text-white tracking-tight">
                        {season?.name || `Season ${seasonId}`}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-white/60">
                        {season?.start_year && (
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-accent-cyan text-base">calendar_today</span>
                                <span>Years: {season.start_year} - {season.end_year}</span>
                            </div>
                        )}
                        {competition?.country && (
                            <div className="flex items-center gap-2">
                                {competition.country.img_src && (
                                    <img src={competition.country.img_src} alt={competition.country.name} className="w-4 h-3 object-cover rounded-sm" />
                                )}
                                <span>{competition.country.name}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Edit Winner Action */}
                <div className="relative z-10 shrink-0">
                    <Button
                        variant="secondary"
                        onClick={() => setIsEditWinnerOpen(true)}
                        className="flex items-center gap-2 shadow-lg shadow-accent-cyan/10"
                    >
                        <span className="material-symbols-outlined text-sm">emoji_events</span>
                        {winner_team ? 'Change Winner' : 'Assign Winner Team'}
                    </Button>
                </div>
            </div>

            {/* Winner Team Spotlight Card */}
            <div className="relative">
                <div className={`glass-card rounded-3xl p-8 border relative overflow-hidden transition-all duration-500 ${winner_team
                    ? 'border-amber-400/30 bg-gradient-to-r from-amber-500/10 via-white/5 to-amber-500/5'
                    : 'border-white/10 bg-white/5'
                    }`}>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                        <div className="flex items-center gap-6">
                            {/* Trophy / Winner Badge */}
                            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center p-3 border shadow-xl ${winner_team
                                ? 'bg-amber-400/10 border-amber-400/30 text-amber-400'
                                : 'bg-white/5 border-white/10 text-white/30'
                                }`}>
                                {winner_team?.img_src ? (
                                    <img src={winner_team.img_src} alt={winner_team.name} className="w-full h-full object-contain filter drop-shadow" />
                                ) : (
                                    <span className="material-symbols-outlined text-4xl">emoji_events</span>
                                )}
                            </div>

                            <div>
                                <span className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1 mb-1">
                                    <span className="material-symbols-outlined text-sm">workspace_premium</span>
                                    Season Champion / Winner
                                </span>
                                <h2 className="text-2xl md:text-3xl font-headline font-bold text-white">
                                    {winner_team ? winner_team.name : 'No Winner Assigned Yet'}
                                </h2>
                                {winner_team?.abbr && (
                                    <span className="text-xs font-bold text-accent-cyan bg-accent-cyan/10 px-2 py-0.5 rounded border border-accent-cyan/20 inline-block mt-2">
                                        {winner_team.abbr}
                                    </span>
                                )}
                            </div>
                        </div>

                        {!winner_team && (
                            <Button variant="outline" onClick={() => setIsEditWinnerOpen(true)}>
                                Select Winner Team
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Standings Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-headline font-bold text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-accent-cyan">format_list_numbered</span>
                        League Standings
                    </h3>
                    {standings && standings.length > 0 && (
                        <span className="text-xs font-semibold text-white/50 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                            {standings.length} Teams
                        </span>
                    )}
                </div>

                {standings && standings.length > 0 ? (
                    <div className="glass-card rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/5 text-[11px] font-black uppercase tracking-wider text-white/40 border-b border-white/10">
                                        <th className="py-4 px-4 text-center w-12">#</th>
                                        <th className="py-4 px-6">Team</th>
                                        <th className="py-4 px-3 text-center">P</th>
                                        <th className="py-4 px-3 text-center">W</th>
                                        <th className="py-4 px-3 text-center">D</th>
                                        <th className="py-4 px-3 text-center">L</th>
                                        <th className="py-4 px-3 text-center">GF</th>
                                        <th className="py-4 px-3 text-center">GA</th>
                                        <th className="py-4 px-3 text-center">GD</th>
                                        <th className="py-4 px-6 text-center font-bold text-accent-cyan">PTS</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-sm">
                                    {standings.map((row) => {
                                        const isWinner = row.position === 1;
                                        const isTop4 = row.position <= 4;
                                        return (
                                            <tr
                                                key={row.id}
                                                className={`hover:bg-white/5 transition-colors ${isWinner ? 'bg-amber-400/5' : ''
                                                    }`}
                                            >
                                                {/* Rank Position */}
                                                <td className="py-4 px-4 text-center">
                                                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${isWinner
                                                        ? 'bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-400/20'
                                                        : isTop4
                                                            ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30'
                                                            : 'bg-white/5 text-white/60'
                                                        }`}>
                                                        {row.position}
                                                    </span>
                                                </td>

                                                {/* Team Info */}
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-white/5 p-1 border border-white/10 shrink-0 flex items-center justify-center">
                                                            {row.team?.img_src ? (
                                                                <img src={row.team.img_src} alt={row.team.name} className="w-full h-full object-contain" />
                                                            ) : (
                                                                <span className="material-symbols-outlined text-xs text-white/30">shield</span>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <span className="font-bold text-white block">{row.team?.name || `Team #${row.team_id}`}</span>
                                                            {row.team?.abbr && <span className="text-[10px] text-white/40">{row.team.abbr}</span>}
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="py-4 px-3 text-center text-white/80 font-medium">{row.played}</td>
                                                <td className="py-4 px-3 text-center text-emerald-400 font-semibold">{row.won}</td>
                                                <td className="py-4 px-3 text-center text-amber-300 font-medium">{row.drawn}</td>
                                                <td className="py-4 px-3 text-center text-rose-400 font-medium">{row.lost}</td>
                                                <td className="py-4 px-3 text-center text-white/60 text-xs">{row.goals_for}</td>
                                                <td className="py-4 px-3 text-center text-white/60 text-xs">{row.goals_against}</td>
                                                <td className="py-4 px-3 text-center text-white/80 text-xs font-semibold">
                                                    {row.goal_difference > 0 ? `+${row.goal_difference}` : row.goal_difference}
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <span className="text-base font-black text-accent-cyan">{row.points}</span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="glass-card rounded-2xl p-12 text-center border border-white/5 space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 mx-auto flex items-center justify-center text-white/30 border border-white/10">
                            <span className="material-symbols-outlined text-3xl">table_chart</span>
                        </div>
                        <h4 className="text-lg font-bold text-white">No Standings Table Available</h4>
                        <p className="text-white/40 text-sm max-w-md mx-auto">
                            The standings table for this season has not been created or populated yet.
                        </p>
                    </div>
                )}
            </div>

            {/* Edit Winner Modal */}
            <EditWinnerModal
                isOpen={isEditWinnerOpen}
                onClose={() => setIsEditWinnerOpen(false)}
                competitionSeason={competitionSeason}
                countryId={competition?.country_id}
            />
        </div>
    );
}
