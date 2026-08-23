import { useState } from "react";
import PageMeta from "@/components/common/PageMeta";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { PageHeader } from "@/components/ui/PageHeader";
import GlassLaunchButton from "@/components/ui/Buttons/GlassLaunchButton";
import ConfirmationDialog from "@/components/ui/Feedback/ConfirmationDialog";
import { GenericTable } from "@/components/ui/Tables/GenericTable";
import { ErrorScreen, LoadingScreen } from "@/components/ui/Feedback/StatusScreens";
import { Competition } from "@/types";
import { useDeleteCompetitionMutation, useGetCompetitionsQuery, useUpdateCompetitionMutation } from "@/store/apis";
import { showToast } from "@/utils/toast";

import AddCompetitionModal from "./components/AddCompetitionModal";
import { getCompetitionTableColumns, getCompetitionTableActions } from "./components/CompetitionsTableConfig";

export default function CompetitionsPage() {
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

  const { data: response, isLoading, isError, refetch } = useGetCompetitionsQuery({
    page,
    per_page: pageSize,
    ...queryState.filters,
    sort_by: queryState.orderBy,
    sort_order: queryState.sortOrder,
    search: searchTerm,
  });

  const [deleteCompetition, { isLoading: isDeleting }] = useDeleteCompetitionMutation();
  const [updateCompetition] = useUpdateCompetitionMutation();

  const handleSaveRow = async (updatedCompetition: Competition) => {
    const originalCompetition = competitions.find((p) => p.id === updatedCompetition.id);

    if (!originalCompetition) return;
    const changedFields: Partial<Competition> = {};

    (Object.keys(updatedCompetition) as (keyof Competition)[]).forEach((key) => {
      if (key === 'id') return;

      if (updatedCompetition[key] !== originalCompetition[key]) {
        changedFields[key] = updatedCompetition[key] as any;
      }
    });

    if (Object.keys(changedFields).length === 0) {
      showToast.info('No Changes', 'No fields were modified.');
      return;
    }

    try {
      await updateCompetition({
        id: updatedCompetition.id,
        body: changedFields,
      }).unwrap();
      showToast.success('Competition Updated', 'Competition profile has been updated successfully.');
    } catch (error: any) {
      showToast.error('Update Failed', error.data?.message || 'A system error occurred.');
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await deleteCompetition(selectedId).unwrap();
      showToast.success('Competition Deleted', 'Competition has been removed successfully.');
    } catch (error: any) {
      showToast.error('Deletion Failed', error.data?.message || 'System error occurred.');
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  if (isLoading) return <LoadingScreen message="Loading competitions..." />;
  if (isError) return <ErrorScreen title="Failed to fetch competitions" message="Please try again." />;

  const competitionsData = response?.data;
  const competitions: Competition[] = competitionsData?.items || [];

  return (
    <>
      <PageMeta title="Competitions" description="This is Competitions Admin Dashboard page" />

      <div className="flex flex-col h-full overflow-hidden">
        <div>
          <Breadcrumbs items={[
            { label: 'Home', path: '/dashboard/admin' },
            { label: 'Competitions' }
          ]} />

          <div className="py-5 flex justify-between gap-6">
            <PageHeader
              chipText="Competitions"
              titlePrefix="Competitions"
              gradientText=" Management"
              description="Manage and track all competitions and their activities."
            />
            <div className="flex justify-end items-center">
              <GlassLaunchButton
                title="Add New Competition"
                subtitle="Tap to add new competition"
                iconName="auto_awesome"
                variant="cyan"
                onClick={() => setIsAddModalOpen(true)}
              />
            </div>
          </div>
        </div>

        <GenericTable<Competition>
          items={competitions}
          columns={getCompetitionTableColumns()}
          actions={getCompetitionTableActions((competition) => {
            setSelectedId(competition.id);
            setIsDeleteDialogOpen(true);
          })}
          searchOption={{
            placeholder: "Search by name...",
            value: searchTerm,
            onChange: (val) => { setSearchTerm(val); setPage(1); }
          }}
          paginationData={competitionsData}
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
          responsiveStyle="scroll"
        />
        <AddCompetitionModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => refetch()}
        />

        <ConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          title="Remove Competition"
          description="Are you sure you want to remove this competition?"
          confirmText="Delete"
          variant="danger"
          isLoading={isDeleting}
        />
      </div>
    </>
  );
}