import { useState } from "react";
import PageMeta from "@/components/common/PageMeta";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { PageHeader } from "@/components/ui/PageHeader";
import GlassLaunchButton from "@/components/ui/Buttons/GlassLaunchButton";
import ConfirmationDialog from "@/components/ui/Feedback/ConfirmationDialog";
import { GenericTable } from "@/components/ui/Tables/GenericTable";
import { ErrorScreen, LoadingScreen } from "@/components/ui/Feedback/StatusScreens";
import { Continent, Season } from "@/types";
import { showToast } from "@/utils/toast";
import AddContinentModal from "./components/AddContinentModal";
import { useDeleteContinentMutation, useGetContinentsQuery, useUpdateContinentMutation } from "@/store/apis/admin/core/continents.api";
import { getContinentTableActions, getContinentTableColumns } from "./components/ContinentsTableConfig";

export default function ContinentsPage() {
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

  const { data: response, isLoading, isError, refetch } = useGetContinentsQuery({
    page,
    per_page: pageSize,
    ...queryState.filters,
    sort_by: queryState.orderBy,
    sort_order: queryState.sortOrder,
    search: searchTerm,
  });

  const [deleteContinent, { isLoading: isDeleting }] = useDeleteContinentMutation();
  const [updateContinent] = useUpdateContinentMutation();

  const handleSaveRow = async (updatedContinent: Continent) => {
    try {
      await updateContinent({
        id: updatedContinent.id,
        body: {
          name: updatedContinent.name,
          code: updatedContinent.code,
        },
      }).unwrap();
      showToast.success('Continent Updated', 'Continent profile has been updated successfully.');
    } catch (error: any) {
      showToast.error('Update Failed', error.data?.message || 'A system error occurred.');
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await deleteContinent(selectedId).unwrap();
      showToast.success('Continent Deleted', 'Continent has been removed successfully.');
    } catch (error: any) {
      showToast.error('Deletion Failed', error.data?.message || 'System error occurred.');
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  if (isLoading) return <LoadingScreen message="Loading continents..." />;
  if (isError) return <ErrorScreen title="Failed to fetch continents" message="Please try again." />;

  const continentsData = response?.data;
  const continents: Continent[] = continentsData?.items || [];

  return (
    <>
      <PageMeta title="Continents" description="This is Continents Admin Dashboard page" />

      <div className="flex flex-col h-full overflow-hidden">
        <div>
          <Breadcrumbs items={[
            { label: 'Home', path: '/dashboard' },
            { label: 'Continents' }
          ]} />

          <div className="py-5 flex justify-between gap-6">
            <PageHeader
              chipText="Continents"
              titlePrefix="Continents"
              gradientText=" Management"
              description="Manage and track all continents and their activities."
            />
            <div className="flex justify-end items-center">
              <GlassLaunchButton
                title="Add New Continent"
                subtitle="Tap to add new continent"
                iconName="auto_awesome"
                variant="cyan"
                onClick={() => setIsAddModalOpen(true)}
              />
            </div>
          </div>
        </div>

        <GenericTable<Continent>
          items={continents}
          columns={getContinentTableColumns()}
          actions={getContinentTableActions((continent) => {
            setSelectedId(continent.id);
            setIsDeleteDialogOpen(true);
          })}
          searchOption={{
            placeholder: "Search by name...",
            value: searchTerm,
            onChange: (val) => { setSearchTerm(val); setPage(1); }
          }}
          paginationData={continentsData}
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

        <AddContinentModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => refetch()}
        />

        <ConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          title="Remove Continent"
          description="Are you sure you want to remove this continent?"
          confirmText="Delete"
          variant="danger"
          isLoading={isDeleting}
        />
      </div>
    </>
  );
}