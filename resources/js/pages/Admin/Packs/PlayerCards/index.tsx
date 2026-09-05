import { useState } from "react";
import PageMeta from "@/components/common/PageMeta";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { PageHeader } from "@/components/ui/PageHeader";
import GlassLaunchButton from "@/components/ui/Buttons/GlassLaunchButton";
import ConfirmationDialog from "@/components/ui/Feedback/ConfirmationDialog";
import { GenericTable } from "@/components/ui/Tables/GenericTable";
import { ErrorScreen, LoadingScreen } from "@/components/ui/Feedback/StatusScreens";
import { PlayerCard } from "@/types";
import { useDeletePlayerCardMutation, useGetPlayerCardsQuery, useUpdatePlayerCardMutation } from "@/store/apis";
import { showToast } from "@/utils/toast";
import AddPlayerCardModal from "./components/AddPlayerCardModal";
import { FilterGroupConfig } from "@/components/ui/Grids/GenericDataGrid";
import { getPlayerCardTableActions, getPlayerCardTableColumns } from "./components/PlayerCardsTableConfig";

export default function PlayerCardsPage() {
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

  const { data: response, isLoading, isError, refetch } = useGetPlayerCardsQuery({
    page,
    per_page: pageSize,
    ...queryState.filters,
    sort_by: queryState.orderBy,
    sort_order: queryState.sortOrder,
    search: searchTerm,
  });

  const [deletePlayerCard, { isLoading: isDeleting }] = useDeletePlayerCardMutation();
  const [updatePlayerCard] = useUpdatePlayerCardMutation();

  const handleSaveRow = async (updatedCard: PlayerCard) => {
    const originalCard = cards.find((c) => c.id === updatedCard.id);
    if (!originalCard) return;

    const changedFields: Partial<PlayerCard> = {};
    (Object.keys(updatedCard) as (keyof PlayerCard)[]).forEach((key) => {
      if (key === 'id') return;
      if (updatedCard[key] !== originalCard[key]) {
        changedFields[key] = updatedCard[key] as any;
      }
    });

    if (Object.keys(changedFields).length === 0) {
      showToast.info('No Changes', 'No fields were modified.');
      return;
    }

    try {
      await updatePlayerCard({
        id: updatedCard.id,
        body: changedFields as any,
      }).unwrap();
      showToast.success('Card Updated', 'Player card has been updated successfully.');
    } catch (error: any) {
      showToast.error('Update Failed', error.data?.message || 'A system error occurred.');
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await deletePlayerCard(selectedId).unwrap();
      showToast.success('Card Deleted', 'Player card has been removed successfully.');
    } catch (error: any) {
      showToast.error('Deletion Failed', error.data?.message || 'System error occurred.');
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const filterFields: FilterGroupConfig[] = [];

  if (isLoading) return <LoadingScreen message="Loading player cards..." />;
  if (isError) return <ErrorScreen title="Failed to fetch player cards" message="Please try again." />;

  const cardsData = response?.data;
  const cards: PlayerCard[] = cardsData?.items || [];

  return (
    <>
      <PageMeta title="Player Cards" description="Player Cards Admin Dashboard page" />

      <div className="max-w-full flex flex-col h-full overflow-hidden">
        <div>
          <Breadcrumbs items={[
            { label: 'Home', path: '/dashboard' },
            { label: 'Player Cards' }
          ]} />

          <div className="py-5 flex justify-between gap-6">
            <PageHeader
              chipText="Player Cards"
              titlePrefix="Player Cards"
              gradientText=" Management"
              description="Manage collectible player cards, ratings, rarity tiers, and thematic associations."
            />
            <div className="flex justify-end items-center">
              <GlassLaunchButton
                title="Add New Card"
                subtitle="Tap to add player card"
                iconName="style"
                variant="cyan"
                onClick={() => setIsAddModalOpen(true)}
              />
            </div>
          </div>
        </div>

        <GenericTable<PlayerCard>
          items={cards}
          columns={getPlayerCardTableColumns()}
          actions={getPlayerCardTableActions(
            (card) => {
              setSelectedId(card.id);
              setIsDeleteDialogOpen(true);
            }
          )}
          searchOption={{
            placeholder: "Search by player name...",
            value: searchTerm,
            onChange: (val) => { setSearchTerm(val); setPage(1); }
          }}
          paginationData={cardsData}
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

        <AddPlayerCardModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => refetch()}
        />

        <ConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          title="Remove Player Card"
          description="Are you sure you want to remove this player card? Existing user cards referring to this card may be impacted."
          confirmText="Delete"
          variant="danger"
          isLoading={isDeleting}
        />
      </div>
    </>
  );
}
