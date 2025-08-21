import { EditableColumnDef } from "@/types/table";
import GenericTable from "@/components/tables/GenericTable";
import { useGetDataQuery } from "@/services/api";
import { useEffect, useState } from "react";

const columns: EditableColumnDef<TeamStat>[] = [
 {
        accessorKey: "team.id", header: "Team", enableEditing: false, size: 3,
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <img
                    src={row.original.team?.img_src}
                    alt={row.original.team?.name}
                    className="w-8 h-8 rounded"
                />
                <p>{row.original.team?.name}</p>
            </div>

        ),
    },
    {
        accessorKey: "competition.id", header: "Comp.", enableEditing: false, size: 1,
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <img
                src={row.original.competition?.img_src}
                alt={row.original.competition?.name}
                    className="w-8 h-8 rounded"
                />
            </div>
        ),
    },  
    { accessorKey: "matches_played", header: "M", enableEditing: true, size: 1 },
    { accessorKey: "wins", header: "W", enableEditing: true, size: 1 },
    { accessorKey: "draws", header: "D", enableEditing: true, size: 1 },
    { accessorKey: "losses", header: "L", enableEditing: true, size: 1 },
    { accessorKey: "goals_for", header: "GF", enableEditing: true, size: 1 },
    { accessorKey: "goals_against", header: "GA", enableEditing: true, size: 1 },
    { accessorKey: "clean_sheets", header: "CS", enableEditing: true, size: 1 },
    { accessorKey: "yellow_cards", header: "YC", enableEditing: true, size: 1 },
    { accessorKey: "red_cards", header: "RC", enableEditing: true, size: 1 },
    { accessorKey: "penalties_scored", header: "PS", enableEditing: true, size: 1 },
];

export default function TeamStatsTable() {
    const [fields, setFields] = useState<any>([]);
    const { data: teamsData, isLoading: teamsLoading, isSuccess: teamsSuccess } = useGetDataQuery({
        url: "/api/v1/admin/options/teams",
    });
    const { data: competitionsData, isLoading: competitionsLoading, isSuccess: competitionsSuccess } = useGetDataQuery({
        url: "/api/v1/admin/options/competitions",
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
            url="/api/v1/admin/competition-team-stats"
            itemName="Team Stat"
            columns={columns}
            enableEditing
            enableDeleting
            enableAdding
            fields={fields}
        />
    );
} 