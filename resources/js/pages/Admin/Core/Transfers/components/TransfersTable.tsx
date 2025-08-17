import { EditableColumnDef } from "@/types/table";
import GenericTable from "@/components/tables/GenericTable";
import { useGetDataQuery } from "@/services/api";
import { useEffect, useState } from "react";

const columns: EditableColumnDef<Transfer>[] = [
    { accessorKey: "player.name", header: "Player", enableEditing: false, enableSorting: false, size: 1 },
    { accessorKey: "from_team.name", header: "From Team", enableEditing: false, enableSorting: false, size: 1 },
    { accessorKey: "to_team.name", header: "To Team", enableEditing: false, enableSorting: false, size: 1 },
    { accessorKey: "transfer_date", header: "Transfer Date", enableEditing: true, enableSorting: false, size: 1 },
];

export default function TransfersTable() {
    const [fields, setFields] = useState<any>([]);
    const { data: playersData, isLoading: playersLoading, isSuccess: playersSuccess } = useGetDataQuery({
        url: "/api/v1/admin/players",
    });
    const { data: teamsData, isLoading: teamsLoading, isSuccess: teamsSuccess } = useGetDataQuery({
        url: "/api/v1/admin/teams",
    });

    useEffect(() => {
        if (playersSuccess && playersData && teamsSuccess && teamsData) {
            let playersOptions = playersData.map((row: Player) => ({ value: row.id, label: row.name }));
            let teamsOptions = teamsData.map((row: Team) => ({ value: row.id, label: row.name }));
            
            setFields([
                { name: "player_id", label: "Player", type: "select", options: playersOptions },
                { name: "from_team_id", label: "From Team", type: "select", options: teamsOptions },
                { name: "to_team_id", label: "To Team", type: "select", options: teamsOptions },
                { name: "transfer_date", label: "Transfer Date", type: 'date' },
            ]);
        }
    }, [playersSuccess, playersData, teamsSuccess, teamsData]);

    if (playersLoading || teamsLoading) {
        return <div>Loading...</div>;
    }

    return (
        <GenericTable<Transfer>
            title="Transfers"
            url="/api/v1/admin/transfers"
            itemName="Transfer"
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
