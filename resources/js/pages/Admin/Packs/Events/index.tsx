import { useState } from "react";
import PageMeta from "@/components/common/PageMeta";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { PageHeader } from "@/components/ui/PageHeader";
import GlassLaunchButton from "@/components/ui/Buttons/GlassLaunchButton";
import ConfirmationDialog from "@/components/ui/Feedback/ConfirmationDialog";
import { GenericTable } from "@/components/ui/Tables/GenericTable";
import { ErrorScreen, LoadingScreen } from "@/components/ui/Feedback/StatusScreens";
import { Event } from "@/types";
import { useDeleteEventMutation, useGetEventsQuery, useUpdateEventMutation } from "@/store/apis";
import { showToast } from "@/utils/toast";
import AddEventModal from "./components/AddEventModal";
import { FilterGroupConfig } from "@/components/ui/Grids/GenericDataGrid";
import { getEventTableActions, getEventTableColumns } from "./components/EventsTableConfig";

export default function EventsPage() {
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

  const { data: response, isLoading, isError, refetch } = useGetEventsQuery({
    page,
    per_page: pageSize,
    ...queryState.filters,
    sort_by: queryState.orderBy,
    sort_order: queryState.sortOrder,
    search: searchTerm,
  });

  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();
  const [updateEvent] = useUpdateEventMutation();

  const handleSaveRow = async (updatedEvent: Event) => {
    const originalEvent = events.find((e) => e.id === updatedEvent.id);
    if (!originalEvent) return;

    const changedFields: Partial<Event> = {};
    (Object.keys(updatedEvent) as (keyof Event)[]).forEach((key) => {
      if (key === 'id') return;
      if (updatedEvent[key] !== originalEvent[key]) {
        changedFields[key] = updatedEvent[key] as any;
      }
    });

    if (Object.keys(changedFields).length === 0) {
      showToast.info('No Changes', 'No fields were modified.');
      return;
    }

    try {
      await updateEvent({
        id: updatedEvent.id,
        body: changedFields as any,
      }).unwrap();
      showToast.success('Event Updated', 'Event details have been updated successfully.');
    } catch (error: any) {
      showToast.error('Update Failed', error.data?.message || 'A system error occurred.');
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await deleteEvent(selectedId).unwrap();
      showToast.success('Event Deleted', 'Event has been removed successfully.');
    } catch (error: any) {
      showToast.error('Deletion Failed', error.data?.message || 'System error occurred.');
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const filterFields: FilterGroupConfig[] = [];

  if (isLoading) return <LoadingScreen message="Loading events..." />;
  if (isError) return <ErrorScreen title="Failed to fetch events" message="Please try again." />;

  const eventsData = response?.data;
  const events: Event[] = eventsData?.items || [];

  return (
    <>
      <PageMeta title="Card Events" description="Card Events Admin Dashboard page" />

      <div className="max-w-full flex flex-col h-full overflow-hidden">
        <div>
          <Breadcrumbs items={[
            { label: 'Home', path: '/dashboard' },
            { label: 'Events' }
          ]} />

          <div className="py-5 flex justify-between gap-6">
            <PageHeader
              chipText="Card Events"
              titlePrefix="Card Events"
              gradientText=" Management"
              description="Manage thematic campaigns, operational time windows, and card event themes."
            />
            <div className="flex justify-end items-center">
              <GlassLaunchButton
                title="Add New Event"
                subtitle="Tap to add new event"
                iconName="event"
                variant="cyan"
                onClick={() => setIsAddModalOpen(true)}
              />
            </div>
          </div>
        </div>

        <GenericTable<Event>
          items={events}
          columns={getEventTableColumns()}
          actions={getEventTableActions(
            (event) => {
              setSelectedId(event.id);
              setIsDeleteDialogOpen(true);
            }
          )}
          searchOption={{
            placeholder: "Search by name or slug...",
            value: searchTerm,
            onChange: (val) => { setSearchTerm(val); setPage(1); }
          }}
          paginationData={eventsData}
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

        <AddEventModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => refetch()}
        />

        <ConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          title="Remove Event"
          description="Are you sure you want to remove this event? Associated cards and packs may have their event reference cleared."
          confirmText="Delete"
          variant="danger"
          isLoading={isDeleting}
        />
      </div>
    </>
  );
}
