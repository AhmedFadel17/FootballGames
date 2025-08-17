import { EditableColumnDef } from "@/types/table";
import GenericTable from "@/components/tables/GenericTable";

const columns: EditableColumnDef<Continent>[] = [
    { accessorKey: "name", header: "Name", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "code", header: "Code", enableEditing: true, enableSorting: false, size: 1 },
];

const fields = [
    { name: "name", label: "Name", type: 'text' },
    { name: "code", label: "Code", type: 'text' },
];

export default function ContinentsTable() {
    return (
        <GenericTable<Continent>
            title="Continents"
            url="/api/v1/admin/continents"
            itemName="Continent"
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