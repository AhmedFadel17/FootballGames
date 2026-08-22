import { useState } from "react";
import PageMeta from "@/components/common/PageMeta";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { PageHeader } from "@/components/ui/PageHeader";
import GlassLaunchButton from "@/components/ui/Buttons/GlassLaunchButton";
import ConfirmationDialog from "@/components/ui/Feedback/ConfirmationDialog";
import { GenericTable } from "@/components/ui/Tables/GenericTable";
import { ErrorScreen, LoadingScreen } from "@/components/ui/Feedback/StatusScreens";
import { Country } from "@/types";
import { useDeleteCountryMutation, useGetCountriesQuery, useUpdateCountryMutation } from "@/store/apis";
import { showToast } from "@/utils/toast";

import AddCountryModal from "./components/AddCountryModal";
import { getCountryTableColumns, getCountryTableActions } from "./components/CountriesTableConfig";

import { useNavigate } from "react-router-dom";

export default function CountriesPage() {
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

  const { data: response, isLoading, isError, refetch } = useGetCountriesQuery({
    page,
    per_page: pageSize,
    ...queryState.filters,
    sort_by: queryState.orderBy,
    sort_order: queryState.sortOrder,
    search: searchTerm,
  });

  const [deleteCountry, { isLoading: isDeleting }] = useDeleteCountryMutation();
  const [updateCountry] = useUpdateCountryMutation();

  const handleSaveRow = async (updatedCountry: Country) => {
    try {
      await updateCountry({
        id: updatedCountry.id,
        body: {
          name: updatedCountry.name,
          code: updatedCountry.code,
          popularity: updatedCountry.popularity,
          continent_id: updatedCountry.continent_id,
        },
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
      await deleteCountry(selectedId).unwrap();
      showToast.success('Country Deleted', 'Country has been removed successfully.');
    } catch (error: any) {
      showToast.error('Deletion Failed', error.data?.message || 'System error occurred.');
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  if (isLoading) return <LoadingScreen message="Loading countries..." />;
  if (isError) return <ErrorScreen title="Failed to fetch countries" message="Please try again." />;

  const countriesData = response?.data;
  const countries: Country[] = countriesData?.items || [];

  return (
    <>
      <PageMeta title="Countries" description="This is Countries Admin Dashboard page" />

      <div className="flex flex-col h-full overflow-hidden">
        <div>
          <Breadcrumbs items={[
            { label: 'Home', path: '/dashboard' },
            { label: 'Countries' }
          ]} />

          <div className="py-5 flex justify-between gap-6">
            <PageHeader
              chipText="Countries"
              titlePrefix="Countries"
              gradientText=" Management"
              description="Manage and track all countries and their activities."
            />
            <div className="flex justify-end items-center">
              <GlassLaunchButton
                title="Add New Country"
                subtitle="Tap to add new Country"
                iconName="auto_awesome"
                variant="cyan"
                onClick={() => setIsAddModalOpen(true)}
              />
            </div>
          </div>
        </div>

        <GenericTable<Country>
          items={countries}
          columns={getCountryTableColumns()}
          actions={getCountryTableActions(
            (country) => navigate(`/admin/countries/${country.id}`),
            (country) => {
              setSelectedId(country.id);
              setIsDeleteDialogOpen(true);
            }
          )}
          searchOption={{
            placeholder: "Search by name...",
            value: searchTerm,
            onChange: (val) => { setSearchTerm(val); setPage(1); }
          }}
          paginationData={countriesData}
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

        <AddCountryModal
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