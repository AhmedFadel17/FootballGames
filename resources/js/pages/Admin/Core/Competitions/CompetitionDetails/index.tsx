import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    useGetCompetitionByIdQuery,
    useGetCompetitionSeasonsQuery,
    useDeleteCompetitionSeasonMutation,
    useGetCompetitionTeamsQuery,
} from '@/store/apis';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { ErrorScreen, LoadingScreen } from '@/components/ui/Feedback/StatusScreens';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { CompetitionSeason, CompetitionType, Team } from '@/types';
import { GenericDataGrid } from '@/components/ui/Grids/GenericDataGrid';
import ConfirmationDialog from '@/components/ui/Feedback/ConfirmationDialog';
import { showToast } from '@/utils/toast';

import CompetitionHero from './components/CompetitionHero';
import CompetitionSeasonCard from './components/CompetitionSeasonCard';
import CompetitionTeamCard from './components/CompetitionTeamCard';
import EditWinnerModal from './components/EditWinnerModal';
import CreateCompetitionSeasonModal from './components/CreateCompetitionSeasonModal';

export default function CompetitionDetails() {
    const { id: competitionIdStr } = useParams<{ id: string }>();
    const competitionId = parseInt(competitionIdStr || '') || 0;
    const navigate = useNavigate();

    // Active Tab state ('seasons' | 'teams')
    const [activeTab, setActiveTab] = useState<'seasons' | 'teams'>('seasons');

    // Seasons pagination & sort
    const [seasonsPage, setSeasonsPage] = useState(1);
    const [seasonsPageSize, setSeasonsPageSize] = useState(8);
    const [seasonsQueryState, setSeasonsQueryState] = useState({
        orderBy: 'season.start_year',
        sortOrder: 'desc' as 'asc' | 'desc'
    });

    // Teams pagination & search
    const [teamsPage, setTeamsPage] = useState(1);
    const [teamsPageSize, setTeamsPageSize] = useState(8);
    const [teamsSearch, setTeamsSearch] = useState('');

    // Modal & Action states
    const [isCreateSeasonOpen, setIsCreateSeasonOpen] = useState(false);
    const [selectedSeasonForEdit, setSelectedSeasonForEdit] = useState<CompetitionSeason | null>(null);
    const [isEditWinnerOpen, setIsEditWinnerOpen] = useState(false);
    const [selectedSeasonToDelete, setSelectedSeasonToDelete] = useState<number | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Queries
    const { data: competitionResponse, isLoading: isCompetitionLoading } = useGetCompetitionByIdQuery(competitionId);

    const { data: seasonsResponse, isLoading: isSeasonsLoading, error: seasonsError } = useGetCompetitionSeasonsQuery({
        competition_id: competitionId,
        page: seasonsPage,
        per_page: seasonsPageSize,
        sort_by: seasonsQueryState.orderBy,
        sort_order: seasonsQueryState.sortOrder
    });

    const competition = competitionResponse?.data;

    const { data: teamsResponse, isLoading: isTeamsLoading, error: teamsError } = useGetCompetitionTeamsQuery({
        id: competitionId,
        page: teamsPage,
        per_page: teamsPageSize,
        searchQuery: teamsSearch,
    }, { skip: !competition });

    const [deleteCompetitionSeason, { isLoading: isDeletingSeason }] = useDeleteCompetitionSeasonMutation();

    const seasonsData = seasonsResponse?.data;
    const seasons: CompetitionSeason[] = seasonsData?.items || [];

    const teamsData = teamsResponse?.data;
    const teams: Team[] = teamsData?.items || [];

    const handleDeleteSeason = async () => {
        if (!selectedSeasonToDelete) return;

        try {
            await deleteCompetitionSeason(selectedSeasonToDelete).unwrap();
            showToast.success('Season Deleted', 'Competition season removed successfully.');
        } catch (error: any) {
            showToast.error('Delete Failed', error.data?.message || 'Failed to remove competition season.');
        } finally {
            setIsDeleteDialogOpen(false);
            setSelectedSeasonToDelete(null);
        }
    };

    const seasonSortConfig = {
        currentOrderBy: seasonsQueryState.orderBy,
        currentSortOrder: seasonsQueryState.sortOrder,
        options: [
            { label: 'Newest First', orderBy: 'season.start_year', sortOrder: 'desc' as const },
            { label: 'Oldest First', orderBy: 'season.start_year', sortOrder: 'asc' as const },
        ],
        onChange: (newOrderBy: string, newSortOrder: 'asc' | 'desc') => {
            setSeasonsQueryState({ orderBy: newOrderBy, sortOrder: newSortOrder });
            setSeasonsPage(1);
        }
    };

    if (isCompetitionLoading) return <LoadingScreen message="Accessing Competition Details..." accentColor="purple" />;
    if (!competition) return <ErrorScreen title="Competition Not Found" message="Unable to retrieve competition details." />;

    const typeLabel = typeof competition.type === 'number'
        ? CompetitionType[competition.type]
        : String(competition.type || '');

    return (
        <div className="space-y-8 pb-20 antialiased text-[#dae2fd]">
            {/* Breadcrumbs */}
            <Breadcrumbs items={[
                { label: 'Home', path: '/dashboard' },
                { label: 'Competitions', path: '/admin/competitions' },
                { label: competition.name, path: `/admin/competitions/${competition.id}` },
            ]} />

            {/* Page Header */}
            <div>
                <PageHeader
                    chipText={`${competition.country?.name || 'International'} • ${typeLabel.replace(/_/g, ' ')}`}
                    titlePrefix={`${competition.name}`}
                    gradientText=" Overview"
                    description="Detailed view of competition info, associated seasons, and participating teams."
                />
            </div>

            {/* Competition Hero Section */}
            <CompetitionHero competition={competition} />

            {/* Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex gap-4">
                    <button
                        onClick={() => setActiveTab('seasons')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'seasons'
                            ? 'bg-accent-cyan text-[#0b0e17] shadow-lg shadow-accent-cyan/20'
                            : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5'
                            }`}
                    >
                        <span className="material-symbols-outlined text-base">calendar_month</span>
                        Seasons ({seasonsData?.totalCount ?? seasons.length})
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
                </div>

                <Button
                    variant="primary"
                    onClick={() => setIsCreateSeasonOpen(true)}
                    className="flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-sm">add</span>
                    Add Season
                </Button>
            </div>

            {/* Tab 1: Seasons */}
            {activeTab === 'seasons' && (
                <div>
                    <GenericDataGrid<CompetitionSeason>
                        items={seasons}
                        isLoading={isSeasonsLoading}
                        error={seasonsError}
                        loadingMessage="Loading seasons..."
                        errorTitle="Network Error"
                        errorMessage="Failed to fetch seasons. Please try again."
                        emptyStateMessage="No seasons found for this competition."
                        renderItem={(season) => (
                            <CompetitionSeasonCard
                                key={season.id}
                                competitionSeason={season}
                                onViewDetails={(id) => navigate(`/admin/competition-seasons/${id}`)}
                                onEditWinner={(seasonItem) => {
                                    setSelectedSeasonForEdit(seasonItem);
                                    setIsEditWinnerOpen(true);
                                }}
                                onDelete={(id) => {
                                    setSelectedSeasonToDelete(id);
                                    setIsDeleteDialogOpen(true);
                                }}
                            />
                        )}
                        sortOption={seasonSortConfig}
                        paginationData={seasonsData}
                        onPageChange={(p) => setSeasonsPage(p)}
                        onPageSizeChange={(size) => { setSeasonsPageSize(size); setSeasonsPage(1); }}
                        cols={{ sm: 1, md: 2, lg: 4 }}
                    />
                </div>
            )}

            {/* Tab 2: Teams */}
            {activeTab === 'teams' && (
                <div className="space-y-6">
                    {/* Teams Search Bar */}
                    <div className="flex items-center gap-4 max-w-md">
                        <div className="relative flex-1">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">search</span>
                            <input
                                type="text"
                                placeholder="Search teams..."
                                value={teamsSearch}
                                onChange={(e) => { setTeamsSearch(e.target.value); setTeamsPage(1); }}
                                className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-accent-cyan/50 transition-colors"
                            />
                        </div>
                    </div>

                    <GenericDataGrid<Team>
                        items={teams}
                        isLoading={isTeamsLoading}
                        error={teamsError}
                        loadingMessage="Loading teams..."
                        errorTitle="Network Error"
                        errorMessage="Failed to fetch teams. Please try again."
                        emptyStateMessage="No teams found matching search criteria."
                        renderItem={(team) => (
                            <CompetitionTeamCard key={team.id} team={team} />
                        )}
                        paginationData={teamsData}
                        onPageChange={(p) => setTeamsPage(p)}
                        onPageSizeChange={(size) => { setTeamsPageSize(size); setTeamsPage(1); }}
                        cols={{ sm: 1, md: 2, lg: 4 }}
                    />
                </div>
            )}

            {/* Create Season Modal */}
            <CreateCompetitionSeasonModal
                isOpen={isCreateSeasonOpen}
                onClose={() => setIsCreateSeasonOpen(false)}
                competitionId={competitionId}
                competitionName={competition.name}
            />

            {/* Edit Winner Modal */}
            <EditWinnerModal
                isOpen={isEditWinnerOpen}
                onClose={() => {
                    setIsEditWinnerOpen(false);
                    setSelectedSeasonForEdit(null);
                }}
                competitionSeason={selectedSeasonForEdit}
                countryId={competition.country_id}
            />

            {/* Delete Season Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => {
                    setIsDeleteDialogOpen(false);
                    setSelectedSeasonToDelete(null);
                }}
                onConfirm={handleDeleteSeason}
                title="Delete Competition Season"
                description="Are you sure you want to delete this season record? This action cannot be undone."
                confirmText="Delete Season"
                variant="danger"
                isLoading={isDeletingSeason}
            />
        </div>
    );
}
