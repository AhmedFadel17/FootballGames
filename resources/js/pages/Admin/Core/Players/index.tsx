import { useState } from "react";
import PageMeta from "@/components/common/PageMeta";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { PageHeader } from "@/components/ui/PageHeader";
import GlassLaunchButton from "@/components/ui/Buttons/GlassLaunchButton";
import ConfirmationDialog from "@/components/ui/Feedback/ConfirmationDialog";
import { GenericTable } from "@/components/ui/Tables/GenericTable";
import { ErrorScreen, LoadingScreen } from "@/components/ui/Feedback/StatusScreens";
import { Player, Season } from "@/types";
import { useDeletePlayerMutation, useGetCountriesLookupQuery, useGetPlayersQuery, useGetTeamsLookupQuery, useUpdatePlayerMutation } from "@/store/apis";
import { showToast } from "@/utils/toast";
import AddPlayerModal from "./components/AddPlayerModal";
import { getPlayerTableColumns, getPlayerTableActions } from "./components/PlayersTableConfig";

import { useNavigate } from "react-router-dom";
import { FilterGroupConfig } from "@/components/ui/Grids/GenericDataGrid";

export default function PlayersPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number>();

  const [queryState, setQueryState] = useState({
    filters: {} as Record<string, any>,
    orderBy: 'created_at' as string | undefined,
    sortOrder: 'desc' as 'asc' | 'desc' | undefined,
  });
  const [teamsSearch, setTeamsSearch] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const { data: teamssLookup, isLoading: isTeamsLoading } =
    useGetTeamsLookupQuery({
      query: teamsSearch,
      limit: 100,
    });
  const { data: countriesLookup, isLoading: isCountriesLoading } =
    useGetCountriesLookupQuery({
      query: countrySearch,
      limit: 100,
    });

  const { data: response, isLoading, isError, refetch } = useGetPlayersQuery({
    page,
    per_page: pageSize,
    ...queryState.filters,
    sort_by: queryState.orderBy,
    sort_order: queryState.sortOrder,
    search: searchTerm,
    current_team_id:
      queryState.filters.current_team_id !== "all"
        ? queryState.filters.current_team_id
        : undefined,
    country_id:
      queryState.filters.country_id !== "all"
        ? queryState.filters.country_id
        : undefined,
  });

  const [deletePlayer, { isLoading: isDeleting }] = useDeletePlayerMutation();
  const [updatePlayer] = useUpdatePlayerMutation();

  const handleSaveRow = async (updatedPlayer: Player) => {
    const originalPlayer = players.find((p) => p.id === updatedPlayer.id);

    if (!originalPlayer) return;
    const changedFields: Partial<Player> = {};

    (Object.keys(updatedPlayer) as (keyof Player)[]).forEach((key) => {
      if (key === 'id') return;

      if (updatedPlayer[key] !== originalPlayer[key]) {
        changedFields[key] = updatedPlayer[key] as any;
      }
    });

    if (Object.keys(changedFields).length === 0) {
      showToast.info('No Changes', 'No fields were modified.');
      return;
    }

    try {
      await updatePlayer({
        id: updatedPlayer.id,
        body: changedFields,
      }).unwrap();
      showToast.success('Player Updated', 'Player profile has been updated successfully.');
    } catch (error: any) {
      showToast.error('Update Failed', error.data?.message || 'A system error occurred.');
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await deletePlayer(selectedId).unwrap();
      showToast.success('Player Deleted', 'Player has been removed successfully.');
    } catch (error: any) {
      showToast.error('Deletion Failed', error.data?.message || 'System error occurred.');
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const filterFields: FilterGroupConfig[] = [
    {
      id: "current_team_id",
      label: "Team",
      type: "select",
      searchable: true,
      isLoading: isTeamsLoading,
      onSearch: (searchTerm) => {
        if (searchTerm.trim().length === 0 || searchTerm.trim().length >= 2) {
          setTeamsSearch(searchTerm.trim());
        }
      },
      options: [
        { label: "All Teams", value: "all" },
        ...(teamssLookup?.data || []),
      ],
    },
    {
      id: "country_id",
      label: "Country",
      type: "select",
      searchable: true,
      isLoading: isCountriesLoading,
      onSearch: (searchTerm) => {
        if (searchTerm.trim().length === 0 || searchTerm.trim().length >= 2) {
          setCountrySearch(searchTerm.trim());
        }
      },
      options: [
        { label: "All Countries", value: "all" },
        ...(countriesLookup?.data || []),
      ],
    },
  ];

  if (isLoading) return <LoadingScreen message="Loading players..." />;
  if (isError) return <ErrorScreen title="Failed to fetch players" message="Please try again." />;

  const playersData = response?.data;
  const players: Player[] = playersData?.items || [];

  return (
    <>
      <PageMeta title="Players" description="This is Players Admin Dashboard page" />

      <div className="max-w-full flex flex-col h-full overflow-hidden">
        <div>
          <Breadcrumbs items={[
            { label: 'Home', path: '/dashboard' },
            { label: 'Players' }
          ]} />

          <div className="py-5 flex justify-between gap-6">
            <PageHeader
              chipText="Players"
              titlePrefix="Players"
              gradientText=" Management"
              description="Manage and track all players and their activities."
            />
            <div className="flex justify-end items-center">
              <GlassLaunchButton
                title="Add New Player"
                subtitle="Tap to add new player"
                iconName="auto_awesome"
                variant="cyan"
                onClick={() => setIsAddModalOpen(true)}
              />
            </div>
          </div>
        </div>

        <GenericTable<Player>
          items={players}
          columns={getPlayerTableColumns()}
          actions={getPlayerTableActions(
            (player) => navigate(`/dashboard/admin/players/${player.id}`),
            (player) => {
              setSelectedId(player.id);
              setIsDeleteDialogOpen(true);
            }
          )}
          searchOption={{
            placeholder: "Search by name...",
            value: searchTerm,
            onChange: (val) => { setSearchTerm(val); setPage(1); }
          }}
          paginationData={playersData}
          onPageChange={setPage}
          onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
          filterOptions={{
            fields: filterFields,
            values: queryState.filters,
            onChange: (nextFilters) => {
              setQueryState(prev => ({ ...prev, filters: nextFilters }));
              setPage(1);
            }
          }}
          sortBy={queryState.orderBy}
          sortOrder={queryState.sortOrder}
          onSort={(orderBy, sortOrder) => setQueryState(prev => ({ ...prev, orderBy, sortOrder }))}
          onSaveRow={handleSaveRow}
          tableClassName="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
          responsiveStyle="scroll"
        />

        <AddPlayerModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => refetch()}
        />

        <ConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          title="Remove Player"
          description="Are you sure you want to remove this player?"
          confirmText="Delete"
          variant="danger"
          isLoading={isDeleting}
        />
      </div>
    </>
  );
}