import { EditableColumnDef } from "@/types/table";
import GenericTable from "@/components/tables/GenericTable";

const columns: EditableColumnDef<Season>[] = [
    { accessorKey: "name", header: "Name", enableEditing: true, size: 2 },
    { accessorKey: "start_year", header: "Start", enableEditing: true, size: 1 },
    { accessorKey: "end_year", header: "End", enableEditing: true, size: 1 },
];

const fields = [
    { name: "name", label: "Name" },
    { name: "start_year", label: "Start Year", type: "number" },
    { name: "end_year", label: "End Year", type: "number" },
]
export default function SeasonsTable() {
    return (
        <GenericTable<Season>
            title="Seasons"
            url="/api/v1/admin/seasons"
            itemName="Season"
            columns={columns}
            enableEditing
            enableDeleting
            enableAdding
            fields={fields}
        />
    );
}
