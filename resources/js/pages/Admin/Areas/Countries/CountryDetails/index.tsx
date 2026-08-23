import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    useGetCountryByIdQuery,
    useGetCompetitionsQuery,
    useGetTeamsQuery,
    useGetPlayersQuery,
    useGetManagersQuery,
} from '@/store/apis';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { ErrorScreen, LoadingScreen } from '@/components/ui/Feedback/StatusScreens';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { GenericDataGrid } from '@/components/ui/Grids/GenericDataGrid';
import { Competition, Team, Player, Manager } from '@/types';
import TeamCard from '@/components/ui/Cards/TeamCard';
import CompetitionCard from '@/components/ui/Cards/CompetitionCard';
import ManagerCard from '@/components/ui/Cards/ManagerCard';
import PlayerCard from '@/components/ui/Cards/PlayerCard';
// import CompetitionCard from '@/pages/Admin/Core/Competitions/CompetitionDetails/components/CompetitionCard';

export default function CountryDetails() {
    const { id: countryIdStr } = useParams<{ id: string }>();
    const countryId = parseInt(countryIdStr || '') || 0;
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<'competitions' | 'teams' | 'players' | 'managers'>('competitions');

    // Tab Paginations & Searches
    const [compPage, setCompPage] = useState(1);
    const [teamsPage, setTeamsPage] = useState(1);
    const [playersPage, setPlayersPage] = useState(1);
    const [managersPage, setManagersPage] = useState(1);

    // Queries
    const { data: countryResponse, isLoading: isCountryLoading, isError } = useGetCountryByIdQuery(countryId);
    const country = countryResponse?.data;

    const { data: compsResponse, isLoading: isCompsLoading } = useGetCompetitionsQuery(
        { country_id: countryId, page: compPage, per_page: 8 },
        { skip: !country }
    );

    const { data: teamsResponse, isLoading: isTeamsLoading } = useGetTeamsQuery(
        { country_id: countryId, page: teamsPage, per_page: 8 },
        { skip: !country }
    );

    const { data: playersResponse, isLoading: isPlayersLoading } = useGetPlayersQuery(
        { country_id: countryId, page: playersPage, per_page: 8 },
        { skip: !country }
    );

    const { data: managersResponse, isLoading: isManagersLoading } = useGetManagersQuery(
        { country_id: countryId, page: managersPage, per_page: 8 },
        { skip: !country }
    );

    if (isCountryLoading) return <LoadingScreen message="Accessing Country Overview..." accentColor="cyan" />;
    if (isError || !country) return <ErrorScreen title="Country Not Found" message="Unable to retrieve country information." />;

    const compsData = compsResponse?.data;
    const comps: Competition[] = compsData?.items || [];

    const teamsData = teamsResponse?.data;
    const teams: Team[] = teamsData?.items || [];

    const playersData = playersResponse?.data;
    const players: Player[] = playersData?.items || [];

    const managersData = managersResponse?.data;
    const managers: Manager[] = managersData?.items || [];

    return (
        <div className="space-y-8 pb-20 antialiased text-[#dae2fd]">
            {/* Breadcrumbs */}
            <Breadcrumbs items={[
                { label: 'Home', path: '/dashboard/admin' },
                { label: 'Countries', path: '/dashboard/admin/countries' },
                { label: country.name, path: `/dashboard/admin/countries/${country.id}` },
            ]} />

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <PageHeader
                    chipText={`${country.continent?.name || 'Global Region'} • Code ${country.code}`}
                    titlePrefix={`${country.name} `}
                    gradientText=" Overview"
                    description="Explore all competitions, teams, registered players, and managers affiliated with this nation."
                />
                <Button
                    variant="outline"
                    onClick={() => navigate('/dashboard/admin/countries')}
                    className="shrink-0 flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back to Countries
                </Button>
            </div>

            {/* Hero / Country Spotlight */}
            <div className="glass-card rounded-3xl p-8 lg:p-10 border border-white/10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-br from-white/5 via-dashboard-bg/80 to-emerald-500/5">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] pointer-events-none" />

                <div className="flex flex-col md:flex-row items-center gap-6 relative z-10 text-center md:text-left">
                    {/* Flag Container */}
                    <div className="w-28 h-20 md:w-36 md:h-24 rounded-2xl bg-white/5 p-1 border border-white/10 shrink-0 flex items-center justify-center shadow-2xl overflow-hidden group">
                        <img
                            src={country.img_src}
                            alt={country.name}
                            className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                                {country.code}
                            </span>
                            {country.continent && (
                                <span className="text-xs font-bold text-accent-cyan bg-accent-cyan/10 px-3 py-1 rounded-full border border-accent-cyan/20">
                                    {country.continent.name}
                                </span>
                            )}
                        </div>

                        <h1 className="text-3xl lg:text-4xl font-headline font-bold text-white tracking-tight">
                            {country.name}
                        </h1>
                    </div>
                </div>

                {/* Popularity Badge */}
                <div className="relative z-10 flex items-center gap-4 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-white/10 md:pl-8">
                    <div className="glass-card p-5 rounded-2xl border border-white/5 text-center min-w-[130px]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-1">Popularity Rating</span>
                        <div className="flex items-center justify-center gap-1 text-amber-400 text-xl font-black">
                            <span>{country.popularity ?? 0}</span>
                            <span className="material-symbols-outlined text-lg">star</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-3 border-b border-white/10 pb-4">
                <button
                    onClick={() => setActiveTab('competitions')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'competitions'
                        ? 'bg-accent-cyan text-[#0b0e17] shadow-lg shadow-accent-cyan/20'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5'
                        }`}
                >
                    <span className="material-symbols-outlined text-base">emoji_events</span>
                    Competitions ({compsData?.totalCount ?? comps.length})
                </button>

                <button
                    onClick={() => setActiveTab('teams')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'teams'
                        ? 'bg-accent-cyan text-[#0b0e17] shadow-lg shadow-accent-cyan/20'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5'
                        }`}
                >
                    <span className="material-symbols-outlined text-base">shield</span>
                    Teams ({teamsData?.totalCount ?? teams.length})
                </button>

                <button
                    onClick={() => setActiveTab('players')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'players'
                        ? 'bg-accent-cyan text-[#0b0e17] shadow-lg shadow-accent-cyan/20'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5'
                        }`}
                >
                    <span className="material-symbols-outlined text-base">sports_soccer</span>
                    Players ({playersData?.totalCount ?? players.length})
                </button>

                <button
                    onClick={() => setActiveTab('managers')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'managers'
                        ? 'bg-accent-cyan text-[#0b0e17] shadow-lg shadow-accent-cyan/20'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5'
                        }`}
                >
                    <span className="material-symbols-outlined text-base">sports</span>
                    Managers ({managersData?.totalCount ?? managers.length})
                </button>
            </div>

            {/* Tab 1: Competitions */}
            {activeTab === 'competitions' && (
                <GenericDataGrid<Competition>
                    items={comps}
                    isLoading={isCompsLoading}
                    loadingMessage="Loading competitions..."
                    emptyStateMessage="No competitions registered for this country."
                    renderItem={(comp) => (
                        <CompetitionCard
                            key={comp.id}
                            competition={comp}
                            onViewDetails={(id) => navigate(`/dashboard/admin/competitions/${id}`)}
                            onEdit={() => { }}
                            onDelete={() => { }}
                        />
                    )}
                    paginationData={compsData}
                    onPageChange={setCompPage}
                    cols={{ sm: 1, md: 2, lg: 4 }}
                />
            )}

            {/* Tab 2: Teams */}
            {activeTab === 'teams' && (
                <GenericDataGrid<Team>
                    items={teams}
                    isLoading={isTeamsLoading}
                    loadingMessage="Loading teams..."
                    emptyStateMessage="No teams registered for this country."
                    renderItem={(team) => (
                        <TeamCard
                            key={team.id}
                            team={team}
                            onEdit={() => { }}
                            onDelete={() => { }}
                        />
                    )}
                    paginationData={teamsData}
                    onPageChange={setTeamsPage}
                    cols={{ sm: 1, md: 2, lg: 4 }}
                />
            )}

            {/* Tab 3: Players */}
            {activeTab === 'players' && (
                <GenericDataGrid<Player>
                    items={players}
                    isLoading={isPlayersLoading}
                    loadingMessage="Loading players..."
                    emptyStateMessage="No players registered for this country."
                    renderItem={(player) => (
                        <PlayerCard
                            key={player.id}
                            player={player}
                            onEdit={() => { }}
                            onDelete={() => { }}
                        />
                    )}
                    paginationData={playersData}
                    onPageChange={setPlayersPage}
                    cols={{ sm: 1, md: 2, lg: 4 }}
                />
            )}

            {/* Tab 4: Managers */}
            {activeTab === 'managers' && (
                <GenericDataGrid<Manager>
                    items={managers}
                    isLoading={isManagersLoading}
                    loadingMessage="Loading managers..."
                    emptyStateMessage="No managers registered for this country."
                    renderItem={(manager) => (
                        <ManagerCard
                            key={manager.id}
                            manager={manager}
                            onEdit={() => { }}
                            onDelete={() => { }}
                        />
                    )}
                    paginationData={managersData}
                    onPageChange={setManagersPage}
                    cols={{ sm: 1, md: 2, lg: 4 }}
                />
            )}
        </div>
    );
}
