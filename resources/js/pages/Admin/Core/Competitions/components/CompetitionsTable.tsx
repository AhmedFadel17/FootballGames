import { EditableColumnDef } from "@/types/table";
import GenericTable from "@/components/tables/GenericTable";

const columns: EditableColumnDef<Competition>[] = [
    { accessorKey: "name", header: "Name", enableEditing: true,  size: 2 },
    { accessorKey: "short_name", header: "Abbr.", enableEditing: true,  size: 1 },
    { accessorKey: "founded_year", header: "Founded", enableEditing: true,  size: 1},
    { accessorKey: "country_id", header: "Country",   size: 1},
    { accessorKey: "type", header: "Type", enableEditing: true,  size: 1},
    { accessorKey: "tier", header: "Tier", enableEditing: true,  size: 1},
    { accessorKey: "img_src", header: "Img.", enableEditing: true,  size: 1,
        cell: ({ row }) => (
                <img
                    src={row.original.img_src}
                    alt={row.original.name}
                    className="w-8 h-8  rounded"
                />
            ),
    },
    { accessorKey: "is_active", header: "Active", enableEditing: true,  size: 1},

];

const fields = [
    { name: "name", label: "Name" },
    { name: "slug", label: "Slug" },
    { name: "description", label: "Description" }
]
export default function CompetitionsTable() {
    return (
        <GenericTable<Competition>
            title="Competitions"
            url="/api/v1/admin/competitions"
            itemName="Competition"
            columns={columns}
            enableEditing
            enableDeleting
            enableAdding

            fields={fields}
        />
    );
}
