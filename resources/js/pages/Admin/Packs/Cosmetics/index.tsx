import { useState } from "react";
import PageMeta from "@/components/common/PageMeta";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { PageHeader } from "@/components/ui/PageHeader";
import GlassLaunchButton from "@/components/ui/Buttons/GlassLaunchButton";
import ConfirmationDialog from "@/components/ui/Feedback/ConfirmationDialog";
import { GenericTable } from "@/components/ui/Tables/GenericTable";
import { ErrorScreen, LoadingScreen } from "@/components/ui/Feedback/StatusScreens";
import { Cosmetic } from "@/types";
import { useDeleteCosmeticMutation, useGetCosmeticsQuery, useUpdateCosmeticMutation } from "@/store/apis";
import { showToast } from "@/utils/toast";
import AddCosmeticModal from "./components/AddCosmeticModal";

import { useNavigate } from "react-router-dom";
import { FilterGroupConfig } from "@/components/ui/Grids/GenericDataGrid";
import { getCosmeticTableActions, getCosmeticTableColumns } from "./components/CosmeticsTableConfig";

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

  const { data: response, isLoading, isError, refetch } = useGetCosmeticsQuery({
    page,
    per_page: pageSize,
    ...queryState.filters,
    sort_by: queryState.orderBy,
    sort_order: queryState.sortOrder,
    search: searchTerm,
  });

  const [deleteCosmetic, { isLoading: isDeleting }] = useDeleteCosmeticMutation();
  const [updateCosmetic] = useUpdateCosmeticMutation();

  const handleSaveRow = async (updatedCosmetic: Cosmetic) => {
    const originalCosmetic = cosmetics.find((p) => p.id === updatedCosmetic.id);

    if (!originalCosmetic) return;
    const changedFields: Partial<Cosmetic> = {};

    (Object.keys(updatedCosmetic) as (keyof Cosmetic)[]).forEach((key) => {
      if (key === 'id') return;

      if (updatedCosmetic[key] !== originalCosmetic[key]) {
        changedFields[key] = updatedCosmetic[key] as any;
      }
    });

    if (Object.keys(changedFields).length === 0) {
      showToast.info('No Changes', 'No fields were modified.');
      return;
    }

    try {
      await updateCosmetic({
        id: updatedCosmetic.id,
        body: changedFields,
      }).unwrap();
      showToast.success('Cosmetic Updated', 'Cosmetic profile has been updated successfully.');
    } catch (error: any) {
      showToast.error('Update Failed', error.data?.message || 'A system error occurred.');
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await deleteCosmetic(selectedId).unwrap();
      showToast.success('Cosmetic Deleted', 'Cosmetic has been removed successfully.');
    } catch (error: any) {
      showToast.error('Deletion Failed', error.data?.message || 'System error occurred.');
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const filterFields: FilterGroupConfig[] = [];

  if (isLoading) return <LoadingScreen message="Loading cosmetics..." />;
  if (isError) return <ErrorScreen title="Failed to fetch cosmetics" message="Please try again." />;

  const cosmeticsData = response?.data;
  const cosmetics: Cosmetic[] = cosmeticsData?.items || [];

  return (
    <>
      <PageMeta title="Cosmetics" description="This is Cosmetics Admin Dashboard page" />

      <div className="max-w-full flex flex-col h-full overflow-hidden">
        <div>
          <Breadcrumbs items={[
            { label: 'Home', path: '/dashboard' },
            { label: 'Cosmetics' }
          ]} />

          <div className="py-5 flex justify-between gap-6">
            <PageHeader
              chipText="Cosmetics"
              titlePrefix="Cosmetics"
              gradientText=" Management"
              description="Manage and track all cosmetics and their activities."
            />
            <div className="flex justify-end items-center">
              <GlassLaunchButton
                title="Add New Cosmetic"
                subtitle="Tap to add new cosmetic"
                iconName="auto_awesome"
                variant="cyan"
                onClick={() => setIsAddModalOpen(true)}
              />
            </div>
          </div>
        </div>

        <GenericTable<Cosmetic>
          items={cosmetics}
          columns={getCosmeticTableColumns()}
          actions={getCosmeticTableActions(
            (cosmetic) => navigate(`/dashboard/admin/cosmetics/${cosmetic.id}`),
            (cosmetic) => {
              setSelectedId(cosmetic.id);
              setIsDeleteDialogOpen(true);
            }
          )}
          searchOption={{
            placeholder: "Search by name...",
            value: searchTerm,
            onChange: (val) => { setSearchTerm(val); setPage(1); }
          }}
          paginationData={cosmeticsData}
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

        <AddCosmeticModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => refetch()}
        />

        <ConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          title="Remove Cosmetic"
          description="Are you sure you want to remove this cosmetic?"
          confirmText="Delete"
          variant="danger"
          isLoading={isDeleting}
        />
      </div>
    </>
  );
}