import { useState } from "react";
import PageMeta from "@/components/common/PageMeta";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { PageHeader } from "@/components/ui/PageHeader";
import GlassLaunchButton from "@/components/ui/Buttons/GlassLaunchButton";
import ConfirmationDialog from "@/components/ui/Feedback/ConfirmationDialog";
import { GenericTable } from "@/components/ui/Tables/GenericTable";
import { ErrorScreen, LoadingScreen } from "@/components/ui/Feedback/StatusScreens";
import { PackDropRule } from "@/types";
import { useDeletePackDropRuleMutation, useGetPackDropRulesQuery, useUpdatePackDropRuleMutation } from "@/store/apis";
import { showToast } from "@/utils/toast";
import AddPackDropRuleModal from "./components/AddPackDropRuleModal";
import { FilterGroupConfig } from "@/components/ui/Grids/GenericDataGrid";
import { getPackDropRuleTableActions, getPackDropRuleTableColumns } from "./components/PackDropRulesTableConfig";

export default function PackDropRulesPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number>();

  const [queryState, setQueryState] = useState({
    filters: {} as Record<string, any>,
    orderBy: 'created_at' as string | undefined,
    sortOrder: 'desc' as 'asc' | 'desc' | undefined,
  });

  const { data: response, isLoading, isError, refetch } = useGetPackDropRulesQuery({
    page,
    per_page: pageSize,
    ...queryState.filters,
    sort_by: queryState.orderBy,
    sort_order: queryState.sortOrder,
  });

  const [deletePackDropRule, { isLoading: isDeleting }] = useDeletePackDropRuleMutation();
  const [updatePackDropRule] = useUpdatePackDropRuleMutation();

  const handleSaveRow = async (updatedRule: PackDropRule) => {
    const originalRule = rules.find((r) => r.id === updatedRule.id);
    if (!originalRule) return;

    const changedFields: Partial<PackDropRule> = {};
    (Object.keys(updatedRule) as (keyof PackDropRule)[]).forEach((key) => {
      if (key === 'id') return;
      if (updatedRule[key] !== originalRule[key]) {
        changedFields[key] = updatedRule[key] as any;
      }
    });

    if (Object.keys(changedFields).length === 0) {
      showToast.info('No Changes', 'No fields were modified.');
      return;
    }

    try {
      await updatePackDropRule({
        id: updatedRule.id,
        body: changedFields as any,
      }).unwrap();
      showToast.success('Rule Updated', 'Pack drop rule has been updated successfully.');
    } catch (error: any) {
      showToast.error('Update Failed', error.data?.message || 'A system error occurred.');
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await deletePackDropRule(selectedId).unwrap();
      showToast.success('Rule Deleted', 'Drop rule has been removed successfully.');
    } catch (error: any) {
      showToast.error('Deletion Failed', error.data?.message || 'System error occurred.');
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const filterFields: FilterGroupConfig[] = [];

  if (isLoading) return <LoadingScreen message="Loading drop rules..." />;
  if (isError) return <ErrorScreen title="Failed to fetch drop rules" message="Please try again." />;

  const rulesData = response?.data;
  const rules: PackDropRule[] = rulesData?.items || [];

  return (
    <>
      <PageMeta title="Pack Drop Rules" description="Pack Drop Rules Admin Dashboard page" />

      <div className="max-w-full flex flex-col h-full overflow-hidden">
        <div>
          <Breadcrumbs items={[
            { label: 'Home', path: '/dashboard' },
            { label: 'Pack Drop Rules' }
          ]} />

          <div className="py-5 flex justify-between gap-6">
            <PageHeader
              chipText="Loot Tables"
              titlePrefix="Pack Drop Rules"
              gradientText=" Management"
              description="Configure item drop percentages, tier probabilities, and pack reward distributions."
            />
            <div className="flex justify-end items-center">
              <GlassLaunchButton
                title="Add Drop Rule"
                subtitle="Tap to configure rule"
                iconName="casino"
                variant="cyan"
                onClick={() => setIsAddModalOpen(true)}
              />
            </div>
          </div>
        </div>

        <GenericTable<PackDropRule>
          items={rules}
          columns={getPackDropRuleTableColumns()}
          actions={getPackDropRuleTableActions(
            (rule) => {
              setSelectedId(rule.id);
              setIsDeleteDialogOpen(true);
            }
          )}
          paginationData={rulesData}
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

        <AddPackDropRuleModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => refetch()}
        />

        <ConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          title="Remove Drop Rule"
          description="Are you sure you want to remove this drop rule from the pack?"
          confirmText="Delete"
          variant="danger"
          isLoading={isDeleting}
        />
      </div>
    </>
  );
}
