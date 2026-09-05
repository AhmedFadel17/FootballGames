import { useState } from "react";
import PageMeta from "@/components/common/PageMeta";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { PageHeader } from "@/components/ui/PageHeader";
import GlassLaunchButton from "@/components/ui/Buttons/GlassLaunchButton";
import ConfirmationDialog from "@/components/ui/Feedback/ConfirmationDialog";
import { GenericTable } from "@/components/ui/Tables/GenericTable";
import { ErrorScreen, LoadingScreen } from "@/components/ui/Feedback/StatusScreens";
import { Pack } from "@/types";
import { useDeletePackMutation, useGetPacksQuery, useUpdatePackMutation } from "@/store/apis";
import { showToast } from "@/utils/toast";
import AddPackModal from "./components/AddPackModal";
import { FilterGroupConfig } from "@/components/ui/Grids/GenericDataGrid";
import { getPackTableActions, getPackTableColumns } from "./components/PacksTableConfig";

export default function PacksPage() {
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

  const { data: response, isLoading, isError, refetch } = useGetPacksQuery({
    page,
    per_page: pageSize,
    ...queryState.filters,
    sort_by: queryState.orderBy,
    sort_order: queryState.sortOrder,
    search: searchTerm,
  });

  const [deletePack, { isLoading: isDeleting }] = useDeletePackMutation();
  const [updatePack] = useUpdatePackMutation();

  const handleSaveRow = async (updatedPack: Pack) => {
    const originalPack = packs.find((p) => p.id === updatedPack.id);
    if (!originalPack) return;

    const changedFields: Partial<Pack> = {};
    (Object.keys(updatedPack) as (keyof Pack)[]).forEach((key) => {
      if (key === 'id') return;
      if (updatedPack[key] !== originalPack[key]) {
        changedFields[key] = updatedPack[key] as any;
      }
    });

    if (Object.keys(changedFields).length === 0) {
      showToast.info('No Changes', 'No fields were modified.');
      return;
    }

    try {
      await updatePack({
        id: updatedPack.id,
        body: changedFields as any,
      }).unwrap();
      showToast.success('Pack Updated', 'Pack profile has been updated successfully.');
    } catch (error: any) {
      showToast.error('Update Failed', error.data?.message || 'A system error occurred.');
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await deletePack(selectedId).unwrap();
      showToast.success('Pack Deleted', 'Pack has been removed successfully.');
    } catch (error: any) {
      showToast.error('Deletion Failed', error.data?.message || 'System error occurred.');
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const filterFields: FilterGroupConfig[] = [];

  if (isLoading) return <LoadingScreen message="Loading packs..." />;
  if (isError) return <ErrorScreen title="Failed to fetch packs" message="Please try again." />;

  const packsData = response?.data;
  const packs: Pack[] = packsData?.items || [];

  return (
    <>
      <PageMeta title="Packs" description="Packs Admin Dashboard page" />

      <div className="max-w-full flex flex-col h-full overflow-hidden">
        <div>
          <Breadcrumbs items={[
            { label: 'Home', path: '/dashboard' },
            { label: 'Packs' }
          ]} />

          <div className="py-5 flex justify-between gap-6">
            <PageHeader
              chipText="Packs"
              titlePrefix="Packs"
              gradientText=" Management"
              description="Manage and track all packs, pricing, limitations, and drop contents."
            />
            <div className="flex justify-end items-center">
              <GlassLaunchButton
                title="Add New Pack"
                subtitle="Tap to add new pack"
                iconName="inventory_2"
                variant="cyan"
                onClick={() => setIsAddModalOpen(true)}
              />
            </div>
          </div>
        </div>

        <GenericTable<Pack>
          items={packs}
          columns={getPackTableColumns()}
          actions={getPackTableActions(
            (pack) => {
              setSelectedId(pack.id);
              setIsDeleteDialogOpen(true);
            }
          )}
          searchOption={{
            placeholder: "Search by name...",
            value: searchTerm,
            onChange: (val) => { setSearchTerm(val); setPage(1); }
          }}
          paginationData={packsData}
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

        <AddPackModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => refetch()}
        />

        <ConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          title="Remove Pack"
          description="Are you sure you want to remove this pack? Existing user inventories will not be affected."
          confirmText="Delete"
          variant="danger"
          isLoading={isDeleting}
        />
      </div>
    </>
  );
}
