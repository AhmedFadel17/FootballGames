import { useState } from "react";
import PageMeta from "@/components/common/PageMeta";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { PageHeader } from "@/components/ui/PageHeader";
import GlassLaunchButton from "@/components/ui/Buttons/GlassLaunchButton";
import ConfirmationDialog from "@/components/ui/Feedback/ConfirmationDialog";
import { GenericTable } from "@/components/ui/Tables/GenericTable";
import { ErrorScreen, LoadingScreen } from "@/components/ui/Feedback/StatusScreens";
import { Powerup } from "@/types";
import { useDeletePowerupMutation, useGetPowerupsQuery, useUpdatePowerupMutation } from "@/store/apis";
import { showToast } from "@/utils/toast";
import AddPowerupModal from "./components/AddPowerupModal";

import { useNavigate } from "react-router-dom";
import { FilterGroupConfig } from "@/components/ui/Grids/GenericDataGrid";
import { getPowerupTableActions, getPowerupTableColumns } from "./components/PowerupsTableConfig";

export default function CosmeticsPage() {
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

  const { data: response, isLoading, isError, refetch } = useGetPowerupsQuery({
    page,
    per_page: pageSize,
    ...queryState.filters,
    sort_by: queryState.orderBy,
    sort_order: queryState.sortOrder,
    search: searchTerm,
  });

  const [deletePowerup, { isLoading: isDeleting }] = useDeletePowerupMutation();
  const [updatePowerup] = useUpdatePowerupMutation();

  const handleSaveRow = async (updatedPowerup: Powerup) => {
    const originalPowerup = powerups.find((p) => p.id === updatedPowerup.id);

    if (!originalPowerup) return;
    const changedFields: Partial<Powerup> = {};

    (Object.keys(updatedPowerup) as (keyof Powerup)[]).forEach((key) => {
      if (key === 'id') return;

      if (updatedPowerup[key] !== originalPowerup[key]) {
        changedFields[key] = updatedPowerup[key] as any;
      }
    });

    if (Object.keys(changedFields).length === 0) {
      showToast.info('No Changes', 'No fields were modified.');
      return;
    }

    try {
      await updatePowerup({
        id: updatedPowerup.id,
        body: changedFields,
      }).unwrap();
      showToast.success('Powerup Updated', 'Powerup profile has been updated successfully.');
    } catch (error: any) {
      showToast.error('Update Failed', error.data?.message || 'A system error occurred.');
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await deletePowerup(selectedId).unwrap();
      showToast.success('Powerup Deleted', 'Powerup has been removed successfully.');
    } catch (error: any) {
      showToast.error('Deletion Failed', error.data?.message || 'System error occurred.');
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const filterFields: FilterGroupConfig[] = [];

  if (isLoading) return <LoadingScreen message="Loading powerups..." />;
  if (isError) return <ErrorScreen title="Failed to fetch powerups" message="Please try again." />;

  const powerupsData = response?.data;
  const powerups: Powerup[] = powerupsData?.items || [];

  return (
    <>
      <PageMeta title="Powerups" description="This is Powerups Admin Dashboard page" />

      <div className="max-w-full flex flex-col h-full overflow-hidden">
        <div>
          <Breadcrumbs items={[
            { label: 'Home', path: '/dashboard' },
            { label: 'Powerups' }
          ]} />

          <div className="py-5 flex justify-between gap-6">
            <PageHeader
              chipText="Powerups"
              titlePrefix="Powerups"
              gradientText=" Management"
              description="Manage and track all powerups and their activities."
            />
            <div className="flex justify-end items-center">
              <GlassLaunchButton
                title="Add New Powerup"
                subtitle="Tap to add new powerup"
                iconName="auto_awesome"
                variant="cyan"
                onClick={() => setIsAddModalOpen(true)}
              />
            </div>
          </div>
        </div>

        <GenericTable<Powerup>
          items={powerups}
          columns={getPowerupTableColumns()}
          actions={getPowerupTableActions(
            (powerup) => {
              setSelectedId(powerup.id);
              setIsDeleteDialogOpen(true);
            }
          )}
          searchOption={{
            placeholder: "Search by name...",
            value: searchTerm,
            onChange: (val) => { setSearchTerm(val); setPage(1); }
          }}
          paginationData={powerupsData}
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

        <AddPowerupModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => refetch()}
        />

        <ConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          title="Remove Powerup"
          description="Are you sure you want to remove this powerup?"
          confirmText="Delete"
          variant="danger"
          isLoading={isDeleting}
        />
      </div>
    </>
  );
}