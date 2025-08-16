import { EditableColumnDef } from "@/types/table";
import GenericTable from "@/components/tables/GenericTable";

const columns: EditableColumnDef<GameType>[] = [
    { accessorKey: "name", header: "Name", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "slug", header: "Slug", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "description", header: "Description", enableEditing: true, enableSorting: false, size: 3 },
];

const fields = [
    { name: "name", label: "Name" },
    { name: "slug", label: "Slug" },
    { name: "description", label: "Description" }
]
export default function GameTypesTable() {
    return (
        <GenericTable<GameType>
            title="Game Types"
            url="/api/v1/game-types"
            itemName="Game type"
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
