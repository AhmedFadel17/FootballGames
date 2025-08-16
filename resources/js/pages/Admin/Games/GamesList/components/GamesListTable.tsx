import { EditableColumnDef } from "@/types/table";
import GenericTable from "@/components/tables/GenericTable";
import { RedixModalInputProps } from "@/components/modals/RedixModal";
import { useGetDataQuery } from "@/services/api";
import { useEffect, useState } from "react";

const columns: EditableColumnDef<Game>[] = [
    { accessorKey: "title", header: "Title", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "description", header: "Description", enableEditing: true, enableSorting: false, size: 3 },

];


export default function GamesListTable() {
    const [fields, setFields] = useState<any>([]);
    const { data, isLoading, isSuccess } = useGetDataQuery({
        url: "/api/v1/game-types",
    });

    useEffect(() => {
        if (isSuccess && data) {
            let typesOptions = data.map((row: GameType) => ({ value: row.id, label: row.name }));
            setFields([
                { name: "title", label: "Title", type: 'text' },
                { name: "description", label: "Description" },
                { name: "game_type_id", label: "Game Type", type: "select", options: typesOptions },
            ])
        }
    }, [isSuccess, data]);
    return (
        <GenericTable<Game>
            title="Games"
            url="/api/v1/games"
            itemName="Game"
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
