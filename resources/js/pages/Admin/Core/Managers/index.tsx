import { useState } from "react";
import PageMeta from "@/components/common/PageMeta";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { PageHeader } from "@/components/ui/PageHeader";
import GlassLaunchButton from "@/components/ui/Buttons/GlassLaunchButton";
import ConfirmationDialog from "@/components/ui/Feedback/ConfirmationDialog";
import { GenericTable } from "@/components/ui/Tables/GenericTable";
import { ErrorScreen, LoadingScreen } from "@/components/ui/Feedback/StatusScreens";
import { Manager } from "@/types";
import { useDeleteManagerMutation, useGetManagersQuery, useUpdateManagerMutation } from "@/store/apis";
import { showToast } from "@/utils/toast";

import AddManagerModal from "./components/AddManagerModal";
import { getManagerTableColumns, getManagerTableActions } from "./components/ManagersTableConfig";

import { useNavigate } from "react-router-dom";

export default function ManagersPage() {
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

  const { data: response, isLoading, isError, refetch } = useGetManagersQuery({
    page,
    per_page: pageSize,
    ...queryState.filters,
    sort_by: queryState.orderBy,
    sort_order: queryState.sortOrder,
    search: searchTerm,
  });

  const [deleteManager, { isLoading: isDeleting }] = useDeleteManagerMutation();
  const [updateManager] = useUpdateManagerMutation();

  const handleSaveRow = async (updatedManager: Manager) => {
    const originalManager = managers.find((p) => p.id === updatedManager.id);

    if (!originalManager) return;
    const changedFields: Partial<Manager> = {};

    (Object.keys(updatedManager) as (keyof Manager)[]).forEach((key) => {
      if (key === 'id') return;

      if (updatedManager[key] !== originalManager[key]) {
        changedFields[key] = updatedManager[key] as any;
      }
    });

    if (Object.keys(changedFields).length === 0) {
      showToast.info('No Changes', 'No fields were modified.');
      return;
    }

    try {
      await updateManager({
        id: updatedManager.id,
        body: changedFields,
      }).unwrap();
      showToast.success('Manager Updated', 'Manager profile has been updated successfully.');
    } catch (error: any) {
      showToast.error('Update Failed', error.data?.message || 'A system error occurred.');
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await deleteManager(selectedId).unwrap();
      showToast.success('Manager Deleted', 'Manager has been removed successfully.');
    } catch (error: any) {
      showToast.error('Deletion Failed', error.data?.message || 'System error occurred.');
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  if (isLoading) return <LoadingScreen message="Loading managers..." />;
  if (isError) return <ErrorScreen title="Failed to fetch managers" message="Please try again." />;

  const managersData = response?.data;
  const managers: Manager[] = managersData?.items || [];

  return (
    <>
      <PageMeta title="Managers" description="This is Managers Admin Dashboard page" />

      <div className="flex flex-col h-full overflow-hidden">
        <div>
          <Breadcrumbs items={[
            { label: 'Home', path: '/dashboard/admin' },
            { label: 'Managers' }
          ]} />

          <div className="py-5 flex justify-between gap-6">
            <PageHeader
              chipText="Managers"
              titlePrefix="Managers"
              gradientText=" Management"
              description="Manage and track all managers and their activities."
            />
            <div className="flex justify-end items-center">
              <GlassLaunchButton
                title="Add New Manager"
                subtitle="Tap to add new manager"
                iconName="auto_awesome"
                variant="cyan"
                onClick={() => setIsAddModalOpen(true)}
              />
            </div>
          </div>
        </div>

        <GenericTable<Manager>
          items={managers}
          columns={getManagerTableColumns()}
          actions={getManagerTableActions(
            (manager) => navigate(`/dashboard/admin/managers/${manager.id}`),
            (manager) => {
              setSelectedId(manager.id);
              setIsDeleteDialogOpen(true);
            }
          )}
          searchOption={{
            placeholder: "Search by name...",
            value: searchTerm,
            onChange: (val) => { setSearchTerm(val); setPage(1); }
          }}
          paginationData={managersData}
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

        <AddManagerModal
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