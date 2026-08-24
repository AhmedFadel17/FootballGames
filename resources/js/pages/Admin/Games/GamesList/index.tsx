import { useState } from "react";
import PageMeta from "@/components/common/PageMeta";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { PageHeader } from "@/components/ui/PageHeader";
import GlassLaunchButton from "@/components/ui/Buttons/GlassLaunchButton";
import ConfirmationDialog from "@/components/ui/Feedback/ConfirmationDialog";
import { GenericTable } from "@/components/ui/Tables/GenericTable";
import { ErrorScreen, LoadingScreen } from "@/components/ui/Feedback/StatusScreens";
import { Game } from "@/types";
import { useDeleteGameMutation, useGetGamesQuery, useUpdateGameMutation } from "@/store/apis";
import { showToast } from "@/utils/toast";

import AddGameModal from "./components/AddGameModal";
import { getGamesTableColumns, getGamesTableActions } from "./components/GamesTableConfig";

import { useNavigate } from "react-router-dom";

export default function GamesPage() {
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

  const { data: response, isLoading, isError, refetch } = useGetGamesQuery({
    page,
    per_page: pageSize,
    ...queryState.filters,
    sort_by: queryState.orderBy,
    sort_order: queryState.sortOrder,
    search: searchTerm,
  });

  const [deleteGame, { isLoading: isDeleting }] = useDeleteGameMutation();
  const [updateGame] = useUpdateGameMutation();

  const handleSaveRow = async (updatedGame: Game) => {
    const originalGame = games.find((p) => p.id === updatedGame.id);

    if (!originalGame) return;
    const changedFields: Partial<Game> = {};

    (Object.keys(updatedGame) as (keyof Game)[]).forEach((key) => {
      if (key === 'id') return;

      if (updatedGame[key] !== originalGame[key]) {
        changedFields[key] = updatedGame[key] as any;
      }
    });

    if (Object.keys(changedFields).length === 0) {
      showToast.info('No Changes', 'No fields were modified.');
      return;
    }

    try {
      await updateGame({
        id: updatedGame.id,
        body: changedFields,
      }).unwrap();
      showToast.success('Game Updated', 'Game profile has been updated successfully.');
    } catch (error: any) {
      showToast.error('Update Failed', error.data?.message || 'A system error occurred.');
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await deleteGame(selectedId).unwrap();
      showToast.success('Game Deleted', 'Game has been removed successfully.');
    } catch (error: any) {
      showToast.error('Deletion Failed', error.data?.message || 'System error occurred.');
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  if (isLoading) return <LoadingScreen message="Loading games..." />;
  if (isError) return <ErrorScreen title="Failed to fetch games" message="Please try again." />;

  const gamesData = response?.data;
  const games: Game[] = gamesData?.items || [];

  return (
    <>
      <PageMeta title="Games" description="This is Games Admin Dashboard page" />

      <div className="flex flex-col h-full overflow-hidden">
        <div>
          <Breadcrumbs items={[
            { label: 'Home', path: '/dashboard/admin' },
            { label: 'Games' }
          ]} />

          <div className="py-5 flex justify-between gap-6">
            <PageHeader
              chipText="Games"
              titlePrefix="Games"
              gradientText=" Management"
              description="Manage and track all games and their activities."
            />
            <div className="flex justify-end items-center">
              <GlassLaunchButton
                title="Add New Game"
                subtitle="Tap to add new game"
                iconName="auto_awesome"
                variant="cyan"
                onClick={() => setIsAddModalOpen(true)}
              />
            </div>
          </div>
        </div>

        <GenericTable<Game>
          items={games}
          columns={getGamesTableColumns()}
          actions={getGamesTableActions(
            (game) => navigate(`/dashboard/admin/games/${game.id}`),
            (game) => {
              setSelectedId(game.id);
              setIsDeleteDialogOpen(true);
            }
          )}
          searchOption={{
            placeholder: "Search by name...",
            value: searchTerm,
            onChange: (val) => { setSearchTerm(val); setPage(1); }
          }}
          paginationData={gamesData}
          onPageChange={setPage}
          onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
          filterOptions={{
            fields: [],
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
          responsiveStyle="stacked"
        />

        <AddGameModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => refetch()}
        />

        <ConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          title="Remove Manager"
          description="Are you sure you want to remove this manager?"
          confirmText="Delete"
          variant="danger"
          isLoading={isDeleting}
        />
      </div>
    </>
  );
}