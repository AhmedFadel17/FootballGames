import { EditableColumnDef } from "@/types/table";
import GenericTable from "@/components/tables/GenericTable";
import { Link } from "react-router-dom";

const columns: EditableColumnDef<GameType>[] = [
    {
        accessorKey: "name", header: "Name", enableEditing: true, enableSorting: false, size: 1,
        cell: (({ row }) => (
            <Link className="font-bold text-blue-400" to={row.original.slug}>{row.original.name}</Link>
        ))
    },
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
            url="/api/v1/admin/game-types"
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
