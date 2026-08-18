import { useState } from "react";
import PageMeta from "@/components/common/PageMeta";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { PageHeader } from "@/components/ui/PageHeader";
import GlassLaunchButton from "@/components/ui/Buttons/GlassLaunchButton";
import ConfirmationDialog from "@/components/ui/Feedback/ConfirmationDialog";
import { GenericTable } from "@/components/ui/Tables/GenericTable";
import { ErrorScreen, LoadingScreen } from "@/components/ui/Feedback/StatusScreens";
import { Season } from "@/types";
import { useDeleteSeasonMutation, useGetSeasonsQuery, useUpdateSeasonMutation } from "@/store/apis";
import { showToast } from "@/utils/toast";

import AddSeasonModal from "./components/AddSeasonModal";
import { getSeasonTableColumns, getSeasonTableActions } from "./components/seasonTableConfig";

export default function SeasonsPage() {
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

  const { data: response, isLoading, isError, refetch } = useGetSeasonsQuery({
    page,
    per_page: pageSize,
    ...queryState.filters,
    sort_by: queryState.orderBy,
    sort_order: queryState.sortOrder,
    search: searchTerm,
  });

  const [deleteSeason, { isLoading: isDeleting }] = useDeleteSeasonMutation();
  const [updateSeason] = useUpdateSeasonMutation();

  const handleSaveRow = async (updatedSeason: Season) => {
    const originalSeason = seasons.find((p) => p.id === updatedSeason.id);

    if (!originalSeason) return;
    const changedFields: Partial<Season> = {};

    (Object.keys(updatedSeason) as (keyof Season)[]).forEach((key) => {
      if (key === 'id') return;

      if (updatedSeason[key] !== originalSeason[key]) {
        changedFields[key] = updatedSeason[key] as any;
      }
    });

    if (Object.keys(changedFields).length === 0) {
      showToast.info('No Changes', 'No fields were modified.');
      return;
    }

    try {
      await updateSeason({
        id: updatedSeason.id,
        body: changedFields,
      }).unwrap();
      showToast.success('Season Updated', 'Season profile has been updated successfully.');
    } catch (error: any) {
      showToast.error('Update Failed', error.data?.message || 'A system error occurred.');
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await deleteSeason(selectedId).unwrap();
      showToast.success('Season Deleted', 'Season has been removed successfully.');
    } catch (error: any) {
      showToast.error('Deletion Failed', error.data?.message || 'System error occurred.');
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  if (isLoading) return <LoadingScreen message="Loading seasons..." />;
  if (isError) return <ErrorScreen title="Failed to fetch seasons" message="Please try again." />;

  const seasonsData = response?.data;
  const seasons: Season[] = seasonsData?.items || [];

  return (
    <>
      <PageMeta title="Seasons" description="This is Seasons Admin Dashboard page" />

      <div className="flex flex-col h-full overflow-hidden">
        <div>
          <Breadcrumbs items={[
            { label: 'Home', path: '/dashboard' },
            { label: 'Seasons' }
          ]} />

          <div className="py-5 flex justify-between gap-6">
            <PageHeader
              chipText="Seasons"
              titlePrefix="Seasons"
              gradientText=" Management"
              description="Manage and track all seasons and their activities."
            />
            <div className="flex justify-end items-center">
              <GlassLaunchButton
                title="Add New Season"
                subtitle="Tap to add new season"
                iconName="auto_awesome"
                variant="cyan"
                onClick={() => setIsAddModalOpen(true)}
              />
            </div>
          </div>
        </div>

        <GenericTable<Season>
          items={seasons}
          columns={getSeasonTableColumns()}
          actions={getSeasonTableActions((season) => {
            setSelectedId(season.id);
            setIsDeleteDialogOpen(true);
          })}
          searchOption={{
            placeholder: "Search by name...",
            value: searchTerm,
            onChange: (val) => { setSearchTerm(val); setPage(1); }
          }}
          paginationData={seasonsData}
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

        <AddSeasonModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => refetch()}
        />

        <ConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          title="Remove Season"
          description="Are you sure you want to remove this season?"
          confirmText="Delete"
          variant="danger"
          isLoading={isDeleting}
        />
      </div>
    </>
  );
}