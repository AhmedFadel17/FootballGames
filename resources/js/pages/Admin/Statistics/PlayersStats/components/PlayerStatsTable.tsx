import { EditableColumnDef } from "@/types/table";
import GenericTable from "@/components/tables/GenericTable";
import { useGetDataQuery } from "@/services/api";
import { useEffect, useState } from "react";

const columns: EditableColumnDef<PlayerStat>[] = [
    { accessorKey: "player.name", header: "Player", enableEditing: false, enableSorting: false, size: 1 },
    { accessorKey: "competition.name", header: "Competition", enableEditing: false, enableSorting: false, size: 1 },
    { accessorKey: "appearances", header: "Appearances", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "minutes_played", header: "Minutes", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "goals", header: "Goals", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "assists", header: "Assists", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "yellow_cards", header: "Yellow Cards", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "red_cards", header: "Red Cards", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "clean_sheets", header: "Clean Sheets", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "saves", header: "Saves", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "penalties_saved", header: "Penalties Saved", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "own_goals", header: "Own Goals", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "goals_conceded", header: "Goals Conceded", enableEditing: true, enableSorting: false, size: 1 },
];

export default function PlayerStatsTable() {
    const [fields, setFields] = useState<any>([]);
    const { data: playersData, isLoading: playersLoading, isSuccess: playersSuccess } = useGetDataQuery({
        url: "/api/v1/admin/players",
    });
    const { data: competitionsData, isLoading: competitionsLoading, isSuccess: competitionsSuccess } = useGetDataQuery({
        url: "/api/v1/admin/competitions",
    });

    useEffect(() => {
        if (playersSuccess && playersData && competitionsSuccess && competitionsData) {
            let playersOptions = playersData.map((row: Player) => ({ value: row.id, label: row.name }));
            let competitionsOptions = competitionsData.map((row: Competition) => ({ value: row.id, label: row.name }));
            
            setFields([
                { name: "player_id", label: "Player", type: "select", options: playersOptions },
                { name: "competition_id", label: "Competition", type: "select", options: competitionsOptions },
                { name: "appearances", label: "Appearances", type: 'number' },
                { name: "minutes_played", label: "Minutes Played", type: 'number' },
                { name: "goals", label: "Goals", type: 'number' },
                { name: "assists", label: "Assists", type: 'number' },
                { name: "yellow_cards", label: "Yellow Cards", type: 'number' },
                { name: "red_cards", label: "Red Cards", type: 'number' },
                { name: "clean_sheets", label: "Clean Sheets", type: 'number' },
                { name: "saves", label: "Saves", type: 'number' },
                { name: "penalties_saved", label: "Penalties Saved", type: 'number' },
                { name: "own_goals", label: "Own Goals", type: 'number' },
                { name: "goals_conceded", label: "Goals Conceded", type: 'number' },
            ]);
        }
    }, [playersSuccess, playersData, competitionsSuccess, competitionsData]);

    if (playersLoading || competitionsLoading) {
        return <div>Loading...</div>;
    }

    return (
        <GenericTable<PlayerStat>
            title="Player Statistics"
            url="/api/v1/admin/player-stats"
            itemName="Player Stat"
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