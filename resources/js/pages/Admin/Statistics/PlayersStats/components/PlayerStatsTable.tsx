import { EditableColumnDef } from "@/types/table";
import GenericTable from "@/components/tables/GenericTable";
import { useGetDataQuery } from "@/services/api";
import { useEffect, useState } from "react";

const columns: EditableColumnDef<PlayerStat>[] = [
    {
        accessorKey: "player.id", header: "Player", enableEditing: false, size: 3,
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <img
                    src={row.original.player?.img_src}
                    alt={row.original.player?.name}
                    className="w-8 h-8 rounded"
                />
                <p>{row.original.player?.name}</p>
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
    { accessorKey: "appearances", header: "App.", enableEditing: true, size: 1 },
    { accessorKey: "minutes_played", header: "Min.", enableEditing: true, size: 1 },
    { accessorKey: "goals", header: "GS", enableEditing: true, size: 1 },
    { accessorKey: "assists", header: "AS", enableEditing: true, size: 1 },
    { accessorKey: "yellow_cards", header: "YC", enableEditing: true, size: 1 },
    { accessorKey: "red_cards", header: "RC", enableEditing: true, size: 1 },
    { accessorKey: "clean_sheets", header: "CS", enableEditing: true, size: 1 },
    { accessorKey: "saves", header: "Saves", enableEditing: true, size: 1 },
    { accessorKey: "penalties_saved", header: "PS", enableEditing: true, size: 1 },
    { accessorKey: "own_goals", header: "OG", enableEditing: true, size: 1 },
    { accessorKey: "goals_conceded", header: "GC", enableEditing: true, size: 1 },
];

export default function PlayerStatsTable() {
    const [fields, setFields] = useState<any>([]);
    const { data: playersData, isLoading: playersLoading, isSuccess: playersSuccess } = useGetDataQuery({
        url: "/api/v1/admin/options/players",
    });
    const { data: competitionsData, isLoading: competitionsLoading, isSuccess: competitionsSuccess } = useGetDataQuery({
        url: "/api/v1/admin/options/competitions",
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
            url="/api/v1/admin/competition-player-stats"
            itemName="Player Stat"
            columns={columns}
            enableEditing
            enableDeleting
            enableAdding
            fields={fields}
        />
    );
} 