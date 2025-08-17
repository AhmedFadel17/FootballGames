import { EditableColumnDef } from "@/types/table";
import GenericTable from "@/components/tables/GenericTable";
import { useGetDataQuery } from "@/services/api";
import { useEffect, useState } from "react";

const columns: EditableColumnDef<TeamStat>[] = [
    { accessorKey: "team.name", header: "Team", enableEditing: false, enableSorting: false, size: 1 },
    { accessorKey: "competition.name", header: "Competition", enableEditing: false, enableSorting: false, size: 1 },
    { accessorKey: "matches_played", header: "Matches", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "wins", header: "Wins", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "draws", header: "Draws", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "losses", header: "Losses", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "goals_for", header: "Goals For", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "goals_against", header: "Goals Against", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "clean_sheets", header: "Clean Sheets", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "yellow_cards", header: "Yellow Cards", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "red_cards", header: "Red Cards", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "penalties_scored", header: "Penalties Scored", enableEditing: true, enableSorting: false, size: 1 },
];

export default function TeamStatsTable() {
    const [fields, setFields] = useState<any>([]);
    const { data: teamsData, isLoading: teamsLoading, isSuccess: teamsSuccess } = useGetDataQuery({
        url: "/api/v1/admin/teams",
    });
    const { data: competitionsData, isLoading: competitionsLoading, isSuccess: competitionsSuccess } = useGetDataQuery({
        url: "/api/v1/admin/competitions",
    });

    useEffect(() => {
        if (teamsSuccess && teamsData && competitionsSuccess && competitionsData) {
            let teamsOptions = teamsData.map((row: Team) => ({ value: row.id, label: row.name }));
            let competitionsOptions = competitionsData.map((row: Competition) => ({ value: row.id, label: row.name }));
            
            setFields([
                { name: "team_id", label: "Team", type: "select", options: teamsOptions },
                { name: "competition_id", label: "Competition", type: "select", options: competitionsOptions },
                { name: "matches_played", label: "Matches Played", type: 'number' },
                { name: "wins", label: "Wins", type: 'number' },
                { name: "draws", label: "Draws", type: 'number' },
                { name: "losses", label: "Losses", type: 'number' },
                { name: "goals_for", label: "Goals For", type: 'number' },
                { name: "goals_against", label: "Goals Against", type: 'number' },
                { name: "clean_sheets", label: "Clean Sheets", type: 'number' },
                { name: "yellow_cards", label: "Yellow Cards", type: 'number' },
                { name: "red_cards", label: "Red Cards", type: 'number' },
                { name: "penalties_scored", label: "Penalties Scored", type: 'number' },
            ]);
        }
    }, [teamsSuccess, teamsData, competitionsSuccess, competitionsData]);

    if (teamsLoading || competitionsLoading) {
        return <div>Loading...</div>;
    }

    return (
        <GenericTable<TeamStat>
            title="Team Statistics"
            url="/api/v1/admin/team-stats"
            itemName="Team Stat"
            columns={columns}
            enableEditing
            enableDeleting
            enableAdding
            paginate={false}
            enableSearch={false}
            fields={fields}
        />
    );
} 