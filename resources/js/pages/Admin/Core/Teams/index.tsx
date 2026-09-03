import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageMeta from "@/components/common/PageMeta";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { PageHeader } from "@/components/ui/PageHeader";
import GlassLaunchButton from "@/components/ui/Buttons/GlassLaunchButton";
import ConfirmationDialog from "@/components/ui/Feedback/ConfirmationDialog";
import { GenericTable } from "@/components/ui/Tables/GenericTable";
import { ErrorScreen, LoadingScreen } from "@/components/ui/Feedback/StatusScreens";
import { Team } from "@/types";
import {
  useDeleteTeamMutation,
  useGetCompetitionsLookupQuery,
  useGetCountriesLookupQuery,
  useGetTeamsQuery,
  useUpdateTeamMutation,
} from "@/store/apis";
import { showToast } from "@/utils/toast";

import AddTeamModal from "./components/AddTeamModal";
import { getTeamTableColumns, getTeamTableActions } from "./components/TeamsTableConfig";
import { FilterGroupConfig } from "@/components/ui/Grids/GenericDataGrid";

export default function TeamsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number>();

  // Dynamic search query states for filters
  const [competitionSearch, setCompetitionSearch] = useState("");
  const [countrySearch, setCountrySearch] = useState("");

  const [queryState, setQueryState] = useState({
    filters: {} as Record<string, any>,
    orderBy: "created_at" as string | undefined,
    sortOrder: "desc" as "asc" | "desc" | undefined,
  });

  // Dynamic Lookup API Calls
  const { data: competitionsLookup, isLoading: isCompetitionsLoading } =
    useGetCompetitionsLookupQuery({
      query: competitionSearch,
      limit: 100,
    });

  const { data: countriesLookup, isLoading: isCountriesLoading } =
    useGetCountriesLookupQuery({
      query: countrySearch,
      limit: 100,
    });

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetTeamsQuery({
    page,
    per_page: pageSize,
    ...queryState.filters,
    sort_by: queryState.orderBy,
    sort_order: queryState.sortOrder,
    search: searchTerm,
    current_competition_id:
      queryState.filters.current_competition_id !== "all"
        ? queryState.filters.current_competition_id
        : undefined,
    country_id:
      queryState.filters.country_id !== "all"
        ? queryState.filters.country_id
        : undefined,
  });

  const [deleteTeam, { isLoading: isDeleting }] = useDeleteTeamMutation();
  const [updateTeam] = useUpdateTeamMutation();

  const handleSaveRow = async (updatedTeam: Team) => {
    const originalTeam = teams.find((p) => p.id === updatedTeam.id);

    if (!originalTeam) return;
    const changedFields: Partial<Team> = {};

    (Object.keys(updatedTeam) as (keyof Team)[]).forEach((key) => {
      if (key === "id") return;

      if (updatedTeam[key] !== originalTeam[key]) {
        changedFields[key] = updatedTeam[key] as any;
      }
    });

    if (Object.keys(changedFields).length === 0) {
      showToast.info("No Changes", "No fields were modified.");
      return;
    }

    try {
      await updateTeam({
        id: updatedTeam.id,
        body: changedFields,
      }).unwrap();
      showToast.success("Team Updated", "Team profile has been updated successfully.");
    } catch (error: any) {
      showToast.error("Update Failed", error.data?.message || "A system error occurred.");
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await deleteTeam(selectedId).unwrap();
      showToast.success("Team Deleted", "Team has been removed successfully.");
    } catch (error: any) {
      showToast.error("Deletion Failed", error.data?.message || "System error occurred.");
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const filterFields: FilterGroupConfig[] = [
    {
      id: "current_competition_id",
      label: "Competition",
      type: "select",
      searchable: true,
      isLoading: isCompetitionsLoading,
      onSearch: (searchTerm) => {
        // Only set dynamic search parameter if query length is 2 or more (or empty to reset)
        if (searchTerm.trim().length === 0 || searchTerm.trim().length >= 2) {
          setCompetitionSearch(searchTerm.trim());
        }
      },
      options: [
        { label: "All Competitions", value: "all" },
        ...(competitionsLookup?.data || []),
      ],
    },
    {
      id: "country_id",
      label: "Country",
      type: "select",
      searchable: true,
      isLoading: isCountriesLoading,
      onSearch: (searchTerm) => {
        if (searchTerm.trim().length === 0 || searchTerm.trim().length >= 2) {
          setCountrySearch(searchTerm.trim());
        }
      },
      options: [
        { label: "All Countries", value: "all" },
        ...(countriesLookup?.data || []),
      ],
    },
  ];

  if (isLoading) return <LoadingScreen message="Loading teams..." />;
  if (isError) return <ErrorScreen title="Failed to fetch teams" message="Please try again." />;

  const teamsData = response?.data;
  const teams: Team[] = teamsData?.items || [];

  return (
    <>
      <PageMeta title="Teams" description="This is Teams Admin Dashboard page" />

      <div className="flex flex-col h-full overflow-hidden">
        <div>
          <Breadcrumbs
            items={[
              { label: "Home", path: "/dashboard" },
              { label: "Teams" },
            ]}
          />

          <div className="py-5 flex justify-between gap-6">
            <PageHeader
              chipText="Teams"
              titlePrefix="Teams"
              gradientText=" Management"
              description="Manage and track all teams and their activities."
            />
            <div className="flex justify-end items-center">
              <GlassLaunchButton
                title="Add New Team"
                subtitle="Tap to add new team"
                iconName="auto_awesome"
                variant="cyan"
                onClick={() => setIsAddModalOpen(true)}
              />
            </div>
          </div>
        </div>

        <GenericTable<Team>
          items={teams}
          columns={getTeamTableColumns()}
          actions={getTeamTableActions(
            (team) => navigate(`/dashboard/admin/teams/${team.id}`),
            (team) => {
              setSelectedId(team.id);
              setIsDeleteDialogOpen(true);
            }
          )}
          searchOption={{
            placeholder: "Search by name...",
            value: searchTerm,
            onChange: (val) => {
              setSearchTerm(val);
              setPage(1);
            },
          }}
          paginationData={teamsData}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
          filterOptions={{
            fields: filterFields,
            values: queryState.filters,
            onChange: (nextFilters) => {
              setQueryState((prev) => ({ ...prev, filters: nextFilters }));
              setPage(1);
            },
          }}
          sortBy={queryState.orderBy}
          sortOrder={queryState.sortOrder}
          onSort={(orderBy, sortOrder) =>
            setQueryState((prev) => ({ ...prev, orderBy, sortOrder }))
          }
          onSaveRow={handleSaveRow}
          tableClassName="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
          responsiveStyle="stacked"
        />

        <AddTeamModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => refetch()}
        />

        <ConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          title="Remove Team"
          description="Are you sure you want to remove this team?"
          confirmText="Delete"
          variant="danger"
          isLoading={isDeleting}
        />
      </div>
    </>
  );
}